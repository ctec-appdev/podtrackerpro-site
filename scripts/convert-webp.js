const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const blogDir = path.resolve(__dirname, '..', 'images', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.png'));

(async () => {
  for (const file of files) {
    const input = path.join(blogDir, file);
    const output = path.join(blogDir, file.replace(/\.png$/, '.webp'));
    await sharp(input).webp({ quality: 85 }).toFile(output);
    const inSize = fs.statSync(input).size;
    const outSize = fs.statSync(output).size;
    console.log(`${file}  ${(inSize/1024).toFixed(1)}K -> ${(outSize/1024).toFixed(1)}K (${outSize < inSize ? 'smaller' : 'larger'})`);
  }
  console.log('Done.');
})();
