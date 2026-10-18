import { pages, pageHTML, photos, artworks, chapters, references, referenceHTML, escapeHTML, teamMembers, teamHTML, interviewPhotos, interviewHTML, interviewEntryHTML } from './content.js';
import { chartHTML, fuelSteps, reactorSteps, calculateScenario, scenarios, timeline, timelineHTML, decimal } from './data.js';
import { citationHTML, visualEvidence, sourcePanelHTML, pageSourceRecords, sourceCardsHTML } from './citations.js';
import { paybackBarsHTML, updatePaybackBars, refreshExplorers } from './explorers.js';

export function createInteractions(onJump) {
  const dialog = document.querySelector('#interaction-dialog');
  const content = document.querySelector('#dialog-content');
  const closeButton = document.querySelector('#close-dialog');
  let origin, history = [], gallery = null, slideIndex = 0;
  const photoHTML = art => `<figure class="expanded-photo"><img src="${art.src}" alt="${escapeHTML(art.caption)}"><figcaption>${escapeHTML(art.caption)}<br><a href="${art.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(art.credit)} ↗</a> · <a href="${art.licenseUrl}" target="_blank" rel="noopener noreferrer">${escapeHTML(art.license)}</a></figcaption></figure>`;
  function setSlide(index) {
    slideIndex = (index + gallery.length) % gallery.length;
    content.querySelector('#gallery-photo').innerHTML = photoHTML(gallery[slideIndex]);
    content.querySelector('#slide-status').textContent = `${slideIndex + 1} / ${gallery.length}`;
  }
  function stepsHTML(steps) {
    return `<div class="step-tabs" role="group" aria-label="Escolha uma etapa">${steps.map((step, i) => `<button type="button" data-step="${i}" aria-pressed="${i === 0}"><span>${i + 1}</span>${step[0]}</button>`).join('')}</div><div class="step-detail" role="status"><h3 id="step-title">${steps[0][0]}</h3><p id="step-text">${steps[0][1]}</p></div>`;
  }
  const flowHTML = items => `<ol class="reading-flow">${items.map(item=>`<li>${item}</li>`).join('')}</ol>`;
  let currentSteps = [], scenario = { ...scenarios[1], investment: 23.9 };
  function scenarioHTML() {
    return `<p class="dialog-intro">Um exercício didático com as hipóteses da pesquisa do grupo. Não é orçamento vigente, proposta de tarifa ou previsão financeira.</p><div class="scenario-presets" role="group" aria-label="Cenário">${scenarios.map((s, i) => `<button type="button" data-scenario="${i}" aria-pressed="${i === 1}">${s.name}</button>`).join('')}</div><div class="calculator-grid"><div class="calculator-fields"><label>Fator de capacidade <output id="capacity-value">85%</output><input id="capacity" type="range" min="50" max="95" value="85" step="1"></label><label>Tarifa assumida <output id="tariff-value">R$ 791,81/MWh</output><input id="tariff" type="range" min="500" max="1100" value="791.81" step="0.01"></label><label>Custos operacionais <output id="operating-value">30% da receita</output><input id="operating" type="range" min="15" max="60" value="30" step="1"></label><label>Base de investimento<select id="investment"><option value="23.9">Restante · R$ 23,9 bilhões</option><option value="35.9">Total do exercício · R$ 35,9 bilhões</option></select></label></div><div class="calculator-result" role="status" aria-live="polite"><span>PAYBACK SIMPLES</span><strong id="result-years"></strong><span>anos de operação</span><p id="result-cash"></p></div></div><p class="calculation-method">Energia = 1.405 MW × 8.760 h × fator de capacidade.<br>Fluxo anual = energia × tarifa × (1 − parcela de custos).<br>Payback = investimento ÷ fluxo anual.</p><p class="source-note">Sem considerar integralmente juros, impostos, construção, financiamento, descomissionamento e cronograma. As hipóteses monetárias são nominais e pertencem ao exercício escolar de 2025.</p>`;
  }
  function updateScenario() {
    const result = calculateScenario(scenario);
    for (const key of ['capacity','tariff','operating','investment']) content.querySelector(`#${key}`).value = scenario[key];
    content.querySelector('#capacity-value').textContent = `${decimal(scenario.capacity,0)}%`;
    content.querySelector('#tariff-value').textContent = `R$ ${decimal(scenario.tariff,2)}/MWh`;
    content.querySelector('#operating-value').textContent = `${decimal(scenario.operating,0)}% da receita`;
    content.querySelector('#result-years').textContent = decimal(result.years);
    content.querySelector('#result-cash').textContent = `Fluxo anual simplificado: R$ ${decimal(result.cash,2)} bilhões. Geração: ${decimal(result.generation / 1e6,2)} milhões de MWh/ano.`;
    updatePaybackBars(content,scenario);
  }
  function open(type, pageIndex = 0, trigger, pushHistory = true) {
    const page = pages[pageIndex] || pages[0];
    if (dialog.open && pushHistory) history.push({ nodes: [...content.childNodes], className: dialog.className, scroll: dialog.scrollTop, trigger, gallery, slideIndex, currentSteps, scenario: { ...scenario } });
    if (!dialog.open) origin = trigger || document.activeElement;
    gallery = null;
    dialog.className = ['linear','read'].includes(type) ? 'reading-dialog' : type === 'interview' ? 'interview-dialog' : '';
    let title = '', markup = '';
    if (type === 'index') {
      title = 'Escolha por onde começar.';
      markup = `<nav class="dialog-index" aria-label="Sumário">${chapters.map(ch => `<button type="button" data-jump="${ch.page}"><b>${String(ch.page + 1).padStart(2,'0')}</b><span>${ch.title}<small>${ch.detail}</small></span><i aria-hidden="true">↗</i></button>`).join('')}</nav><details><summary>Fluxograma da revista</summary>${flowHTML(['Capa, sumário e editorial','Panorama: matriz, território e desigualdade','Tecnologia: funcionamento, segurança e resíduos','Urânio: ciclo, soberania e Wallerstein','Custo: premissas, payback e distribuição','Política: Messmer, experiências internacionais e Weber','Balanço, uso de IA e referências'])}</details>`;
      markup += interviewEntryHTML();
    } else if (type === 'interview') {
      title = 'Conversa com Adolfo Braid';
      markup = interviewHTML();
    } else if (type === 'member') {
      const member = teamMembers.find(item => item.id === trigger?.dataset.member);
      if (!member) return;
      title = member.name;
      markup = `<figure class="expanded-photo member-photo"><img src="${member.portrait}" alt="Retrato de ${escapeHTML(member.name)}"><figcaption>${escapeHTML(member.name)} · Integrante da pesquisa.<br>Fotografia fornecida pelo grupo para esta revista. Fotógrafo não informado.</figcaption></figure>`;
    } else if (type === 'image') {
      const art = photos[trigger?.dataset.photoKey] || interviewPhotos[trigger?.dataset.photoKey] || page.image || photos.angra;
      title = art.title; markup = photoHTML(art);
    } else if (type === 'carousel') {
      title = 'Paisagens da energia.'; gallery = artworks; slideIndex = 0;
      markup = `<div id="gallery-photo">${photoHTML(gallery[0])}</div><div class="gallery-controls"><button type="button" data-dialog-slide="-1" aria-label="Fotografia anterior">←</button><span id="slide-status" role="status">1 / ${gallery.length}</span><button type="button" data-dialog-slide="1" aria-label="Próxima fotografia">→</button></div>`;
    } else if (type === 'chart') {
      title = 'Matriz elétrica em camadas.';
      markup = `<p class="dialog-intro">Geração nacional em 2025. Selecione um grupo; a escala das barras permanece a mesma.</p><div class="chart-filters" role="group" aria-label="Filtrar fontes"><button type="button" data-filter="all" aria-pressed="true">Todas</button><button type="button" data-filter="renewable" aria-pressed="false">Renováveis</button><button type="button" data-filter="nuclear" aria-pressed="false">Nuclear</button></div><div id="interactive-chart" role="region" aria-live="polite" aria-label="Gráfico por fonte">${chartHTML()}</div><p class="source-note">A nuclear aparece com 2,0%; “outras”, com 1,5%. Fonte: <a href="${references[0].url}" target="_blank" rel="noopener">EPE, Anuário 2026 ↗</a>. Valores também disponíveis como texto em cada linha.</p>`;
    } else if (type === 'diagram' || type === 'cycle') {
      title = type === 'cycle' ? 'O caminho do combustível.' : 'Do reator à rede.';
      currentSteps = type === 'cycle' ? fuelSteps : reactorSteps;
      markup = stepsHTML(currentSteps) + citationHTML(visualEvidence[type === 'cycle' ? 'cycle' : 'reactor']);
    } else if (type === 'calculator') {
      title = 'Laboratório de cenários.'; scenario = { ...scenarios[1], investment: 23.9 }; markup = scenarioHTML() + paybackBarsHTML(scenario) + citationHTML(visualEvidence.payback);
    } else if (type === 'timeline') {
      title = 'Seis trajetórias, diferentes contextos.';
      markup = `<p class="dialog-intro">Recortes históricos com data. Selecione um país para conhecer o contexto e a fonte.</p>${timelineHTML()}<div class="timeline-detail" role="status" id="timeline-detail"></div>`;
    } else if (type === 'checklist') {
      title = 'O que precisa entrar na decisão?';
      markup = `<p class="dialog-intro">Marque os critérios que você já consegue discutir. Este quadro é uma ferramenta de leitura, sem pontuação a favor ou contra a tecnologia.</p><div class="evaluation-list">${['Qual problema energético se pretende resolver?','Quais alternativas e prazos foram comparados?','Quem paga em cada cenário?','Como resíduos e descomissionamento serão financiados?','Quem fiscaliza e publica os resultados?','Como os benefícios e impactos se distribuem?','Quais dependências o projeto reduz ou cria?'].map((label,i) => `<label><input type="checkbox" data-evaluate="${i}"><span>${label}</span></label>`).join('')}</div><p id="evaluation-status" role="status">0 de 7 critérios explorados. Suas marcações permanecem apenas nesta janela.</p>`;
    } else if (type === 'sources') {
      const used=pageSourceRecords(page);
      title = used.length ? 'As fontes desta matéria.' : 'As fontes da edição.';
      markup = `<div class="sources-overview"><span>${used.length?`${used.length} ${used.length===1?'referência':'referências'} nesta matéria`:'BIBLIOGRAFIA DA REVISTA'}</span><p>${escapeHTML(page.title.replaceAll('\n',' '))}</p><small>Consulte o documento original e o local utilizado na pesquisa.</small></div>${used.length?sourceCardsHTML(page):''}${sourcePanelHTML(page,pageIndex)?`<details class="source-passages"><summary>Onde cada fonte aparece no texto</summary>${sourcePanelHTML(page,pageIndex)}</details>`:''}<details class="source-all" ${used.length?'':'open'}><summary>Todas as referências da edição</summary><ol class="references-list">${referenceHTML([],true)}</ol></details><button type="button" class="sources-photo-link" data-action="credits">Fotografias, autores e licenças ↗</button><p class="source-note">Os exemplos internacionais são datados; as hipóteses financeiras pertencem ao estudo do grupo. Cada referência identifica o período e o local de consulta disponíveis.</p>`;
    } else if (type === 'credits') {
      title = 'Quem fez estas imagens.';
      markup = `<p class="dialog-intro">Os arquivos foram redimensionados e têm recortes de exibição. Fotografias conservam as licenças de seus autores; nenhuma implica apoio dos fotógrafos às conclusões da revista.</p><div class="photo-credits">${artworks.map(art => `<div><img src="${art.src}" alt="${escapeHTML(art.title)}" loading="lazy"><p>${escapeHTML(art.caption)}<br><a href="${art.url}" target="_blank" rel="noopener">${escapeHTML(art.credit)} ↗</a><br><a href="${art.licenseUrl}" target="_blank" rel="noopener">${escapeHTML(art.license)}</a></p></div>`).join('')}</div><h3>Retratos dos integrantes</h3><p class="source-note">Fotografias fornecidas pelo grupo para uso nesta revista. Fotógrafo não informado.</p>${teamHTML()}`;
      markup += `<h3>Entrevista com Adolfo Braid</h3><div class="photo-credits">${Object.values(interviewPhotos).map(art => `<div><img src="${art.src}" alt="${escapeHTML(art.title)}" loading="lazy"><p>${escapeHTML(art.caption)}<br><a href="${art.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(art.credit)} ↗</a><br><a href="${art.licenseUrl}" target="_blank" rel="noopener noreferrer">${escapeHTML(art.license)}</a></p></div>`).join('')}</div>`;
    } else if (type === 'linear' || type === 'read') {
      title = type === 'read' ? 'Leia esta abertura.' : 'A edição no seu ritmo.';
      const selection = type === 'read' ? pages.slice(Math.floor(pageIndex / 2) * 2,Math.floor(pageIndex / 2) * 2 + 2) : pages;
      markup = `<div class="linear-content">${selection.map(p => pageHTML(p,pages.indexOf(p),{linear:true}) + (p.id === 'public' ? interviewHTML() : '')).join('')}</div>`;
    } else {
      title = page.note?.title || 'Energia, sociedade e escolhas.';
      markup = `<p class="note-body">${escapeHTML(page.note?.text || 'Geração, rede, distribuição, capacidade de pagamento e participação são dimensões relacionadas. Nenhuma fonte, sozinha, resolve todos esses problemas. A revista reúne esses critérios ao longo dos cinco temas.')}</p>${page.id === 'editorial' ? `<h3>Fluxograma do editorial</h3>${flowHTML(['Defender acesso à energia e autonomia tecnológica','Relacionar geração, distribuição e tarifas com Milton Santos e Maria Laura Silveira','Discutir capacidade produtiva e dependência com Wallerstein','Propor planejamento público, capacitação e ampliação industrial','Vincular financiamento a metas e prestação de contas'])}` : ''}${page.refs?.length ? `<h3>Fontes desta leitura</h3><ol class="references-list">${referenceHTML(page.refs)}</ol>` : ''}`;
    }
    if (type === 'chart') markup += citationHTML(visualEvidence.matrix);
    if (type === 'checklist') markup += citationHTML({kind:'Critérios elaborados pelo grupo, com base em',sources:page.refs.map(id=>({id}))});
    if (!['index','interview','member','image','carousel','chart','diagram','cycle','calculator','timeline','checklist','sources','credits','linear','read'].includes(type)) {
      markup += citationHTML({kind:'Nota da edição: síntese e interpretação com base em',sources:(page.refs || []).map(id=>({id}))});
    }
    content.innerHTML = `<h2 id="dialog-title">${title}</h2>${markup}`;
    if (!dialog.open) dialog.showModal();
    refreshExplorers(content);
    closeButton.focus(); dialog.scrollTop = 0;
    if (type === 'calculator') updateScenario();
    if (type === 'timeline') setEvent(0);
  }
  function setEvent(index) {
    const event = timeline[index], ref = references.find(ref => ref.id === event.ref);
    content.querySelector('#timeline-detail').innerHTML = `<span class="eyebrow">${event.country} · ${event.year}</span><h3>${event.title}</h3><p>${event.text}</p>${citationHTML({kind:'Fonte do recorte histórico',sources:[{id:event.ref}]})}`;
    content.querySelectorAll('[data-event]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.event) === index)));
  }
  function close() {
    if (history.length) {
      const prior = history.pop(); content.replaceChildren(...prior.nodes); dialog.className = prior.className;
      ({ gallery, slideIndex, currentSteps, scenario } = prior); dialog.scrollTop = prior.scroll;
      refreshExplorers(content);
      if (prior.trigger?.isConnected) prior.trigger.focus(); else closeButton.focus();
    } else dialog.close();
  }
  closeButton.addEventListener('click',close);
  // Evita que o fechamento nativo alcance a camada restaurada no mesmo Escape.
  dialog.addEventListener('keydown',event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
  });
  dialog.addEventListener('cancel',event => { event.preventDefault(); close(); });
  dialog.addEventListener('close',() => { history = []; gallery = null; if (origin?.isConnected) origin.focus(); });
  dialog.addEventListener('click',event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
  });
  document.addEventListener('click',event => {
    const jump = event.target.closest('[data-jump]');
    if (jump) { history = []; if (dialog.open) dialog.close(); onJump(Number(jump.dataset.jump)); return; }
    const trigger = event.target.closest('[data-action]');
    if (trigger) open(trigger.dataset.action,Number(trigger.dataset.page || 0),trigger);
    const move = event.target.closest('[data-dialog-slide]'); if (move && gallery) setSlide(slideIndex + Number(move.dataset.dialogSlide));
    const filter = event.target.closest('[data-filter]');
    if (filter) { content.querySelector('#interactive-chart').innerHTML = chartHTML(filter.dataset.filter); content.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed',String(button === filter))); }
    const step = event.target.closest('[data-step]');
    if (step) { const selected = currentSteps[Number(step.dataset.step)]; content.querySelector('#step-title').textContent = selected[0]; content.querySelector('#step-text').textContent = selected[1]; content.querySelectorAll('[data-step]').forEach(button => button.setAttribute('aria-pressed',String(button === step))); }
    const preset = event.target.closest('[data-scenario]');
    if (preset) { scenario = { ...scenarios[Number(preset.dataset.scenario)], investment: scenario.investment }; updateScenario(); content.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed',String(button === preset))); }
    const time = event.target.closest('[data-event]'); if (time) setEvent(Number(time.dataset.event));
  });
  content.addEventListener('input',event => {
    if (['capacity','tariff','operating','investment'].includes(event.target.id)) { scenario[event.target.id] = Number(event.target.value); updateScenario(); content.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed','false')); }
    if (event.target.matches('[data-evaluate]')) content.querySelector('#evaluation-status').textContent = `${content.querySelectorAll('[data-evaluate]:checked').length} de 7 critérios explorados. Suas marcações permanecem apenas nesta janela.`;
  });
  document.addEventListener('keydown',event => {
    if (dialog.open && gallery && ['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); setSlide(slideIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  return { open, isOpen: () => dialog.open };
}
