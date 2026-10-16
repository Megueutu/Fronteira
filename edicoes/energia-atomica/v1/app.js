import { radii, pathFrom, morph } from './shapes.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Formas expressivas ---------- */
function drawShapes(root = document) {
  $$('svg.xs', root).forEach((svg, i) => {
    const path = $('path', svg);
    if (!path || path._r) return;
    const r = radii(svg.dataset.shape || 'circle', (i % 5) * 0.11);
    path.setAttribute('d', pathFrom(r));
    path._r = r;
    path._base = r;
    if (svg.dataset.morph) path._alt = radii(svg.dataset.morph, (i % 5) * 0.11);
  });
}

function setMorphed(svg, on) {
  const path = $('path', svg);
  if (!path?._alt) return;
  morph(path, path._r, on ? path._alt : path._base);
}

function bindMorphs() {
  // Hover/foco morfa as formas do próprio elemento; ao entrar na tela, as decorações da página morfam uma vez.
  $$('svg.xs[data-morph]').forEach(svg => {
    const host = svg.closest('li, .card, .fab, figure, aside') || svg;
    host.addEventListener('pointerenter', () => setMorphed(svg, true));
    host.addEventListener('pointerleave', () => setMorphed(svg, false));
  });
}

/* ---------- Navegação ---------- */
const pages = $$('.page');
let current = 0;
const pad = n => String(n).padStart(2, '0');

function buildDrawer() {
  const list = $('#drawer-list');
  const seen = new Set();
  pages.forEach((page, i) => {
    const name = page.dataset.section;
    if (seen.has(name)) return;
    seen.add(name);
    const li = document.createElement('li');
    li.innerHTML = `<a href="#${page.id}" data-index="${i}"><span class="num">${pad(i + 1)}</span><span>${name}</span></a>`;
    list.append(li);
  });
  list.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    closeDrawer();
    goTo(Number(a.dataset.index));
  });
}

function openDrawer() {
  $('#drawer').hidden = false; $('#scrim').hidden = false;
  requestAnimationFrame(() => document.body.classList.add('drawer-open'));
  $('#open-drawer').setAttribute('aria-expanded', 'true');
  $('#drawer a[aria-current]')?.focus() || $('#drawer a')?.focus();
}
function closeDrawer() {
  document.body.classList.remove('drawer-open');
  $('#open-drawer').setAttribute('aria-expanded', 'false');
  setTimeout(() => { $('#drawer').hidden = true; $('#scrim').hidden = true; }, 220);
  $('#open-drawer').focus({ preventScroll: true });
}

function goTo(index) {
  const i = Math.max(0, Math.min(pages.length - 1, index));
  const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  pages[i].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  history.replaceState(null, '', `#${pages[i].id}`);
}

function updateCurrent(i) {
  current = i;
  const page = pages[i];
  $('#page-counter').textContent = `${pad(i + 1)} / ${pad(pages.length)}`;
  $('#current-section').textContent = page.dataset.section;
  $('#prev-page').disabled = i === 0;
  $('#next-page').disabled = i === pages.length - 1;
  $('#fab').classList.toggle('at-end', i === pages.length - 1);
  $('#fab').setAttribute('aria-label', i === pages.length - 1 ? 'Voltar à capa' : 'Próxima página');
  $$('#drawer a').forEach(a => {
    const same = pages[Number(a.dataset.index)].dataset.section === page.dataset.section;
    if (same) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const fabPath = $('#fab .fab-shape path');
  if (fabPath?._alt) morph(fabPath, fabPath._r, i % 2 ? fabPath._alt : fabPath._base, 500);
}

function watchPages() {
  const seen = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const i = pages.indexOf(entry.target);
      if (entry.isIntersecting) {
        updateCurrent(i);
        if (!seen.has(i)) {
          seen.add(i);
          $$('.deco, .opener-shape', entry.target).forEach(svg => {
            setMorphed(svg, true);
            setTimeout(() => setMorphed(svg, false), 900);
          });
        }
      }
    });
  }, { rootMargin: '-45% 0px -54% 0px' });
  pages.forEach(p => io.observe(p));
}

