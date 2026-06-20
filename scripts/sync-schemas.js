const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../tesina_backend/src/schemas');
const destDir = path.join(__dirname, '../src/models/schemas');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Source schemas directory not found at: ${srcDir}`);
    process.exit(1);
  }
  
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  
  copyDir(srcDir, destDir);
  console.log('✅ Schemas synchronized successfully from backend to frontend!');
} catch (err) {
  console.error('❌ Error synchronizing schemas:', err);
  process.exit(1);
}
