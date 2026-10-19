/* Adapted from Paper Shaders (metaballs): https://github.com/paper-design/shaders
   Licensed under the Apache License, Version 2.0 (assets/third-party/paper-shaders/LICENSE).
   Powered by Paper Shaders: https://shaders.paper.design
   Changes: ported to vanilla JS and WebGL2 without the sizing vertex shader; the noise texture was replaced by a hash. */
const VERTEX = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() { v_uv = a_position * .5; gl_Position = vec4(a_position, 0., 1.); }`;

const FRAGMENT = `#version 300 es
precision mediump float;
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec4 u_colorBack;
uniform vec4 u_colors[8];
uniform float u_colorsCount;
uniform float u_size;
uniform float u_count;
in vec2 v_uv;
out vec4 fragColor;

float randomR(vec2 p) { return fract(sin(dot(floor(p), vec2(12.9898, 78.233))) * 43758.5453123); }
float noise(float x) {
  float i = floor(x), f = fract(x), u = f * f * (3.0 - 2.0 * f);
  return mix(randomR(vec2(i, 0.)), randomR(vec2(i + 1., 0.)), u);
}
float getBallShape(vec2 uv, vec2 c, float p) {
  float s = .5 * length(uv - c);
  s = 1. - clamp(s, 0., 1.);
  return pow(s, p);
}
void main() {
  vec2 shape_uv = v_uv + .5;
  float t = .2 * (u_time + 2503.4);
  vec3 totalColor = vec3(0.);
  float totalShape = 0., totalOpacity = 0.;
  for (int i = 0; i < 20; i++) {
    if (i >= int(ceil(u_count))) break;
    float idxFract = float(i) / 20.;
    float angle = TWO_PI * idxFract;
    float speed = 1. - .2 * idxFract;
    float noiseX = noise(angle * 10. + float(i) + t * speed);
    float noiseY = noise(angle * 20. + float(i) - t * speed);
    vec2 pos = vec2(.5) + 1e-4 + .9 * (vec2(noiseX, noiseY) - .5);
    vec4 ballColor = u_colors[i % int(u_colorsCount + .5)];
    ballColor.rgb *= ballColor.a;
    float sizeFrac = 1.;
    if (float(i) > floor(u_count - 1.)) sizeFrac *= fract(u_count);
    float shape = getBallShape(shape_uv, pos, 45. - 30. * u_size * sizeFrac);
    shape *= pow(u_size, .2);
    shape = smoothstep(0., 1., shape);
    totalColor += ballColor.rgb * shape;
    totalShape += shape;
    totalOpacity += ballColor.a * shape;
  }
  totalColor /= max(totalShape, 1e-4);
  totalOpacity /= max(totalShape, 1e-4);
  float edge_width = fwidth(totalShape);
  float finalShape = smoothstep(.4, .4 + edge_width, totalShape);
  vec3 color = totalColor * finalShape;
  float opacity = totalOpacity * finalShape;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
  fragColor = vec4(color, opacity);
}`;

const rgba = hex => { const n = parseInt(hex.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255, 1]; };
const shader = (gl, type, source) => {
  const object = gl.createShader(type); gl.shaderSource(object, source); gl.compileShader(object);
  if (!gl.getShaderParameter(object, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(object));
  return object;
};

/** Cria uma lava lamp no canvas. Retorna `{draw(seconds), dispose()}` ou null quando WebGL2 não existe. */
export function createLavaLamp(canvas, { back = '#0f5a37', colors, count = 8, size = .72 } = {}) {
  const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  try {
    const program = gl.createProgram();
    gl.attachShader(program, shader(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const palette = colors.map(rgba);
    const uniform = name => gl.getUniformLocation(program, name);
    gl.uniform4fv(uniform('u_colorBack'), rgba(back));
    gl.uniform4fv(uniform('u_colors'), new Float32Array([...palette.flat(), ...new Array((8 - palette.length) * 4).fill(0)]));
    gl.uniform1f(uniform('u_colorsCount'), palette.length);
    gl.uniform1f(uniform('u_count'), count);
    gl.uniform1f(uniform('u_size'), size);
    const time = uniform('u_time');
    return {
      draw(seconds) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(time, seconds);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
      dispose() { gl.getExtension('WEBGL_lose_context')?.loseContext(); },
    };
  } catch (error) { console.warn('Lava lamp indisponível:', error); return null; }
}