function bindNav() {
  $('#open-drawer').addEventListener('click', openDrawer);
  $('#close-drawer').addEventListener('click', closeDrawer);
  $('#scrim').addEventListener('click', closeDrawer);
  $('#prev-page').addEventListener('click', () => goTo(current - 1));
  $('#next-page').addEventListener('click', () => goTo(current + 1));
  $('#fab').addEventListener('click', () => goTo(current === pages.length - 1 ? 0 : current + 1));
  $$('.toc a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    goTo(pages.indexOf($(a.getAttribute('href'))));
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) { closeDrawer(); return; }
    if (e.target.closest('input, textarea, [role="tablist"], [role="radiogroup"]') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(pages.length - 1); }
  });
  const start = pages.findIndex(p => `#${p.id}` === location.hash);
  if (start > 0) requestAnimationFrame(() => pages[start].scrollIntoView({ block: 'start' }));
}

/* ---------- Matriz elétrica ---------- */
const MATRIX = [
  ['Hidrelétrica', 51.7, 'renovavel', '401,4 TWh'],
  ['Eólica', 15.0, 'renovavel', '116,5 TWh'],
  ['Solar', 11.4, 'renovavel', '88,1 TWh'],
  ['Biomassa', 8.5, 'renovavel', '66,1 TWh'],
  ['Gás natural', 7.6, 'nao', '58,6 TWh'],
  ['Nuclear', 2.0, 'nao', '15,8 TWh'],
  ['Carvão mineral', 1.4, 'nao', '11,2 TWh'],
  ['Derivados de petróleo', 0.9, 'nao', '6,7 TWh'],
  ['Outras', 1.5, 'mista', '11,4 TWh'],
];
const br = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function matrixChart() {
  const list = $('#matrix-bars');
  list.innerHTML = MATRIX.map(([name, v, type, twh]) => `
    <li class="bar ${type}${name === 'Nuclear' ? ' highlight' : ''}" data-type="${type}">
      <span class="bar-name">${name}</span>
      <span class="bar-track"><i style="--v:${v / 51.7}"></i></span>
      <span class="bar-value">${br(v)}%<small>${twh}</small></span>
    </li>`).join('');
  const total = $('#matrix-total');
  const apply = filter => {
    $$('#matrix-chart .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
    let sum = 0;
    $$('.bar', list).forEach(li => {
      const on = filter === 'all' || li.dataset.type === filter;
      li.classList.toggle('dim', !on);
      if (on) sum += MATRIX.find(m => m[0] === $('.bar-name', li).textContent)[1];
    });
    total.textContent = filter === 'all'
      ? 'Renováveis: 86,6% · Não renováveis: 11,9% · Outras (mista): 1,5%'
      : `${filter === 'renovavel' ? 'Renováveis' : 'Não renováveis'} somam ${br(sum)}% da geração.`;
  };
  $$('#matrix-chart .chip').forEach(c => c.addEventListener('click', () => apply(c.dataset.filter)));
  apply('all');
}

/* ---------- Abas acessíveis (etapas do reator e ciclo do urânio) ---------- */
function tabs(container, detail, items) {
  const buttons = $$('[role="tab"]', container);
  const show = i => {
    buttons.forEach((b, j) => {
      b.setAttribute('aria-selected', String(i === j));
      b.tabIndex = i === j ? 0 : -1;
      const path = $('path', b.querySelector('svg'));
      if (path) morph(path, path._r, radii(i === j ? b.querySelector('svg').dataset.shape : 'circle'), 500);
    });
    const [title, text] = items[i];
    detail.innerHTML = `<p class="label">Etapa ${i + 1} de ${items.length}</p><h3 class="title-medium">${title}</h3><p>${text}</p>`;
  };
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => show(i));
    b.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const n = (i + k + buttons.length) % buttons.length;
      buttons[n].focus(); show(n);
    });
  });
  show(0);
}

const REACTOR = [
  ['Fissão no reator', 'Nêutrons dividem núcleos de urânio-235 nas varetas de combustível. Cada fissão libera calor e novos nêutrons. Barras de controle regulam quantas fissões acontecem e podem desligar o reator.'],
  ['Circuito primário', 'A água que passa pelo reator é mantida a cerca de 150 vezes a pressão atmosférica. Assim, passa de 300 °C sem ferver e leva o calor do núcleo até o gerador de vapor.'],
  ['Gerador de vapor', 'O calor atravessa milhares de tubos e aquece a água de um segundo circuito, que vira vapor. As duas águas não se misturam: a do circuito secundário não passa pelo reator.'],
  ['Turbina e gerador', 'O vapor gira as pás de uma turbina ligada a um gerador elétrico. Essa parte da usina funciona como em qualquer termelétrica.'],
  ['Condensador e rede', 'O vapor é resfriado com água do mar, volta a ser líquido e retorna ao gerador de vapor. A eletricidade segue por linhas de 500 kV para o Sistema Interligado Nacional.'],
];

