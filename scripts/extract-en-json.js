const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const outPath = path.join(srcRoot, 'translations', 'en.json');

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

const INCLUDE_PATHS = new Set([
  path.join(srcRoot, 'index.js'),
  path.join(srcRoot, 'containers'),
  path.join(srcRoot, 'components'),
]);

const JSX_TEXT_MIN_LENGTH = 2;
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
const OBJECT_KEY_NAMES = new Set([
  'header',
  'placeholder',
  'content',
  'label',
  'text',
  'title',
  'message',
]);

function shouldKeepFile(filePath) {
  const isInIncludedPath = [...INCLUDE_PATHS].some((allowedPath) =>
    filePath.startsWith(allowedPath),
  );
  if (!isInIncludedPath) return false;
  return !SKIP_PATTERNS.some((pattern) => pattern.test(filePath));
}

function walk(dirPath, acc = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const absPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(absPath, acc);
      continue;
    }

    if (!FILE_EXT.has(path.extname(absPath))) continue;
    if (!shouldKeepFile(absPath)) continue;
    acc.push(absPath);
  }
  return acc;
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function looksLikeUserFacingText(value) {
  const v = normalizeWhitespace(value);
  if (!v || !/[A-Za-z]/.test(v)) return false;
  if (v.length < JSX_TEXT_MIN_LENGTH) return false;

  if (v.startsWith('./') || v.startsWith('../') || v.startsWith('/'))
    return false;
  if (v.startsWith('http://') || v.startsWith('https://')) return false;
  if (v.includes('eslint-disable')) return false;
  if (/[;{}]/.test(v)) return false;
  if (/\b(const|return|case|break|import|export)\b/.test(v)) return false;
  if (/^#(?:[a-f0-9]{3}|[a-f0-9]{6})(?:\s*!important)?$/i.test(v)) return false;
  if (/^[a-z]+\/[a-z0-9+.-]+$/i.test(v)) return false;
  if (/^[a-z]+(?:[A-Z][a-z0-9]+)+$/.test(v)) return false;
  if (/^[a-z0-9_]+$/.test(v) && !v.includes(' ')) return false;
  if (/^[a-z]+(?:\s+[a-z]+){0,2}$/.test(v) && !/[.!?:'"]/.test(v)) return false;
  if (/^[a-z0-9_.-]+$/.test(v) && !v.includes(' ') && v === v.toLowerCase())
    return false;
  if (/^(true|false|null|undefined)$/i.test(v)) return false;

  return true;
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

function makeNamespace(filePath) {
  return path
    .relative(srcRoot, filePath)
    .replace(/\.(js|jsx)$/, '')
    .replace(/[\\/]+/g, '.')
    .toLowerCase();
}

function addIfValid(found, value) {
  const normalized = normalizeWhitespace(value);
  if (looksLikeUserFacingText(normalized)) found.push(normalized);
}

function collectFromAst(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const found = [];

  traverse(ast, {
    JSXText(pathRef) {
      addIfValid(found, pathRef.node.value);
    },
    JSXAttribute(pathRef) {
      const attr = pathRef.node;
      if (!t.isJSXIdentifier(attr.name)) return;
      const attrName = attr.name.name.toLowerCase();
      if (!JSX_ATTR_NAMES.has(attrName)) return;
      if (!t.isStringLiteral(attr.value)) return;

      addIfValid(found, attr.value.value);
    },
    StringLiteral(pathRef) {
      const { node, parentPath } = pathRef;
      const value = node.value;
      if (!looksLikeUserFacingText(value)) return;

      if (
        parentPath.isConditionalExpression() ||
        parentPath.isLogicalExpression() ||
        parentPath.isArrayExpression()
      ) {
        addIfValid(found, value);
        return;
      }

      if (parentPath.isObjectProperty()) {
        const key = parentPath.node.key;
        if (
          (t.isIdentifier(key) &&
            OBJECT_KEY_NAMES.has(key.name.toLowerCase())) ||
          (t.isStringLiteral(key) &&
            OBJECT_KEY_NAMES.has(key.value.toLowerCase()))
        ) {
          addIfValid(found, value);
        }
      }
    },
  });

  return [...new Set(found)];
}

function buildCatalog() {
  const catalog = {};
  const files = walk(srcRoot);

  for (const filePath of files) {
    const namespace = makeNamespace(filePath);
    const strings = collectFromAst(filePath);
    const counts = new Map();

    for (const value of strings) {
      const slug = slugify(value);
      const count = (counts.get(slug) || 0) + 1;
      counts.set(slug, count);
      const key = `${namespace}.${slug}${count > 1 ? `.${count}` : ''}`;
      catalog[key] = value;
    }
  }

  return Object.keys(catalog)
    .sort()
    .reduce((acc, key) => {
      acc[key] = catalog[key];
      return acc;
    }, {});
}

const catalog = buildCatalog();
fs.writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
console.log(
  `Wrote ${Object.keys(catalog).length} keys to ${path.relative(projectRoot, outPath)}`,
);
