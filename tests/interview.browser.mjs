import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from '../scripts/chromium.mjs';
import { pages, interviewPhotos } from '../src/content.js';

const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const browser = await launchBrowser({timeout:240000});
await mkdir(new URL('../artifacts/interview/',import.meta.url),{recursive:true});
const capture = async name => writeFile(new URL(`../artifacts/interview/${name}.png`,import.meta.url),await browser.screenshot({clip:{x:0,y:await browser.evaluate('scrollY'),width:await browser.evaluate('innerWidth'),height:1000}}));
const close = async () => {
  await browser.key('Escape','Escape',27);
  await browser.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
};
const navigate = async url => {
  const previous = await browser.evaluate('performance.timeOrigin');
  await browser.navigate(url);
  await browser.waitFor(`performance.timeOrigin!==${previous} && document.readyState==="complete" && !!document.body.dataset.readerMode`);
  await browser.evaluate(`(() => {
    window.interviewTrace=[];const dialog=document.querySelector('dialog');
    const record=event=>window.interviewTrace.push({event,open:dialog.open,title:document.querySelector('#dialog-title')?.textContent,active:document.activeElement.id||document.activeElement.dataset.photoKey||document.activeElement.tagName});
    dialog.addEventListener('cancel',()=>record('cancel-before'),true);
    dialog.addEventListener('cancel',()=>record('cancel-after'));
    dialog.addEventListener('close',()=>record('close'));
    document.addEventListener('click',event=>record('click-'+(event.target.closest('[data-action]')?.dataset.action||event.target.id)));
  })()`);
};
const visitInlineImages = async () => {
  for (const key of Object.keys(interviewPhotos)) {
    await browser.evaluate(`document.querySelector('#interview-adolfo [data-photo-key="${key}"]').scrollIntoView({block:'center'})`);
    await browser.waitFor(`document.querySelector('#interview-adolfo [data-photo-key="${key}"] img').naturalWidth>0`);
  }
  await browser.evaluate('document.querySelector("#interview-adolfo").scrollIntoView({block:"start"})');
};
try {
  await browser.viewport(1440,1000);
  await navigate(base+'/?template=landing&page=17&interview=adolfo');
  await browser.waitFor('document.querySelector("dialog.interview-dialog")?.open');
  await browser.waitFor('[...document.querySelectorAll("dialog .interview-photo img")].every(img=>img.naturalWidth>0)');
  assert.equal(await browser.evaluate('document.querySelectorAll("#landing-view>.magazine-page").length'),20);
  assert.equal(await browser.evaluate('document.querySelectorAll("#landing-view>#interview-adolfo").length'),1);
  assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("#landing-view .columns p")].map(el=>el.textContent)'),pages.flatMap(page=>page.body));
  assert.ok((await browser.evaluate('document.querySelector("dialog .interview-method").textContent')).includes('sem reprodução de falas literais'));
  await capture('dialog-desktop');
  await close();
  await browser.waitFor('!document.querySelector("dialog").open');

  // O suplemento não pode deslocar os destinos das páginas posteriores.
  await browser.click('#next');
  await browser.waitFor('new URL(location.href).searchParams.get("page")==="18" && document.activeElement.id==="landing-title-17"');
  await browser.click('#previous');
  await browser.waitFor('new URL(location.href).searchParams.get("page")==="17"');
  await browser.evaluate('document.querySelector("#interview-adolfo").scrollIntoView({block:"start"})');
  await visitInlineImages();
  await capture('inline-desktop');
  await browser.click('#interview-adolfo .interview-questions summary');
  assert.equal(await browser.evaluate('document.querySelector("#interview-adolfo .interview-questions").open'),true);
  assert.equal(await browser.evaluate('document.querySelectorAll("#interview-adolfo .interview-questions dl > div").length'),10);
  assert.ok(await browser.evaluate('[...document.querySelectorAll("#interview-adolfo .interview-questions dd > span")].every(e=>!/^sem /i.test(e.textContent))'));
  assert.ok(!(await browser.evaluate('document.querySelector("#interview-adolfo .interview-questions").textContent')).includes('momento mais marcante'));
  await browser.click('#interview-adolfo .interview-questions summary');

  for (const mode of ['landing','html','3d']) {
    console.log('Checking interview in',mode);
    await navigate(base+`/?template=${mode}&page=17`);
    await browser.waitFor(`document.body.dataset.readerMode==="${mode}" && document.querySelector("#stage")?.getAttribute("aria-busy")==="false"`);
    if(mode==='3d') {
      await browser.waitFor('document.querySelector("#loading").hidden && document.querySelectorAll(".hotspot").length===2');
      await browser.click('.hotspot[data-action="interview"]');
      await browser.waitFor('document.querySelector("dialog.interview-dialog")?.open');
      await close();
    }
    await browser.click('#open-index');
    await browser.click('dialog .interview-entry');
    await browser.waitFor('document.querySelector("dialog.interview-dialog")?.open');
    await browser.waitFor('[...document.querySelectorAll("dialog .interview-photo img")].every(img=>img.naturalWidth>0)');
    await browser.click('dialog .interview-questions summary');
    for (const key of Object.keys(interviewPhotos)) {
      await browser.click(`dialog [data-photo-key="${key}"]`);
      await browser.waitFor('document.querySelector(".expanded-photo img")?.naturalWidth>0');
      assert.equal(await browser.evaluate('document.querySelector(".expanded-photo img").getAttribute("src")'),interviewPhotos[key].src);
      assert.ok((await browser.evaluate('document.querySelector(".expanded-photo figcaption").textContent')).includes(interviewPhotos[key].credit));
      await close();
      assert.equal(await browser.evaluate(`document.activeElement===document.querySelector('dialog [data-photo-key="${key}"]')`),true);
      assert.equal(await browser.evaluate('document.querySelector("dialog .interview-questions").open'),true);
    }
    await close();
    await browser.waitFor('document.activeElement===document.querySelector("dialog .interview-entry")');
    await close();
    await browser.waitFor('!document.querySelector("dialog").open && document.activeElement.id==="open-index"');
  }

  for(const width of [1440,768,390,320]) {
    await browser.viewport(width,1000);
    await navigate(base+'/?template=landing&page=17');
    await browser.waitFor('document.querySelector("#interview-adolfo")');
    await browser.evaluate('document.querySelector("#interview-adolfo").scrollIntoView({block:"start"})');
    await visitInlineImages();
    assert.equal(await browser.evaluate('document.documentElement.scrollWidth>innerWidth'),false);
    const ratios = await browser.evaluate('[...document.querySelectorAll("#interview-adolfo img")].map(img=>({actual:img.getBoundingClientRect().width/img.getBoundingClientRect().height,natural:img.naturalWidth/img.naturalHeight}))');
    assert.ok(ratios.every(r=>Math.abs(r.actual-r.natural)<.005));
    await capture(`inline-${width}`);
    await browser.click('#open-index');
    await browser.click('dialog .interview-entry');
    assert.equal(await browser.evaluate('document.querySelector("dialog").scrollWidth>document.querySelector("dialog").clientWidth'),false);
    await capture(`dialog-${width}`);
  }
  assert.deepEqual(browser.errors,[]);
  console.log('PASS: interview deep link, preserved 20 pages, navigation after supplement, HTML/3D/landing entry, both images, credits, nested Escape/focus and four responsive widths.');
} catch(error) {
  console.log('FAILED:',error.message);
  console.log(await browser.evaluate('JSON.stringify({url:location.href,open:document.querySelector("dialog")?.open,title:document.querySelector("#dialog-title")?.textContent,active:document.activeElement?.outerHTML.slice(0,500),photos:document.querySelectorAll("dialog [data-photo-key]").length,trace:window.interviewTrace})'));
  await capture('failure');
  throw error;
} finally { await browser.close(); }