const CYCLE = [
  ['Caetité (BA): mineração', 'O minério é extraído e transformado em concentrado de urânio. Foram 75 toneladas em 2025, contra cerca de 450 consumidas por ano em Angra 1 e 2.'],
  ['Salvador (BA): porto', 'O concentrado percorre mais de 700 km de estrada até o porto. Segundo a CNT, 62,1% das rodovias avaliadas estão em condição regular, ruim ou péssima.'],
  ['Exterior: conversão em gás', 'A conversão é feita fora do país: Canadá, Holanda e, mais recentemente, França já receberam o material. Em 2021, uma remessa foi barrada pela França por falta de aviso prévio.'],
  ['Resende (RJ): enriquecimento e combustível', 'A INB enriquece urânio por ultracentrifugação e fabrica os elementos combustíveis. Desde o fim de 2022, atende até 70% do combustível de Angra 1; o restante é contratado no exterior.'],
  ['Angra dos Reis (RJ): geração', 'Angra 1 e 2 transformam o combustível em eletricidade para o subsistema Sudeste/Centro-Oeste. Com Angra 3, a demanda de urânio subiria para 700 a 900 toneladas por ano.'],
];

/* ---------- Payback ---------- */
const SCENARIOS = [
  { name: 'Conservador', fluxo: 4.67 },
  { name: 'Base', fluxo: 5.80 },
  { name: 'Otimista', fluxo: 6.79 },
];
const REST = 23.9, TOTAL = 35.9;

function payback() {
  const bars = $('#payback-bars');
  bars.innerHTML = SCENARIOS.map((s, i) => `
    <div class="pb-group" data-i="${i}">
      <div class="pb-cols">
        <i class="rest" style="--v:${REST / s.fluxo / 8}"><b>${br(REST / s.fluxo)}</b></i>
        <i class="total" style="--v:${TOTAL / s.fluxo / 8}"><b>${br(TOTAL / s.fluxo)}</b></i>
      </div>
      <span>${s.name}</span>
    </div>`).join('');
  const radios = $$('#payback [role="radio"]');
  const select = i => {
    radios.forEach((r, j) => { r.setAttribute('aria-checked', String(i === j)); r.tabIndex = i === j ? 0 : -1; });
    $$('.pb-group', bars).forEach((g, j) => g.classList.toggle('active', i === j));
    const s = SCENARIOS[i];
    $('#scenario-facts').innerHTML = `
      <div class="hero"><dt>Payback do custo restante</dt><dd>${br(REST / s.fluxo)} anos</dd></div>
      <div><dt>Fluxo líquido anual</dt><dd>R$ ${s.fluxo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} bi</dd></div>
      <div><dt>Payback do custo total</dt><dd>${br(TOTAL / s.fluxo)} anos</dd></div>`;
  };
  radios.forEach((r, i) => {
    r.addEventListener('click', () => select(i));
    r.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const n = (i + k + radios.length) % radios.length;
      radios[n].focus(); select(n);
    });
  });
  select(1);
}

/* ---------- Medidor ondulado (progresso expressivo) ---------- */
function wavyMeters() {
  $$('.wavy-meter').forEach(m => {
    const v = Number(m.dataset.value) / 100;
    const svg = $('svg', m);
    const end = 300 * v;
    let d = 'M4 12';
    for (let x = 4; x <= end - 4; x += 2) d += `L${x} ${(12 + Math.sin(x / 6) * 4).toFixed(2)}`;
    svg.innerHTML = `<path class="track" d="M${Math.min(296, end + 6)} 12H296"/><path class="wave" d="${d}"/><circle class="stop" cx="296" cy="12" r="2"/>`;
    m.setAttribute('role', 'img');
    m.setAttribute('aria-label', $('.meter-label', m).textContent);
  });
}

/* ---------- Países ---------- */
function countries() {
  const chips = $$('#country-filter .chip');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(o => o.setAttribute('aria-pressed', String(o === c)));
    $$('#countries li').forEach(li => li.classList.toggle('dim', c.dataset.filter !== 'all' && li.dataset.group !== c.dataset.filter));
  }));
}

drawShapes();
buildDrawer();
bindNav();
matrixChart();
tabs($('#reactor-steps'), $('#step-detail'), REACTOR);
tabs($('#uranium-cycle'), $('#cycle-detail'), CYCLE);
payback();
wavyMeters();
countries();
bindMorphs();
watchPages();
updateCurrent(0);
