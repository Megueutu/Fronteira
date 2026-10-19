import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pages, pageHTML, photos, interviewPhotos, interviewSections, interviewHTML } from '../src/content.js';
import { adolfoInterview } from '../src/interview.js';
import { evidenceFor } from '../src/citations.js';

// Captured before visual repagination. This fixture is independent of the renderer.
const original = JSON.parse(await readFile(new URL('./fixtures/editorial-original.json',import.meta.url),'utf8'));
const escape = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

test('a redistribuição preserva integralmente e em ordem os parágrafos das vinte faces originais',()=>{
  for (const before of original.pages) {
    const faces = pages.filter(page=>(page.sourceId || page.id) === before.id);
    assert.deepEqual(faces.flatMap(page=>page.body),before.body,before.id);
    const anchor = pages.find(page=>page.id===before.id);
    for (const key of ['title','subtitle','note','quote','kicker']) assert.deepEqual(anchor[key],before[key],`${before.id}.${key}`);
    const balances=faces.filter(face=>face.balance).map(face=>face.balance);
    assert.deepEqual(balances,before.balance?[before.balance]:[],`${before.id}.balance`);
    const refs=new Set(faces.flatMap(face=>face.refs || []));
    assert.ok((before.refs || []).every(ref=>refs.has(ref)),before.id);
    for (const face of faces) for (let i=0;i<face.body.length;i++) {
      const offset=face.sourceParagraphOffset || 0;
      assert.deepEqual(evidenceFor(face.sourceId || face.id,i+offset),evidenceFor(before.id,i+offset));
      assert.ok(pageHTML(face,pages.indexOf(face)).includes(escape(face.body[i])),`${face.id}, parágrafo ${i}`);
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
