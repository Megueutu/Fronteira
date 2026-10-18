import { matrixData, regionalTariffs, scenarios, calculateScenario, timeline, decimal } from './data.js';
import { citationHTML, visualEvidence } from './citations.js';

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const arrow = back => `<svg class="reader-icon${back ? ' arrow-back' : ''}" aria-hidden="true"><use href="#ui-arrow_forward"/></svg>`;
const header = (eyebrow,title,intro) => `<header class="explorer-heading"><span>${eyebrow}</span><h3>${title}</h3><p>${intro}</p></header>`;

function carouselHTML(kind,title,intro,slides) {
  return `<section class="digital-feature explorer-carousel" data-explorer="carousel" data-carousel-index="0" role="region" aria-roledescription="carrossel" aria-label="${title}">${header(kind,title,intro)}<div class="explorer-track" tabindex="0" aria-label="Use as setas do teclado ou deslize para navegar">${slides.map((slide,i)=>`<article class="explorer-slide" role="group" aria-roledescription="slide" aria-label="${i+1} de ${slides.length}" data-slide-title="${escape(slide.title)}" ${i ? 'inert' : ''}>${slide.html}</article>`).join('')}</div><div class="explorer-carousel-controls"><button type="button" data-carousel-move="-1" aria-label="Item anterior" disabled>${arrow(true)}</button><span class="explorer-carousel-status" role="status" aria-live="polite" aria-atomic="true">1 / ${slides.length} · ${escape(slides[0].title)}</span><button type="button" data-carousel-move="1" aria-label="Próximo item">${arrow(false)}</button></div><div class="explorer-dots" role="group" aria-label="Escolha um item">${slides.map((slide,i)=>`<button type="button" data-carousel-go="${i}" aria-label="${i+1}. ${escape(slide.title)}" aria-pressed="${i===0}"><span></span></button>`).join('')}</div></section>`;
}

function photoCarouselHTML(photos) {
  return carouselHTML('ENSAIO FOTOGRÁFICO','A energia também tem paisagem.','Percorra as fotografias e amplie cada imagem para conhecer seu contexto.', ['angra','grid','wind','construction'].map(key=>{
    const photo=photos[key];
    return {title:photo.title,html:`<figure class="explorer-photo"><button type="button" data-action="image" data-photo-key="${key}" aria-label="Ampliar: ${escape(photo.title)}"><img src="${photo.src}" alt="${escape(photo.caption)}" loading="lazy" decoding="async" draggable="false"><span>Ampliar imagem ↗</span></button><figcaption><h4>${escape(photo.title)}</h4><p>${escape(photo.caption)}</p><div class="claim-source"><strong>Fonte da fotografia:</strong><a href="${photo.url}" target="_blank" rel="noopener noreferrer">${escape(photo.credit)} ↗</a><span class="source-location">Página original da fotografia; contexto e data descritos na legenda.</span><a href="${photo.licenseUrl}" target="_blank" rel="noopener noreferrer">${escape(photo.license)}</a></div></figcaption></figure>`};
  }));
}

function countryCarouselHTML() {
  return carouselHTML('EXPERIÊNCIAS INTERNACIONAIS','Uma escolha, diferentes trajetórias.','Avance pelos seis países. Cada caso mantém sua data e sua fonte histórica.',timeline.map(event=>({title:event.country,html:`<div class="explorer-country"><div class="explorer-country-date"><span>RECORTE HISTÓRICO</span><strong>${escape(event.year)}</strong><h4>${escape(event.country)}</h4></div><div><h5>${escape(event.title)}</h5><p>${escape(event.text)}</p>${citationHTML({kind:'Fonte deste caso',sources:[{id:event.ref}]})}</div></div>`})));
}

