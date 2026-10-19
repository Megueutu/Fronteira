import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
const b=await launchBrowser();
const base=process.env.TEST_URL||'http://localhost:3000';
await mkdir('artifacts/cover',{recursive:true});
try {
 for(const width of (process.env.W?process.env.W.split(","):[1440,390,320]).map(Number)) {
  console.log('cover viewport',width); await b.viewport(width,1064,width<760);
  await b.navigate(base+'/');
  await b.waitFor("document.querySelector('.edition-cover')?.dataset.coverActive==='true'");
  console.log('cover active'); await b.evaluate('document.fonts.ready');
  assert.equal(await b.evaluate("document.querySelectorAll('#html-book .cover-photograph').length"),1);
  assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'));
  assert.equal(await b.evaluate("document.querySelectorAll('#html-book .cover-qr').length"),0,'o QR saiu da capa');
  assert.ok(await b.evaluate("document.fonts.check('800 40px MontserratVariable')"),'Montserrat is loaded for the cover');
  assert.equal(await b.evaluate("document.querySelectorAll('#html-book .edition-cover canvas.cover-lava-gl').length"),1);
  console.log('motion check'); const frame="document.querySelector('#html-book .cover-lava-gl').toDataURL()";
  const before=await b.evaluate(frame);
  await b.evaluate('new Promise(resolve=>setTimeout(resolve,900))');
  assert.notEqual(await b.evaluate(frame),before,'lava lamp moves');
  assert.equal(await b.evaluate("document.querySelector('#html-book .cover-motion-toggle')"),null);
  await writeFile(`artifacts/cover/cover-${width}.png`,await b.screenshot());
 }
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 {const still=await b.evaluate("document.querySelector('#html-book .cover-lava-gl').toDataURL()");await b.evaluate('new Promise(resolve=>setTimeout(resolve,900))');assert.equal(await b.evaluate("document.querySelector('#html-book .cover-lava-gl').toDataURL()"),still,'reduced motion keeps one still frame');}
 assert.equal(await b.evaluate("document.querySelector('#html-book .cover-motion-toggle')"),null);
 await b.navigate(base+'/?render=0');await b.waitFor("document.body?.dataset.ready==='true'");
 assert.deepEqual(b.errors,[]);
 console.log('PASS: one photograph in organic windows, Montserrat, lava lamp canvas, no pause button, reduced motion, stable texture rendering and three widths.');
} finally {await b.close();}
