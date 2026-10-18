import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser} from '../scripts/chromium.mjs';

const scale=[10,11,12,13,14,16,18,20,24,28,32,40,48,56,64,72,80,96];
const base=process.env.TEST_URL || 'http://127.0.0.1:4317';
const browser=await launchBrowser({timeout:240000});
const report=[];
await mkdir('artifacts/typography',{recursive:true});
const inspect=async selector=>{
  const text=await browser.evaluate(`(()=>{const scope=document.querySelector(${JSON.stringify(selector)});return [...scope.querySelectorAll('*')].filter(el=>!el.closest('.cover-artwork')&&el.getClientRects().length&&[...el.childNodes].some(node=>node.nodeType===3&&node.textContent.trim())).map(el=>({tag:el.tagName,class:el.getAttribute('class'),size:parseFloat(getComputedStyle(el).fontSize),family:getComputedStyle(el).fontFamily}))})()`);
  assert.ok(text.length,selector);
  assert.deepEqual(text.filter(item=>!scale.includes(item.size)),[],selector+' uses only the fixed scale');
  assert.ok(new Set(text.map(item=>item.family)).size<=2,selector+' keeps two font families');
  assert.equal(await browser.evaluate('document.documentElement.scrollWidth>innerWidth'),false);
  return [...new Set(text.map(item=>item.size))].sort((a,b)=>a-b);
};
try {
  for(const width of [1440,1024,768,390,320]) {
    await browser.viewport(width,1024,width<760);
    for(const mode of ['landing','html','3d']) {
      await browser.navigate(base+`/?template=${mode}&page=1`);
      await browser.waitFor(`document.body?.dataset.readerMode==='${mode}' && document.readyState==='complete' && document.querySelector('#stage')?.getAttribute('aria-busy')==='false'`);
      if(mode==='3d')await browser.waitFor(`document.querySelector('#loading').hidden`);
      const sizes=await inspect(mode==='landing'?'#landing-view':'.reader');
      if(mode==='landing') {
        const body=await browser.evaluate(`parseFloat(getComputedStyle(document.querySelector('#landing-editorial .reading-passage > p')).fontSize)`);
        assert.equal(body,width<=760?18:20);
        const cover=await browser.evaluate(`(()=>{const art=document.querySelector('#landing-cover .cover-artwork'),a=art.getBoundingClientRect();return [...art.querySelectorAll('.cover-masthead,.cover-title,.cover-deck,.cover-callout strong,.cover-callout > span')].map(el=>{const r=el.getBoundingClientRect();return{step:parseFloat(getComputedStyle(el).fontSize)*760/a.width,left:r.left-a.left,right:r.right-a.left,top:r.top-a.top,bottom:r.bottom-a.top,width:a.width,height:a.height}})})()`);
        for(const item of cover) {
          assert.ok(scale.some(step=>Math.abs(step-item.step)<.02),'cover scales an existing logical step');
          assert.ok(item.left>=-1&&item.right<=item.width+1&&item.top>=0&&item.bottom<=item.height+1,'cover text stays inside the artwork');
        }
        assert.ok(cover[1].bottom<=cover[2].top&&cover[2].bottom<=cover[3].top,'cover headlines do not overlap');
        if(width===1440||width===390) {
          await browser.evaluate(`document.querySelector('#landing-cover').scrollIntoView({block:'start',behavior:'instant'})`);
          await writeFile(`artifacts/typography/cover-${width}.png`,await browser.screenshot({clip:{x:0,y:await browser.evaluate('scrollY'),width,height:1024}}));
        }
      }
      await browser.click('#open-index');await browser.waitFor(`document.querySelector('dialog').open`);
      const dialogSizes=await inspect('dialog');
      await browser.key('Escape','Escape',27);
      report.push({width,mode,sizes,dialogSizes});
    }
  }
  assert.deepEqual(browser.errors,[]);
  await writeFile('artifacts/typography/REPORT.json',JSON.stringify(report,null,2));
  console.log('PASS: fixed type scale, two families, responsive body sizes, proportional cover steps without overlap, dialogs and bounds across three modes and five widths.');
}finally{await browser.close();}
