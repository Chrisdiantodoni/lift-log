const assert = require('node:assert/strict');
const fs = require('node:fs');

const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
assert.equal(manifest.name, 'Lift Log');
assert.equal(manifest.start_url, './');
assert.equal(manifest.display, 'standalone');
assert.ok(manifest.icons.some(icon => icon.sizes === '192x192' && icon.purpose.includes('maskable')));
assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose.includes('maskable')));

const worker = fs.readFileSync('sw.js', 'utf8');
for (const asset of ['./', './style.css', './guides.js', './storage.js', './app.js', './guide-ui.js', './favicon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png']) assert.ok(worker.includes(`'${asset}'`), `${asset} missing from offline shell`);
assert.match(worker, /request\.destination\s*===\s*'image'/);
console.log('pwa checks passed');
