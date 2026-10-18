import assert from 'node:assert/strict';
import {launchBrowser} from '../scripts/chromium.mjs';
import {pages,pageIndexForId} from '../src/content.js';
import {pageSourceRecords} from '../src/citations.js';
import {regionalTariffs,decimal,reactorSteps} from '../src/data.js';
const b=await launchBrowser({timeout:300000}),base=process.env.TEST_URL||'http://localhost:3000',scope=process.env.READER_CASE||'all';
const cases={matrix:['matrix','chart'],reactor:['reactor','diagram'],cycle:['uranium','cycle'],payback:['payback','calculator'],world:['world','timeline'],balance:['balance','checklist']};
const selected=scope==='all'?Object.keys(cases):scope==='sources'?[]:[scope];
async function visit(id,mode){await b.navigate(`${base}/?template=${mode}&page=${pageIndexForId(id)+1}`);await b.waitFor(`document.body?.dataset.readerMode==='${mode}'&&document.querySelector('#stage')?.getAttribute('aria-busy')==='false'`);if(mode==='3d')await b.waitFor("document.querySelector('#loading').hidden");}
async function close(){await b.key('Escape','Escape',27);await b.waitFor("!document.querySelector('dialog').open");}
try{
 await b.viewport(1440,1000);
 for(const mode of ['html','landing','3d']){
  for(const key of selected.filter(key=>cases[key])){
   const [id,type]=cases[key];await visit(id,mode);
   const root=mode==='3d'?'.spread-page-action':mode==='landing'?`#landing-${id} .page-action`:`#html-book [data-page-id="${id}"] .page-action`;
   await b.click(`${root}${mode==='3d'?`[data-page="${pageIndexForId(id)}"]`:''}`);await b.waitFor("document.querySelector('dialog').open");
   if(type==='chart'){await b.click('[data-filter=nuclear]');assert.equal(await b.evaluate("document.querySelectorAll('#interactive-chart .chart-row').length"),1);}
   if(type==='diagram'||type==='cycle'){await b.click('[data-step="2"]');assert.ok((await b.evaluate("document.querySelector('#step-title').textContent")).length>5);}
   if(type==='calculator'){const before=await b.evaluate("document.querySelector('#result-years').textContent");await b.evaluate("const x=document.querySelector('#capacity');x.value='60';x.dispatchEvent(new Event('input',{bubbles:true}))");assert.notEqual(await b.evaluate("document.querySelector('#result-years').textContent"),before);}
   if(type==='timeline'){await b.click('[data-event="3"]');assert.match(await b.evaluate("document.querySelector('#timeline-detail').textContent"),/Sendai/);}
   if(type==='checklist'){await b.click('[data-evaluate="0"]');assert.match(await b.evaluate("document.querySelector('#evaluation-status').textContent"),/1 de 7/);}
   await close();
  }
  if(scope==='sources'||scope==='all'){
   await visit('reactor',mode);const index=pageIndexForId('reactor'),records=pageSourceRecords(pages[index]);
   await b.click(mode==='3d'?`.spread-source-action[data-page="${index}"]`:mode==='landing'?'#landing-reactor .source-link':'#html-book [data-page-id="reactor"] .source-link');
   await b.waitFor("document.querySelector('.source-catalog')");assert.equal(await b.evaluate("document.querySelectorAll('.source-document').length"),records.length);
   for(const record of records){const text=await b.evaluate(`document.querySelector('[data-document-source="${record.id}"]').textContent`);for(const location of record.locations)assert.ok(text.includes(location));}
   await close();
  }
 }
 if(scope==='tariffs'||scope==='all'||scope==='reactor'){
  await visit(scope==='reactor'?'reactor':'who-pays','html');await b.click('#read-linear');
  if(scope!=='reactor'){
   const root='.linear-content [data-page-id="who-pays"] [data-explorer=tariffs]';await b.click(`${root} [data-tariff-mode=cost]`);
   await b.evaluate(`const x=document.querySelector('${root} [data-tariff-consumption]');x.value='350';x.dispatchEvent(new Event('input',{bubbles:true}))`);
   assert.deepEqual(await b.evaluate(`[...document.querySelectorAll('${root} .explorer-tariff-values')].map(el=>el.textContent)`),regionalTariffs.map(row=>`R$ ${decimal(row.min*350,2)} – ${decimal(row.max*350,2)}`));
  }
  if(scope==='reactor'||scope==='all')for(let i=0;i<reactorSteps.length;i++){await b.click(`.linear-content [data-explorer=reactor] [data-reactor-step="${i}"]`);assert.equal(await b.evaluate("document.querySelector('.linear-content [data-reactor-description]').textContent"),reactorSteps[i][1]);}
  await close();
 }
 assert.deepEqual(b.errors,[]);assert.deepEqual(b.requests,[]);
 console.log(`PASS: ${scope} interactions use the same page actions in HTML, scrolling and 3D; sources and detailed reading remain available.`);
}finally{await b.close();}
