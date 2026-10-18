import assert from 'node:assert/strict';
import {launchBrowser} from '../scripts/chromium.mjs';
import {regionalTariffs,decimal} from '../src/data.js';
const base=process.env.TEST_URL || 'http://localhost:3000';
const browser=await launchBrowser({timeout:180000});
try {
  await browser.viewport(1440,1000);
  await browser.navigate(base+'/?template=landing&page=14');
  await browser.waitFor("document.querySelectorAll('#landing-who-pays .explorer-tariff-row').length===5");
  const root='#landing-who-pays [data-explorer=tariffs]';
  const values=()=>browser.evaluate(`Array.from(document.querySelectorAll('${root} .explorer-tariff-values')).map(node=>node.textContent)`);
  assert.deepEqual(await values(),regionalTariffs.map(row=>`R$ ${decimal(row.min,3)} – ${decimal(row.max,3)}`));
  await browser.click(`${root} button[data-tariff-mode=cost]`);
  assert.deepEqual(await values(),regionalTariffs.map(row=>`R$ ${decimal(row.min*200,2)} – ${decimal(row.max*200,2)}`));
  await browser.evaluate(`const input=document.querySelector('${root} [data-tariff-consumption]');input.value='350';input.dispatchEvent(new Event('input',{bubbles:true}));`);
  assert.deepEqual(await values(),regionalTariffs.map(row=>`R$ ${decimal(row.min*350,2)} – ${decimal(row.max*350,2)}`));
  await browser.click(`${root} button[data-tariff-mode=tariff]`);
  assert.equal(await browser.evaluate(`document.querySelector('${root} .explorer-tariff-consumption').hidden`),true);
  for(const width of [768,390,320]) {
    await browser.viewport(width,1000,width<760);
    assert.ok(await browser.evaluate('document.documentElement.scrollWidth<=innerWidth'));
    assert.ok(await browser.evaluate(`(()=>{const element=document.querySelector('${root}');return element.scrollWidth<=element.clientWidth})()`));
  }
  assert.deepEqual(browser.errors,[]);
  console.log('PASS: unified tariff ranges, consumption calculation, units, source context and responsive bounds.');
} finally {await browser.close();}
