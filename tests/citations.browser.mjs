import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { launchBrowser } from '../scripts/chromium.mjs';
import {pages} from '../src/content.js';
const base=process.env.TEST_URL || 'http://127.0.0.1:4317';
const b=await launchBrowser({timeout:240000});
await mkdir('artifacts/citations',{recursive:true});
const shot=async name=>{await b.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');await writeFile(`artifacts/citations/${name}.png`,await b.screenshot({clip:{x:0,y:await b.evaluate('scrollY'),width:await b.evaluate('innerWidth'),height:900}}));};
try {
  await b.viewport(1440,900);
  await b.navigate(base+'/?template=landing&page=5');
  await b.waitFor("document.querySelector('#landing-matrix')?.getBoundingClientRect().top<200");
  assert.deepEqual(await b.evaluate("[...document.querySelectorAll('#landing-view .columns p')].map(p=>p.textContent)"),pages.flatMap(page=>page.body));
  assert.ok(await b.evaluate("[...document.querySelectorAll('#landing-view .inline-citation')].every(e=>getComputedStyle(e).display!=='none')"));
  assert.ok(await b.evaluate("[...document.querySelectorAll('#landing-view .columns > .claim-source')].every(e=>e.previousElementSibling.matches('p') && e.querySelector('strong'))"));
  await shot('matrix-desktop');
  for (const width of [768,390,320]) {
    await b.viewport(width,900,width<760);
    assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),`width ${width}`);
    await b.evaluate("document.querySelector('#landing-matrix').scrollIntoView({block:'start'})");
    if (width===390) await shot('matrix-mobile');
  }
  await b.viewport(1440,900);
  await b.click('#open-index'); await b.click('dialog [data-jump="11"]');
  await b.waitFor("new URL(location.href).searchParams.get('page')==='12'");
  await b.click('#next');
  await b.waitFor("new URL(location.href).searchParams.get('page')==='13'");
  await b.click('#landing-payback [data-action="calculator"]');
  assert.ok(await b.evaluate("document.querySelector('dialog [data-source-id=group]').textContent.includes('Tabela 4')"));
  await b.click('#close-dialog');
  await b.click('[data-mode="3d"]');
  await b.waitFor("document.querySelector('#loading').hidden && document.querySelector('#book-canvas').dataset.textureCount==='2'");
  assert.ok(await b.evaluate("!document.querySelector('#reader-sources').hidden && document.querySelector('#reader-sources').textContent.includes('Tabela 5')"));
  await b.click('#next');
  await b.waitFor("document.querySelector('#stage').getAttribute('aria-busy')==='false'");
  assert.ok(await b.evaluate("document.querySelector('#reader-sources').textContent.includes('Uma decisão de Estado')"));
  await b.click('.hotspot[data-action="timeline"]');
  for (let i=0;i<6;i++) { await b.click(`[data-event="${i}"]`); assert.ok(await b.evaluate("document.querySelector('#timeline-detail .source-location')?.textContent.length>20")); }
  await b.click('#close-dialog');
  await b.click('[data-mode="html"]');
  assert.ok(await b.evaluate("!document.querySelector('#reader-sources').hidden"));
  await b.click('#read-spread');
  assert.ok(await b.evaluate("[...document.querySelectorAll('.linear-content .inline-citation')].every(e=>getComputedStyle(e).display!=='none')"));
  await b.click('#close-dialog');
  await b.click('#open-index');await b.click('dialog [data-action=interview]');
  assert.ok(await b.evaluate("document.querySelectorAll('dialog .interview-answer [data-source-id=interview]').length===3"));
  await b.evaluate("document.querySelector('.interview-answer').scrollIntoView({block:'start'})");
  await b.waitFor("document.querySelector('.interview-answer .claim-source').getBoundingClientRect().top<innerHeight");
  const interviewShot=await b.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await writeFile('artifacts/citations/interview-sources.png',Buffer.from(interviewShot.data,'base64'));
  assert.deepEqual(b.errors,[]);
  assert.deepEqual(b.requests,[]);
  console.log('PASS: paragraph sources, source locators, responsive reading, calculator, all six countries, HTML/3D source panel, and interview.');
} finally {await b.close();}
