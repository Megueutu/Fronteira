import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const profile = await mkdtemp(path.join(tmpdir(), 'fronteira-browser-'));
const chrome = spawn(process.env.CHROMIUM_PATH || 'chromium', ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
let seq = 0, pending = new Map(), session, socket;
const errors = [];
const deadline = setTimeout(() => { console.error('Browser test timed out'); chrome.kill('SIGKILL'); process.exitCode = 1; }, 45000);
const endpoint = new Promise((resolve, reject) => {
  let diagnostics = '';
  chrome.stderr.on('data', chunk => {
    diagnostics = (diagnostics + chunk.toString()).slice(-8000);
    const match = diagnostics.match(/DevTools listening on (ws:\/\/\S+)/);
    if (match) resolve(match[1]);
  });
  chrome.once('error', reject);
  chrome.once('exit', () => reject(new Error(`Chromium closed during startup: ${diagnostics}`)));
});
function receive(event) {
  const message = JSON.parse(event.data);
  if (message.id) { const item = pending.get(message.id); if (item) { pending.delete(message.id); message.error ? item.reject(new Error(JSON.stringify(message.error))) : item.resolve(message.result); } }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + (message.params.exceptionDetails.exception?.description || ''));
}
function disconnect() { for (const item of pending.values()) item.reject(new Error('Chromium connection closed')); pending.clear(); }
chrome.on('error', error => { for (const item of pending.values()) item.reject(error); });
chrome.on('exit', disconnect);
function send(method, params = {}, direct = false) {
  return new Promise((resolve, reject) => {
    const id = ++seq; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(session && !direct ? { sessionId: session } : {}) }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(expression) {
  for (let attempt = 0; attempt < 80; attempt++) { if (await evaluate(expression)) return; await pause(75); }
  throw new Error(`Condition failed: ${expression}`);
}
async function click(selector) { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); }
async function screenshot(name) {
  const layout = await send('Page.getLayoutMetrics');
  const { width, height } = layout.cssContentSize;
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
  await writeFile(new URL(`../artifacts/${name}.png`, import.meta.url), Buffer.from(result.data, 'base64'));
}

try {
  socket = new WebSocket(await endpoint);
  socket.addEventListener('message', receive);
  socket.addEventListener('close', disconnect);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error('Could not connect to Chromium')), { once: true });
  });
  const target = await send('Target.createTarget', { url: 'about:blank' }, true);
  session = (await send('Target.attachToTarget', { targetId: target.targetId, flatten: true }, true)).sessionId;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: process.env.TEST_URL || 'http://localhost:3000' });
  await waitFor(`document.querySelector('#html-book')?.children.length === 2 && document.querySelector('#page-status').textContent.includes('01')`);
  await mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
  assert.equal(await evaluate(`document.querySelector('#previous').disabled`), true);
  await screenshot('html-desktop');
  await click('[data-page="0"][data-action="popup"]');
  assert.equal(await evaluate(`document.querySelector('dialog').open`), true);
  assert.equal(await evaluate(`document.activeElement.id`), 'close-dialog');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await waitFor(`!document.querySelector('dialog').open`);
  await waitFor(`document.activeElement.dataset.page === '0'`);
  assert.equal(await evaluate(`document.activeElement.dataset.page`), '0');
  await click('#next'); await waitFor(`!document.querySelector('#next').disabled`);
  assert.equal(await evaluate(`document.querySelector('#page-status').textContent`), '03 — 04 / 06');
  await click('[data-slide="1"]');
  assert.equal(await evaluate(`document.querySelector('.carousel-count').textContent`), '02 / 03');
  await click('.inline-carousel [data-action="image"]');
  assert.equal(await evaluate(`document.querySelector('#dialog-title').textContent`), 'Em órbita');
  await click('#close-dialog');
  await click('[data-action="carousel"]'); await click('[data-dialog-slide="1"]');
  assert.equal(await evaluate(`document.querySelector('#slide-status').textContent`), '2 / 3');
  await screenshot('carousel-dialog'); await click('#close-dialog');
  await click('#previous'); await waitFor(`document.querySelector('#stage').getAttribute('aria-busy') === 'false'`);
  await click('#next'); await waitFor(`document.querySelector('#stage').getAttribute('aria-busy') === 'false'`);
  await click('.inline-carousel [data-action="image"]');
  assert.equal(await evaluate(`document.querySelector('#dialog-title').textContent`), 'Entre planos', 'ampliação corresponde à imagem após remontar a página');
  await click('#close-dialog');
  await click('#next'); await waitFor(`document.querySelector('#page-status').textContent.includes('05')`);
  await click('[data-page="4"][data-action="image"]');
  assert.equal(await evaluate(`document.querySelector('#dialog-title').textContent`), 'Passagem');
  await click('#close-dialog');
  await click('#read-linear');
  assert.equal(await evaluate(`document.querySelectorAll('.linear-page').length`), 6);
  await click('.linear-page [data-action="popup"]');
  await click('#close-dialog');
  assert.equal(await evaluate(`document.querySelectorAll('.linear-page').length`), 6, 'fechar interação retorna à leitura linear');
  await click('#close-dialog');
  await click('[data-mode="3d"]');
  await waitFor(`document.querySelectorAll('.hotspot').length === 2`);
  assert.equal(await evaluate(`document.querySelector('#stage-error').hidden`), true);
  await screenshot('3d-desktop');
  await click('.hotspot[data-action="image"]');
  assert.equal(await evaluate(`document.querySelector('dialog').open`), true);
  await click('#close-dialog');
  await click('#previous'); await waitFor(`document.querySelector('#page-status').textContent === '03 — 04 / 06' && document.querySelector('#stage').getAttribute('aria-busy') === 'false'`);
  await click('.hotspot[data-action="carousel"]');
  assert.equal(await evaluate(`document.querySelector('#slide-status').textContent`), '1 / 3');
  await click('#close-dialog');
  await click('#previous'); await pause(340); await screenshot('3d-turning');
  await waitFor(`document.querySelector('#stage').getAttribute('aria-busy') === 'false'`);
  await screenshot('3d-cover');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await click('[data-mode="html"]');
  await waitFor(`document.querySelector('#page-status').textContent === '01 / 06'`);
  assert.equal(await evaluate(`document.querySelectorAll('#html-book > article:not([inert])').length`), 1);
  await click('#next');
  assert.equal(await evaluate(`document.querySelector('#page-status').textContent`), '02 / 06');
  assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), 'sem transbordamento no celular');
  await screenshot('html-mobile');
  await click('[data-mode="3d"]'); await pause(150); await screenshot('3d-mobile');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await click('#next'); await waitFor(`document.querySelector('#stage').getAttribute('aria-busy') === 'false'`);
  await evaluate(`document.querySelector('#book-canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext()`);
  await waitFor(`!document.querySelector('#stage-error').hidden`);
  await click('#read-linear');
  assert.equal(await evaluate(`document.querySelectorAll('.linear-page').length`), 6);
  assert.deepEqual(errors, [], 'sem exceções JavaScript');
  console.log('PASS: html, 3d, navegação, popup/foco/escape, carrossel, ampliação, leitura linear, mobile, movimento reduzido e perda de WebGL.');
} finally {
  clearTimeout(deadline); socket?.close(); chrome.kill('SIGTERM'); await pause(250); await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
