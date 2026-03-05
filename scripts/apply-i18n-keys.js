const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const enPath = path.join(srcRoot, 'translations', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const FILE_EXT = new Set(['.js', '.jsx']);
const SKIP_PATTERNS = [
  /\/tests\//,
  /Style\.js$/,
  /Loadable\.js$/,
  /messages\.js$/,
  /\/utils\//,
  /\/queries\//,
  /\/translations\//,
  /\/i18n\.js$/,
  /\/global-styles\.js$/,
];

const TARGET_ROOTS = [
  path.join(srcRoot, 'components'),
  path.join(srcRoot, 'containers'),
];

const JSX_ATTR_NAMES = new Set([
  'label',
  'placeholder',
  'content',
  'title',
  'alt',
  'aria-label',
  'header',
  'description',
  'text',
  'confirmtext',
  'canceltext',
]);

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '') || 'text'
  );
}

function walk(dirPath, acc = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const absPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(absPath, acc);
      continue;
    }
    if (!FILE_EXT.has(path.extname(absPath))) continue;
    if (SKIP_PATTERNS.some((pattern) => pattern.test(absPath))) continue;
    acc.push(absPath);
  }
  return acc;
}

function namespaceFor(filePath) {
  return path
    .relative(srcRoot, filePath)
    .replace(/\.(js|jsx)$/, '')
    .replace(/[\\/]+/g, '.')
    .toLowerCase();
}

function runtimeImportFor(filePath) {
  const rel = path
    .relative(
      path.dirname(filePath),
      path.join(srcRoot, 'utils', 'i18nRuntime'),
    )
    .replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function makeTrCall(key, fallback) {
  return t.callExpression(t.identifier('tr'), [
    t.stringLiteral(key),
    t.stringLiteral(fallback),
  ]);
}

function ensureTrImport(ast, importPath) {
  let hasTrImport = false;

  traverse(ast, {
    ImportDeclaration(pathRef) {
      if (pathRef.node.source.value !== importPath) return;
      for (const specifier of pathRef.node.specifiers) {
        if (
          t.isImportSpecifier(specifier) &&
          t.isIdentifier(specifier.imported, { name: 'tr' })
        ) {
          hasTrImport = true;
          return;
        }
      }
    },
  });

  if (hasTrImport) return;

  const body = ast.program.body;
  let insertAt = 0;
  for (let i = 0; i < body.length; i += 1) {
    if (t.isImportDeclaration(body[i])) {
      insertAt = i + 1;
      continue;
    }
    break;
  }

  body.splice(
    insertAt,
    0,
    t.importDeclaration(
      [t.importSpecifier(t.identifier('tr'), t.identifier('tr'))],
      t.stringLiteral(importPath),
    ),
  );
}

function transformFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const namespace = namespaceFor(filePath);
  const slugCounts = new Map();
  let changed = false;

  function nextKeyFor(text) {
    const normalized = normalizeWhitespace(text);
    if (!normalized) return null;

    const slug = slugify(normalized);
    const count = (slugCounts.get(slug) || 0) + 1;
    slugCounts.set(slug, count);

    const key = `${namespace}.${slug}${count > 1 ? `.${count}` : ''}`;
    if (!Object.prototype.hasOwnProperty.call(en, key)) {
      return null;
    }

    return { key, normalized };
  }

  function replaceStringLiteral(pathRef, value) {
    const keyInfo = nextKeyFor(value);
    if (!keyInfo) return;

    pathRef.replaceWith(makeTrCall(keyInfo.key, keyInfo.normalized));
    changed = true;
  }

  traverse(ast, {
    JSXText(pathRef) {
      const keyInfo = nextKeyFor(pathRef.node.value);
      if (!keyInfo) return;

      pathRef.replaceWith(
        t.jsxExpressionContainer(makeTrCall(keyInfo.key, keyInfo.normalized)),
      );
      changed = true;
    },
    JSXAttribute(pathRef) {
      const attr = pathRef.node;
      if (!t.isJSXIdentifier(attr.name)) return;
      if (!JSX_ATTR_NAMES.has(attr.name.name.toLowerCase())) return;
      if (!t.isStringLiteral(attr.value)) return;

      const keyInfo = nextKeyFor(attr.value.value);
      if (!keyInfo) return;

      attr.value = t.jsxExpressionContainer(
        makeTrCall(keyInfo.key, keyInfo.normalized),
      );
      changed = true;
    },
    StringLiteral(pathRef) {
      if (pathRef.parentPath.isJSXAttribute()) return;

      const parent = pathRef.parentPath;
      if (parent.isConditionalExpression()) {
        if (
          parent.node.consequent === pathRef.node ||
          parent.node.alternate === pathRef.node
        ) {
          replaceStringLiteral(pathRef, pathRef.node.value);
        }
        return;
      }

      if (parent.isLogicalExpression()) {
        const jsxAncestor = pathRef.findParent(
          (ancestor) =>
            ancestor.isJSXExpressionContainer() || ancestor.isJSXAttribute(),
        );
        if (!jsxAncestor) return;
        if (parent.node.right === pathRef.node) {
          replaceStringLiteral(pathRef, pathRef.node.value);
        }
      }
    },
  });

  if (!changed) return false;

  ensureTrImport(ast, runtimeImportFor(filePath));
  const output = generate(ast, { jsescOption: { minimal: true } }, source);
  fs.writeFileSync(filePath, `${output.code}\n`, 'utf8');

  return true;
}

let changedFiles = 0;
for (const root of TARGET_ROOTS) {
  const files = walk(root);
  for (const filePath of files) {
    if (transformFile(filePath)) {
      changedFiles += 1;
      console.log(`Updated ${path.relative(projectRoot, filePath)}`);
    }
  }
}

console.log(`Done. Updated ${changedFiles} files.`);
