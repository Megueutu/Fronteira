import { pages, getOpening } from './content.js';
import { pageGeometry, projection, projectPoint } from './webgl-reader.js';

const WIDTH = 1.43, HEIGHT = 2;
const vertexSource = `attribute vec3 position; attribute vec2 uv; attribute vec3 normal;
uniform mat4 matrix; varying vec2 vUV; varying float light;
void main(){vUV=uv; light=.985+.015*abs(dot(normalize(normal),normalize(vec3(-.3,.5,1.)))); gl_Position=matrix*vec4(position,1.);}`;
const fragmentSource = `precision mediump float; uniform sampler2D page; uniform float tint; uniform float paperOnly; uniform float spine;
varying vec2 vUV; varying float light;
void main(){vec4 c=mix(texture2D(page,vUV),vec4(.98,.985,.98,1.),paperOnly);float gutter=1.-.08*exp(-abs(vUV.x-spine)*48.);gl_FragColor=vec4(c.rgb*light*gutter*tint,c.a);}`;

export async function create3DReader(onLost) {
  const canvas = document.querySelector('#book-canvas'), hotspots = document.querySelector('#hotspots');
  const gl = canvas.getContext('webgl',{ alpha:true, antialias:true, premultipliedAlpha:false });
  if (!gl) throw new Error('WebGL indisponível');
  let lost = false, spread = 0, animation, frame = 0, matrix, width, height, resolveTurn, showId = 0, operationId = 0;
  const textures = new Map(), pending = new Map();
  function shader(type,source) {
    const value = gl.createShader(type); gl.shaderSource(value,source); gl.compileShader(value);
    if (!gl.getShaderParameter(value,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(value));
    return value;
  }
  const program = gl.createProgram(), vertex = shader(gl.VERTEX_SHADER,vertexSource), fragment = shader(gl.FRAGMENT_SHADER,fragmentSource);
  gl.attachShader(program,vertex); gl.attachShader(program,fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.deleteShader(vertex); gl.deleteShader(fragment); gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  for (const [attribute,size,offset] of [['position',3,0],['uv',2,12],['normal',3,20]]) {
    const loc = gl.getAttribLocation(program,attribute); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,size,gl.FLOAT,false,32,offset);
  }
  const matrixLocation = gl.getUniformLocation(program,'matrix'), tintLocation = gl.getUniformLocation(program,'tint');
  const paperLocation = gl.getUniformLocation(program,'paperOnly'), spineLocation = gl.getUniformLocation(program,'spine');
  const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
  const filtering = anisotropy ? Math.min(4,gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)) : 1;
  gl.uniform1i(gl.getUniformLocation(program,'page'),0); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
  async function ensure(index) {
    if (index === null || index === undefined) return;
    if (textures.has(index)) return;
    if (pending.has(index)) return pending.get(index);
    const operation = (async () => {
      const image = new Image(); image.src = `/assets/textures/page-${String(index + 1).padStart(2,'0')}.jpg`;
      await image.decode(); if (lost) return;
      const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      if (anisotropy) gl.texParameterf(gl.TEXTURE_2D,anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,filtering);
      textures.set(index,texture);
    })();
    pending.set(index,operation);
    try { await operation; } finally { pending.delete(index); }
  }
  async function prepare(value) { const opening=getOpening(value); await Promise.all([ensure(opening.leftIndex),ensure(opening.rightIndex)]); }
  function prune() {
    const opening=getOpening(spread);
    const keep = new Set([opening.leftIndex,opening.rightIndex]);
    for (const [index,texture] of textures) if (!keep.has(index)) { gl.deleteTexture(texture); textures.delete(index); }
    canvas.dataset.textureCount = String(textures.size);
  }
  function dimensions() {
    const r = canvas.getBoundingClientRect(); width = r.width; height = r.height;
    if (!width || !height) return false;
    const ratio = Math.min(Math.max(devicePixelRatio || 1,1.5),2);
    const bufferWidth = Math.round(width * ratio), bufferHeight = Math.round(height * ratio);
    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) { canvas.width = bufferWidth; canvas.height = bufferHeight; }
    matrix = projection(width / height); gl.viewport(0,0,canvas.width,canvas.height); gl.uniformMatrix4fv(matrixLocation,false,matrix); return true;
  }
  function draw(side,index,progress = 0,offset = 0,tint = 1,paperOnly = false) {
    if (!textures.has(index)) return;
    const vertices = pageGeometry(side,progress,offset);
    gl.bindTexture(gl.TEXTURE_2D,textures.get(index)); gl.uniform1f(tintLocation,tint);
    gl.uniform1f(paperLocation,Number(paperOnly)); gl.uniform1f(spineLocation,(side === 1) === (progress <= .5) ? 0 : 1);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW); gl.drawArrays(gl.TRIANGLES,0,vertices.length / 8);
  }
  function updateHotspots() {
    if (!matrix || !width) return;
    const left = projectPoint(matrix,-WIDTH,-HEIGHT/2,0,width,height), right = projectPoint(matrix,WIDTH,-HEIGHT/2,0,width,height);
    hotspots.style.width = `${Math.min(width,Math.max(320,right.x-left.x))}px`;
  }
  function makeHotspots() {
    hotspots.setAttribute('role','group'); hotspots.setAttribute('aria-label','Fontes das páginas desta abertura');
    const opening=getOpening(spread);
    hotspots.innerHTML = [['left',opening.leftIndex],['right',opening.rightIndex]].map(([side,index]) => index===null || (!pages[index].folio && !pages[index].supplement) ? '' : `<button type="button" class="hotspot spread-source-action" data-side="${side}" data-action="${pages[index].supplement ? 'interview' : 'sources'}" data-page="${index}" aria-haspopup="dialog"><span>${pages[index].supplement ? 'Entrevista completa' : 'Fontes da página '+String(pages[index].folio).padStart(2,'0')}</span><svg class="reader-icon" aria-hidden="true"><use href="#ui-menu_book"/></svg></button>`).join(''); updateHotspots();
  }
  const centerOf = value => { const opening=getOpening(value); return opening.leftIndex===null ? WIDTH/2 : opening.rightIndex===null ? -WIDTH/2 : 0; };
  function render(now = performance.now()) {
    if (lost || !matrix) return;
    const raw = animation ? Math.min(1,(now - animation.start) / 850) : 0;
    const progress = raw * raw * (3 - 2 * raw);
    matrix = projection(width / height,animation ? WIDTH*1.25*Math.sin(progress*Math.PI) : 0);
    const center=animation ? centerOf(animation.from)*(1-progress)+centerOf(animation.to)*progress : centerOf(spread);
    for(let row=0;row<4;row++) matrix[12+row]-=matrix[row]*center;
    gl.uniformMatrix4fv(matrixLocation,false,matrix);
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const base = getOpening(animation ? animation.from : spread);
    for (let i = 4; i >= 1; i--) { draw(-1,base.leftIndex,0,-i * .004,.94 + .012 * (4-i),true); draw(1,base.rightIndex,0,-i * .004,.94 + .012 * (4-i),true); }
    if (!animation) { draw(-1,base.leftIndex); draw(1,base.rightIndex); return; }
    const forward = animation.to > animation.from;
    const from=getOpening(animation.from),to=getOpening(animation.to);
    draw(-1,(forward ? from : to).leftIndex); draw(1,(forward ? to : from).rightIndex);
    const index = forward ? (progress <= .5 ? from.rightIndex : to.leftIndex) : (progress <= .5 ? from.leftIndex : to.rightIndex);
    draw(forward ? 1 : -1,index,progress,.018);
    if (raw < 1) frame = requestAnimationFrame(render);
    else { spread = animation.to; animation = null; makeHotspots(); render(); prune(); const done = resolveTurn; resolveTurn = null; done?.(); }
  }
  function cancel() { ++operationId; cancelAnimationFrame(frame); if (animation) spread = animation.to; animation = null; const done = resolveTurn; resolveTurn = null; done?.(); }
  async function show(value) {
    const request = ++showId; cancel(); await prepare(value);
    if (request !== showId || lost) return;
    spread = value; if (dimensions()) { makeHotspots(); render(); prune(); }
  }
  const observer = new ResizeObserver(() => { if (!lost && dimensions()) { updateHotspots(); if (!animation) render(); } }); observer.observe(canvas);
  canvas.addEventListener('webglcontextlost',event => { event.preventDefault(); lost = true; ++showId; cancel(); hotspots.replaceChildren(); onLost(); });
  return {
    show,cancel,
    async turn(from,to) {
      cancel(); const request = operationId; await Promise.all([prepare(from),prepare(to)]);
      if (lost || request !== operationId) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { await show(to); return; }
      return new Promise(resolve => { resolveTurn = resolve; animation = { from,to,start:performance.now() }; frame = requestAnimationFrame(render); });
    },
    dispose() { lost = true; cancel(); observer.disconnect(); textures.forEach(texture => gl.deleteTexture(texture)); textures.clear(); gl.deleteBuffer(buffer); gl.deleteProgram(program); },
  };
}
