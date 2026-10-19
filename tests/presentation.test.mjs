import test from 'node:test';
import assert from 'node:assert/strict';
import {pages,contentPages,formatPage,formatPages,pageIndexForId,spreadForPage,interviewHTML,pageHTML} from '../src/content.js';

test('presentation has exactly twenty numbered content pages with the agreed topic ranges',()=>{
 assert.equal(contentPages.length,20);
 const blocks=[['opening','editorial'],['unequal','matrix','territory'],['reactor','safety'],['uranium','wallerstein','sovereignty'],['cost','payback','who-pays'],['messmer','world','public'],['balance','references','editorial-conclusion','adolfo']];
 assert.deepEqual(contentPages.map(page=>page.id),blocks.flat());
 assert.deepEqual(contentPages.map(page=>page.folio),Array.from({length:20},(_,index)=>index+1));
 for(const page of pages.filter(page=>!page.contentPage)) assert.equal(page.folio,null,page.id);
 assert.equal(pages.length,28);
 assert.equal(formatPage(contentPages[3]),'04 / 20');
 assert.equal(formatPages(0),'Capa');
 assert.ok(formatPages(spreadForPage(pageIndexForId('unequal'))).includes('03'));
});

test('the unnumbered supplement opens the complete interview without adding content folios',()=>{
 const supplement=pages.find(page=>page.supplement);
 assert.equal(supplement.readingLabel,'Suplemento');
 assert.match(pageHTML(supplement,pages.indexOf(supplement)),/data-action="interview"/);
 assert.ok(interviewHTML().includes('MARVEL')||interviewHTML().includes('microrreator'));
 assert.doesNotMatch(pageHTML(supplement,pages.indexOf(supplement)),/>null<\/span>/);
});
