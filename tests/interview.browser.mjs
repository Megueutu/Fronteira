import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
import {pages,interviewPhotos,pageIndexForId} from '../src/content.js';
const base=process.env.TEST_URL||'http://localhost:3000';
const b=await launchBrowser({timeout:240000});
await mkdir('artifacts/interview',{recursive:true});
try {
 for(const mode of ['landing','html','3d']) {
  console.log('interview mode',mode); await b.viewport(1440,1000);
  await b.navigate(`${base}/?template=${mode}&page=${pageIndexForId('interview-profile')+1}`);
  await b.waitFor(`document.body?.dataset.readerMode==='${mode}'&&document.querySelector('#stage')?.getAttribute('aria-busy')==='false'`);
  if(mode==='3d') await b.waitFor("document.querySelector('#loading').hidden");
  if(mode==='landing') {
   assert.equal(await b.evaluate("document.querySelectorAll('#landing-view>.page-interview').length"),1);
   await b.click('#landing-interview-profile .supplement-open');
  } else if(mode==='html') await b.click('#html-book .supplement-open');
  else await b.click('.hotspot[data-action=interview]');
  await b.waitFor("document.querySelector('dialog.interview-dialog')?.open");
  await b.waitFor("[...document.querySelectorAll('dialog .interview-photo img')].every(image=>image.naturalWidth>0)");
  assert.equal(await b.evaluate("document.querySelectorAll('dialog .interview-photo').length"),4);
  assert.match(await b.evaluate("document.querySelector('dialog .interview-feature').textContent"),/Braid defende ampliar a participação/);
  await b.click('dialog .interview-questions summary');
  assert.equal(await b.evaluate("document.querySelectorAll('dialog .interview-questions dl>div').length"),5);
  for(const [key,photo] of Object.entries(interviewPhotos)) {
   console.log('interview image',mode,key);
   await b.click(`dialog [data-photo-key="${key}"]`);
   await b.waitFor("document.querySelector('.expanded-photo img')?.naturalWidth>0");
   assert.equal(await b.evaluate("document.querySelector('.expanded-photo img').getAttribute('src')"),photo.src);
   assert.ok((await b.evaluate("document.querySelector('.expanded-photo figcaption').textContent")).includes(photo.credit));
   await b.key('Escape','Escape',27);
   await b.waitFor(`document.activeElement===document.querySelector('dialog [data-photo-key="${key}"]')`);
  }
  await b.key('Escape','Escape',27);

 }
 for(const width of [768,390,320]) {
  console.log('interview width',width); await b.viewport(width,1000,width<760);
  await b.navigate(`${base}/?template=landing&page=${pageIndexForId('interview-profile')+1}`);
  await b.waitFor("document.querySelector('#landing-interview-profile .supplement-open')");
  assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'));
  await b.click('#landing-interview-profile .supplement-open');
  assert.ok(await b.evaluate("document.querySelector('dialog').scrollWidth<=document.querySelector('dialog').clientWidth"));
  const frame=await b.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); await writeFile(`artifacts/interview/supplement-${width}.png`,Buffer.from(frame.data,'base64'));
 }
 assert.deepEqual(b.errors,[]);
 assert.equal(pages.filter(page=>Number.isInteger(page.folio)).length,20);
 console.log('PASS: unnumbered supplement, complete interview, four credited images, nested focus/Escape, three modes and responsive layouts.');
}finally{await b.close();}
