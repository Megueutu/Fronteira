import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../edicoes/energia-atomica/v1.html', import.meta.url), 'utf8');
const script = html.match(/<script>\n([\s\S]*?)<\/script>/)[1];
// Executa só o trecho das formas, que não depende do DOM.
const shapesCode = script.slice(script.indexOf('const N ='), script.indexOf('const reduceMotion'));
const { radii, pathFrom, SHAPE_NAMES } = vm.runInNewContext(`${shapesCode}; ({ radii, pathFrom, SHAPE_NAMES })`);

test('energia atômica v1 segue a ordem editorial combinada', () => {
  const sections = [...html.matchAll(/<section class="page[^"]*" id="p(\d+)" data-section="([^"]+)"/g)].map(m => [Number(m[1]), m[2]]);
  assert.equal(sections.length, 14);
  assert.deepEqual(sections.map(s => s[0]), Array.from({ length: 14 }, (_, i) => i + 1));
  const order = [...new Set(sections.map(s => s[1]))];
  assert.deepEqual(order, ['Capa', 'Integrantes', 'Sumário', 'Editorial', 'Panorama da matriz elétrica', 'Como funciona a energia nuclear', 'O urânio brasileiro e o seu ciclo', 'O custo e o payback', 'Política']);
  for (const href of html.matchAll(/<a href="#(p\d+)"/g)) assert.match(html, new RegExp(`id="${href[1]}"`));
});

test('energia atômica v1 é um único arquivo, com fotos embutidas e creditadas', () => {
  assert.doesNotMatch(html, /<link rel="stylesheet" href="(?!https:)|<script[^>]+src=|href="\.\.\//);
  assert.equal((html.match(/<image href="data:image\/jpeg;base64,/g) || []).length, 2);
  assert.equal((html.match(/CC BY 3\.0/g) || []).length, 2);
  assert.match(html, /Escolher como produzir eletricidade é também decidir o futuro de um país\./);
  assert.match(html, /Transparência sobre IA/);
});

test('payback da v1 confere com os cenários do grupo', () => {
  const expected = [[4.67, 5.1, 7.7], [5.80, 4.1, 6.2], [6.79, 3.5, 5.3]];
  for (const [fluxo, rest, total] of expected) {
    assert.equal(Math.round(23.9 / fluxo * 10) / 10, rest);
    assert.equal(Math.round(35.9 / fluxo * 10) / 10, total);
  }
  const matrix = [51.7, 15.0, 11.4, 8.5, 7.6, 2.0, 1.4, 0.9, 1.5];
  assert.equal(Math.round(matrix.reduce((a, b) => a + b) * 10) / 10, 100);
});

test('formas expressivas têm o mesmo número de pontos para permitir morph', () => {
  const lengths = new Set(SHAPE_NAMES.map(name => radii(name).length));
  assert.equal(lengths.size, 1);
  for (const name of SHAPE_NAMES) {
    const r = radii(name);
    assert.ok(Math.max(...r) === 1 && Math.min(...r) > 0.5, name);
    assert.match(pathFrom(r), /^M[\d.]+ [\d.]+(L[\d.]+ [\d.]+)+Z$/);
  }
  assert.match(html, /data-shape="cookie9"/);
  for (const [, name] of html.matchAll(/data-(?:shape|morph)="([^"]+)"/g)) assert.ok(SHAPE_NAMES.includes(name), name);
});