function matrixRowsHTML(filter='all', selected='Nuclear') {
  return matrixData.filter(row=>filter==='all' || (filter==='renewable' ? row.renewable===true : row.name==='Nuclear')).map(row=>`<button type="button" class="explorer-matrix-row" data-matrix-source="${escape(row.name)}" aria-pressed="${row.name===selected}"><span>${escape(row.name)}</span><span class="explorer-bar-track" aria-hidden="true"><i style="width:${row.value/51.7*100}%"></i></span><b>${decimal(row.value)}%</b></button>`).join('');
}
function matrixExplorerHTML() {
  return `<section class="digital-feature explorer-matrix" data-explorer="matrix" data-matrix-filter="all" data-matrix-selected="Nuclear" aria-label="Explore a matriz elétrica de 2025">${header('DADOS PARA EXPLORAR','Qual é o espaço de cada fonte?','Filtre o gráfico e escolha uma fonte para ver sua participação na geração brasileira de 2025.')}<div class="explorer-filters" role="group" aria-label="Filtrar fontes da matriz"><button type="button" data-matrix-filter="all" aria-pressed="true">Todas as fontes</button><button type="button" data-matrix-filter="renewable" aria-pressed="false">Renováveis</button><button type="button" data-matrix-filter="nuclear" aria-pressed="false">Nuclear</button></div><div class="explorer-matrix-layout"><div class="explorer-matrix-summary" role="status" aria-live="polite" aria-atomic="true"><span data-matrix-name>Nuclear</span><strong data-matrix-value>2,0<span>%</span></strong><p>da geração nacional em 2025.</p><div class="explorer-share-track" aria-hidden="true"><i data-matrix-share style="width:2%"></i></div><p data-matrix-rest>As demais fontes somam 98,0%.</p></div><div><p class="explorer-axis">Participação na geração · escala de 0 a 51,7%</p><div class="explorer-matrix-rows">${matrixRowsHTML()}</div><p class="explorer-filter-total" role="status">9 fontes neste filtro · 100,0% da geração.</p></div></div><p class="explorer-footnote">O filtro mantém o total nacional como referência e não redimensiona as barras. “Outras” tem classificação mista; o filtro Renováveis reúne as quatro fontes identificadas como renováveis na tabela.</p>${citationHTML(visualEvidence.matrix)}</section>`;
}

export function paybackBarsHTML(scenario={...scenarios[1],investment:23.9}) {
  const remaining=calculateScenario({...scenario,investment:23.9}).years;
  const total=calculateScenario({...scenario,investment:35.9}).years;
  return `<figure class="explorer-payback-chart" aria-label="Compare o retorno do investimento restante e do custo total"><figcaption>Mesmas condições de operação, duas bases de investimento</figcaption>${[[23.9,'Restante · R$ 23,9 bi',remaining],[35.9,'Total do exercício · R$ 35,9 bi',total]].map(([investment,label,years])=>`<div class="explorer-payback-row" data-payback-base="${investment}"><span>${label}</span><div class="explorer-bar-track" aria-hidden="true"><i style="width:${years/30*100}%"></i></div><strong data-payback-years>${decimal(years)} anos</strong></div>`).join('')}<div class="explorer-chart-axis" aria-hidden="true"><span>0</span><span>10</span><span>20</span><span>30 anos</span></div><p>Escala fixa de 0 a 30 anos de operação. Construção e atrasos não entram nesse prazo.</p></figure>`;
}
export function updatePaybackBars(root,scenario) {
  root.querySelectorAll('[data-payback-base]').forEach(row=>{
    const years=calculateScenario({...scenario,investment:Number(row.dataset.paybackBase)}).years;
    row.querySelector('i').style.width=`${years/30*100}%`;
    row.querySelector('[data-payback-years]').textContent=`${decimal(years)} anos`;
  });
}
function paybackExplorerHTML() {
  return `<section class="digital-feature explorer-payback" data-explorer="payback" aria-label="Simulador de payback de Angra 3">${header('LABORATÓRIO DO LEITOR','E se as premissas mudarem?','Mova os controles e observe o efeito no retorno. Os valores são hipóteses do exercício do grupo, de 2025.')}<div class="explorer-presets" role="group" aria-label="Escolha um cenário">${scenarios.map((scenario,i)=>`<button type="button" data-payback-preset="${i}" aria-pressed="${i===1}">${scenario.name}</button>`).join('')}</div><div class="explorer-lab-layout"><div class="explorer-fields"><label>Fator de capacidade <output data-payback-output="capacity">85%</output><input type="range" data-payback-input="capacity" min="50" max="95" step="1" value="85"></label><label>Tarifa assumida <output data-payback-output="tariff">R$ 791,81/MWh</output><input type="range" data-payback-input="tariff" min="500" max="1100" step="0.01" value="791.81"></label><label>Custos operacionais <output data-payback-output="operating">30% da receita</output><input type="range" data-payback-input="operating" min="15" max="60" step="1" value="30"></label><button type="button" class="explorer-reset" data-payback-reset>Restaurar cenário base</button></div><div class="explorer-lab-result"><div class="explorer-result-number" role="status" aria-live="polite" aria-atomic="true"><span>PAYBACK DO INVESTIMENTO RESTANTE</span><strong data-payback-result>4,1 <small>anos</small></strong><p data-payback-cash>Fluxo anual simplificado: R$ 5,80 bilhões.</p></div>${paybackBarsHTML()}</div></div><details class="explorer-method"><summary>Como o cálculo funciona</summary><p>Energia = 1.405 MW × 8.760 horas × fator de capacidade.<br>Fluxo anual = energia × tarifa × (1 − parcela de custos).<br>Payback = investimento ÷ fluxo anual.</p><p>Modelo simples, sem considerar integralmente juros, impostos, financiamento, construção e descomissionamento. Não é orçamento vigente nem previsão de retorno.</p></details>${citationHTML(visualEvidence.payback)}</section>`;
}

