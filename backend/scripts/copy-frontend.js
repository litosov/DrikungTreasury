// Copies ../frontend/dist into ../backend/public in a cross-platform way
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const frontendDist = path.join(root, '..', 'frontend', 'dist');
const backendPublic = path.join(root, 'public');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`[copy-frontend] Source not found: ${src}`);
    process.exit(1);
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      fs.copyFileSync(s, d);
    }
  }
}

console.log('[copy-frontend] Copying', frontendDist, '->', backendPublic);
copyDir(frontendDist, backendPublic);
console.log('[copy-frontend] Done');
