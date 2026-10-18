import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';
import {pages,pageIndexForId,getOpening,spreadForPage} from '../src/content.js';
const scale=[10,11,12,13,14,16,18,20,24,28,32,40,48,56,64,72,80,96];
const base=(process.env.TEST_URL||'http://127.0.0.1:3000').replace(/\/$/,'');
const browser=await launchBrowser({timeout:300000});
const report=[];
await mkdir('artifacts/typography',{recursive:true});
async function inspect(selector){
  const text=await browser.evaluate(`(()=>{const scope=document.querySelector(${JSON.stringify(selector)});return [...scope.querySelectorAll('*')].filter(el=>!el.closest('.cover-artwork')&&el.getClientRects().length&&[...el.childNodes].some(node=>node.nodeType===3&&node.textContent.trim())).map(el=>({tag:el.tagName,class:el.getAttribute('class'),size:parseFloat(getComputedStyle(el).fontSize),family:getComputedStyle(el).fontFamily}))})()`);
  assert.ok(text.length,selector);assert.deepEqual(text.filter(item=>!scale.includes(item.size)),[],selector+' uses fixed type scale');
  assert.ok(text.every(item=>/^['"]?Inter(?:Variable| Variable)?['"]?(?:,|$)/.test(item.family)),selector+' uses Inter for all text');
  assert.equal(await browser.evaluate('document.documentElement.scrollWidth>innerWidth'),false);
  return [...new Set(text.map(item=>item.size))].sort((a,b)=>a-b);
}
try{
  for(const width of [1440,1024,768,390,320]){
    await browser.viewport(width,1024,width<760);
    for(const mode of ['landing','html','3d']){
      await browser.navigate(base+`/?template=${mode}&page=${pageIndexForId('cover')+1}`);
      await browser.waitFor(`document.body?.dataset.readerMode==='${mode}' && document.readyState==='complete' && document.querySelector('#stage')?.getAttribute('aria-busy')==='false'`);
      if(mode==='3d')await browser.waitFor("document.querySelector('#loading').hidden");
      await browser.evaluate('document.fonts.ready');
      assert.equal(await browser.evaluate('location.search+location.hash'),'');
      const sizes=await inspect(mode==='landing'?'#landing-view':'.reader');
      assert.ok(await browser.evaluate("document.fonts.check('400 20px InterVariable')"),'local Inter is ready');
      if(mode==='landing'||mode==='html'){
        const scope=mode==='landing'?'#landing-cover':'#html-book .edition-cover';
        const cover=await browser.evaluate(`(()=>{const p=document.querySelector('${scope}'),art=p.querySelector('.cover-artwork'),a=art.getBoundingClientRect(),image=p.querySelector('.cover-photograph'),r=image.getBoundingClientRect();return{folios:p.querySelectorAll('.page-top,.page-bottom,.page-tail').length,photos:p.querySelectorAll('.cover-photograph').length,photoWidth:r.width,photoHeight:r.height,width:a.width,height:a.height,text:[...art.querySelectorAll('.cover-eyebrow,.cover-title,.cover-deck,.cover-callout strong,.cover-callout > span,.cover-qr span')].map(el=>{const r=el.getBoundingClientRect();return{step:parseFloat(getComputedStyle(el).fontSize)*760/art.clientWidth,left:r.left-a.left,right:r.right-a.left,top:r.top-a.top,bottom:r.bottom-a.top,family:getComputedStyle(el).fontFamily}})}})()`);
        assert.equal(cover.folios,0);assert.equal(cover.photos,1);
        assert.ok(Math.abs(cover.photoWidth-cover.width)<1&&Math.abs(cover.photoHeight-cover.height)<1,'photo reaches all cover edges');
        for(const item of cover.text){
          assert.ok(scale.some(step=>Math.abs(step-item.step)<.05),'cover scales a canonical type step');
          assert.ok(item.left>=-1&&item.right<=cover.width+1&&item.top>=0&&item.bottom<=cover.height+1,'cover text remains inside artwork');
          assert.match(item.family,/Inter/);
        }
        const [eyebrow,title,deck,callout]=cover.text;
        assert.ok(eyebrow.bottom<=title.top&&title.bottom<=deck.top&&deck.bottom<=callout.top,'cover text does not overlap');
        if(mode==='landing'){
          const editorial=`#landing-${pages[pageIndexForId('editorial')].id}`;
          const body=await browser.evaluate(`parseFloat(getComputedStyle(document.querySelector('${editorial} .columns p')).fontSize)`);
          assert.equal(body,16);
        }else{
          const count=await browser.evaluate("document.querySelectorAll('#html-book>article').length");assert.equal(count,1);
        }
        if(mode==='landing'&&(width===1440||width===390)){
          await browser.evaluate("document.querySelector('#landing-cover').scrollIntoView({block:'start',behavior:'instant'})");
          await writeFile(`artifacts/typography/cover-${width}.png`,await browser.screenshot({clip:{x:0,y:await browser.evaluate('scrollY'),width,height:1024}}));
        }
      }
      await browser.click('#open-index');await browser.waitFor("document.querySelector('dialog').open");
      const dialogSizes=await inspect('dialog');await browser.key('Escape','Escape',27);
      report.push({width,mode,sizes,dialogSizes});
    }
    await browser.navigate(base+`/?template=html&page=${pageIndexForId('editorial')+1}`);
    const opening=getOpening(spreadForPage(pageIndexForId('editorial')));
    await browser.waitFor(`!!document.querySelector('#html-book>[data-page-index="${width<=760?pageIndexForId('editorial'):opening.leftIndex}"]')`);
    const columns=await browser.evaluate("[...document.querySelectorAll('#html-book .columns')].filter(el=>el.querySelector('p')).map(el=>({count:getComputedStyle(el).columnCount,fill:getComputedStyle(el).columnFill,align:getComputedStyle(el.querySelector('p')).textAlign}))");
    assert.ok(columns.length);
    for(const item of columns){assert.equal(item.count,'2');assert.equal(item.fill,'balance');assert.equal(item.align,'justify');}
  }
  assert.deepEqual(browser.errors,[]);
  await writeFile('artifacts/typography/REPORT.json',JSON.stringify(report,null,2));
  console.log('PASS: one local Inter family, fixed scale, responsive article columns, isolated full-bleed photographic cover, dialogs, three modes and five widths.');
}finally{await browser.close();}