function tariffRowsHTML(consumption=1) {
  return regionalTariffs.map(row=>`<div class="explorer-tariff-row" data-tariff-region="${row.region}"><strong>${row.region}</strong><span class="explorer-tariff-values">R$ ${decimal(row.min*consumption,consumption===1?3:2)} – ${decimal(row.max*consumption,consumption===1?3:2)}</span><div class="explorer-tariff-track" aria-hidden="true"><i style="left:${row.min/1.6*100}%;width:${(row.max-row.min)/1.6*100}%"></i></div></div>`).join('');
}
function tariffExplorerHTML() {
  return `<section class="digital-feature explorer-tariffs" data-explorer="tariffs" data-tariff-mode="tariff" aria-label="Compare as faixas de tarifas por região">${header('TARIFAS E TERRITÓRIO','O mesmo consumo, diferentes custos.','Compare os limites regionais reunidos na pesquisa de 2026. Depois, experimente um consumo mensal.')}<div class="explorer-filters" role="group" aria-label="Unidade do gráfico de tarifas"><button type="button" data-tariff-mode="tariff" aria-pressed="true">Tarifa por kWh</button><button type="button" data-tariff-mode="cost" aria-pressed="false">Custo pelo consumo</button></div><div class="explorer-fields explorer-tariff-consumption" hidden><label>Consumo mensal <output data-tariff-output>200 kWh</output><input type="range" data-tariff-consumption min="50" max="500" step="10" value="200"></label></div><figure class="explorer-tariff-chart"><figcaption data-tariff-caption>Faixa entre a menor e a maior tarifa · R$/kWh</figcaption><div class="explorer-tariff-rows" role="status" aria-live="polite" aria-atomic="true">${tariffRowsHTML()}</div><div class="explorer-chart-axis" data-tariff-axis aria-hidden="true">${[0,.4,.8,1.2,1.6].map(v=>`<span>${decimal(v)}</span>`).join('')}</div></figure><p class="explorer-footnote">Cada segmento vai do mínimo ao máximo da compilação; não representa uma média regional. O custo simulado é consumo × tarifa, sem calcular tributos, bandeiras, iluminação pública ou descontos. A compilação de 2026 não substitui a tarifa vigente da sua distribuidora.</p>${citationHTML(visualEvidence.tariffs)}${citationHTML({kind:'Sobre a composição da conta',sources:[{id:'aneel-tariffs'}]})}</section>`;
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

export function explorerHTML(pageId,photos) {
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
function updateLab(root,preset) {
  if (preset) root.querySelectorAll('[data-payback-input]').forEach(input=>{input.value=preset[input.dataset.paybackInput];});
  const values=Object.fromEntries([...root.querySelectorAll('[data-payback-input]')].map(input=>[input.dataset.paybackInput,Number(input.value)]));
  const result=calculateScenario(values);
  root.querySelector('[data-payback-output=capacity]').textContent=`${decimal(values.capacity,0)}%`;
  root.querySelector('[data-payback-output=tariff]').textContent=`R$ ${decimal(values.tariff,2)}/MWh`;
  root.querySelector('[data-payback-output=operating]').textContent=`${decimal(values.operating,0)}% da receita`;
  root.querySelector('[data-payback-result]').innerHTML=`${decimal(result.years)} <small>anos</small>`;
  root.querySelector('[data-payback-cash]').textContent=`Fluxo anual simplificado: R$ ${decimal(result.cash,2)} bilhões.`;
  root.querySelectorAll('[data-payback-preset]').forEach(button=>{
    const scenario=scenarios[Number(button.dataset.paybackPreset)];
    button.setAttribute('aria-pressed',String(['capacity','tariff','operating'].every(key=>scenario[key]===values[key])));
  });
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
    const page=root.closest('.magazine-page');
    if (page && !page.querySelector('.digital-entry')) {
      const button=document.createElement('button'); button.type='button'; button.className='digital-entry';
      button.textContent=root.dataset.explorer==='matrix' ? 'Explore o gráfico ↓' : root.dataset.explorer==='tariffs' ? 'Compare as tarifas ↓' : root.dataset.explorer==='payback' ? 'Experimente o simulador ↓' : root.querySelector('.explorer-photo') ? 'Percorra as fotografias ↓' : 'Compare os países ↓';
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
    const root=event.target.closest('[data-explorer=carousel]');
    if (!root || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const index=event.key==='Home' ? 0 : event.key==='End' ? root.querySelectorAll('.explorer-slide').length-1 : Number(root.dataset.carouselIndex)+(event.key==='ArrowRight'?1:-1);
    setSlide(root,index);
  });
  window.addEventListener('resize',()=>refreshExplorers());
}
