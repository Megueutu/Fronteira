import { mkdir,writeFile,readFile } from 'node:fs/promises';
import { textureFingerprint, textureSources } from './texture-fingerprint.mjs';
import { pages } from '../src/content.js';
import { launchBrowser } from './chromium.mjs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const base = process.env.TEST_URL || 'http://localhost:3000';
const selected = process.argv.slice(2).map(value=>Number(value)-1);
// Layout coordinates are fractional; allow a quarter pixel of rounding at the 10px safety gap.
const fits = row => row.contentBottom <= row.tailTop - 10 + .25 && row.tailBottom <= 1064 && !row.horizontal && !row.vertical && !row.missingImages;
// Evita reabrir artefatos idênticos durante a sincronização do OneDrive.
async function writeGenerated(file, data) {
  const previous = await readFile(file).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
  if (previous?.equals(Buffer.isBuffer(data) ? data : Buffer.from(data))) return;
  for (let attempt=0; ; attempt++) {
    try { await writeFile(file, data); return; }
    catch (error) {
      if (attempt>=5 || !['EBUSY','EPERM','EACCES','UNKNOWN'].includes(error.code)) throw error;
      await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));
    }
  }
}
await mkdir(new URL('../assets/textures/',import.meta.url),{recursive:true});
await mkdir(new URL('../artifacts/pages/',import.meta.url),{recursive:true});
const browser = await launchBrowser({timeout:300000});
const results = [];
try {
  await browser.viewport(1000,1400);
  for (let index = 0; index < pages.length; index++) {
    if (selected.length && !selected.includes(index)) continue;
    await browser.navigate(`${base}/?render=${index}`);
    await browser.waitFor(`document.body?.dataset.ready === 'true' && document.querySelector('[data-page-index="${index}"]')`);
    const layout = await browser.evaluate(`(() => {const page=document.querySelector('.magazine-page'),main=page.querySelector('.page-main'),tail=page.querySelector('.page-tail'),box=page.getBoundingClientRect(),columns=page.querySelector('.columns'),paragraph=columns?.querySelector('p');return {index:${index},id:page.dataset.pageId||'',contentBottom:Math.max(...[...main.children].map(el=>el.getBoundingClientRect().bottom)),tailTop:tail?.getBoundingClientRect().top??box.bottom+10,pageBottom:box.bottom,tailBottom:tail?.getBoundingClientRect().bottom??box.bottom,missingImages:[...document.images].filter(i=>!i.naturalWidth).length,horizontal:page.scrollWidth>page.clientWidth,vertical:page.scrollHeight>page.clientHeight+1,columns:columns?getComputedStyle(columns).columnCount:null,justify:paragraph?getComputedStyle(paragraph).textAlign:null}})()`);
    const clip = {x:0,y:0,width:760,height:1064};
    const name = `page-${String(index + 1).padStart(2,'0')}`;
    await writeGenerated(new URL(`../assets/textures/${name}.jpg`,import.meta.url),await browser.screenshot({format:'jpeg',quality:88,scale:1.5,clip}));
    await writeGenerated(new URL(`../artifacts/pages/${name}.png`,import.meta.url),await browser.screenshot({clip}));
    results.push(layout);
    console.log(`${name}: ${fits(layout) ? 'OK' : 'REVIEW'} (content ${Math.round(layout.contentBottom)} / footer ${Math.round(layout.tailTop)})`);
  }
  await writeFile(new URL('../assets/textures/MANIFEST.json',import.meta.url),JSON.stringify({pages:pages.length,width:1140,height:1596,sources:textureSources,sha256:await textureFingerprint()},null,2)+'\n');
  const prior = selected.length ? JSON.parse(await readFile(new URL('../artifacts/page-layout.json',import.meta.url),'utf8').catch(()=>'[]')).filter(row=>!selected.includes(row.index)) : [];
  await writeFile(new URL('../artifacts/page-layout.json',import.meta.url),JSON.stringify([...prior,...results].sort((a,b)=>a.index-b.index),null,2));
  if (results.some(row=>!fits(row)) || browser.errors.length) process.exitCode=1;
} finally { await browser.close(); }
// O PDF para download acompanha as texturas; sem Python disponível, o passo é ignorado com um aviso.
try { console.log(execFileSync('python',[fileURLToPath(new URL('./build-pdf.py',import.meta.url))],{encoding:'utf8'}).trim()); } catch (error) { console.warn('PDF não regenerado:',String(error.message).split('\n')[0]); }
