const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const outPath = path.join(srcRoot, 'translations', 'en.json');

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(entry.name) && !/\/tests\//.test(p))
      files.push(p);
  }
}
walk(path.join(srcRoot, 'components'));
walk(path.join(srcRoot, 'containers'));

const catalog = {};

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx'] });

  traverse(ast, {
    CallExpression(pathRef) {
      const { node } = pathRef;
      if (!t.isIdentifier(node.callee, { name: 'tr' })) return;
      if (node.arguments.length < 2) return;
      if (!t.isStringLiteral(node.arguments[0])) return;
      if (!t.isStringLiteral(node.arguments[1])) return;

      const key = node.arguments[0].value;
      const fallback = node.arguments[1].value;
      if (!catalog[key]) {
        catalog[key] = fallback;
      }
    },
  });
}

const sorted = Object.keys(catalog)
  .sort()
  .reduce((acc, key) => {
    acc[key] = catalog[key];
    return acc;
  }, {});

fs.writeFileSync(outPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
console.log(
  `Wrote ${Object.keys(sorted).length} keys to ${path.relative(root, outPath)}`,
);
