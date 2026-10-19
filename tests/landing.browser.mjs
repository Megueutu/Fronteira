import assert from 'node:assert/strict';
import { launchBrowser } from '../scripts/chromium.mjs';
import { pages, teamMembers, pageIndexForId, getOpening, spreadForPage, formatPages } from '../src/content.js';

const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const index=id=>pageIndexForId(id);
const publicOpening=getOpening(spreadForPage(index('public')));
const openingStart=publicOpening.leftIndex ?? publicOpening.rightIndex;
const browser = await launchBrowser({timeout:180000});
const atPage = index => browser.waitFor(`history.state?.reader?.page===${index} && location.search==='' && location.hash===''`);
try {
  await browser.viewport(1440,1000);
  await browser.navigate(base + `/?template=landing&page=${index('payback')+1}`);
  await browser.waitFor(`document.querySelectorAll('#landing-view>.magazine-page').length===${pages.length}`);
  await browser.waitFor("document.querySelector('#landing-payback').getBoundingClientRect().top<200");
  await atPage(index('payback')+1);
  assert.equal(await browser.evaluate("document.querySelector('#stage').hidden"),true);
  assert.equal(await browser.evaluate("document.querySelector('#zoom-controls').hidden"),true);
  assert.equal(await browser.evaluate("document.querySelectorAll('#landing-view h1').length"),1);

  assert.equal(await browser.evaluate("document.querySelectorAll('#landing-team .team-member').length"),6);
  for (const member of teamMembers) {
    const selector = `#landing-team [data-member="${member.id}"]`;
    await browser.click(selector);
    await browser.waitFor("document.querySelector('.member-photo img')?.naturalWidth===500");
    assert.equal(await browser.evaluate("document.querySelector('#dialog-title').textContent"),member.name);
    assert.equal(await browser.evaluate("document.querySelector('.member-photo img').getAttribute('src')"),member.portrait);
    await browser.key('Escape','Escape',27);
    await browser.waitFor(`!document.querySelector('dialog').open && document.activeElement===document.querySelector('${selector}')`);
  }

  await browser.click('#open-index');
  await browser.waitFor("document.querySelector('#interaction-dialog').open");
  await browser.click(`dialog [data-jump="${index('unequal')}"]`);
  await atPage(index('unequal')+1);
  await browser.waitFor(`document.activeElement.id==='landing-title-${index("unequal")}'`);
  await browser.click(`#landing-contents [data-jump="${index('messmer')}"]`);
  await atPage(index('messmer')+1);
  await browser.waitFor(`document.activeElement.id==='landing-title-${index("messmer")}'`);
  await browser.evaluate("document.querySelector('#landing-public').scrollIntoView({block:'start'})");
  await atPage(index('public')+1);

  await browser.click('[data-mode="html"]');
  await browser.waitFor("!document.querySelector('#html-view').hidden");
  assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),formatPages(spreadForPage(index('public'))));
  await browser.click('[data-mode="3d"]');
  await browser.waitFor("document.querySelector('#loading').hidden && document.querySelectorAll('.hotspot').length===2");
  await browser.click('[data-mode="landing"]');
  await atPage(openingStart+1);
  await browser.waitFor(`document.querySelector('#landing-${pages[openingStart].id}').getBoundingClientRect().top<200`);
  await browser.click('#go-cover');await atPage(1);

  for(const page of pages) for(const text of page.body) assert.ok(await browser.evaluate(`document.querySelector('#landing-${page.id}').textContent.includes(${JSON.stringify(text)})`),page.id);
  assert.equal(await browser.evaluate("document.querySelectorAll('#landing-cover .cover-photograph').length"),1);
  assert.equal(await browser.evaluate("document.querySelector('#landing-cover .cover-qr').href"),'https://megueutu.github.io/Fronteira/');
  assert.equal(await browser.evaluate("document.querySelector('#landing-cover .page-bottom')"),null);

  for (const width of [1440,768,390,320]) {
    await browser.viewport(width,1000);
    await browser.waitFor("document.documentElement.scrollWidth<=document.documentElement.clientWidth");
    assert.equal(await browser.evaluate("document.querySelectorAll('#landing-view>.magazine-page').length"),pages.length);
  }
  assert.deepEqual(browser.errors,[]);
  console.log('PASS: landing deep link, physical faces, index/focus, scroll state, HTML/3D switching and responsive bounds.');
} finally { await browser.close(); }
