// Renderer experimental e específico para a revista; não é um motor 3D genérico.
const WIDTH = 1.43, HEIGHT = 2, SEGMENTS = 40;
function multiply(a, b) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return out;
}
export function projection(aspect, lift = 0) {
  const f = 1 / Math.tan(Math.PI / 18), near = .1, far = 50;
  const perspective = new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0]);
  const angle = -.07, c = Math.cos(angle), s = Math.sin(angle);
  const distance = Math.max(f * WIDTH / aspect, f * HEIGHT / 2) / .92 + Math.abs(s) * HEIGHT / 2 + .03 + lift;
  const tilt = new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, -distance, 1]);
  return multiply(perspective, tilt);
}
export function projectPoint(matrix, x, y, z, width, height) {
  const clip = [0, 0, 0, 0];
  for (let r = 0; r < 4; r++) clip[r] = matrix[r] * x + matrix[4 + r] * y + matrix[8 + r] * z + matrix[12 + r];
  return { x: (clip[0] / clip[3] + 1) * width / 2, y: (1 - clip[1] / clip[3]) * height / 2 };
}

export function pageGeometry(side, progress = 0, zOffset = 0) {
  const points = [{ x: 0, z: zOffset }];
  const base = side === 1 ? progress * Math.PI : Math.PI * (1 - progress);
  const bend = (side === 1 ? -.55 : .55) * Math.sin(progress * Math.PI);
  for (let i = 1; i <= SEGMENTS; i++) {
    const fraction = (i - .5) / SEGMENTS;
    const angle = base + bend * Math.sin(Math.PI * fraction);
    points.push({ x: points[i - 1].x + Math.cos(angle) * WIDTH / SEGMENTS, z: points[i - 1].z + Math.sin(angle) * WIDTH / SEGMENTS });
  }
  const vertices = [];
  function push(i, top) {
    const fraction = i / SEGMENTS;
    const a = base + bend * Math.sin(Math.PI * fraction);
    const backside = progress > .5;
    const u = side === 1 ? (backside ? 1 - fraction : fraction) : (backside ? fraction : 1 - fraction);
    vertices.push(points[i].x, top ? HEIGHT / 2 : -HEIGHT / 2, points[i].z, u, top ? 1 : 0, -Math.sin(a), 0, Math.cos(a));
  }
  for (let i = 0; i < SEGMENTS; i++) { push(i, false); push(i + 1, false); push(i, true); push(i, true); push(i + 1, false); push(i + 1, true); }
  return new Float32Array(vertices);
}

export { create3DReader } from './webgl-scene.js';
