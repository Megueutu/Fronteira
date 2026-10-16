import { pages, getSpread } from './content.js';

// Renderer experimental e específico para a revista; não é um motor 3D genérico.
const WIDTH = 1.43, HEIGHT = 2, SEGMENTS = 40;
const vertexSource = `attribute vec3 position; attribute vec2 uv; attribute vec3 normal;
uniform mat4 matrix; varying vec2 vUV; varying float light;
void main(){vUV=uv; light=.83+.17*abs(dot(normalize(normal),normalize(vec3(-.3,.5,1.)))); gl_Position=matrix*vec4(position,1.);}`;
const fragmentSource = `precision mediump float; uniform sampler2D page; uniform float tint;
varying vec2 vUV; varying float light;
void main(){vec4 c=texture2D(page,vUV); float gutter=1.-.12*exp(-min(vUV.x,1.-vUV.x)*35.);gl_FragColor=vec4(c.rgb*light*gutter*tint,c.a);}`;

function multiply(a, b) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return out;
}
export function projection(aspect) {
  const f = 1 / Math.tan(Math.PI / 9), near = .1, far = 50;
  const perspective = new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0]);
  const angle = -.22, c = Math.cos(angle), s = Math.sin(angle);
  const tilt = new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, -Math.max(3.25, 4.3 / aspect), 1]);
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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let cursor = y;
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) { ctx.fillText(line, x, cursor); cursor += lineHeight; line = word; }
      else line = next;
    }
    ctx.fillText(line, x, cursor); cursor += lineHeight;
  }
  return cursor;
}

