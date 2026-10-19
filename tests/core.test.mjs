import test from 'node:test';
import assert from 'node:assert/strict';
import { pages, getSpread, getOpening, spreadForPage, spreadCount, clampSpread, formatPages } from '../src/content.js';
import { pageGeometry, projection, projectPoint } from '../src/webgl-reader.js';
import { matrixData, calculateScenario, scenarios, timeline } from '../src/data.js';
import { chapters, references, pageHTML, teamMembers } from '../src/content.js';
import { access, readFile } from 'node:fs/promises';
import { textureFingerprint } from '../scripts/texture-fingerprint.mjs';

test('edição mantém páginas e limites válidos ao avançar e voltar', () => {
  assert.equal(clampSpread(-1), 0);
  assert.equal(pages.length % 4, 0);
  assert.equal(clampSpread(99), spreadCount - 1);
  assert.deepEqual(getSpread(0).map(p => p.id), ['cover']);
  assert.equal(formatPages(0), 'Capa');
  assert.equal(getOpening(0).left, null);
  assert.equal(getOpening(spreadCount - 1).right, null);
  const sequence = Array.from({length:spreadCount},(_,i)=>getSpread(i)).flat();
  assert.deepEqual(sequence.map(page=>page.id),pages.map(page=>page.id));
  for (let i=0;i<pages.length;i++) assert.ok(getSpread(spreadForPage(i)).includes(pages[i]));
  assert.equal(new Set(pages.map(p => p.id)).size, pages.length);
});

test('edição tem fontes, ações e destinos válidos, sem omitir os cinco temas', async () => {
  const ids = new Set(references.map(ref => ref.id));
  for (const [index,page] of pages.entries()) {
    assert.ok(page.action === null || (page.action.type && page.action.label));
    assert.ok(Array.isArray(page.body));
    assert.ok((page.refs || []).every(ref => ids.has(ref)), page.id);
    assert.match(pageHTML(page,index), /class="magazine-page/);
    if (page.image) await access(new URL(`..${page.image.src}`,import.meta.url));
  }
  assert.ok(chapters.every(ch => ch.page >= 0 && ch.page < pages.length));
  assert.equal(teamMembers.length,6);
  assert.equal(new Set(teamMembers.map(member => member.id)).size,6);
  for (const member of teamMembers) await access(new URL(`..${member.portrait}`,import.meta.url));
  assert.equal(timeline.length,6);
  for (const id of ['unequal','matrix','territory','reactor','safety','uranium','wallerstein','sovereignty','payback','messmer','world','public','balance','credits']) assert.ok(pages.some(page=>page.id===id));
});

test('matriz mantém total e denominador ao comparar fontes', () => {
  assert.ok(Math.abs(matrixData.reduce((sum,row)=>sum+row.value,0)-100)<1e-9);
  assert.equal(matrixData.find(row=>row.name==='Nuclear').value,2);
  assert.equal(matrixData.find(row=>row.name==='Outras').value,1.5);
  assert.ok(matrixData.find(row=>row.name==='Nuclear').value > matrixData.find(row=>row.name==='Outras').value);
});

test('payback respeita unidades, sensibilidade e hipóteses inválidas', () => {
  const base=calculateScenario(scenarios[1]);
  assert.ok(Math.abs(base.generation-10461630)<1);
  assert.ok(Math.abs(base.cash-5.7985)<.001);
  assert.ok(base.years>4.1 && base.years<4.2);
  assert.ok(calculateScenario({...scenarios[1],investment:35.9}).years>base.years);
  assert.ok(calculateScenario({...scenarios[1],capacity:60}).years>base.years);
  assert.throws(()=>calculateScenario({operating:100}),RangeError);
  assert.throws(()=>calculateScenario({capacity:101}),RangeError);
  assert.throws(()=>calculateScenario({tariff:NaN}),RangeError);
});

test('as texturas correspondem ao conteúdo e à composição versionados', async () => {
  const manifest = JSON.parse(await readFile(new URL('../assets/textures/MANIFEST.json',import.meta.url),'utf8'));
  assert.equal(manifest.pages,pages.length);
  assert.equal(manifest.sha256,await textureFingerprint(),'regenere as texturas após alterar conteúdo ou diagramação');
  for (let i=1;i<=pages.length;i++) await access(new URL(`../assets/textures/page-${String(i).padStart(2,'0')}.jpg`,import.meta.url));
});

test('folha curva no meio da virada e termina do outro lado sem espelhar o verso', () => {
  for (const side of [-1, 1]) {
    const start = pageGeometry(side, 0);
    const middle = pageGeometry(side, .5);
    const end = pageGeometry(side, 1);
    const last = start.length - 8;
    assert.ok(Math.abs(start[last] - side * 1.43) < .001);
    assert.ok(Math.abs(end[last] + side * 1.43) < .001);
    assert.ok(middle[last + 2] > 1.3, 'a folha sai do plano e tem profundidade real');
    assert.notEqual(start[last + 3], end[last + 3], 'o verso inverte a coordenada para manter a leitura correta');
    assert.ok([...middle].every(Number.isFinite));
  }
});

test('enquadramento mantém a abertura e a folha curva inteiras durante a virada', () => {
  for (const [width, height] of [[1200, 600], [340, 260], [280, 210]]) {
    for (let sample=0; sample<=20; sample++) {
      const progress=sample/20;
      const matrix=projection(width/height,1.43*1.25*Math.sin(progress*Math.PI));
      for (const side of [-1,1]) {
        for (const state of [0,progress]) {
          const vertices=pageGeometry(side,state);
          for(let i=0;i<vertices.length;i+=8) {
            const p=projectPoint(matrix,vertices[i],vertices[i+1],vertices[i+2],width,height);
            assert.ok(p.x>=0 && p.x<=width && p.y>=0 && p.y<=height,JSON.stringify({width,height,progress,p}));
          }
        }
      }
    }
  }
});
