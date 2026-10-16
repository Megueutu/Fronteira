import { clampSpread, formatPages, pages } from './content.js';
import { createInteractions } from './interactions.js';
import { createHTMLReader } from './html-reader.js';

const interactions = createInteractions();
const html = createHTMLReader();
const stage = document.querySelector('#stage');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const status = document.querySelector('#page-status');
const mobile = matchMedia('(max-width: 600px)');
let mode = new URLSearchParams(location.search).get('template') === '3d' ? '3d' : 'html';
let spread = 0;
let side = 0;
let renderer = null;
let rendererPromise = null;
let turning = false;
let modeRequest = 0;
let turnRequest = 0;
let graphicsFailed = false;

function update() {
  const single = mobile.matches && mode === 'html';
  status.textContent = single ? `${String(spread * 2 + side + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}` : formatPages(spread);
  previous.disabled = turning || (spread === 0 && (!single || side === 0));
  next.disabled = turning || (spread === clampSpread(999) && (!single || side === 1));
  stage.classList.toggle('turning', turning);
  stage.setAttribute('aria-busy', String(turning));
}
async function navigate(delta) {
  if (turning || interactions.isOpen()) return;
  if (mobile.matches && mode === 'html') {
    const page = Math.max(0, Math.min(pages.length - 1, spread * 2 + side + delta));
    spread = Math.floor(page / 2); side = page % 2; html.show(spread, side); update(); return;
  }
  const target = clampSpread(spread + delta);
  if (target === spread) return;
  const request = ++turnRequest;
  turning = true; update();
  const old = spread; spread = target; side = 0;
  if (mode === '3d' && renderer) await renderer.turn(old, spread);
  else { html.show(spread); await new Promise(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 550)); }
  if (request === turnRequest) { turning = false; update(); }
}
async function setMode(value) {
  const request = ++modeRequest;
  mode = value; turning = false; ++turnRequest; update();
  renderer?.cancel();
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  document.querySelector('#html-view').hidden = mode !== 'html';
  document.querySelector('#webgl-view').hidden = mode !== '3d';
  document.querySelector('#stage-error').hidden = true;
  document.querySelector('#stage-label').textContent = mode === 'html' ? 'HTML · TOQUE PARA EXPLORAR' : '3D · EXPLORE OS PONTOS NA REVISTA';
  document.querySelector('#mode-caption').textContent = mode === 'html' ? 'Páginas que convidam a participar.' : 'Uma nova dimensão para a leitura.';
  document.querySelector('#nav-hint').textContent = mode === 'html' ? 'Use as setas ou deslize nas margens para folhear.' : 'Use as setas para folhear. Os pontos abrem novas camadas.';
  const url = new URL(location.href); url.searchParams.set('template', mode); history.replaceState(null, '', url);
  if (mode === 'html') { html.show(spread, side, false); return; }
  try {
    if (graphicsFailed) throw new Error('Contexto WebGL indisponível');
    if (!renderer) {
      rendererPromise ||= import('./webgl-reader.js').then(({ create3DReader }) => create3DReader(() => {
        graphicsFailed = true;
        turning = false; ++turnRequest;
        document.querySelector('#stage-error').hidden = mode !== '3d';
        document.querySelector('#webgl-view').hidden = true;
        update();
      }));
      renderer = await rendererPromise;
    }
    if (request === modeRequest) renderer.show(spread);
  } catch (error) {
    console.error(error);
    if (request === modeRequest) {
      document.querySelector('#stage-error').hidden = false;
      document.querySelector('#webgl-view').hidden = true;
    }
  }
}
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
previous.addEventListener('click', () => navigate(-1));
next.addEventListener('click', () => navigate(1));
document.querySelector('#read-linear').addEventListener('click', event => interactions.open('linear', spread * 2, event.currentTarget));
document.addEventListener('keydown', event => {
  if (interactions.isOpen() || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable],[data-carousel]')) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(event.key === 'ArrowRight' ? 1 : -1); }
});
let pointer = null;
stage.addEventListener('pointerdown', event => {
  if (mode !== 'html' || event.target.closest('button,a') || !event.isPrimary) return;
  const rect = document.querySelector('#html-book').getBoundingClientRect();
  // Somente as margens iniciam o gesto; o centro preserva seleção e scroll.
  if (event.clientX < rect.left || event.clientX > rect.right || (event.clientX > rect.left + 35 && event.clientX < rect.right - 35)) return;
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
});
stage.addEventListener('pointerup', event => {
  if (!pointer || event.pointerId !== pointer.id) return;
  const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y; pointer = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1);
});
stage.addEventListener('pointercancel', () => { pointer = null; });
mobile.addEventListener('change', () => { html.show(spread, side, false); update(); });
setMode(mode);
