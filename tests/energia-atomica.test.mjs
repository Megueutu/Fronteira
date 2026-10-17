import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../edicoes/energia-atomica.html', import.meta.url), 'utf8');
const script = html.match(/<script>\r?\n([\s\S]*?)<\/script>/)[1];
// Executa só o trecho das formas, que não depende do DOM.
const shapesCode = script.slice(script.indexOf('const N ='), script.indexOf('const reduceMotion'));
const { radii, pathFrom, SHAPE_NAMES } = vm.runInNewContext(`${shapesCode}; ({ radii, pathFrom, SHAPE_NAMES })`);

test('energia atômica segue a ordem editorial combinada', () => {
  const sections = [...html.matchAll(/<section class="page[^"]*" id="p(\d+)" data-section="([^"]+)"/g)].map(m => [Number(m[1]), m[2]]);
  assert.equal(sections.length, 16);
  assert.deepEqual(sections.map(s => s[0]), Array.from({ length: 16 }, (_, i) => i + 1));
  const order = [...new Set(sections.map(s => s[1]))];
  assert.deepEqual(order, ['Capa', 'Integrantes', 'Sumário', 'Editorial', 'Panorama da matriz elétrica', 'Como funciona a energia nuclear', 'O urânio brasileiro e o seu ciclo', 'O custo e o payback', 'Política']);
  for (const href of html.matchAll(/<a href="#(p\d+)"/g)) assert.match(html, new RegExp(`id="${href[1]}"`));
});

test('energia atômica é um único arquivo, com fotos embutidas uma vez e creditadas', () => {
  assert.doesNotMatch(html, /<link rel="stylesheet" href="(?!https:)|<script[^>]+src=|href="\.\.\/|src="(?!data:)[^"]+\.(jpe?g|png|webp)"/);
  const photos = JSON.parse(html.match(/<script type="application\/json" id="photo-data">([\s\S]*?)<\/script>/)[1].replaceAll('<\\/', '</'));
  const used = new Set([...html.matchAll(/data-photo="([\w-]+)"/g)].map(m => m[1]));
  for (const key of used) {
    assert.ok(photos[key]?.src.startsWith('data:image/jpeg;base64,'), key);
    assert.ok(photos[key].credit && photos[key].license && photos[key].url, `crédito de ${key}`);
    assert.ok(html.includes(photos[key].credit), `crédito visível de ${key}`);
  }
  assert.deepEqual([...used].sort(), Object.keys(photos).sort());
  assert.equal((html.match(/data:image\/jpeg;base64,/g) || []).length, Object.keys(photos).length);
  assert.match(html, /Escolher como produzir eletricidade é também decidir o futuro de um país\./);
  assert.match(html, /Transparência sobre IA/);
});

test('energia atômica tem página dupla com a foto de Angra nas páginas 8 e 9', () => {
  assert.match(html, /id="p8"[^>]*|class="page spread-page spread-left" id="p8"/);
  assert.match(html, /class="page spread-page spread-left" id="p8"/);
  assert.match(html, /class="page spread-page spread-right" id="p9"/);
  assert.equal((html.match(/<div class="spread-photo" aria-hidden="true"><img data-photo="angra"/g) || []).length, 2);
});

test('energia atômica não marca a reportagem nem usa rodapé corrido', () => {
  assert.doesNotMatch(html, /class="kicker|class="folio|Reportagem \d/);
});

test('energia atômica tem fundo orgânico interativo atrás das páginas', () => {
  assert.match(html, /<canvas class="organic-bg" id="organic-bg" aria-hidden="true"><\/canvas>/);
  assert.match(script, /function organicBackground\(\)/);
  assert.match(script, /prefers-reduced-motion/);
  for (const event of ['pointermove', 'pointerdown', 'visibilitychange']) assert.match(script, new RegExp(event));
});

test('energia atômica amplia fotos e gráficos em um diálogo', () => {
  assert.match(html, /<dialog class="viewer" id="viewer"/);
  assert.match(script, /function expandables\(\)/);
  for (const sel of ['.shaped-photo', '.chart-card', '.table-card', '.stepper-card', '.cycle-card']) assert.ok(script.includes(sel), sel);
  assert.match(script, /^expandables\(\);$/m);
});

test('energia atômica marca números de dados e liga os de gráfico a uma ênfase existente', () => {
  const nums = [...html.matchAll(/<button type="button" class="dnum"([^>]*)>([^<]+)<\/button>/g)];
  assert.ok(nums.length >= 60, `só ${nums.length} números marcados`);
  for (const [, attrs, value] of nums) {
    assert.match(attrs, /data-info="[^"]+"/, value);
    assert.match(attrs, /data-src="[^"]+"/, value);
    const chart = attrs.match(/data-chart="([^"]+)"/)?.[1];
    if (!chart) continue;
    const key = attrs.match(/data-emph="([^"]*)"/)?.[1];
    assert.ok(html.includes(`id="${chart}"`), `gráfico ${chart} de ${value}`);
    // A chave precisa existir no HTML ou nas marcações geradas pelo script (matriz e payback).
    const inHtml = html.includes(`data-key="${key}"`) || html.includes(`data-key="${key} `);
    const generated = (chart === 'matrix-chart' && /data-key="\$\{name\}" data-group="\$\{type\}"/.test(script)) || (chart === 'payback' && /data-key="(rest|total)"/.test(script));
    assert.ok(inHtml || generated, `ênfase ${key} de ${value}`);
  }
});

test('energia atômica usa ícones do sprite Material Symbols e oferece três layouts', () => {
  const used = new Set([...html.matchAll(/<use href="#(i-[\w-]+)"/g), ...script.matchAll(/<use href="#(i-[\w-]+)"/g)].map(m => m[1]));
  for (const id of used) assert.match(html, new RegExp(`<symbol id="${id}"`), id);
  assert.doesNotMatch(html.replace(/<svg class="icon-sprite"[\s\S]*?<\/svg>/, ''), /<path d="M\d+ \d+[\d.]*H/);
  for (const mode of ['scroll', 'spread', 'focus']) assert.match(html, new RegExp(`data-layout="${mode}"`));
  assert.match(script, /function createFocus\(\)/);
});

test('energia atômica segue o tema Verde Bandeira ES, sem o verde neon anterior', () => {
  assert.match(html, /--brand: #1d7449;/);
  assert.doesNotMatch(html, /#02a913|#0fc621|#11b81f|#76ff66|#57e24c/i);
});

test('payback confere com os cenários do grupo', () => {
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
  for (const [, name] of html.matchAll(/data-(?:shape|morph)="([^"]+)"/g)) assert.ok(SHAPE_NAMES.includes(name), name);
});
