import { mkdir,writeFile,readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pages } from '../src/content.js';
import { launchBrowser } from './chromium.mjs';

const base = process.env.TEST_URL || 'http://localhost:3000';
const selected = process.argv.slice(2).map(value=>Number(value)-1);
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
    const layout = await browser.evaluate(`(() => {const page=document.querySelector('.magazine-page'),main=page.querySelector('.page-main'),tail=page.querySelector('.page-tail');return {index:${index},contentBottom:Math.max(...[...main.children].map(el=>el.getBoundingClientRect().bottom)),tailTop:tail.getBoundingClientRect().top,pageBottom:page.getBoundingClientRect().bottom,tailBottom:tail.getBoundingClientRect().bottom,missingImages:[...document.images].filter(i=>!i.naturalWidth).length,horizontal:page.scrollWidth>page.clientWidth,columns:getComputedStyle(page.querySelector('.columns')).columnCount,justify:getComputedStyle(page.querySelector('.columns p')).textAlign}})()`);
    const clip = {x:0,y:0,width:760,height:1064};
    const name = `page-${String(index + 1).padStart(2,'0')}`;
    await writeFile(new URL(`../assets/textures/${name}.jpg`,import.meta.url),await browser.screenshot({format:'jpeg',quality:88,scale:1.5,clip}));
    await writeFile(new URL(`../artifacts/pages/${name}.png`,import.meta.url),await browser.screenshot({clip}));
    results.push(layout);
    console.log(`${name}: ${layout.contentBottom <= layout.tailTop - 10 && layout.tailBottom <= 1064 && !layout.horizontal && !layout.missingImages ? 'OK' : 'REVIEW'} (content ${Math.round(layout.contentBottom)} / footer ${Math.round(layout.tailTop)})`);
  }
  const source = await Promise.all(['src/content.js','src/data.js','src/styles.css'].map(async name=>(await readFile(new URL(`../${name}`,import.meta.url),'utf8')).replaceAll('\r\n','\n')));
  await writeFile(new URL('../assets/textures/MANIFEST.json',import.meta.url),JSON.stringify({pages:pages.length,width:1140,height:1596,sha256:createHash('sha256').update(source.join('')).digest('hex')},null,2)+'\n');
  const prior = selected.length ? JSON.parse(await readFile(new URL('../artifacts/page-layout.json',import.meta.url),'utf8').catch(()=>'[]')).filter(row=>!selected.includes(row.index)) : [];
  await writeFile(new URL('../artifacts/page-layout.json',import.meta.url),JSON.stringify([...prior,...results].sort((a,b)=>a.index-b.index),null,2));
  if (results.some(r=>r.contentBottom>r.tailTop-10 || r.tailBottom>1064 || r.horizontal || r.missingImages) || browser.errors.length) process.exitCode=1;
} finally { await browser.close(); }
