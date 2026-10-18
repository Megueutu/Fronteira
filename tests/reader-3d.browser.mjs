import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
import {projection,projectPoint} from '../src/webgl-reader.js';
const base=process.env.TEST_URL || 'http://127.0.0.1:4317';
const b=await launchBrowser({timeout:240000});
await mkdir('artifacts/reader-3d',{recursive:true});
const idle=()=>b.waitFor(`document.querySelector('#stage').getAttribute('aria-busy')==='false' && document.querySelector('#loading').hidden && document.querySelector('#book-canvas').dataset.textureCount==='2'`);
const frame=async name=>{
  await b.evaluate(`document.querySelector('#stage').scrollIntoView({block:'start'});new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
  await writeFile(`artifacts/reader-3d/${name}.png`,await b.screenshot({clip:{x:0,y:await b.evaluate('scrollY'),width:await b.evaluate('innerWidth'),height:await b.evaluate('innerHeight')}}));
};
try {
  await b.viewport(1440,1000);await b.navigate(base+'/?render=4');
  await b.waitFor(`document.body.dataset.ready==='true'`);
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('.page-action')).visibility`),'hidden');
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('.page-bottom')).visibility`),'visible');
  await b.navigate(base+'/?template=3d&page=15');await idle();
  assert.ok(await b.evaluate(`[...document.querySelectorAll('#hotspots button')].every(button=>button.dataset.action==='sources')`));
  const measurements=[];
  for(const [width,height] of [[1896,1080],[1440,1000],[1024,900],[768,900],[390,844],[320,700]]) {
    await b.viewport(width,height,width<=760);
    await b.waitFor(`document.querySelector('#book-canvas').width>=document.querySelector('#book-canvas').clientWidth*1.49`);
    const layout=await b.evaluate(`(()=>{const canvas=document.querySelector('#book-canvas'),c=canvas.getBoundingClientRect(),tray=document.querySelector('#hotspots').getBoundingClientRect(),stage=document.querySelector('#stage').getBoundingClientRect();return {width:innerWidth,height:innerHeight,canvas:c.toJSON(),tray:tray.toJSON(),stage:stage.toJSON(),overflow:document.documentElement.scrollWidth>innerWidth,buttons:[...document.querySelectorAll('#hotspots button')].map(el=>({page:el.dataset.page,action:el.dataset.action,...el.getBoundingClientRect().toJSON()}))}})()`);
    assert.equal(layout.overflow,false,`overflow at ${width}`);
    assert.ok(layout.tray.top>=layout.canvas.bottom,`controls cover the page at ${width}`);
    assert.ok(layout.tray.bottom<=layout.stage.bottom && layout.tray.left>=0 && layout.tray.right<=width,JSON.stringify(layout));
    assert.ok(layout.buttons.every(button=>button.width>=44 && button.height>=44 && button.x>=0 && button.right<=width));
    assert.deepEqual([...new Set(layout.buttons.map(button=>button.page))],['14','15']);
    const matrix=projection(layout.canvas.width/layout.canvas.height);
    for(const x of [-1.43,1.43]) for(const y of [-1,1]) {
      const p=projectPoint(matrix,x,y,0,layout.canvas.width,layout.canvas.height);
      assert.ok(p.x>0 && p.x<layout.canvas.width && p.y>0 && p.y<layout.canvas.height);
    }
    measurements.push(layout);await frame(`spread-${width}`);
  }
  await writeFile('artifacts/reader-3d/layout.json',JSON.stringify(measurements,null,2));
  await b.viewport(1440,1000);
  await b.evaluate(`document.querySelector('.hotspot[data-page="14"]').focus()`);await b.key(' ','Space',32);
  await b.waitFor(`document.querySelector('#interaction-dialog').open && document.querySelector('.source-catalog')`);
  await b.key('Escape','Escape',27);
  await b.waitFor(`!document.querySelector('#interaction-dialog').open && document.activeElement.matches('.hotspot[data-page="14"]')`);
  await b.click('.spread-source-action[data-page="15"]');
  await b.waitFor(`document.querySelector('.source-catalog')`);
  assert.ok(await b.evaluate(`document.querySelector('.sources-overview').textContent.includes('Sair, manter')`));
  await b.key('Escape','Escape',27);
  await b.waitFor(`document.activeElement.matches('.spread-source-action[data-page="15"]')`);
  await b.click('#next');await b.waitFor(`document.querySelector('#stage').getAttribute('aria-busy')==='true'`);
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('#hotspots')).visibility`),'hidden');
  await idle();await frame('after-turn');
  assert.equal(await b.evaluate(`document.querySelector('#page-status').textContent`),'17 — 18 / 20');
  await b.click('#previous');await idle();
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await b.key('Home','Home',36);
  await b.waitFor(`document.querySelector('.hotspot')?.dataset.page==='1'`);await idle();
  assert.equal(await b.evaluate(`document.querySelectorAll('.hotspot').length`),1);
  assert.equal(await b.evaluate(`document.querySelector('.hotspot').dataset.page`),'1');
  for(let spread=1;spread<10;spread++) {
    await b.click('#next');await idle();
    assert.deepEqual(await b.evaluate(`[...document.querySelectorAll('#hotspots button')].map(el=>el.dataset.page)`),[String(spread*2),String(spread*2+1)]);
  }
  await b.click('#read-spread');await b.waitFor(`document.querySelectorAll('.linear-page').length===2`);
  await b.key('Escape','Escape',27);await b.waitFor(`!document.querySelector('#interaction-dialog').open`);
  await b.evaluate(`document.querySelector('#book-canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext()`);
  await b.waitFor(`!document.querySelector('#stage-error').hidden && !document.querySelector('#html-view').hidden`);
  assert.deepEqual(b.errors,[]);assert.deepEqual(b.requests,[]);
  console.log('PASS: no action callouts on 3D paper or below it, source links, keyboard/focus, 6 widths, 10 spreads, real turn, reduced motion, texture cache, reading and WebGL fallback.');
} finally {await b.close();}
