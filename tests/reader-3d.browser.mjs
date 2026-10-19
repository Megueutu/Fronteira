import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
import {pages,getOpening,getSpread,spreadCount,formatPages,pageIndexForId,spreadForPage} from '../src/content.js';
import {projectPoint} from '../src/webgl-reader.js';

const base=process.env.TEST_URL || 'http://localhost:3000';
const browser=await launchBrowser({timeout:300000});
await mkdir('artifacts/reader-3d',{recursive:true});
const idle=(textures)=>browser.waitFor(`document.querySelector('#stage')?.getAttribute('aria-busy')==='false' && document.querySelector('#loading').hidden && document.querySelector('#book-canvas').dataset.textureCount==='${textures}'`);
const capture=async name=>writeFile(`artifacts/reader-3d/${name}.png`,await browser.screenshot({clip:{x:0,y:await browser.evaluate('scrollY'),width:await browser.evaluate('innerWidth'),height:await browser.evaluate('innerHeight')}}));
async function closedBounds(side) {
  const sample=await browser.evaluate(`(()=>{const c=document.querySelector('#book-canvas'),gl=c.getContext('webgl'),p=gl.getParameter(gl.CURRENT_PROGRAM);return {width:c.clientWidth,height:c.clientHeight,matrix:Array.from(gl.getUniform(p,gl.getUniformLocation(p,'matrix')))}})()`);
  const a=projectPoint(sample.matrix,side<0?-1.43:0,0,0,sample.width,sample.height),b=projectPoint(sample.matrix,side<0?0:1.43,0,0,sample.width,sample.height);
  assert.ok(Math.abs((a.x+b.x)/2-sample.width/2)<2,'closed cover is centered');
  assert.ok(a.x>=0&&b.x<=sample.width,'closed cover stays inside canvas');
}
try {
  await browser.viewport(1440,1000);
  await browser.navigate(base+'/?template=3d');await idle(1);
  assert.equal(await browser.evaluate("document.querySelectorAll('.hotspot').length"),0);
  assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),formatPages(0));
  await closedBounds(1);await capture('front-cover');
  await browser.click('#next');
  await browser.waitFor("document.querySelector('#stage').getAttribute('aria-busy')==='true'");
  await idle(2);
  assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),formatPages(1));
  await browser.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  for(let opening=2;opening<spreadCount;opening++) {
    await browser.click('#next');await idle(getSpread(opening).length);
    const expected=getSpread(opening).filter(page=>page.folio || page.supplement).map(page=>String(pages.indexOf(page)));
    assert.deepEqual(await browser.evaluate("[...document.querySelectorAll('.hotspot')].map(button=>button.dataset.page)"),expected);
    assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),formatPages(opening));
  }
  await closedBounds(-1);await capture('back-cover');
  await browser.click('#read-spread');
  assert.equal(await browser.evaluate("document.querySelectorAll('.linear-page').length"),1);
  await browser.key('Escape','Escape',27);
  const target=pageIndexForId('reactor'),opening=spreadForPage(target);
  await browser.click('#open-index');await browser.click(`dialog [data-jump="${target}"]`);await idle(getSpread(opening).length);
  for(const [width,height] of [[1440,1000],[1024,900],[768,900],[390,844],[320,700]]) {
    await browser.viewport(width,height,width<=760);
    const bounds=await browser.evaluate("(()=>{const c=document.querySelector('#book-canvas').getBoundingClientRect(),tray=document.querySelector('#hotspots').getBoundingClientRect();return {canvas:c.toJSON(),tray:tray.toJSON(),overflow:document.documentElement.scrollWidth>innerWidth}})()");
    assert.equal(bounds.overflow,false,`overflow at ${width}`);
    assert.ok(bounds.tray.top>=bounds.canvas.bottom-1,'source controls stay below paper');
    assert.ok(bounds.tray.left>=0&&bounds.tray.right<=width,'source controls stay inside viewport');
  }
  await browser.viewport(1440,1000);
  await browser.click(`.hotspot[data-page="${target}"]`);
  await browser.waitFor("document.querySelector('.source-catalog')");
  await browser.key('Escape','Escape',27);
  await browser.waitFor(`document.activeElement.matches('.hotspot[data-page="${target}"]')`);
  await browser.click('#read-spread');
  assert.equal(await browser.evaluate("document.querySelectorAll('.linear-page').length"),getSpread(opening).length);
  await browser.key('Escape','Escape',27);
  await browser.evaluate("document.querySelector('#book-canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext()");
  await browser.waitFor("!document.querySelector('#stage-error').hidden && !document.querySelector('#html-view').hidden");
  await browser.click('#next');await browser.waitFor("document.querySelector('#stage').getAttribute('aria-busy')==='false'");
  assert.deepEqual(browser.errors,[]);assert.deepEqual(browser.requests,[]);
  console.log('PASS: centered isolated covers, every physical opening, texture cache, real/reduced turn, source controls, 5 widths and WebGL fallback.');
} finally {await browser.close();}
