import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pages, pageHTML, photos, interviewPhotos, interviewSections, interviewHTML } from '../src/content.js';
import { adolfoInterview } from '../src/interview.js';
import { evidenceFor } from '../src/citations.js';

// Captured before visual repagination. This fixture is independent of the renderer.
const original = JSON.parse(await readFile(new URL('./fixtures/editorial-original.json',import.meta.url),'utf8'));
const escape = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

test('a redistribuição preserva integralmente e em ordem os parágrafos das faces originais mantidas',()=>{
  // Páginas unidas a pedido do responsável (custo + payback; balanço + conclusão do editorial) declaram `sourceParts`.
  const entries = pages.flatMap(page=>page.sourceParts
    ? (offset=>page.sourceParts.map(part=>{const start=offset;offset+=part.length;return {page,id:part.id,body:page.body.slice(start,start+part.length),start,merged:true};}))(0)
    : [{page,id:page.sourceId || page.id,body:page.body,start:0,merged:false}]);
  for (const before of original.pages) {
    const mine = entries.filter(entry=>entry.id===before.id);
    assert.deepEqual(mine.flatMap(entry=>entry.body),before.body,before.id);
    const anchor = pages.find(page=>page.id===before.id);
    if (!mine.some(entry=>entry.merged)) for (const key of ['title','subtitle','note','quote','kicker']) assert.deepEqual(anchor[key],before[key],`${before.id}.${key}`);
    if (!mine.some(entry=>entry.merged)) {
      const faces = mine.map(entry=>entry.page);
      const balances=faces.filter(face=>face.balance).map(face=>face.balance);
      assert.deepEqual(balances,before.balance?[before.balance]:[],`${before.id}.balance`);
    } else if (before.balance) assert.deepEqual(mine[0].page.balance,before.balance,`${before.id}.balance`);
    const refs=new Set(mine.flatMap(entry=>entry.page.refs || []));
    assert.ok((before.refs || []).every(ref=>refs.has(ref)),before.id);
    for (const entry of mine) {
      const html=pageHTML(entry.page,pages.indexOf(entry.page));
      for (let i=0;i<entry.body.length;i++) {
        const offset=entry.merged ? (entry.page.sourceParts.find(part=>part.id===entry.id).offset || 0) : (entry.page.sourceParagraphOffset || 0);
        if (entry.merged) assert.deepEqual(entry.page.evidence[entry.start+i],evidenceFor(entry.id,i+offset),`${entry.id}, parágrafo ${i}`);
        else assert.deepEqual(evidenceFor(entry.id,i+offset),evidenceFor(before.id,i+offset));
        assert.ok(html.includes(escape(entry.body[i])),`${entry.id}, parágrafo ${i}`);
      }
    }
  }
});

test('o suplemento conserva respostas, análises, localizadores e quatro imagens',()=>{
  assert.deepEqual(adolfoInterview,original.interview);
  const faces=interviewSections;
  assert.equal(faces.length,7);
  const markup=interviewHTML();
  for (const text of [adolfoInterview.fullName,adolfoInterview.role,adolfoInterview.title,adolfoInterview.introduction,...adolfoInterview.career.flatMap(item=>[item.title,item.text]),...adolfoInterview.conversations.flatMap(item=>[item.topic,item.question,item.answer,item.reading,item.record]),...adolfoInterview.questions.flatMap(item=>[item.question,item.answer,...(item.record?[item.record]:[])])]) assert.ok(markup.includes(escape(text)),text);
  for (const source of Object.values(adolfoInterview.sources)) assert.ok(markup.includes(source.url),source.label);
  for (const art of Object.values(interviewPhotos)) {
    assert.equal(markup.split(`src="${art.src}"`).length-1,1,art.title);
    assert.ok(markup.includes(escape(art.caption)),art.caption);
    assert.ok(markup.includes(escape(art.credit)),art.credit);
    assert.ok(markup.includes(art.licenseUrl),art.licenseUrl);
  }
  assert.equal(Object.keys(photos).length,9);
});

test('fotografias de contexto aparecem uma vez na matéria e não nas continuações',()=>{
  for(const [id,key] of Object.entries({safety:'steam',sovereignty:'panel','who-pays':'coast'})) {
    const face=pages.find(page=>page.id===id);
    assert.equal(face.image,photos[key]);
    for(const flow of [false,true]) {
      const markup=pageHTML(face,pages.indexOf(face),{flow});
      assert.equal(markup.split(`src="${photos[key].src}"`).length-1,1,`${id}, flow=${flow}`);
      assert.ok(markup.includes(escape(photos[key].caption)),id);
    }
    assert.equal(pages.find(page=>page.id===id+'-continued')?.image,undefined);
  }
});
