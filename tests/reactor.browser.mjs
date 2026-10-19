import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
import {reactorSteps} from '../src/data.js';
import {pageIndexForId} from '../src/content.js';
const b=await launchBrowser({timeout:180000});
const base=process.env.TEST_URL || 'http://localhost:3000';
const root='#landing-reactor [data-explorer=reactor]';
await mkdir('artifacts/reactor',{recursive:true});
const capture=async name=>{
 await b.evaluate(`document.querySelector('${root}').scrollIntoView({block:'start',behavior:'instant'})`);
 await b.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 const clip=await b.evaluate(`(()=>{const r=document.querySelector('${root}').getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}})()`);
 await writeFile(`artifacts/reactor/${name}.png`,await b.screenshot({clip}));
};
try {
 await b.viewport(1440,1100);await b.navigate(base+`/?template=landing&page=${pageIndexForId('reactor')+1}`);
 await b.waitFor(`document.querySelectorAll('${root} [data-reactor-step]').length===5`);
 assert.equal(await b.evaluate("getComputedStyle(document.querySelector('#landing-reactor .reactor-strip')).display"),'none');
 assert.equal(await b.evaluate(`document.querySelectorAll('${root} .reactor-stages>li').length`),4);
 assert.ok(await b.evaluate(`document.querySelector('${root} [data-source-id=iaea]').textContent.includes('How does a nuclear power plant work?')`));
 for(const [i,step] of reactorSteps.entries()) {
  await b.click(`${root} [data-reactor-step="${i}"]`);
  assert.equal(await b.evaluate(`document.querySelector('${root} [data-reactor-title]').textContent`),step[0]);
  assert.equal(await b.evaluate(`document.querySelector('${root} [data-reactor-description]').textContent`),step[1]);
  assert.equal(await b.evaluate(`document.querySelectorAll('${root} [aria-pressed=true]').length`),1);
 }
 await b.evaluate(`document.querySelector('${root} [data-reactor-step="2"]').focus({preventScroll:true})`);
 const page=await b.evaluate('location.search');
 await b.key('ArrowRight','ArrowRight',39);
 assert.equal(await b.evaluate(`document.querySelector('${root}').dataset.reactorActive`),'3');
 assert.equal(await b.evaluate('location.search'),page);
 await b.key('End','End',35);assert.equal(await b.evaluate(`document.querySelector('${root}').dataset.reactorActive`),'4');
 await b.key('Home','Home',36);assert.equal(await b.evaluate(`document.querySelector('${root}').dataset.reactorActive`),'0');
 await capture('desktop');
 for(const width of [1024,768,390,320]) {
  await b.viewport(width,1100,width<760);
  assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),`viewport ${width}`);
  assert.ok(await b.evaluate(`(()=>{const r=document.querySelector('${root}');return r.scrollWidth<=r.clientWidth})()`),`diagram ${width}`);
  assert.ok(await b.evaluate(`Array.from(document.querySelectorAll('${root} button')).every(button=>button.getBoundingClientRect().height>=44)`));
  await b.click(`${root} [data-reactor-step="2"]`);
  await b.evaluate(`document.querySelector('${root} [data-reactor-step="2"]').focus({preventScroll:true})`);
  if(width===390) await capture('mobile');
 }
 await b.viewport(1440,1100);
 await b.click('[data-mode="3d"]');
 await b.click('#open-index');await b.click(`dialog [data-jump="${pageIndexForId('reactor')}"]`);
 await b.waitFor("document.querySelector('#loading').hidden && document.querySelector('#book-canvas').dataset.textureCount==='2'");
 await b.click('#read-spread');
 assert.equal(await b.evaluate("document.querySelectorAll('dialog [data-explorer=reactor]').length"),1);
 await b.click('dialog [data-reactor-step="4"]');
 assert.equal(await b.evaluate("document.querySelector('dialog [data-reactor-title]').textContent"),reactorSteps[4][0]);
 await b.key('Escape','Escape',27);
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await b.click('[data-mode="landing"]');
 assert.equal(await b.evaluate(`parseFloat(getComputedStyle(document.querySelector('${root} .reactor-drawing')).transitionDuration)`),0);
 assert.deepEqual(b.errors,[]);assert.deepEqual(b.requests,[]);
 console.log('PASS: four illustrated stages, five explanations, source, keyboard isolation, focus, responsive bounds, 3D reading and reduced motion.');
} finally {await b.close();}
