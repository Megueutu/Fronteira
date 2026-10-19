import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { launchBrowser } from '../scripts/chromium.mjs';
import { pages,pageIndexForId,getOpening,spreadForPage,spreadCount,formatPages,formatPage } from '../src/content.js';
const base=(process.env.TEST_URL||'http://127.0.0.1:3000').replace(/\/$/,'');
await mkdir('artifacts',{recursive:true});
const b=await launchBrowser({timeout:300000});
const capture=async name=>writeFile(`artifacts/${name}.png`,await b.screenshot());
const idle=()=>b.waitFor("document.querySelector('#stage')?.getAttribute('aria-busy')==='false'");
const article=id=>`[data-page-index="${pageIndexForId(id)}"]`;
const clean=async()=>assert.equal(await b.evaluate('location.search+location.hash'),'');
const imagesReady=()=>b.evaluate("Promise.all([...document.querySelectorAll('#html-book img')].map(image=>image.decode()))");
async function visit(id,mode='html') {
  assert.ok(pageIndexForId(id)>=0,id);
  await b.navigate(`${base}/?template=${mode}&page=${pageIndexForId(id)+1}`);
  await b.waitFor(`document.body?.dataset.readerMode==='${mode}' && document.querySelector('#stage')?.getAttribute('aria-busy')==='false'`);
  if(mode==='3d')await b.waitFor("document.querySelector('#loading').hidden");
  else if(mode==='html')await b.waitFor(`!!document.querySelector('#html-book ${article(id)}')`);
  await clean();
}
async function action(id,type) {
  await visit(id);await b.click(`#html-book ${article(id)} [data-action="${type}"]`);
  await b.waitFor("document.querySelector('#interaction-dialog').open");
}
async function close(){await b.key('Escape','Escape',27);await b.waitFor("!document.querySelector('#interaction-dialog').open");}
async function restoreReading(selector){
  await b.key('Escape','Escape',27);
  await b.waitFor(`document.querySelector('#interaction-dialog').open && !!document.querySelector(${JSON.stringify(selector)})`);
}
try {
  assert.equal(pages.length%4,0);assert.equal(spreadCount,pages.length/2+1);
  await b.viewport(1440,1100);await visit('cover');await imagesReady();
  assert.equal(await b.evaluate("document.querySelectorAll('#html-book>article').length"),1);
  assert.equal(await b.evaluate("document.querySelector('#previous').disabled"),true);
  const cover=await b.evaluate(`(()=>{const p=document.querySelector('#html-book .edition-cover'),a=p.getBoundingClientRect(),i=p.querySelector('.cover-photograph').getBoundingClientRect();return {photos:p.querySelectorAll('.cover-photograph').length,folios:p.querySelectorAll('.page-top,.page-bottom,.page-tail').length,fullBleed:Math.abs(a.width-i.width)<1&&Math.abs(a.height-i.height)<1,title:p.querySelector('.cover-title').textContent,brand:p.querySelector('.publisher-brand').getAttribute('src')}})()`);
  assert.equal(cover.photos,1);assert.equal(cover.folios,0);assert.equal(cover.fullBleed,true);
  assert.equal(cover.title.replace(/\s+/g,''),'EnergiaNuclearnoBrasil');
  assert.ok(cover.brand.endsWith('/assets/branding/fronteira.svg'));
  await capture('edition-html-cover');await b.click('#next');await idle();
  assert.equal(await b.evaluate("document.querySelectorAll('#html-book>article').length"),2);
  assert.equal(await b.evaluate("document.querySelector('#page-status').textContent"),formatPages(1));
  await action('editorial','popup');assert.equal(await b.evaluate('document.activeElement.id'),'close-dialog');
  assert.equal(await b.evaluate("document.querySelectorAll('.reading-flow li').length"),5);
  assert.ok((await b.evaluate("document.querySelector('.reading-flow').textContent")).includes('Vincular financiamento a metas e prestação de contas'));
  await close();await b.waitFor(`document.activeElement.matches('${article('editorial')} [data-action="popup"]')`);
  await action('matrix','chart');await b.click('[data-filter="nuclear"]');
  assert.equal(await b.evaluate("document.querySelectorAll('#interactive-chart .chart-row').length"),1);
  assert.ok((await b.evaluate("document.querySelector('#interactive-chart').textContent")).includes('2,0%'));await capture('edition-chart');await close();
  for(const [id,type,step,expected] of [['reactor','diagram',3,'Eletricidade e rede'],['uranium','cycle',2,'Enriquecimento']]){
    await action(id,type);await b.click(`[data-step="${step}"]`);assert.equal(await b.evaluate("document.querySelector('#step-title').textContent"),expected);await close();
  }
  await action('payback','calculator');const initial=await b.evaluate("document.querySelector('#result-years').textContent");
  await b.evaluate("document.querySelector('#capacity').value='60';document.querySelector('#capacity').dispatchEvent(new Event('input',{bubbles:true}))");
  assert.notEqual(await b.evaluate("document.querySelector('#result-years').textContent"),initial);await b.click('[data-scenario="2"]');
  assert.equal(await b.evaluate("document.querySelector('#capacity').value"),'90');await capture('edition-calculator');await close();
  await action('world','timeline');await b.click('[data-event="3"]');assert.ok((await b.evaluate("document.querySelector('#timeline-detail').textContent")).includes('Sendai'));await close();
  await action('balance','checklist');await b.click('[data-evaluate="0"]');assert.ok((await b.evaluate("document.querySelector('#evaluation-status').textContent")).includes('1 de 7'));await close();
  await visit('unequal');await b.click('#read-spread');await b.click('dialog [data-carousel-go="1"]');
  assert.equal(await b.evaluate("document.querySelector('dialog [data-explorer=carousel]').dataset.carouselIndex"),'1');
  await b.click('dialog [data-explorer=carousel] .explorer-slide:not([inert]) [data-action="image"]');await b.waitFor("document.querySelector('.expanded-photo img')?.naturalWidth>0");await restoreReading('dialog [data-explorer=carousel]');
  assert.ok(await b.evaluate("document.activeElement.matches('[data-explorer=carousel] [data-action=image]')"));
  assert.equal(await b.evaluate("document.querySelector('dialog [data-explorer=carousel]').dataset.carouselIndex"),'1');await close();await b.waitFor("document.activeElement.id==='read-spread'");
  await b.click('#read-linear');assert.equal(await b.evaluate("document.querySelectorAll('.linear-page').length"),pages.length);
  await b.click(`dialog ${article('matrix')} [data-action="chart"]`);await restoreReading('dialog .linear-content');assert.equal(await b.evaluate("document.querySelectorAll('.linear-page').length"),pages.length);
  assert.ok(await b.evaluate(`document.activeElement.matches('${article('matrix')} [data-action="chart"]')`));await close();
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await visit('cover');const layouts=[];
  for(let spread=0;spread<spreadCount;spread++){
    await idle();await imagesReady();const opening=getOpening(spread),expected=[opening.leftIndex,opening.rightIndex].filter(i=>i!==null);
    assert.deepEqual(await b.evaluate("[...document.querySelectorAll('#html-book>article')].map(p=>Number(p.dataset.pageIndex))"),expected);
    const measured=await b.evaluate("[...document.querySelectorAll('#html-book>article')].map(p=>{const m=p.querySelector('.page-main'),t=p.querySelector('.page-tail'),paragraph=p.querySelector('.columns p');return{index:Number(p.dataset.pageIndex),contentBottom:t?Math.max(...[...m.children].map(e=>e.getBoundingClientRect().bottom)):null,tailTop:t?.getBoundingClientRect().top??null,justify:paragraph?getComputedStyle(paragraph).textAlign:null,decorative:p.matches('.page-cover,.page-decorative')}})");
    for(const item of measured){if(item.tailTop!==null)assert.ok(item.contentBottom<item.tailTop,JSON.stringify(item));if(item.justify&&!item.decorative)assert.equal(item.justify,'justify');}
    layouts.push(...measured);if(spread<spreadCount-1){await b.click('#next');await idle();}
  }
  assert.equal(layouts.length,pages.length);assert.equal(await b.evaluate("document.querySelector('#next').disabled"),true);
  await writeFile('artifacts/reader-layout.json',JSON.stringify(layouts,null,2));
  await visit('cover','landing');assert.equal(await b.evaluate("document.querySelectorAll('#landing-view .magazine-page').length"),pages.length);
  await b.click('#landing-matrix [data-action=chart]'); await b.waitFor("document.querySelector('dialog').open"); await close(); await clean();
  await visit('cover','3d');await b.waitFor("document.querySelector('#book-canvas').dataset.textureCount==='1'");
  assert.equal(await b.evaluate("document.querySelectorAll('.hotspot').length"),0);assert.equal(await b.evaluate("document.querySelector('#stage-error').hidden"),true);await capture('edition-3d-cover');
  for(let spread=1;spread<spreadCount;spread++){await b.click('#next');await idle();const count=spread===spreadCount-1?1:2;await b.waitFor(`document.querySelector('#book-canvas').dataset.textureCount==='${count}'`);assert.equal(await b.evaluate("document.querySelector('#page-status').textContent"),formatPages(spread));}
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await b.click('#previous');await b.waitFor("document.querySelector('#stage').getAttribute('aria-busy')==='true'");await idle();
  await b.waitFor("document.querySelector('#book-canvas').dataset.textureCount==='2'");await capture('edition-3d-reading');await b.click('#read-spread');assert.equal(await b.evaluate("document.querySelectorAll('.linear-page').length"),2);await close();
  await b.evaluate("document.querySelector('#book-canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext()");await b.waitFor("!document.querySelector('#stage-error').hidden");await b.click('#next');await idle();
  assert.equal(await b.evaluate("Number(document.querySelector('#html-book>article').dataset.pageIndex)"),pageIndexForId('back-cover'));await clean();
  await b.viewport(390,844,true);await visit('cover');await imagesReady();assert.equal(await b.evaluate("document.querySelectorAll('#html-book>article').length"),1);assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'));await capture('edition-mobile-cover');
  await b.click('#next');await idle();assert.equal(await b.evaluate("document.querySelector('#page-status').textContent"),formatPage(pages[pageIndexForId('inside-front')]));
  await visit('unequal');await imagesReady();assert.ok(await b.evaluate("parseFloat(getComputedStyle(document.querySelector('#html-book .columns p')).fontSize)>=16"));await capture('edition-mobile-reading');
  await b.click('#read-linear');assert.equal(await b.evaluate("document.querySelectorAll('.linear-page').length"),pages.length);await close();
  await visit('payback','3d');await b.waitFor("document.querySelector('#book-canvas').dataset.textureCount==='2'");assert.equal(await b.evaluate("document.querySelector('#page-status').textContent"),formatPages(spreadForPage(pageIndexForId('payback'))));
  assert.deepEqual(b.errors,[]);assert.deepEqual(b.requests.filter(r=>!r.url.endsWith('/favicon.ico')),[]);
  console.log(`PASS: ${pages.length} faces, ${spreadCount} openings, isolated covers, three modes, interactions, focus/Escape, texture cache, reduced motion, mobile and WebGL fallback.`);
}finally{await b.close();}
