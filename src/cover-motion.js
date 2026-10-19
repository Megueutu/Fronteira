import { createLavaLamp } from './lava-lamp.js';

/** Capa e quarta capa: lava lamp (WebGL). Sem movimento, fica em um quadro fixo. */
const STILL_TIME = 7;
const PALETTE = ['#a6d63a', '#2fa856', '#0a8a9a', '#8fd06a', '#d8f08a', '#1f8a4c'];
const mounted = new Set();

function mount(canvas) {
  if (mounted.has(canvas) || canvas.dataset.mounted) return;
  canvas.dataset.mounted = 'true';
  const cover = canvas.closest('.edition-cover, .page-back-cover');
  if (canvas.matches('.cover-lava-gl')) {
    const lamp = createLavaLamp(canvas, { back: '#157a40', colors: PALETTE, count: Number(canvas.dataset.count) || 9, size: Number(canvas.dataset.size) || .7 });
    if (!lamp) { canvas.hidden = true; return; }
    lamp.draw(STILL_TIME);
    mounted.add(Object.assign(canvas, { cover, paint: seconds => lamp.draw(seconds * .55 + STILL_TIME) }));
  }
}

export function mountCoverCanvases(root = document) {
  root.querySelectorAll?.('canvas.cover-lava-gl').forEach(mount);
}

export function installCoverMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.dataset.coverActive = String(entry.isIntersecting);
  });
  const register = root => {
    const covers = [...(root.matches?.('.edition-cover, .page-back-cover') ? [root] : []), ...root.querySelectorAll?.('.edition-cover, .page-back-cover') || []];
    for (const cover of covers) observer.observe(cover);
    mountCoverCanvases(root);
  };
  register(document);
  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) if (node.nodeType === 1) register(node);
      for (const node of record.removedNodes) if (node.nodeType === 1) {
        node.querySelectorAll?.('canvas.cover-lava-gl').forEach(canvas => mounted.delete(canvas));
        if (node.matches('.edition-cover, .page-back-cover')) observer.unobserve(node);
        node.querySelectorAll?.('.edition-cover, .page-back-cover').forEach(cover => observer.unobserve(cover));
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
  let frame = 0;
  const loop = now => {
    frame = 0;
    if (reduced.matches || document.hidden) return;
    let any = false;
    for (const canvas of mounted) if (canvas.cover?.dataset.coverActive === 'true' && canvas.isConnected) { canvas.paint(now / 1000); any = true; }
    if (any || mounted.size) frame = requestAnimationFrame(loop);
  };
  const start = () => { if (!frame && !reduced.matches && !document.hidden) frame = requestAnimationFrame(loop); };
  document.addEventListener('visibilitychange', start);
  reduced.addEventListener?.('change', () => { start(); if (reduced.matches) mounted.forEach(canvas => canvas.paint(0)); });
  new MutationObserver(start).observe(document.body, { childList: true, subtree: true });
  start();
}
