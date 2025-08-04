const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, 'package.json');
const snakePath = path.join(__dirname, 'assets', 'js', 'snake.js');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

let snakeCode = fs.readFileSync(snakePath, 'utf8');

// Ersetze die Zeile mit der Versionsvariable
snakeCode = snakeCode.replace(/const\s+version\s*=\s*"[^"]*";/, `const bversion = "${version}";`);

fs.writeFileSync(snakePath, snakeCode, 'utf8');

console.log(`Version ${version} wurde als bversion in snake.js eingetragen.`);
