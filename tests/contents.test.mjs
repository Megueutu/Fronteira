import test from 'node:test';
import assert from 'node:assert/strict';
import {contentsHTML,chapters,pages,pageIndexForId} from '../src/content.js';
test('the printed and drawer contents share entries and omit the colophon',()=>{
 assert.equal(chapters.length,8);
 assert.ok(chapters.every(ch=>ch.id!=='credits'));
 const paper=contentsHTML(),drawer=contentsHTML({drawer:true});
 assert.equal(paper.replace('page-index','dialog-index'),drawer);
 assert.doesNotMatch(paper,/Expediente/);
 assert.equal((paper.match(/data-jump=/g)||[]).length,8);
 assert.equal((paper.match(/index-folio/g)||[]).length,8);
 assert.ok(paper.includes('01–02')&&paper.includes('16–17')&&paper.includes('18')&&!paper.includes('EXTRA'));
 assert.equal(pages[pageIndexForId('credits')].readingLabel,'Expediente');
});
