import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = await readFile(new URL('../index.html',import.meta.url),'utf8');
const legacy = await readFile(new URL('../edicoes/energia-atomica.html',import.meta.url),'utf8');
const app = await readFile(new URL('../src/app.js',import.meta.url),'utf8');

test('one reader uses the Material shell and all three existing reading modes', () => {
  assert.match(root, /class="unified-reader"/);
  for (const mode of ['html','3d','landing']) assert.equal([...root.matchAll(new RegExp(`data-mode="${mode}"`,'g'))].length,1);
  for (const id of ['open-index','previous','next','zoom-in','zoom-out','zoom-fit','zoom-reset','read-spread','read-linear','fullscreen']) assert.match(root,new RegExp(`id="${id}"`));
  const symbols = new Set([...root.matchAll(/<symbol id="([^"]+)"/g)].map(match=>match[1]));
  for (const [,id] of root.matchAll(/<use href="#([^"]+)"/g)) assert.ok(symbols.has(id),id);
  assert.match(app, /params.get\('template'\) : 'html'/);
  assert.match(root, /src="\/src\/app.js"/);
  assert.doesNotMatch(legacy, /<section|<canvas|base64/);
});

test('old edition links redirect to the root with project prefix and reading position', () => {
  const script = legacy.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const prefix of ['/', '/Fronteira/']) {
    for (const [suffix,expected] of [['',''],['?template=3d&page=13','?template=3d&page=13'],['#p13','?page=12']]) {
      const url = new URL(`https://example.com${prefix}edicoes/energia-atomica.html${suffix}`);
      let destination;
      const location = {href:url.href,search:url.search,hash:url.hash,replace:href=>{destination=href;}};
      vm.runInNewContext(script,{URL,location});
      assert.equal(destination,`https://example.com${prefix}${expected}`);
    }
  }
});