async function textureCanvas(page, index) {
  const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 1400;
  const ctx = canvas.getContext('2d');
  const dark = page.kind === 'cover';
  ctx.fillStyle = dark ? '#273e34' : page.kind === 'outro' ? '#dfe5cf' : page.kind === 'story' ? '#e9e8d8' : '#f8f4e9'; ctx.fillRect(0, 0, 1000, 1400);
  const ink = dark ? '#f7f2db' : '#263428';
  ctx.fillStyle = ink; ctx.font = 'bold 20px Arial'; ctx.fillText('FRONTEIRA', 80, 85);
  ctx.font = '17px Arial'; ctx.textAlign = 'right'; ctx.fillText(page.label, 920, 85); ctx.textAlign = 'left';
  ctx.strokeStyle = dark ? '#aebc9566' : '#52604655'; ctx.beginPath(); ctx.moveTo(80, 120); ctx.lineTo(920, 120); ctx.stroke();
  ctx.font = `${dark ? 122 : 110}px Georgia`;
  let y = wrapText(ctx, page.title, 80, 265, 860, dark ? 119 : 112);
  ctx.font = '30px Arial';
  if (page.subtitle) y = wrapText(ctx, page.subtitle, 80, y + 22, 820, 45);
  if (page.body) { ctx.font = '31px Arial'; y = wrapText(ctx, page.body, 80, y + 32, 820, 47); }
  if (page.image) {
    const image = new Image(); image.src = page.image.src;
    try {
      await image.decode();
      const height = Math.min(380, 1090 - y - 20); const top = y + 20;
      ctx.save(); ctx.beginPath(); ctx.rect(80, top, 840, height); ctx.clip();
      const scale = Math.max(840 / image.naturalWidth, height / image.naturalHeight);
      ctx.drawImage(image, 80 + (840 - image.naturalWidth * scale) / 2, top + (height - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale); ctx.restore();
    } catch { ctx.fillStyle = '#a7b99d'; ctx.fillRect(80, y + 20, 840, 240); ctx.fillStyle = ink; ctx.font = '25px Arial'; ctx.fillText('Imagem indisponível', 110, y + 100); }
  }
  if (page.quote) { ctx.fillStyle = '#798957'; ctx.font = 'italic 67px Georgia'; wrapText(ctx, page.quote, 80, Math.max(y + 80, 940), 840, 77); }
  // A ação é um botão DOM projetado sobre a folha para manter foco e semântica.
  ctx.fillStyle = ink; ctx.font = '17px Arial'; ctx.fillText('UM ESTUDO EM ABERTO', 80, 1330); ctx.textAlign = 'right'; ctx.fillText(String(index + 1).padStart(2, '0'), 920, 1330);
  return canvas;
}

export async function create3DReader(onLost) {
  const canvas = document.querySelector('#book-canvas');
  const hotspots = document.querySelector('#hotspots');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) throw new Error('WebGL não disponível');
  let lost = false;
  function shader(type, source) {
    const value = gl.createShader(type); gl.shaderSource(value, source); gl.compileShader(value);
    if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(value));
    return value;
  }
  const program = gl.createProgram();
  const vertex = shader(gl.VERTEX_SHADER, vertexSource), fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.deleteShader(vertex); gl.deleteShader(fragment); gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  for (const [attribute, size, offset] of [['position', 3, 0], ['uv', 2, 12], ['normal', 3, 20]]) {
    const loc = gl.getAttribLocation(program, attribute); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 32, offset);
  }
  const matrixLocation = gl.getUniformLocation(program, 'matrix');
  const tintLocation = gl.getUniformLocation(program, 'tint');
  gl.uniform1i(gl.getUniformLocation(program, 'page'), 0);
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
  const sources = await Promise.all(pages.map(textureCanvas));
  const textures = sources.map(source => {
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return texture;
  });
  let spread = 0, animation = null, frame = 0, matrix, width, height, resolveTurn;
  function dimensions() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    if (!width || !height) return false;
    const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    matrix = projection(width / height); gl.viewport(0, 0, canvas.width, canvas.height); gl.uniformMatrix4fv(matrixLocation, false, matrix); return true;
  }
  function draw(side, pageIndex, progress = 0, offset = 0, tint = 1) {
    const vertices = pageGeometry(side, progress, offset);
    gl.bindTexture(gl.TEXTURE_2D, textures[pageIndex]); gl.uniform1f(tintLocation, tint);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW); gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 8);
  }
  function updateHotspots() {
    if (!matrix || !width) return;
    for (const [i, button] of [...hotspots.children].entries()) {
      const page = pages[spread * 2 + i];
      const x = i === 0 ? -WIDTH * (1 - page.action.x) : WIDTH * page.action.x;
      const point = projectPoint(matrix, x, HEIGHT * (.5 - page.action.y), .015, width, height);
      button.style.left = `${point.x}px`; button.style.top = `${point.y}px`;
      const edge = projectPoint(matrix, WIDTH, 0, 0, width, height);
      button.style.maxWidth = `${Math.max(80, Math.min(225, edge.x - width / 2 - 15))}px`;
    }
  }
  function makeHotspots() {
    hotspots.innerHTML = getSpread(spread).map((page, i) => `<button type="button" class="hotspot" data-action="${page.action.type}" data-page="${spread * 2 + i}">${page.action.label}<span aria-hidden="true"><i class="${page.action.type === 'image' ? 'icon-expand' : 'icon-diagonal'}"></i></span></button>`).join('');
    updateHotspots();
  }
  function render(now = performance.now()) {
    if (lost || !matrix) return;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const base = animation ? animation.from : spread;
    for (let i = 4; i >= 1; i--) { draw(-1, base * 2, 0, -i * .012, .82 + .025 * i); draw(1, base * 2 + 1, 0, -i * .012, .82 + .025 * i); }
    if (animation) {
      const raw = Math.min(1, (now - animation.start) / 850);
      const progress = raw * raw * (3 - 2 * raw);
      const forward = animation.to > animation.from;
      draw(-1, (forward ? animation.from : animation.to) * 2);
      draw(1, (forward ? animation.to : animation.from) * 2 + 1);
      const pageIndex = forward ? (progress <= .5 ? animation.from * 2 + 1 : animation.to * 2) : (progress <= .5 ? animation.from * 2 : animation.to * 2 + 1);
      draw(forward ? 1 : -1, pageIndex, progress, .018);
      if (raw < 1) frame = requestAnimationFrame(render);
      else { spread = animation.to; animation = null; makeHotspots(); render(); const done = resolveTurn; resolveTurn = null; done?.(); }
    } else { draw(-1, spread * 2); draw(1, spread * 2 + 1); }
  }
  function cancel() {
    cancelAnimationFrame(frame);
    if (animation) spread = animation.to;
    animation = null; const done = resolveTurn; resolveTurn = null; done?.();
  }
  function show(value) { cancel(); spread = value; if (dimensions()) { makeHotspots(); render(); } }
  const observer = new ResizeObserver(() => { if (!lost && dimensions()) { updateHotspots(); if (!animation) render(); } }); observer.observe(canvas);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; cancel(); hotspots.replaceChildren(); onLost(); });
  return {
    show, cancel,
    turn(from, to) {
      cancel();
      if (lost || matchMedia('(prefers-reduced-motion: reduce)').matches) { show(to); return Promise.resolve(); }
      return new Promise(resolve => { resolveTurn = resolve; animation = { from, to, start: performance.now() }; frame = requestAnimationFrame(render); });
    },
    dispose() { cancel(); observer.disconnect(); textures.forEach(t => gl.deleteTexture(t)); gl.deleteBuffer(buffer); gl.deleteProgram(program); },
  };
}
