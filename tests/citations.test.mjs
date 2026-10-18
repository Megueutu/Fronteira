import test from 'node:test';
import assert from 'node:assert/strict';
import { pages, pageHTML, interviewHTML } from '../src/content.js';
import { references, pageEvidence, citationHTML, sourcePanelHTML } from '../src/citations.js';
import { adolfoInterview } from '../src/interview.js';

test('every research paragraph has a source locator or an explicit editorial attribution',()=>{
  for (const page of pages.filter(page=>!['cover','contents','references'].includes(page.kind))) {
    const records=pageEvidence[page.id];
    assert.equal(records?.length,page.body.length,page.id);
    for (const record of records) {
      assert.ok(record.kind);
      if (!record.sources.length) assert.match(record.kind,/grupo|editorial|edição|revisão/);
      for (const source of record.sources) {
        const ref=references.find(ref=>ref.id===source.id);
        assert.ok(ref,source.id);
        assert.ok(source.location || ref.location,source.id);
        assert.equal(new URL(ref.url).protocol,'https:');
      }
    }
    assert.ok((pageHTML(page,pages.indexOf(page)).match(/class="claim-source inline-citation"/g)||[]).length>=page.body.length);
    assert.ok(sourcePanelHTML(page,pages.indexOf(page)).includes('Trecho 1'));
  }
});
test('financial assumptions cite the group tables and interview answers cite the actual record',()=>{
  const finance=pageHTML(pages.find(page=>page.id==='payback'),12);
  assert.match(finance,/Tabela 4.*Tabela 5/);
  assert.match(finance,/Hipóteses do exercício de 2025/);
  const interview=interviewHTML();
  assert.ok((interview.match(/data-source-id="interview"/g)||[]).length>=adolfoInterview.questions.length+7);
  assert.ok(adolfoInterview.questions.every(([,status])=>!/^sem /i.test(status)));
  assert.match(interview,/Análise do grupo, com base em/);
  assert.match(interview,/data-source-id="aeita"/);
  assert.match(interview,/data-source-id="adolfo-abdan"/);
  assert.ok(!references.find(ref=>ref.id==='santos').url.includes('biografia'));
});
test('source locators are escaped when inserted into markup',()=>{
  assert.ok(citationHTML({kind:'Fonte',sources:[{id:'inb',location:'<texto> & "aspas"'}]}).includes('&lt;texto&gt; &amp; &quot;aspas&quot;'));
});
