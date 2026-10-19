import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { pages, pageHTML, pageIndexForId, getOpening, getSpread, spreadForPage, spreadCount } from '../src/content.js';

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
  const script = legacy.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1].replace(/^\s*import\s+[^;]+;\s*/m,'');
  for (const prefix of ['/', '/Fronteira/']) {
    const explicit=pageIndexForId('payback')+1;
    for (const [suffix,expected] of [['',''],[`?template=3d&page=${explicit}`,`?template=3d&page=${explicit}`],['#p13',`?page=${pageIndexForId('payback')+1}`],['#p1',`?page=${pageIndexForId('cover')+1}`]]) {
      const url = new URL(`https://example.com${prefix}edicoes/energia-atomica.html${suffix}`);
      let destination;
      const location = {href:url.href,search:url.search,hash:url.hash,replace:href=>{destination=href;}};
      vm.runInNewContext(script,{URL,location,pageIndexForId});
      assert.equal(destination,`https://example.com${prefix}${expected}`);
    }
  }
});

test('physical edition has complete signatures, isolated covers and stable destinations',()=>{
  assert.equal(pages.length%4,0);
  assert.equal(spreadCount,pages.length/2+1);
  assert.equal(getOpening(0).leftIndex,null);
  assert.equal(getOpening(spreadCount-1).rightIndex,null);
  assert.deepEqual(getSpread(0).map(page=>page.id),['cover']);
  assert.deepEqual(getSpread(spreadCount-1).map(page=>page.id),['back-cover']);
  assert.deepEqual(Array.from({length:spreadCount},(_,i)=>getSpread(i)).flat().map(page=>page.id),pages.map(page=>page.id));
  for(const id of ['cover','inside-front','contents','team','editorial','unequal','reactor','uranium','payback','messmer','interview-profile','balance','back-cover']) {
    const index=pageIndexForId(id);
    assert.ok(index>=0,id);
    assert.ok(getSpread(spreadForPage(index)).includes(pages[index]),id);
  }
  for(const id of ['cover','inside-front','back-cover']) {
    const index=pageIndexForId(id),page=pages[index];
    assert.equal(page.folio,null,id);
    assert.doesNotMatch(pageHTML(page,index),/class="page-(?:top|bottom|tail)"/,id);
  }
  const numbered=pages.filter(page=>page.folio);
  assert.equal(numbered.length,18);
  assert.deepEqual(numbered.map(page=>page.folio),Array.from({length:numbered.length},(_,i)=>i+1));
});

test('cover uses one institutional photograph, publisher identity and a real site QR',async()=>{
  const index=pageIndexForId('cover'),cover=pageHTML(pages[index],index);
  assert.equal([...cover.matchAll(/class="cover-photograph"/g)].length,1);
  assert.match(cover,/\/assets\/photos\/angra-cover\.jpg/);
  assert.match(cover,/Energia<br>Nuclear<br><span>no Brasil<\/span>/);
  assert.match(cover,/\/assets\/branding\/fronteira\.svg/);
  assert.doesNotMatch(cover,/cover-qr/);
  const dialogs=await readFile(new URL('../src/interactions.js',import.meta.url),'utf8');
  assert.match(dialogs,/\/assets\/qr\/site\.svg/);
  assert.match(dialogs,/href="https:\/\/megueutu.github.io\/Fronteira\/"/);
  assert.match(root,/data-action="qr"/);
  assert.match(root,/href="\/assets\/favicon\.svg"/);
  assert.equal(await readFile(new URL('../assets/favicon.svg',import.meta.url),'utf8'),await readFile(new URL('../assets/branding/favicon.svg',import.meta.url),'utf8'));
  const qr=JSON.parse(await readFile(new URL('../assets/qr/SOURCES.json',import.meta.url),'utf8'));
  assert.equal(qr.target,'https://megueutu.github.io/Fronteira/');
  assert.equal(qr.quietZoneModules,4);
});
