import test from 'node:test';
import assert from 'node:assert/strict';
import {contentsHTML,chapters,pages,pageIndexForId} from '../src/content.js';
test('the printed and drawer contents share entries and omit the colophon',()=>{
 assert.equal(chapters.length,9);
 assert.ok(chapters.every(ch=>ch.id!=='credits'));
 const paper=contentsHTML(),drawer=contentsHTML({drawer:true});
 assert.equal(paper.replace('page-index','dialog-index'),drawer);
 assert.doesNotMatch(paper,/Expediente/);
 assert.equal((paper.match(/data-jump=/g)||[]).length,9);
 assert.equal((paper.match(/index-folio/g)||[]).length,9);
 assert.ok(paper.includes('01–02')&&paper.includes('17–19')&&paper.includes('EXTRA'));
 assert.equal(pages[pageIndexForId('credits')].readingLabel,'Expediente');
});
