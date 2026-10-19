import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
import {pages,photos,pageIndexForId} from '../src/content.js';

const base=process.env.TEST_URL || 'http://127.0.0.1:4317';
const b=await launchBrowser({timeout:240000});
await mkdir('artifacts/layout',{recursive:true});
const report=[];
try {
 await b.viewport(1440,1000);
 await b.navigate(base+`/?template=landing&page=${pageIndexForId('editorial')+1}`);
 await b.waitFor("document.querySelectorAll('#landing-view .flow-photo').length===7");
 assert.equal(await b.evaluate("document.querySelectorAll('#landing-view>.magazine-page').length"),pages.length);
 for(const page of pages) for(const text of page.body) assert.ok(await b.evaluate(`document.querySelector('#landing-${page.id}').textContent.includes(${JSON.stringify(text)})`),page.id);
 assert.match(await b.evaluate("getComputedStyle(document.querySelector('#landing-editorial .columns p')).fontFamily"),/Inter/);
 const layout=await b.evaluate(`Array.from(document.querySelectorAll('#landing-view>.magazine-page:not(.page-cover)')).map(page=>{
  const main=page.querySelector('.page-main'),columns=main.querySelector(':scope > .columns');
  if(!columns || !columns.querySelector('p')) return null;
  const box=columns.getBoundingClientRect();
  const paragraphs=[...columns.querySelectorAll('p')].flatMap(p=>[...p.getClientRects()].map(r=>r.x-box.x));
  return {id:page.id,mainWidth:main.clientWidth,bodyWidth:Math.round(box.width),columns:getComputedStyle(columns).columnCount,height:Math.round(page.getBoundingClientRect().height),left:paragraphs.some(x=>x<box.width*.1),right:paragraphs.some(x=>x>box.width*.45)};
 }).filter(Boolean)`);
 for(const row of layout) {
  if(['landing-contents','landing-references','landing-inside-front'].includes(row.id)) continue;
  assert.equal(row.columns,'2',row.id);
  assert.ok(row.bodyWidth>=row.mainWidth*.98,row.id+' uses full width');
  assert.ok(row.left && row.right,row.id+' has text on both sides');
 }
 report.push({viewport:1440,layout});
 for (const page of pages.slice(1)) {
  const selector='#landing-'+page.id;
  await b.evaluate(`document.querySelector('${selector}').scrollIntoView({block:'start',behavior:'instant'})`);
  await b.evaluate(`Promise.all([...document.querySelectorAll('${selector} img')].map(image=>{image.loading='eager';return image.decode();}))`);
  const clip=await b.evaluate(`(()=>{const r=document.querySelector('${selector}').getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}})()`);
  await writeFile(`artifacts/layout/${page.id}.png`,await b.screenshot({clip,scale:.7}));
 }
 for (const key of ['angra','coast','steam','construction','panel','grid','wind']) {
  const selector=`#landing-view .flow-photo [data-photo-key="${key}"]`;
  await b.click(selector);
  await b.waitFor("document.querySelector('.expanded-photo img')?.naturalWidth>0");
  assert.equal(await b.evaluate("document.querySelector('.expanded-photo img').getAttribute('src')"),photos[key].src);
  assert.ok((await b.evaluate("document.querySelector('.expanded-photo figcaption').textContent")).includes(photos[key].credit));
  await b.key('Escape','Escape',27);
  await b.waitFor(`!document.querySelector('dialog').open && document.activeElement===document.querySelector('${selector}')`);
 }
 for(const width of [1024,768,390,320]) {
  await b.viewport(width,1000,width<760);
  assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),`viewport ${width}`);
  const expected=width>760?'2':'1';
  assert.equal(await b.evaluate("getComputedStyle(document.querySelector('#landing-editorial .columns')).columnCount"),expected);
  assert.ok(await b.evaluate("[...document.querySelectorAll('#landing-view .reading-passage>.claim-source')].every(source=>source.previousElementSibling.matches('p'))"));
  const bounds=await b.evaluate("[...document.querySelectorAll('#landing-view .flow-photo')].map(photo=>({width:photo.clientWidth,scroll:photo.scrollWidth}))");
  assert.ok(bounds.every(p=>p.scroll<=p.width),`photo bounds ${width}`);
  report.push({viewport:width,columns:expected});
  if(width===390) {
   await b.evaluate("document.querySelector('#landing-editorial').scrollIntoView({block:'start',behavior:'instant'})");
   const frame=await b.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   await writeFile('artifacts/layout/editorial-mobile.png',Buffer.from(frame.data,'base64'));
  }
 }
 assert.deepEqual(b.errors,[]);assert.deepEqual(b.requests,[]);
 await writeFile('artifacts/layout/REPORT.json',JSON.stringify(report,null,2));
 console.log('PASS: full-width magazine columns, text on both sides, preserved paragraphs/sources and Inter typography, seven contextual photos, expansion/credits/focus and five viewport widths.');
} finally {await b.close();}
