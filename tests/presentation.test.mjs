import test from 'node:test';
import assert from 'node:assert/strict';
import {pages,contentPages,formatPage,formatPages,pageIndexForId,spreadForPage,interviewHTML,pageHTML} from '../src/content.js';

test('presentation has exactly nineteen numbered content pages with the agreed topic ranges',()=>{
 assert.equal(contentPages.length,18);
 const blocks=[['opening','editorial'],['unequal','matrix','territory'],['reactor','safety'],['wallerstein','sovereignty','uranium'],['payback','who-pays'],['messmer','world','public'],['adolfo','interview-profile','balance']];
 assert.deepEqual(contentPages.map(page=>page.id),blocks.flat());
 assert.deepEqual(contentPages.map(page=>page.folio),Array.from({length:18},(_,index)=>index+1));
 for(const page of pages.filter(page=>!page.contentPage)) assert.equal(page.folio,null,page.id);
 assert.equal(pages.length,28);
 assert.equal(formatPage(contentPages[3]),'04 / 18');
 assert.equal(formatPages(0),'Capa');
 assert.ok(formatPages(spreadForPage(pageIndexForId('unequal'))).includes('03'));
});

test('the two interview pages summarize the conversation and open the complete interview',()=>{
 for(const id of ['adolfo','interview-profile']) {
  const page=pages[pageIndexForId(id)];
  assert.ok(page.folio,id);
  assert.match(pageHTML(page,pages.indexOf(page)),/data-action="interview"/);
 }
 assert.ok(interviewHTML().includes('MARVEL')||interviewHTML().includes('microrreator'));
 assert.equal(pages.filter(page=>page.supplement).length,0);
});
