// Formas expressivas inspiradas na biblioteca de formas do Material 3 Expressive.
// Cada forma é uma função polar r(θ) amostrada com o mesmo número de pontos,
// o que permite interpolar (morph) entre quaisquer duas formas.
const N = 144;
const TAU = Math.PI * 2;

const lobes = (n, depth, power = 1) => t => 1 - depth + depth * Math.abs(Math.cos(n * t / 2)) ** power;
const points = (n, depth) => t => 1 + depth * (1 - 2 * Math.abs(Math.sin(n * t / 2)));

export const SHAPES = {
  circle: () => 1,
  cookie4: t => 1 + 0.09 * Math.cos(4 * t),
  cookie6: t => 1 + 0.07 * Math.cos(6 * t),
  cookie7: t => 1 + 0.065 * Math.cos(7 * t),
  cookie9: t => 1 + 0.055 * Math.cos(9 * t),
  cookie12: t => 1 + 0.045 * Math.cos(12 * t),
  clover4: lobes(4, 0.3, 0.55),
  clover8: lobes(8, 0.22, 0.6),
  flower: lobes(8, 0.26, 0.9),
  sunny: points(8, 0.07),
  burst: points(12, 0.11),
  softBurst: t => 1 + 0.1 * Math.cos(10 * t) ** 3,
  puffy: t => 1 + 0.06 * Math.cos(5 * t) + 0.03 * Math.cos(10 * t),
  pentagon: t => 1 + 0.08 * Math.cos(5 * t),
};

export const SHAPE_NAMES = Object.keys(SHAPES);

export function radii(name, rotation = 0) {
  const fn = SHAPES[name] || SHAPES.circle;
  const r = Array.from({ length: N }, (_, i) => fn(i / N * TAU + rotation));
  const max = Math.max(...r);
  return r.map(v => v / max);
}

export function pathFrom(r, size = 100, inset = 1) {
  const c = size / 2;
  const scale = c - inset;
  let d = '';
  for (let i = 0; i < N; i += 1) {
    const t = i / N * TAU - Math.PI / 2;
    const x = c + Math.cos(t) * r[i] * scale;
    const y = c + Math.sin(t) * r[i] * scale;
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
// Aproximação de uma mola com leve overshoot, no espírito do motion expressivo.
const spring = t => 1 - Math.exp(-6 * t) * Math.cos(7.5 * t);

export function morph(path, from, to, duration = 650) {
  if (reduceMotion()) { path.setAttribute('d', pathFrom(to)); path._r = to; return; }
  cancelAnimationFrame(path._raf);
  const start = performance.now();
  const step = now => {
    const p = Math.min(1, (now - start) / duration);
    const k = spring(p);
    const r = from.map((v, i) => v + (to[i] - v) * k);
    path.setAttribute('d', pathFrom(r));
    path._r = r;
    if (p < 1) path._raf = requestAnimationFrame(step);
    else { path.setAttribute('d', pathFrom(to)); path._r = to; }
  };
  path._raf = requestAnimationFrame(step);
}
