import assert from 'node:assert/strict';
import { launchBrowser } from '../scripts/chromium.mjs';
import { pages, photos, teamMembers } from '../src/content.js';

const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const browser = await launchBrowser({timeout:180000});
const atPage = index => browser.waitFor(`history.state?.reader?.page===${index} && location.search==='' && location.hash===''`);
try {
  await browser.viewport(1440,1000);
  await browser.navigate(base + '/?template=landing&page=13');
  await browser.waitFor("document.querySelectorAll('#landing-view>.magazine-page').length===20");
  await browser.waitFor("document.querySelector('#landing-payback').getBoundingClientRect().top<200");
  await atPage(13);
  assert.equal(await browser.evaluate("document.querySelector('#stage').hidden"),true);
  assert.equal(await browser.evaluate("document.querySelector('#zoom-controls').hidden"),true);
  assert.equal(await browser.evaluate("document.querySelectorAll('#landing-view h1').length"),1);

  assert.equal(await browser.evaluate("document.querySelectorAll('#landing-contents .team-member').length"),6);
  for (const member of teamMembers) {
    const selector = `#landing-contents [data-member="${member.id}"]`;
    await browser.click(selector);
    await browser.waitFor("document.querySelector('.member-photo img')?.naturalWidth===500");
    assert.equal(await browser.evaluate("document.querySelector('#dialog-title').textContent"),member.name);
    assert.equal(await browser.evaluate("document.querySelector('.member-photo img').getAttribute('src')"),member.portrait);
    await browser.key('Escape','Escape',27);
    await browser.waitFor(`!document.querySelector('dialog').open && document.activeElement===document.querySelector('${selector}')`);
  }

  await browser.click('#open-index');
  await browser.waitFor("document.querySelector('#interaction-dialog').open");
  await browser.click('dialog [data-jump="3"]');
  await atPage(4);
  await browser.waitFor("document.activeElement.id==='landing-title-3'");
  await browser.click('#landing-contents [data-jump="14"]');
  await atPage(15);
  await browser.waitFor("document.activeElement.id==='landing-title-14'");
  await browser.evaluate("document.querySelector('#landing-public').scrollIntoView({block:'start'})");
  await atPage(17);

  await browser.click('[data-mode="html"]');
  await browser.waitFor("!document.querySelector('#html-view').hidden");
  assert.equal(await browser.evaluate("document.querySelector('#page-status').textContent"),'17 — 18 / 20');
  await browser.click('[data-mode="3d"]');
  await browser.waitFor("document.querySelector('#loading').hidden && document.querySelectorAll('.hotspot').length===2");
  await browser.click('[data-mode="landing"]');
  await atPage(17);
  await browser.waitFor("document.querySelector('#landing-public').getBoundingClientRect().top<200");
  await browser.click('#go-cover');await atPage(1);

  assert.deepEqual(await browser.evaluate("[...document.querySelectorAll('#landing-view .columns p')].map(p=>p.textContent)"),pages.flatMap(p=>p.body));
  for (const key of ['panel','angra','construction']) {
    const selector = `#landing-cover [data-photo-key="${key}"]`;
    await browser.click(selector);
    await browser.waitFor("document.querySelector('.expanded-photo img')?.naturalWidth>0");
    assert.equal(await browser.evaluate("document.querySelector('.expanded-photo img').getAttribute('src')"),photos[key].src);
    assert.ok((await browser.evaluate("document.querySelector('.expanded-photo figcaption').textContent")).includes(photos[key].credit));
    await browser.key('Escape','Escape',27);
    await browser.waitFor(`!document.querySelector('dialog').open && document.activeElement===document.querySelector('${selector}')`);
  }

  for (const width of [1440,768,390,320]) {
    await browser.viewport(width,1000);
    await browser.waitFor("document.documentElement.scrollWidth<=document.documentElement.clientWidth");
    assert.equal(await browser.evaluate("document.querySelectorAll('#landing-view>.magazine-page').length"),20);
  }
  assert.deepEqual(browser.errors,[]);
  console.log('PASS: landing deep link, 20 sections, index/focus, scroll state, HTML/3D switching and responsive bounds.');
} finally { await browser.close(); }
