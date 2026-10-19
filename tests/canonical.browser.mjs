import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
import {pages,pageIndexForId} from '../src/content.js';
const b=await launchBrowser({timeout:300000});
const base=process.env.TEST_URL||'http://localhost:3000';
const samples=pages.map(page=>page.id);
await mkdir('artifacts/canonical',{recursive:true});
async function visit(id,mode,width){await b.viewport(width,1100,width<760);const index=pageIndexForId(id);await b.navigate(mode==='render'?`${base}/?render=${index}`:`${base}/?template=${mode}&page=${index+1}`);await b.waitFor(mode==='render'?"document.body?.dataset.ready==='true'":`document.body?.dataset.readerMode==='${mode}'&&document.querySelector('[data-page-id="${id}"]')`);await b.evaluate('document.fonts.ready');}
async function measure(id){return b.evaluate(`(()=>{const p=document.querySelector('[data-page-id="${id}"]'),r=p.getBoundingClientRect(),scale=r.width/760;return{ratio:r.width/r.height,nodes:[...p.querySelectorAll('.page-main > *,.page-tail')].filter(el=>el.getBoundingClientRect().height>0).map(el=>{const x=el.getBoundingClientRect();return{class:el.getAttribute('class'),x:(x.x-r.x)/scale,y:(x.y-r.y)/scale,w:x.width/scale,h:x.height/scale}})}})()`);}
try{
 for(const id of samples){
  await visit(id,'render',1000);const expected=await measure(id);
  for(const width of [1440,390])for(const mode of ['html','landing']){
   await visit(id,mode,width);const actual=await measure(id);
   assert.ok(Math.abs(actual.ratio-760/1064)<.001,`${id} ${mode} ratio`);
   assert.deepEqual(actual.nodes.map(el=>el.class),expected.nodes.map(el=>el.class),`${id} ${mode} elements`);
   for(let i=0;i<actual.nodes.length;i++)for(const key of ['x','y','w','h'])assert.ok(Math.abs(actual.nodes[i][key]-expected.nodes[i][key])<2,`${id} ${mode} ${width} ${i}.${key}: ${actual.nodes[i][key]} vs ${expected.nodes[i][key]}`);
  }
 }
 for(const width of [1440,390,320]){
  await visit('payback','landing',width);
  await b.waitFor("!document.querySelector('#zoom-controls').hidden");
  const before=await b.evaluate("document.querySelector('#landing-payback').getBoundingClientRect().width");
  await b.click('#zoom-in');await b.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const after=await b.evaluate("document.querySelector('#landing-payback').getBoundingClientRect().width");
  assert.ok(Math.abs(after/before-1.15)<.01,'scroll zoom scales the whole sheet');
  assert.equal(await b.evaluate('history.state.reader.page'),pageIndexForId('payback')+1,'zoom preserves the reading page');
  assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),'zoom does not widen the toolbar');
  await b.click('#zoom-fit');
  const frame=await b.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`artifacts/canonical/scroll-${width}.png`,Buffer.from(frame.data,'base64'));
 }
 assert.deepEqual(b.errors,[]);
 console.log('PASS: canonical page geometry matches texture rendering, HTML and scrolling across desktop/mobile; scroll zoom preserves proportions and reading position.');
}finally{await b.close();}
