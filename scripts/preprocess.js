const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const includeDir = path.join(root, 'includes');

const includeRegex = /<\?php\s+include\s+'includes\/([^']+)'\s*;\s*\?>/g;

function loadIncludes() {
  const includes = {};
  for (const file of fs.readdirSync(includeDir)) {
    includes[file] = fs.readFileSync(path.join(includeDir, file), 'utf-8');
  }
  return includes;
}

function resolveIncludes(content, includes) {
  return content.replace(includeRegex, (_, file) => {
    if (includes[file]) return includes[file];
    console.warn(`Missing include: ${file}`);
    return '';
  });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

const includes = loadIncludes();

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'test-results') continue;

  const srcPath = path.join(root, entry.name);
  const destPath = path.join(dist, entry.name);

  if (entry.isFile() && entry.name.endsWith('.html')) {
    const content = resolveIncludes(fs.readFileSync(srcPath, 'utf-8'), includes);
    fs.writeFileSync(destPath, content);
  } else if (entry.isFile()) {
    fs.copyFileSync(srcPath, destPath);
  } else if (entry.isDirectory()) {
    copyDir(srcPath, destPath);
  }
}

console.log('Preprocessed HTML files into dist/');
