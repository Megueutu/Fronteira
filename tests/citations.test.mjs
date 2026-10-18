import test from 'node:test';
import assert from 'node:assert/strict';
import { pages, pageHTML, interviewHTML } from '../src/content.js';
import { references, pageEvidence, citationHTML, sourcePanelHTML, pageSourceRecords } from '../src/citations.js';
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
  assert.ok((interview.match(/data-source-id="interview"/g)||[]).length>=adolfoInterview.conversations.length+2);
  assert.ok(adolfoInterview.questions.every(item=>!('status' in item) && (item.sources?.length || item.record)));
  assert.doesNotMatch(interview,/<dd><span>|respostas parciais|complementada|síntese disponível|sem resposta|não foi localizada/i);
  assert.doesNotMatch(interview,/anotações|posição registrada|avaliação registrada|registro consolidado|transcrição|organização documental/i);
  assert.match(interview,/Braid defende ampliar a participação/);
  assert.match(interview,/ainda está em desenvolvimento/);
  assert.match(interview,/Análise do grupo, com base em/);
  assert.match(interview,/data-source-id="aeita"/);
  assert.match(interview,/data-source-id="adolfo-abdan"/);
  assert.ok(!references.find(ref=>ref.id==='santos').url.includes('biografia'));
});
test('source locators are escaped when inserted into markup',()=>{
  assert.ok(citationHTML({kind:'Fonte',sources:[{id:'inb',location:'<texto> & "aspas"'}]}).includes('&lt;texto&gt; &amp; &quot;aspas&quot;'));
});
test('page source catalog includes interactive graphs and keeps specific locators without repetition',()=>{
  const tariffs=pageSourceRecords(pages.find(page=>page.id==='who-pays'));
  for(const id of ['tariff-study','tariff-compilation','aneel-tariffs']) assert.ok(tariffs.some(ref=>ref.id===id));
  const reactor=pageSourceRecords(pages.find(page=>page.id==='reactor'));
  const iaea=reactor.find(ref=>ref.id==='iaea');
  assert.equal(iaea.locations.length,1);
  assert.match(iaea.locations[0],/esquema simplificado/);
  for(const page of pages) {
    const refs=pageSourceRecords(page);
    assert.equal(new Set(refs.map(ref=>ref.id)).size,refs.length);
    assert.ok(refs.every(ref=>ref.locations.length && ref.locations.every(Boolean)));
  }
});
