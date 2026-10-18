import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser } from '../scripts/chromium.mjs';
import { pages, pageIndexForId, formatPages, spreadForPage, formatPage } from '../src/content.js';

const base = (process.env.TEST_URL || 'http://localhost:3000').replace(/\/$/,'');
const browser = await launchBrowser({timeout:240000});
await mkdir('artifacts/unified',{recursive:true});

try {
  await browser.viewport(1440,1000);
  await browser.navigate(base+'/');
  await browser.waitFor("document.body?.dataset.readerMode==='html' && document.querySelectorAll('#html-book>article').length===1");
  assert.equal(await browser.evaluate('location.pathname+location.search+location.hash'),new URL(base+'/').pathname);
  assert.equal(await browser.evaluate("document.querySelector('#reader-toolbar img,#organic-bg')"),null);
  assert.ok(await browser.evaluate("[...document.querySelectorAll('#reader-toolbar .reader-icon')].every(icon=>getComputedStyle(icon).width==='24px'&&getComputedStyle(icon).height==='24px')"));
  assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),formatPages(0));
  assert.ok(await browser.evaluate("parseFloat(getComputedStyle(document.querySelector('.reading-actions')).borderRadius)>100"));
  await browser.evaluate("Promise.all([...document.querySelectorAll('#html-book img')].map(image=>image.decode()))");

  await browser.click('#open-index');
  await browser.waitFor("document.querySelector('#interaction-dialog').classList.contains('contents-drawer')");
  assert.equal(await browser.evaluate("document.querySelector('#open-index').getAttribute('aria-expanded')"),'true');
  assert.equal(await browser.evaluate("document.querySelector('#interaction-dialog').getBoundingClientRect().left"),0);

  await browser.key('Escape','Escape',27);
  await browser.waitFor("document.activeElement.id==='open-index'");
  assert.equal(await browser.evaluate("document.querySelector('#open-index').getAttribute('aria-expanded')"),'false');
  await browser.click('#zoom-in');
  assert.equal(await browser.evaluate("document.querySelector('#zoom-status').textContent"),'115%');
  await browser.click('#zoom-reset');
  assert.equal(await browser.evaluate("document.querySelector('#zoom-status').textContent"),'100%');
  await browser.click('#zoom-out'); await browser.click('#zoom-fit');
  assert.equal(await browser.evaluate("document.querySelector('#zoom-status').textContent"),'100%');
  await browser.click('#next');
  await browser.waitFor("document.querySelector('#stage').getAttribute('aria-busy')==='false'");
  await browser.click('[data-mode="landing"]');
  await browser.waitFor(`document.querySelectorAll('#landing-view .magazine-page').length===${pages.length}`);
  await browser.click('[data-mode="3d"]');
  await browser.waitFor("document.querySelector('#loading').hidden && document.querySelector('#book-canvas').dataset.textureCount==='2'");
  assert.equal(await browser.evaluate("document.querySelector('#stage-error').hidden"),true);
  assert.equal(await browser.evaluate('location.search+location.hash'),'');
  assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),formatPages(spreadForPage(pageIndexForId('inside-front'))));
  // The dedicated 3D suite captures the canvas in a fresh browser scene.
  for (const width of [1024,768,390,320]) {
    await browser.viewport(width,844,width<760);
    await browser.click('[data-mode="html"]');
    assert.ok(await browser.evaluate('document.documentElement.scrollWidth<=innerWidth'),`overflow at ${width}`);
    const controls = await browser.evaluate("[...document.querySelectorAll('#reader-toolbar button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>{const r=b.getBoundingClientRect();return {id:b.id||b.dataset.mode,x:r.x,y:r.y,right:r.right,bottom:r.bottom}})");
    for (let i=0;i<controls.length;i++) for(let j=i+1;j<controls.length;j++) {
      const a=controls[i],b=controls[j];
      assert.ok(!(a.x<b.right-1&&a.right>b.x+1&&a.y<b.bottom-1&&a.bottom>b.y+1),`overlap ${width}: ${a.id}/${b.id}`);
    }

  }
  const target=pageIndexForId('payback'),folioCount=pages.filter(page=>page.folio).length;
  await browser.navigate(base+`/edicoes/energia-atomica.html?template=html&page=${target+1}`);
  await browser.waitFor(`location.pathname.endsWith('/') && document.querySelector('#html-book>[data-page-index="${target}"]')`);
  assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),formatPage(pages[target]));
  assert.equal(await browser.evaluate("document.querySelectorAll('#html-book>article').length"),1);
  assert.equal(await browser.evaluate('location.search+location.hash'),'');
  assert.deepEqual(browser.errors,[]);
  assert.deepEqual(browser.requests.filter(request=>!request.url.endsWith('/favicon.ico')),[]);
  console.log(`PASS: clean unified root, isolated cover, Material toolbar, drawer/focus, zoom, ${pages.length} faces, three modes, responsive controls and legacy redirect.`);
} finally { await browser.close(); }
