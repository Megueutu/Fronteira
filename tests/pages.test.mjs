import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';

test('pages build relocates resources and only publishes website files', async () => {
  execFileSync(process.execPath, ['scripts/build-pages.mjs'], { env: { ...process.env, BASE_PATH: '/Fronteira' } });
  const read = name => readFile(new URL(`../_site/${name}`, import.meta.url), 'utf8');
  assert.match(await read('index.html'), /src="\/Fronteira\/src\/app.js"/);
  assert.match(await read('src/content.js'), /`\/Fronteira\/assets\/photos\//);
  assert.match(await read('src/citations.js'), /https:\/\/github.com\/Megueutu\/Fronteira\/blob\/main\/pesquisa\//);
  assert.match(await read('src/webgl-scene.js'), /`\/Fronteira\/assets\/textures\//);
  assert.match(await read('src/editorial-cover.js'), /src="\/Fronteira\/assets\/photos\/angra-cover\.jpg"/);
  assert.match(await read('src/editorial-cover.js'), /src="\/Fronteira\/assets\/branding\/fronteira\.svg"/);
  assert.match(await read('src/interactions.js'), /src="\/Fronteira\/assets\/qr\/site\.svg"/);
  assert.match(await read('src/interactions.js'), /href="https:\/\/megueutu.github.io\/Fronteira\/"/);
  assert.match(await read('src/styles.css'), /url\('\/Fronteira\/assets\/fonts\/InterVariable\.woff2'\)/);
  assert.match(await read('src/styles.css'), /url\('\/Fronteira\/assets\/fonts\/InterVariable-Italic\.woff2'\)/);
  assert.match(await read('index.html'), /href="\/Fronteira\/assets\/favicon\.svg"/);
  const qr=JSON.parse(await read('assets/qr/SOURCES.json'));
  assert.equal(qr.target,'https://megueutu.github.io/Fronteira/');
  for(const file of ['assets/fonts/InterVariable.woff2','assets/fonts/InterVariable-Italic.woff2','assets/fonts/LICENSE.txt','assets/branding/fronteira.svg','assets/qr/site.svg','assets/qr/barcode.svg']) assert.ok((await readFile(new URL(`../_site/${file}`,import.meta.url))).length,file);
  assert.match(await read('previews/index.html'), /href="\/Fronteira\/\?template=3d"/);
  assert.match(await read('src/app.js'), /from ['"]\.\/content.js['"]/);
  assert.match(await read('edicoes/energia-atomica.html'), /location.replace\(destination.href\)/);
  assert.match(await read('index.html'), /href="\/Fronteira\/src\/reader-shell.css"/);
  assert.doesNotMatch(await read('src/app.js'), /initializeBackground/);
  assert.doesNotMatch(await read('index.html'), /organic-bg/);
  assert.match(await read('src/explorers.js'), /from ['"]\.\/data.js['"]/);
  const files = await readdir(new URL('../_site/', import.meta.url));
  assert.deepEqual(files.sort(), ['.nojekyll', 'assets', 'edicoes', 'index.html', 'previews', 'src'].sort());
  // A second build must not retain the project prefix or files from the first.
  execFileSync(process.execPath, ['scripts/build-pages.mjs'], { env: { ...process.env, BASE_PATH: '/' } });
  assert.match(await read('index.html'), /src="\/src\/app.js"/);
});
