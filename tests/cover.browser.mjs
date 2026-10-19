import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
const b=await launchBrowser();
const base=process.env.TEST_URL||'http://localhost:3000';
await mkdir('artifacts/cover',{recursive:true});
try {
 for(const width of [1440,390,320]) {
  console.log('cover viewport',width); await b.viewport(width,1064,width<760);
  await b.navigate(base+'/');
  await b.waitFor("document.querySelector('.edition-cover')?.dataset.coverActive==='true'");
  console.log('cover active'); await b.evaluate('document.fonts.ready');
  assert.equal(await b.evaluate("document.querySelectorAll('#html-book .cover-photograph').length"),1);
  assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'));
  const bounds=await b.evaluate(`(()=>{const qr=document.querySelector('#html-book .cover-qr').getBoundingClientRect(),code=document.querySelector('#html-book .cover-barcode').getBoundingClientRect();return{qrBottom:qr.bottom,codeTop:code.top}})()`);
  assert.ok(bounds.qrBottom<bounds.codeTop,'QR and barcode have separate space');
  assert.equal(await b.evaluate("getComputedStyle(document.querySelector('#html-book .lava-window')).animationPlayState"),'running');
  console.log('motion check'); const before=await b.evaluate("getComputedStyle(document.querySelector('#html-book .lava-window')).transform");
  await b.evaluate('new Promise(resolve=>setTimeout(resolve,700))');
  assert.notEqual(await b.evaluate("getComputedStyle(document.querySelector('#html-book .lava-window')).transform"),before,'organic windows move');
  await b.evaluate(`document.querySelector('#html-book .cover-title').dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:250,clientY:200,pointerType:'mouse'}))`);
  assert.ok(await b.evaluate("document.querySelector('#html-book .edition-cover').style.getPropertyValue('--lava-x')"));
  assert.equal(await b.evaluate("document.querySelector('#html-book .cover-motion-toggle')"),null);
  await writeFile(`artifacts/cover/cover-${width}.png`,await b.screenshot());
 }
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await b.evaluate("getComputedStyle(document.querySelector('#html-book .lava-window')).animationName"),'none');
 assert.equal(await b.evaluate("document.querySelector('#html-book .cover-motion-toggle')"),null);
 await b.navigate(base+'/?render=0');await b.waitFor("document.body?.dataset.ready==='true'");
 assert.equal(await b.evaluate("getComputedStyle(document.querySelector('.lava-window')).animationName"),'none');
 assert.deepEqual(b.errors,[]);
 console.log('PASS: one continuous photo, organic mask motion, pointer response, no pause button, reduced motion, stable texture rendering and three widths.');
} finally {await b.close();}
