// Build a self-contained classroom copy. No server, CDN or installation required.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = new URL('./', import.meta.url);
const read = path => readFile(new URL(path, base), 'utf8');
const sources = {};
for (const [name, path] of Object.entries({
  core: 'vendor/three.core.min.js',
  three: 'vendor/three.module.min.js',
  physics: 'physics.js',
  exports: 'exports.js',
  scene: 'scene.js',
  app: 'app.js'
})) sources[name] = await read(path);

const payload = JSON.stringify(sources).replaceAll('<', '\\u003c');
const bootstrap = `
const sources = ${payload};
const urls = {};
function moduleURL(name, dependencies = {}) {
  let source = sources[name];
  for (const [path, dependency] of Object.entries(dependencies)) source = source.replaceAll(path, urls[dependency]);
  return urls[name] = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
}
moduleURL('core');
moduleURL('three', { './three.core.min.js': 'core' });
moduleURL('physics');
moduleURL('exports', { './physics.js': 'physics' });
moduleURL('scene', { './vendor/three.module.min.js': 'three', './physics.js': 'physics' });
moduleURL('app', { './physics.js': 'physics', './exports.js': 'exports', './scene.js': 'scene' });
import(urls.app).catch(error => {
  document.getElementById('loading').textContent = 'No se pudo iniciar la copia portátil. Prueba abrir este archivo en Chrome, Edge o Firefox.';
  console.error(error);
});`;

let html = await read('../modulos/fisica.html');
const css = await read('style.css');
html = html.replace('<link rel="stylesheet" href="../fisica-3d/style.css">', () => `<style>${css}</style>`);
html = html.replace('<script type="module" src="../fisica-3d/app.js"></script>', () => `<script type="module">${bootstrap}</script>`);
html = html.replace('href="../../index.html"', 'href="#"');
html = html.replace('aria-label="Matemáticas Digitales, inicio"', 'aria-label="Física viva, copia portátil"');
html = html.replace('<a href="../experimentos.html" class="back-link">← Volver a laboratorios</a>', '<span class="back-link">Copia portátil · sin conexión</span>');
html = html.replace(/<a id="download-lab"[^>]*>[^<]*<\/a>/, '<span class="subtle">Estás usando la copia portátil del laboratorio.</span>');
html = html.replace('</body>', `<details style="margin:20px"><summary>Licencia del motor 3D</summary><pre style="white-space:pre-wrap">${(await read('vendor/THREE-LICENSE.txt')).replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</pre></details></body>`);
const target = new URL('../fisica-viva-portatil.html', base);
await writeFile(target, html);
console.log(`Copia portátil generada: ${fileURLToPath(target)}`);
