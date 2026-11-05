// US-47: única fuente de verdad para la versión de Sabory.
// Uso: node scripts/bump-version.mjs 1.29   (equivale a "v1.29" / package.json "1.2.9")
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const arg = String(process.argv[2] || '').replace(/^v/i, '');

if (!/^\d+\.\d{2}$/.test(arg)) {
  console.error('Uso: node scripts/bump-version.mjs <major.NN>  (ej. 1.29)');
  process.exit(1);
}

const [major, minor] = arg.split('.');
const pkgVersion = `${major}.${minor[0]}.${Number(minor.slice(1))}`; // 1.29 -> 1.2.9
const tag = `v${arg}`;

const edit = (file, fn) => {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, 'utf-8');
  const after = fn(before);
  if (after !== before) fs.writeFileSync(full, after);
  console.log(`${after !== before ? 'actualizado' : 'sin cambios'}: ${file}`);
};

edit('package.json', s => s.replace(/("version":\s*")[^"]+(")/, `$1${pkgVersion}$2`));
edit('app.js', s => s.replace(/(window\.APP_VERSION = ')v[\d.]+(')/, `$1${tag}$2`)
  .replace(/(window\.APP_VERSION \|\| ')v[\d.]+(')/, `$1${tag}$2`));
edit('sw.js', s => s.replace(/(food-assistant-)v[\d.]+(')/, `$1${tag}$2`).replace(/\?v=[\d.]+/g, `?v=${arg}`));
edit('index.html', s => s.replace(/\?v=[\d.]+/g, `?v=${arg}`)
  .replace(/(id="settings-app-version-text"[^>]*>)v[\d.]+(<)/, `$1${tag}$2`)
  .replace(/(id="app-version-badge">)v[\d.]+(<)/, `$1${tag}$2`));
edit('tests/modals.test.js', s => s.replace(/(APP_VERSION\)\.toBe\(')v[\d.]+('\))/, `$1${tag}$2`)
  .replace(/(appVersion\)\.toBe\(')v[\d.]+('\))/, `$1${tag}$2`)
  .replace(/(badge\.textContent\)\.toBe\(')v[\d.]+('\))/, `$1${tag}$2`)
  .replace(/(settingsVer\.textContent\)\.toBe\(')v[\d.]+('\))/, `$1${tag}$2`));
