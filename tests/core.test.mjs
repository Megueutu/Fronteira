import test from 'node:test';
import assert from 'node:assert/strict';
import { pages, getSpread, clampSpread, formatPages } from '../src/content.js';
import { pageGeometry, projection, projectPoint } from '../src/webgl-reader.js';

test('edição mantém páginas e limites válidos ao avançar e voltar', () => {
  assert.equal(clampSpread(-1), 0);
  assert.equal(clampSpread(99), 2);
  assert.deepEqual(getSpread(2).map(p => p.id), ['detail', 'outro']);
  assert.equal(formatPages(2), '05 — 06 / 06');
  assert.equal(new Set(pages.map(p => p.id)).size, pages.length);
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

test('projeção mantém hotspots dentro da revista em desktop e celular', () => {
  for (const [width, height] of [[1200, 600], [340, 540]]) {
    const matrix = projection(width / height);
    for (const x of [-.715, .715]) {
      const p = projectPoint(matrix, x, -.68, .015, width, height);
      assert.ok(p.x > 0 && p.x < width);
      assert.ok(p.y > 0 && p.y < height);
    }
  }
});
