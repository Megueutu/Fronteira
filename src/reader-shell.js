export function initializeBackground() {
  const canvas = document.querySelector('#organic-bg');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const css = getComputedStyle(canvas);
  const palette = ['--cover-blob-1', '--cover-blob-2', '--cover-blob-3', '--md-sys-color-primary-fixed-dim', '--md-sys-color-secondary-container']
    .map(v => css.getPropertyValue(v).trim());
  const POINTS = 56;
  // Posições em frações da tela; cada seção da revista desloca levemente as âncoras.
  const blobs = [
    [0.08, 0.22, 0.20, 0], [0.92, 0.18, 0.16, 1], [0.86, 0.78, 0.22, 2],
    [0.12, 0.82, 0.17, 3], [0.50, 0.55, 0.12, 4], [0.30, 0.05, 0.10, 1], [0.70, 1.02, 0.13, 0],
  ].map(([x, y, r, c], i) => ({
    hx: x, hy: y, r, color: palette[c], alpha: c === 4 ? 0.9 : 0.42,
    x: 0, y: 0, vx: 0, vy: 0, energy: 0,
    phase: Array.from({ length: 4 }, (_, k) => i * 1.7 + k * 2.3),
    speed: [0.21, -0.17, 0.13, -0.09].map(s => s * (1 + i * 0.07)),
    amp: [0.07, 0.05, 0.035, 0.02],
    bulge: new Float32Array(POINTS),
  }));
  let w = 0, h = 0, dpr = 1, t = 0, last = performance.now(), raf = 0;
  const pointer = { x: -9999, y: -9999, active: false };
  let lastScroll = scrollY, scrollEnergy = 0, sectionShift = 0, targetShift = 0;

  const resize = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    blobs.forEach(b => { if (!b.x) { b.x = b.hx * w; b.y = b.hy * h; } });
    if (reduce.matches) draw();
  };

  const shape = (b, i) => {
    const R = b.r * Math.min(w, h) * (w < 700 ? 1.5 : 1) * (1 + b.energy * 0.08);
    const pts = [];
    for (let k = 0; k < POINTS; k += 1) {
      const a = k / POINTS * Math.PI * 2;
      let r = 1;
      for (let n = 0; n < 4; n += 1) r += b.amp[n] * (1 + b.energy * 1.6) * Math.sin((n + 2) * a + b.phase[n] + t * b.speed[n]);
      r += b.bulge[k];
      pts.push([b.x + Math.cos(a) * R * r, b.y + Math.sin(a) * R * r]);
    }
    return pts;
  };

  const trace = pts => {
    // Curva suave pelos pontos médios (quadráticas), fechada.
    const n = pts.length;
    const mid = i => [(pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2];
    ctx.beginPath();
    const m0 = mid(n - 1);
    ctx.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i += 1) { const m = mid(i); ctx.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
    ctx.closePath();
  };

  function step(dt) {
    t += dt;
    const sv = scrollY - lastScroll; lastScroll = scrollY;
    scrollEnergy = Math.min(1, scrollEnergy * 0.92 + Math.abs(sv) / 900);
    sectionShift += (targetShift - sectionShift) * Math.min(1, dt * 1.5);
    blobs.forEach((b, i) => {
      const depth = 0.4 + (i % 3) * 0.3;
      const hx = (b.hx + Math.sin(sectionShift + i) * 0.04) * w;
      const hy = (b.hy + Math.cos(sectionShift * 0.8 + i * 1.3) * 0.035) * h;
      // Mola até a âncora, rolagem empurra com profundidade diferente (paralaxe).
      b.vx += (hx - b.x) * 2.2 * dt;
      b.vy += (hy - b.y) * 2.2 * dt - sv * depth * 0.9 * dt * 10;
      const R = b.r * Math.min(w, h);
      const dx = b.x - pointer.x, dy = b.y - pointer.y, d = Math.hypot(dx, dy) || 1;
      const reach = R * 2.6;
      if (pointer.active && d < reach) {
        const f = (1 - d / reach) ** 2 * 900 * dt;
        b.vx += dx / d * f; b.vy += dy / d * f;
        b.energy = Math.min(1, b.energy + (1 - d / reach) * dt * 2);
      }
      b.vx *= Math.exp(-dt * 3.2); b.vy *= Math.exp(-dt * 3.2);
      b.x += b.vx * dt; b.y += b.vy * dt;
      b.energy = Math.max(scrollEnergy * 0.8, b.energy - dt * 0.35);
      // Bordas voltadas para o ponteiro incham na direção dele, como uma gota atraída.
      const toward = Math.atan2(pointer.y - b.y, pointer.x - b.x);
      const near = pointer.active ? Math.max(0, 1 - d / (reach * 1.4)) : 0;
      for (let k = 0; k < POINTS; k += 1) {
        const a = k / POINTS * Math.PI * 2;
        let diff = Math.abs(a - toward) % (Math.PI * 2); if (diff > Math.PI) diff = Math.PI * 2 - diff;
        const target = near * 0.22 * Math.exp(-(diff * diff) / 0.35);
        b.bulge[k] += (target - b.bulge[k]) * Math.min(1, dt * 6);
      }
    });
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    blobs.forEach((b, i) => {
      ctx.globalAlpha = b.alpha;
      ctx.fillStyle = b.color;
      trace(shape(b, i));
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    step(dt); draw();
    raf = requestAnimationFrame(frame);
  }
  let suspended = false;
  const start = () => { cancelAnimationFrame(raf); last = performance.now(); if (reduce.matches || suspended || document.hidden) draw(); else raf = requestAnimationFrame(frame); };
  // O 3D tem seu próprio render loop; o fundo permanece estático nesse modo.
  initializeBackground.setMode = mode => { suspended = mode === '3d'; start(); };

  addEventListener('resize', resize);
  addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.active = false; });
  addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') pointer.active = false; });
  addEventListener('pointerdown', e => {
    // Onda: empurra todas as manchas a partir do ponto tocado.
    blobs.forEach(b => {
      const dx = b.x - e.clientX, dy = b.y - e.clientY, d = Math.hypot(dx, dy) || 1;
      const f = 520 * Math.max(0.15, 1 - d / Math.max(w, h));
      b.vx += dx / d * f; b.vy += dy / d * f; b.energy = Math.min(1, b.energy + 0.6);
    });
  }, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? cancelAnimationFrame(raf) : start());
  reduce.addEventListener?.('change', start);
  // A seção atual muda a composição do fundo.
  initializeBackground.setSection = i => { targetShift = i * 0.9; if (reduce.matches) draw(); };

  resize();
  start();
}

