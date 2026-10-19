import { matrixData, regionalTariffs, reactorSteps, fuelSteps, fuelStages, fuelProject, fuelStageInner, scenarios, calculateScenario, timeline, decimal, zoomButton } from './data.js';
import { citationHTML, visualEvidence } from './citations.js';
import { uiIcon } from './icons.js';

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const arrow = back => `<svg class="reader-icon${back ? ' arrow-back' : ''}" aria-hidden="true"><use href="#ui-arrow_forward"/></svg>`;
const header = (eyebrow,title,intro) => `<header class="explorer-heading"><span>${eyebrow}</span><h3>${title}</h3><p>${intro}</p></header>`;

const reactorDrawings = [
  `<circle cx="10" cy="48" r="3.5" fill="currentColor" stroke="none"/>
   <path d="M19 48h17m-5-5 5 5-5 5M42 41l6-6m-6 20 6 6"/>
   <g fill="currentColor" fill-opacity=".14"><circle cx="59" cy="28" r="13"/><circle cx="59" cy="68" r="13"/></g>
   <circle cx="59" cy="28" r="13"/><circle cx="59" cy="68" r="13"/>
   <g fill="currentColor" stroke="none"><circle cx="55" cy="24" r="3"/><circle cx="63" cy="25" r="3"/><circle cx="58" cy="33" r="3"/><circle cx="55" cy="64" r="3"/><circle cx="63" cy="65" r="3"/><circle cx="58" cy="73" r="3"/><circle cx="84" cy="12" r="3"/><circle cx="85" cy="84" r="3"/></g>
   <path d="m72 21 6-5m-6 59 7 5" stroke-dasharray="2 4"/><path d="M40 30v-6m0 48v-6M46 48h6"/>`,
  `<rect x="27" y="17" width="38" height="62" rx="15" fill="currentColor" fill-opacity=".12"/>
   <rect x="27" y="17" width="38" height="62" rx="15"/>
   <path d="M10 64h28V36a8 8 0 0 1 16 0v28h24M10 59v10m68-10v10M46 17V9h16m3 22h15V18m-5 5 5-5 5 5"/>
   <path d="M33 51c4-4 8 4 12 0s8 4 12 0" stroke-width="2"/>
   <path d="M34 83h24"/><path d="M76 43c-4 4 4 7 0 11m8-7c-4 4 4 7 0 11" stroke-width="2"/>`,
  `<path d="M20 25h9l43 13v24L29 75h-9Z" fill="currentColor" fill-opacity=".12"/>
   <path d="M20 25h9l43 13v24L29 75h-9Z"/>
   <path d="M8 50h78m-5-5 5 5-5 5M31 31v38m12-34v30m12-26v22m11-18v14"/>
   <path d="m31 36 7 5v18l-7 5m12-24 6 4v12l-6 4m12-16 5 3v6l-5 3" stroke-width="2"/>
   <path d="M10 28h-5m5 11H3M34 74v8m28-14v14M28 82h41"/>`,
  `<path d="M29 29h32a13 13 0 0 1 13 13v16a13 13 0 0 1-13 13H29a13 13 0 0 1-13-13V42a13 13 0 0 1 13-13Z" fill="currentColor" fill-opacity=".12"/>
   <path d="M29 29h32a13 13 0 0 1 13 13v16a13 13 0 0 1-13 13H29a13 13 0 0 1-13-13V42a13 13 0 0 1 13-13ZM7 50h9M29 71v9m31-9v9M23 80h44M43 29V18h19"/>
   <ellipse cx="61" cy="50" rx="8" ry="20"/>
   <path d="M25 50c4-12 9 12 14 0s9 0 9 0" stroke-width="2.4"/>
   <path d="m82 13-9 15h10l-9 15"/><path d="m57 13 5 5-5 5"/>`,
];
function reactorExplorerHTML() {
  const labels=[['Fissão','Núcleos se dividem'],['Calor','Água recebe energia'],['Vapor e turbina','O calor vira movimento'],['Eletricidade','Gerador e rede']];
  return `<section class="digital-feature reactor-explorer" data-explorer="reactor" data-reactor-active="0" aria-label="Da fissão à eletricidade">${header('UMA ENERGIA, VÁRIAS TRANSFORMAÇÕES','Da fissão à eletricidade.','Selecione uma etapa para acompanhar o caminho da energia.')}<ol class="reactor-stages" aria-label="Etapas da geração nuclear">${labels.map(([label,caption],i)=>`<li><button type="button" data-reactor-step="${i}" aria-pressed="${i===0}"><span class="reactor-stage-number">0${i+1}</span><span class="reactor-drawing"><svg viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${reactorDrawings[i]}</svg></span><strong>${label}</strong><small>${caption}</small></button>${i<3?`<span class="reactor-connector" aria-hidden="true">${arrow(false)}</span>`:''}</li>`).join('')}</ol><div class="reactor-detail" role="status" aria-live="polite" aria-atomic="true"><span class="reactor-detail-number" data-reactor-number>01</span><div><h4 data-reactor-title>${reactorSteps[0][0]}</h4><p data-reactor-description>${reactorSteps[0][1]}</p></div></div><div class="reactor-return"><span>Depois de mover a turbina, o vapor é condensado e a água retorna ao ciclo.</span><button type="button" data-reactor-step="4" aria-pressed="false">Resfriamento e controle ${arrow(true)}</button></div><p class="explorer-footnote">Esquema simplificado de um reator de água pressurizada. A turbina move o gerador, que converte movimento em eletricidade.</p>${citationHTML(visualEvidence.reactor)}</section>`;
}
function updateReactor(root,index) {
  const step=reactorSteps[index]; if(!step) return;
  root.dataset.reactorActive=String(index);
  root.querySelectorAll('[data-reactor-step]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.reactorStep)===index)));
  root.querySelector('[data-reactor-number]').textContent=String(index+1).padStart(2,'0');
  root.querySelector('[data-reactor-title]').textContent=step[0];
  root.querySelector('[data-reactor-description]').textContent=step[1];
}

/* ---------- Ciclo do combustível: infográfico interativo ---------- */
const mapNode = (id,steps,x,y,label,anchor,dx) => `<g class="cy-node" data-map-steps="${steps}" data-map="${id}"><circle cx="${x}" cy="${y}" r="7"/><text x="${x+dx}" y="${y+4}" text-anchor="${anchor}">${label}</text></g>`;
function cycleMapHTML() {
  return `<figure class="cycle-map"><svg viewBox="0 0 320 232" aria-hidden="true" focusable="false">
    <defs><marker id="cy-arrow" class="cy-m" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1l5 3-5 3"/></marker><marker id="cy-arrow-on" class="cy-m cy-m-on" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1l5 3-5 3"/></marker></defs>
    <path class="cy-seg cy-abroad" data-map-steps="1" d="M142 96Q104 100 80 130"/>
    <path class="cy-seg cy-abroad" data-map-steps="2" d="M98 160Q150 192 192 168"/>
    <path class="cy-seg" data-map-steps="4" d="M205 175L248 202"/>
    <g class="cy-tag" data-map-steps="0 1"><circle cx="40" cy="74" r="5"/><text x="50" y="79">yellow cake</text></g>
    <g class="cy-node cy-project" data-map-steps="5" data-map="project"><circle cx="262" cy="30" r="8"/><text x="248" y="27" text-anchor="end">Santa Quitéria (CE)</text><text class="cy-sub" x="248" y="43" text-anchor="end">projeto</text></g>
    ${mapNode('caetite','0',150,92,'Caetité (BA)','start',14)}
    <g class="cy-node cy-abroad-node" data-map-steps="1" data-map="exterior"><rect x="14" y="134" width="90" height="34" rx="17"/><text x="59" y="156" text-anchor="middle">Exterior</text></g>
    ${mapNode('resende','2 3',198,170,'Resende (RJ)','start',14)}
    ${mapNode('angra','4',258,208,'Angra dos Reis (RJ)','end',-14)}
  </svg><figcaption>Mapa esquemático, sem escala: as posições não representam distâncias.</figcaption></figure>`;
}
const cycleItem = index => {
  if (index === 5) return { number: '★', title: fuelProject.name, text: fuelProject.text, extra: '', place: fuelProject.place, operator: fuelProject.operator, state: fuelProject.state, sources: ['itataia'] };
  const stage = fuelStages[index];
  return { number: String(index + 1).padStart(2,'0'), title: fuelSteps[index][0], text: fuelSteps[index][1], extra: stage.extra || '', place: stage.place, operator: stage.operator, state: stage.state, sources: stage.source };
};
function cycleDetailHTML(index) {
  const item = cycleItem(index);
  const sources = item.sources.map(source => Array.isArray(source) ? { id: source[0], location: source[1] } : { id: source });
  return `<span class="cycle-detail-number" aria-hidden="true">${item.number}</span><div><h4 id="step-title">${item.title}</h4><p id="step-text">${item.text}</p>${item.extra ? `<p class="cycle-extra">${item.extra}</p>` : ''}<dl class="cycle-facts"><div><dt>Local</dt><dd>${item.place}</dd></div><div><dt>Quem opera</dt><dd>${item.operator}</dd></div><div><dt>Situação</dt><dd>${item.state}</dd></div></dl>${citationHTML({ kind: 'Fonte', sources })}</div>`;
}
function cycleExplorerHTML() {
  return `<section class="digital-feature cycle-explorer" data-explorer="cycle" data-cycle-active="0" aria-label="Ciclo do combustível nuclear no Brasil">${header('DO MINÉRIO AO REATOR','O caminho do combustível.','Selecione uma etapa, ou percorra o ciclo, para ver onde ela acontece e quem a opera.')}<div class="cycle-toolbar"><button type="button" class="cycle-play" data-cycle-play aria-pressed="false">${uiIcon('play_arrow')}<span>Percorrer o ciclo</span></button><p class="cycle-hint">As setas do teclado também trocam de etapa.</p></div><ol class="fuel-flow" aria-label="Etapas do ciclo do combustível">${fuelSteps.map((_,i)=>`<li class="fuel-stage" data-status="${fuelStages[i].status}"><button type="button" class="fuel-card" data-step="${i}" aria-pressed="${i===0}">${fuelStageInner(i)}</button></li>`).join('')}</ol><div class="fuel-notes"><p class="fuel-cake"><i class="cake-dot" aria-hidden="true"></i><span><strong>Yellow cake</strong> · etapa 1 → 2. Pó amarelado, rico em U3O8; ainda não é combustível.</span></p><button type="button" class="fuel-project" data-step="5" aria-pressed="false"><span><strong>Santa Quitéria (Itataia, CE)</strong> · projeto que pode ampliar a oferta; reserva não é produção nem combustível.</span>${arrow(false)}</button></div><div class="cycle-body">${cycleMapHTML()}<div class="cycle-detail" role="status" aria-live="polite" aria-atomic="true">${cycleDetailHTML(0)}</div></div></section>`;
}
const cycleTimers = new WeakMap();
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function cyclePlayState(root,playing) {
  const button = root.querySelector('[data-cycle-play]'), detail = root.querySelector('.cycle-detail');
  button.setAttribute('aria-pressed',String(playing));
  button.innerHTML = `${uiIcon(playing ? 'pause' : 'play_arrow')}<span>${playing ? 'Pausar' : reducedMotion() ? 'Próxima etapa' : 'Percorrer o ciclo'}</span>`;
  detail.setAttribute('aria-live',playing ? 'off' : 'polite');
}
function stopCycle(root) {
  if (!cycleTimers.has(root)) return;
  clearInterval(cycleTimers.get(root)); cycleTimers.delete(root); cyclePlayState(root,false);
}
function updateCycle(root,index) {
  const last = fuelSteps.length - 1, active = Math.max(0,Math.min(5,index));
  root.dataset.cycleActive = String(active);
  root.querySelectorAll('[data-step]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.step) === active)));
  root.querySelectorAll('[data-map-steps]').forEach(node => node.classList.toggle('is-active',node.dataset.mapSteps.split(' ').includes(String(active))));
  root.querySelector('.cycle-detail').innerHTML = cycleDetailHTML(active);
  if (active >= last) stopCycle(root);
}
function toggleCycle(root) {
  if (cycleTimers.has(root)) { stopCycle(root); return; }
  const last = fuelSteps.length - 1, current = Number(root.dataset.cycleActive);
  if (reducedMotion()) { updateCycle(root,current >= last ? 0 : current + 1); return; }
  if (current >= last) updateCycle(root,0);
  cyclePlayState(root,true);
  cycleTimers.set(root,setInterval(() => {
    if (!root.isConnected) { stopCycle(root); return; }
    updateCycle(root,Number(root.dataset.cycleActive) + 1);
  },2800));
}

function carouselHTML(kind,title,intro,slides) {
  return `<section class="digital-feature explorer-carousel" data-explorer="carousel" data-carousel-index="0" role="region" aria-roledescription="carrossel" aria-label="${title}">${header(kind,title,intro)}<div class="explorer-track" tabindex="0" aria-label="Use as setas do teclado ou deslize para navegar">${slides.map((slide,i)=>`<article class="explorer-slide" role="group" aria-roledescription="slide" aria-label="${i+1} de ${slides.length}" data-slide-title="${escape(slide.title)}" ${i ? 'inert' : ''}>${slide.html}</article>`).join('')}</div><div class="explorer-carousel-controls"><button type="button" data-carousel-move="-1" aria-label="Item anterior" disabled>${arrow(true)}</button><span class="explorer-carousel-status" role="status" aria-live="polite" aria-atomic="true">1 / ${slides.length} · ${escape(slides[0].title)}</span><button type="button" data-carousel-move="1" aria-label="Próximo item">${arrow(false)}</button></div><div class="explorer-dots" role="group" aria-label="Escolha um item">${slides.map((slide,i)=>`<button type="button" data-carousel-go="${i}" aria-label="${i+1}. ${escape(slide.title)}" aria-pressed="${i===0}"><span></span></button>`).join('')}</div></section>`;
}

function photoCarouselHTML(photos) {
  return carouselHTML('ENSAIO FOTOGRÁFICO','A energia também tem paisagem.','Percorra as fotografias e amplie cada imagem para conhecer seu contexto.', ['angra','grid','wind','construction'].map(key=>{
    const photo=photos[key];
    return {title:photo.title,html:`<figure class="explorer-photo"><button type="button" data-action="image" data-photo-key="${key}" aria-label="Ampliar: ${escape(photo.title)}"><img src="${photo.src}" alt="${escape(photo.caption)}" loading="lazy" decoding="async" draggable="false"><span class="photo-expand" aria-hidden="true">${uiIcon("open_in_full")}</span></button><figcaption><h4>${escape(photo.title)}</h4><p>${escape(photo.caption)}</p><div class="claim-source"><strong>Fonte da fotografia:</strong><a href="${photo.url}" target="_blank" rel="noopener noreferrer">${escape(photo.credit)} ↗</a><span class="source-location">Página original da fotografia; contexto e data descritos na legenda.</span><a href="${photo.licenseUrl}" target="_blank" rel="noopener noreferrer">${escape(photo.license)}</a></div></figcaption></figure>`};
  }));
}

function countryCarouselHTML() {
  return carouselHTML('EXPERIÊNCIAS INTERNACIONAIS','Uma escolha, diferentes trajetórias.','Avance pelos seis países. Cada caso mantém sua data e sua fonte histórica.',timeline.map(event=>({title:event.country,html:`<div class="explorer-country"><div class="explorer-country-date"><span>RECORTE HISTÓRICO</span><strong>${escape(event.year)}</strong><h4>${escape(event.country)}</h4></div><div><h5>${escape(event.title)}</h5><p>${escape(event.text)}</p>${citationHTML({kind:'Fonte deste caso',sources:[{id:event.ref}]})}</div></div>`})));
}

function matrixRowsHTML(filter='all', selected='Nuclear') {
  return matrixData.filter(row=>filter==='all' || (filter==='renewable' ? row.renewable===true : row.name==='Nuclear')).map(row=>`<button type="button" class="explorer-matrix-row" data-matrix-source="${escape(row.name)}" aria-pressed="${row.name===selected}"><span>${escape(row.name)}</span><span class="explorer-bar-track" aria-hidden="true"><i style="width:${row.value/51.7*100}%"></i></span><b>${decimal(row.value)}%</b></button>`).join('');
}
function matrixExplorerHTML() {
  return `<section class="digital-feature explorer-matrix" data-explorer="matrix" data-matrix-filter="all" data-matrix-selected="Nuclear" data-zoom-target data-zoom-title="Matriz elétrica brasileira, 2025" aria-label="Explore a matriz elétrica de 2025">${header('DADOS PARA EXPLORAR','Qual é o espaço de cada fonte?','Filtre o gráfico e escolha uma fonte para ver sua participação na geração brasileira de 2025.')}<div class="explorer-toolbar"><div class="explorer-filters" role="group" aria-label="Filtrar fontes da matriz"><button type="button" data-matrix-filter="all" aria-pressed="true">Todas as fontes</button><button type="button" data-matrix-filter="renewable" aria-pressed="false">Renováveis</button><button type="button" data-matrix-filter="nuclear" aria-pressed="false">Nuclear</button></div>${zoomButton('matriz elétrica brasileira, 2025')}</div><div class="explorer-matrix-layout"><div class="explorer-matrix-summary" role="status" aria-live="polite" aria-atomic="true"><span data-matrix-name>Nuclear</span><strong data-matrix-value>2,0<span>%</span></strong><p>da geração nacional em 2025.</p><div class="explorer-share-track" aria-hidden="true"><i data-matrix-share style="width:2%"></i></div><p data-matrix-rest>As demais fontes somam 98,0%.</p></div><div><p class="explorer-axis">Participação na geração · escala de 0 a 51,7%</p><div class="explorer-matrix-rows">${matrixRowsHTML()}</div><p class="explorer-filter-total" role="status">9 fontes neste filtro · 100,0% da geração.</p></div></div><p class="explorer-footnote">O filtro mantém o total nacional como referência e não redimensiona as barras. “Outras” tem classificação mista; o filtro Renováveis reúne as quatro fontes identificadas como renováveis na tabela.</p>${citationHTML(visualEvidence.matrix)}</section>`;
}

export function paybackBarsHTML(scenario={...scenarios[1],investment:23.9}) {
  const remaining=calculateScenario({...scenario,investment:23.9}).years;
  const total=calculateScenario({...scenario,investment:35.9}).years;
  return `<figure class="explorer-payback-chart" data-zoom-target data-zoom-title="Payback: investimento restante e total" aria-label="Compare o retorno do investimento restante e do custo total"><figcaption><span>Mesmas condições de operação, duas bases de investimento</span>${zoomButton('payback do investimento restante e do total')}</figcaption>${[[23.9,'Restante · R$ 23,9 bi',remaining],[35.9,'Total do exercício · R$ 35,9 bi',total]].map(([investment,label,years])=>`<div class="explorer-payback-row" data-payback-base="${investment}"><span>${label}</span><div class="explorer-bar-track" aria-hidden="true"><i style="width:${years/30*100}%"></i></div><strong data-payback-years>${decimal(years)} anos</strong></div>`).join('')}<div class="explorer-chart-axis" aria-hidden="true"><span>0</span><span>10</span><span>20</span><span>30 anos</span></div><p>Escala fixa de 0 a 30 anos de operação. Construção e atrasos não entram nesse prazo.</p></figure>`;
}
export function updatePaybackBars(root,scenario) {
  root.querySelectorAll('[data-payback-base]').forEach(row=>{
    const years=calculateScenario({...scenario,investment:Number(row.dataset.paybackBase)}).years;
    row.querySelector('i').style.width=`${years/30*100}%`;
    row.querySelector('[data-payback-years]').textContent=`${decimal(years)} anos`;
  });
}
function paybackFieldHTML(key,label,min,max,step,value,scale,help) {
  return `<div class="explorer-field"><div class="explorer-field-head"><label for="payback-${key}">${label}</label><output for="payback-${key}" data-payback-output="${key}"></output></div><p class="explorer-help" id="payback-help-${key}">${help}</p><input id="payback-${key}" type="range" data-payback-input="${key}" min="${min}" max="${max}" step="${step}" value="${value}" aria-describedby="payback-help-${key}"><div class="explorer-range-scale" aria-hidden="true"><span>${scale[0]}</span><span>${scale[1]}</span></div><p class="explorer-effect" data-payback-effect="${key}"></p></div>`;
}
function paybackExplorerHTML() {
  const base=scenarios[1];
  return `<section class="digital-feature explorer-payback" data-explorer="payback" aria-label="Simulador de payback de Angra 3">${header('LABORATÓRIO DO LEITOR','E se as premissas mudarem?','Escolha um cenário ou mova os controles: o resultado e a leitura abaixo mudam junto. Os valores são hipóteses do exercício do grupo, de 2025.')}<div class="explorer-scenario-bar"><div class="explorer-presets" role="group" aria-label="Escolha um cenário">${scenarios.map((scenario,i)=>`<button type="button" data-payback-preset="${i}" aria-pressed="${i===1}">${uiIcon('check')}<span>${scenario.name}</span></button>`).join('')}</div><span class="explorer-custom" data-payback-custom hidden>Cenário personalizado</span><button type="button" class="explorer-reset" data-payback-reset>Redefinir para o Base</button></div><div class="explorer-lab-layout"><div class="explorer-result-number" role="status" aria-live="polite" aria-atomic="true"><span>PAYBACK · RETORNO DO INVESTIMENTO RESTANTE</span><strong data-payback-result>4,1 <small>anos</small></strong><p class="explorer-delta" data-payback-delta></p><p class="explorer-sentence" data-payback-sentence></p><p data-payback-cash>Fluxo anual simplificado: R$ 5,80 bilhões.</p></div><div class="explorer-fields">${paybackFieldHTML('capacity','Fator de capacidade',50,95,1,base.capacity,['50%','95%'],'Parte do ano em que a usina gera na potência máxima. Quanto maior, mais energia é vendida.')}${paybackFieldHTML('tariff','Tarifa assumida',500,1100,.01,base.tariff,['R$ 500','R$ 1.100'],'Preço de venda da energia, em reais por megawatt-hora (MWh). Quanto maior, mais receita por ano.')}${paybackFieldHTML('operating','Custos operacionais',15,60,1,base.operating,['15%','60%'],'Parte da receita gasta para operar a usina. Quanto maior, menos sobra para recuperar o investimento.')}</div><div class="explorer-lab-bars">${paybackBarsHTML()}</div></div><details class="explorer-method"><summary>Como o cálculo funciona</summary><p>Energia = 1.405 MW × 8.760 horas × fator de capacidade.<br>Fluxo anual = energia × tarifa × (1 − parcela de custos).<br>Payback = investimento ÷ fluxo anual.</p><p>Modelo simples, sem considerar integralmente juros, impostos, financiamento, construção e descomissionamento. Não é orçamento vigente nem previsão de retorno.</p></details>${citationHTML(visualEvidence.payback)}</section>`;
}

function tariffRowsHTML(consumption=1) {
  return regionalTariffs.map(row=>`<div class="explorer-tariff-row" data-tariff-region="${row.region}"><strong>${row.region}</strong><span class="explorer-tariff-values">R$ ${decimal(row.min*consumption,consumption===1?3:2)} – ${decimal(row.max*consumption,consumption===1?3:2)}</span><div class="explorer-tariff-track" aria-hidden="true"><i style="left:${row.min/1.6*100}%;width:${(row.max-row.min)/1.6*100}%"></i></div></div>`).join('');
}
function tariffExplorerHTML() {
  return `<section class="digital-feature explorer-tariffs" data-explorer="tariffs" data-tariff-mode="tariff" data-zoom-target data-zoom-title="Tarifas de energia por região" aria-label="Compare as faixas de tarifas por região">${header('TARIFAS E TERRITÓRIO','O mesmo consumo, diferentes custos.','Compare os limites regionais reunidos na pesquisa de 2026. Depois, experimente um consumo mensal.')}<div class="explorer-toolbar"><div class="explorer-filters" role="group" aria-label="Unidade do gráfico de tarifas"><button type="button" data-tariff-mode="tariff" aria-pressed="true">Tarifa por kWh</button><button type="button" data-tariff-mode="cost" aria-pressed="false">Custo pelo consumo</button></div>${zoomButton('tarifas de energia por região')}</div><div class="explorer-fields explorer-tariff-consumption" hidden><label>Consumo mensal <output data-tariff-output>200 kWh</output><input type="range" data-tariff-consumption min="50" max="500" step="10" value="200"></label></div><figure class="explorer-tariff-chart"><figcaption data-tariff-caption>Faixa entre a menor e a maior tarifa · R$/kWh</figcaption><div class="explorer-tariff-rows" role="status" aria-live="polite" aria-atomic="true">${tariffRowsHTML()}</div><div class="explorer-chart-axis" data-tariff-axis aria-hidden="true">${[0,.4,.8,1.2,1.6].map(v=>`<span>${decimal(v)}</span>`).join('')}</div></figure><p class="explorer-footnote">Cada segmento vai do mínimo ao máximo da compilação; não representa uma média regional. O custo simulado é consumo × tarifa, sem calcular tributos, bandeiras, iluminação pública ou descontos. A compilação de 2026 não substitui a tarifa vigente da sua distribuidora.</p>${citationHTML(visualEvidence.tariffs)}${citationHTML({kind:'Sobre a composição da conta',sources:[{id:'aneel-tariffs'}]})}</section>`;
}
function updateTariffs(root,mode=root.dataset.tariffMode) {
  const consumption=mode==='cost'?Number(root.querySelector('[data-tariff-consumption]').value):1;
  root.dataset.tariffMode=mode;
  root.querySelectorAll('button[data-tariff-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tariffMode===mode)));
  root.querySelector('.explorer-tariff-consumption').hidden=mode!=='cost';
  root.querySelector('[data-tariff-output]').textContent=`${consumption} kWh`;
  root.querySelector('[data-tariff-caption]').textContent=mode==='cost'?`Custo para ${consumption} kWh · R$ · consumo × tarifa`:'Faixa entre a menor e a maior tarifa · R$/kWh';
  root.querySelector('.explorer-tariff-rows').innerHTML=tariffRowsHTML(consumption);
  root.querySelector('[data-tariff-axis]').innerHTML=[0,.4,.8,1.2,1.6].map(v=>`<span>${decimal(v*consumption,mode==='cost'?0:1)}</span>`).join('');
}

export { cycleExplorerHTML };
export function explorerHTML(pageId,photos) {
  if (pageId==='reactor') return reactorExplorerHTML();
  if (pageId==='uranium') return cycleExplorerHTML();
  if (pageId==='unequal') return photoCarouselHTML(photos);
  if (pageId==='matrix') return matrixExplorerHTML();
  if (pageId==='payback') return paybackExplorerHTML();
  if (pageId==='world') return countryCarouselHTML();
  if (pageId==='who-pays') return tariffExplorerHTML();
  return '';
}

function updateMatrix(root, filter, selected) {
  const rows=matrixData.filter(row=>filter==='all' || (filter==='renewable' ? row.renewable===true : row.name==='Nuclear'));
  const source=rows.find(row=>row.name===selected) || rows[0];
  root.dataset.matrixFilter=filter; root.dataset.matrixSelected=source.name;
  root.querySelectorAll('button[data-matrix-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.matrixFilter===filter)));
  root.querySelector('.explorer-matrix-rows').innerHTML=matrixRowsHTML(filter,source.name);
  root.querySelector('[data-matrix-name]').textContent=source.name;
  root.querySelector('[data-matrix-value]').innerHTML=`${decimal(source.value)}<span>%</span>`;
  root.querySelector('[data-matrix-share]').style.width=`${source.value}%`;
  root.querySelector('[data-matrix-rest]').textContent=`As demais fontes somam ${decimal(100-source.value)}%.`;
  root.querySelector('.explorer-filter-total').textContent=`${rows.length} ${rows.length===1?'fonte':'fontes'} neste filtro · ${decimal(rows.reduce((sum,row)=>sum+row.value,0))}% da geração.`;
}
const plural=value=>value<=1?'ano':'anos';
function paybackDelta(diff) {
  const rounded=Math.round(diff*10)/10;
  return rounded===0 ? {kind:'flat',arrow:'=',years:0} : {kind:rounded>0?'slower':'faster',arrow:rounded>0?'↑':'↓',years:Math.abs(rounded)};
}
function updateLab(root,preset) {
  if (preset) root.querySelectorAll('[data-payback-input]').forEach(input=>{input.value=preset[input.dataset.paybackInput];});
  const base=scenarios[1],baseYears=calculateScenario(base).years;
  const values=Object.fromEntries([...root.querySelectorAll('[data-payback-input]')].map(input=>[input.dataset.paybackInput,Number(input.value)]));
  const result=calculateScenario(values);
  const units={capacity:v=>`${decimal(v,0)}%`,tariff:v=>`R$ ${decimal(v,2)}/MWh`,operating:v=>`${decimal(v,0)}% da receita`};
  const basics={capacity:v=>`${decimal(v,0)}%`,tariff:v=>`R$ ${decimal(v,2)}`,operating:v=>`${decimal(v,0)}%`};
  for (const key of Object.keys(units)) {
    root.querySelector(`[data-payback-output=${key}]`).textContent=units[key](values[key]);
    const effect=root.querySelector(`[data-payback-effect=${key}]`),change=paybackDelta(calculateScenario({...base,[key]:values[key]}).years-baseYears);
    effect.dataset.effect=change.kind;
    effect.innerHTML=change.kind==='flat' ? `<span aria-hidden="true">=</span> Igual ao cenário Base (${basics[key](base[key])}).` : `<span aria-hidden="true">${change.arrow}</span> Sozinha, esta mudança ${change.kind==='slower'?'soma':'tira'} ${decimal(change.years)} ${plural(change.years)} do retorno (Base: ${basics[key](base[key])}).`;
  }
  root.querySelector('[data-payback-result]').innerHTML=`${decimal(result.years)} <small>anos</small>`;
  const total=paybackDelta(result.years-baseYears),delta=root.querySelector('[data-payback-delta]');
  delta.dataset.effect=total.kind;
  delta.innerHTML=total.kind==='flat' ? '<span aria-hidden="true">=</span> Igual ao cenário Base.' : `<span aria-hidden="true">${total.arrow}</span> ${decimal(total.years)} ${plural(total.years)} ${total.kind==='slower'?'a mais':'a menos'} que o cenário Base (${decimal(baseYears)} anos).`;
  root.querySelector('[data-payback-sentence]').textContent=`Com fator de capacidade de ${decimal(values.capacity,0)}%, tarifa de R$ ${decimal(values.tariff,2)}/MWh e custos operacionais de ${decimal(values.operating,0)}% da receita, o investimento restante volta em cerca de ${decimal(result.years)} anos de operação, sem contar construção e atrasos.`;
  root.querySelector('[data-payback-cash]').textContent=`Receita anual de R$ ${decimal(result.revenue,2)} bilhões; fluxo anual simplificado, depois dos custos: R$ ${decimal(result.cash,2)} bilhões.`;
  let matched=false;
  root.querySelectorAll('[data-payback-preset]').forEach(button=>{
    const scenario=scenarios[Number(button.dataset.paybackPreset)],active=['capacity','tariff','operating'].every(key=>scenario[key]===values[key]);
    matched||=active;
    button.setAttribute('aria-pressed',String(active));
  });
  root.querySelector('[data-payback-custom]').hidden=matched;
  updatePaybackBars(root,values);
}
function setSlide(root,index,scroll=true) {
  const track=root.querySelector('.explorer-track'),slides=[...track.children];
  const current=Math.max(0,Math.min(slides.length-1,index));
  const focused=document.activeElement;
  const previous=root.querySelector('[data-carousel-move="-1"]'), next=root.querySelector('[data-carousel-move="1"]');
  if (track.contains(focused) && focused.closest('.explorer-slide') && focused.closest('.explorer-slide')!==slides[current]) track.focus({preventScroll:true});
  root.dataset.carouselIndex=String(current);
  slides.forEach((slide,i)=>{slide.inert=i!==current;});
  previous.disabled=current===0; next.disabled=current===slides.length-1;
  if (focused===next && next.disabled) previous.focus({preventScroll:true});
  if (focused===previous && previous.disabled) next.focus({preventScroll:true});
  root.querySelectorAll('[data-carousel-go]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.carouselGo)===current)));
  root.querySelector('.explorer-carousel-status').textContent=`${current+1} / ${slides.length} · ${slides[current].dataset.slideTitle}`;
  if (scroll && track.clientWidth) track.scrollTo({left:current*track.clientWidth,behavior:'instant'});
}
export function refreshExplorers(container=document) {
  container.querySelectorAll('[data-explorer]').forEach(root=>{
    if (root.dataset.explorer==='carousel') setSlide(root,Number(root.dataset.carouselIndex));
    if (root.dataset.explorer==='payback') updateLab(root);
    if (root.dataset.explorer==='cycle') { updateCycle(root,Number(root.dataset.cycleActive)); cyclePlayState(root,cycleTimers.has(root)); }
    const page=root.closest('.magazine-page');
    if (page && !page.querySelector('.digital-entry')) {
      const button=document.createElement('button'); button.type='button'; button.className='digital-entry';
      const label=root.dataset.explorer==='reactor' ? 'Explore o caminho da energia' : root.dataset.explorer==='cycle' ? 'Percorra o ciclo do combustível' : root.dataset.explorer==='matrix' ? 'Explore o gráfico' : root.dataset.explorer==='tariffs' ? 'Compare as tarifas' : root.dataset.explorer==='payback' ? 'Experimente o simulador' : root.querySelector('.explorer-photo') ? 'Percorra as fotografias' : 'Compare os países';
      button.innerHTML=`<span>${label}</span>${uiIcon('arrow_downward')}`;
      page.querySelector('.page-subtitle').after(button);
    }
  });
}
export function createExplorers() {
  document.addEventListener('click',event=>{
    const entry=event.target.closest('.digital-entry');
    if (entry) {
      const widget=entry.closest('.magazine-page').querySelector('[data-explorer]');
      widget.scrollIntoView({block:'start',behavior:'instant'});
      (widget.querySelector('.explorer-track') || widget.querySelector('button,input')).focus({preventScroll:true});
      return;
    }
    const root=event.target.closest('[data-explorer]'); if (!root) return;
    const cycleStep=event.target.closest('[data-step]'); if (cycleStep && root.dataset.explorer==='cycle') { stopCycle(root); updateCycle(root,Number(cycleStep.dataset.step)); }
    if (event.target.closest('[data-cycle-play]')) toggleCycle(root);
    const reactorStep=event.target.closest('[data-reactor-step]'); if(reactorStep) updateReactor(root,Number(reactorStep.dataset.reactorStep));
    const tariffMode=event.target.closest('button[data-tariff-mode]'); if (tariffMode) updateTariffs(root,tariffMode.dataset.tariffMode);
    const filter=event.target.closest('button[data-matrix-filter]');
    if (filter) updateMatrix(root,filter.dataset.matrixFilter,root.dataset.matrixSelected);
    const source=event.target.closest('[data-matrix-source]');
    if (source) { const name=source.dataset.matrixSource; updateMatrix(root,root.dataset.matrixFilter,name); [...root.querySelectorAll('[data-matrix-source]')].find(button=>button.dataset.matrixSource===name)?.focus({preventScroll:true}); }
    const preset=event.target.closest('[data-payback-preset]'); if (preset) updateLab(root,scenarios[Number(preset.dataset.paybackPreset)]);
    if (event.target.closest('[data-payback-reset]')) updateLab(root,scenarios[1]);
    const move=event.target.closest('[data-carousel-move]'); if (move) setSlide(root,Number(root.dataset.carouselIndex)+Number(move.dataset.carouselMove));
    const go=event.target.closest('[data-carousel-go]'); if (go) setSlide(root,Number(go.dataset.carouselGo));
  });
  document.addEventListener('input',event=>{
    if (event.target.matches('[data-payback-input]')) updateLab(event.target.closest('[data-explorer=payback]'));
    if (event.target.matches('[data-tariff-consumption]')) updateTariffs(event.target.closest('[data-explorer=tariffs]'));
  });
  document.addEventListener('scroll',event=>{
    if (!event.target.matches?.('.explorer-track') || !event.target.clientWidth) return;
    const root=event.target.closest('[data-explorer=carousel]');
    const index=Math.round(event.target.scrollLeft/event.target.clientWidth);
    if (Number(root.dataset.carouselIndex)!==index) setSlide(root,index,false);
  },true);
  document.addEventListener('keydown',event=>{
    const reactor=event.target.closest('[data-explorer=reactor]');
    if (reactor && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key) && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const current=Number(event.target.closest('[data-reactor-step]')?.dataset.reactorStep ?? reactor.dataset.reactorActive);
      const index=event.key==='Home'?0:event.key==='End'?4:Math.max(0,Math.min(4,current+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)));
      updateReactor(reactor,index);reactor.querySelector(`[data-reactor-step="${index}"]`).focus({preventScroll:true});return;
    }
    const cycle=event.target.closest('[data-explorer=cycle]');
    if (cycle && event.target.closest('[data-step]') && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key) && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const current=Math.min(4,Number(event.target.closest('[data-step]').dataset.step));
      const index=event.key==='Home'?0:event.key==='End'?4:Math.max(0,Math.min(4,current+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)));
      stopCycle(cycle);updateCycle(cycle,index);cycle.querySelector(`.fuel-flow [data-step="${index}"]`).focus({preventScroll:true});return;
    }
    const root=event.target.closest('[data-explorer=carousel]');
    if (!root || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const index=event.key==='Home' ? 0 : event.key==='End' ? root.querySelectorAll('.explorer-slide').length-1 : Number(root.dataset.carouselIndex)+(event.key==='ArrowRight'?1:-1);
    setSlide(root,index);
  });
  window.addEventListener('resize',()=>refreshExplorers());
}
