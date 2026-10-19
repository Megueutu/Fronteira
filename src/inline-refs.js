import { references } from './citations.js';
import { uiIcon } from './icons.js';

// Âncoras inline do miolo: a primeira ocorrência de cada frase vira um termo interativo.
// kind 'source': cartão com a fonte (nome curto, local da informação e link). A fonte precisa constar na evidência do parágrafo.
// kind 'popup': mini-cartão que descreve a visualização e abre o popup existente (data-action) no clique ou Enter.
const source = (pageId, p, phrase, ref) => ({ pageId, p, phrase, kind: 'source', ref });
const popup = (pageId, p, phrase, type, target) => ({ pageId, p, phrase, kind: 'popup', action: { type, pageId: target } });

export const popupLabels = {
  chart: ['Abrir gráfico da matriz elétrica', 'Gráfico interativo, geração por fonte em 2025'],
  diagram: ['Abrir diagrama do reator', 'Do reator à rede, em etapas'],
  cycle: ['Abrir ciclo do combustível', 'Da mina ao reator, etapa por etapa'],
  calculator: ['Abrir calculadora de payback', 'Laboratório de cenários de Angra 3'],
  timeline: ['Abrir linha do tempo de países', 'Seis trajetórias nacionais, com fontes'],
  checklist: ['Abrir checklist do balanço', 'Quadro de critérios para a decisão'],
  interview: ['Abrir a entrevista completa', 'Conversa do grupo com Adolfo Braid'],
  index: ['Abrir o sumário', 'Os cinco temas e as páginas da edição'],
};

export const inlineRefs = [
  popup('opening', 0, 'cinco temas', 'index'),
  source('editorial', 1, 'Milton Santos', 'santos'),
  source('editorial', 2, 'Immanuel Wallerstein', 'wallerstein'),
  source('unequal', 0, 'pobreza energética', 'polis'),
  popup('matrix', 0, 'Eólica e solar', 'chart', 'matrix'),
  source('matrix', 1, 'oferta interna', 'ben'),
  source('matrix', 1, 'Anuário da EPE', 'epe'),
  source('territory', 0, 'Sistema Interligado Nacional', 'sin'),
  source('territory', 2, 'Milton Santos', 'santos'),
  source('territory', 3, 'Belo Monte', 'group'),
  source('reactor', 0, 'fissão', 'iaea'),
  popup('reactor', 0, 'reação em cadeia', 'diagram', 'reactor'),
  source('reactor', 1, 'água pressurizada', 'group'),
  source('safety', 1, 'combustível retirado do reator', 'waste'),
  source('safety', 2, 'Chernobyl', 'chernobyl'),
  source('safety', 2, 'Fukushima', 'fukushima'),
  source('wallerstein', 0, 'Immanuel Wallerstein', 'wallerstein-bio'),
  source('wallerstein', 2, 'semiperiferia', 'wallerstein'),
  popup('wallerstein', 3, 'produtor de tecnologia e combustível', 'cycle', 'uranium'),
  source('sovereignty', 0, 'Theda Skocpol', 'critique'),
  source('sovereignty', 2, 'Tratado de Não Proliferação', 'npt'),
  source('sovereignty', 2, 'ABACC', 'abacc'),
  source('uranium', 1, 'INB', 'inb'),
  popup('uranium', 2, 'yellow cake', 'cycle', 'uranium'),
  source('uranium', 3, 'serviços no exterior', 'inb'),
  source('uranium', 4, 'Santa Quitéria', 'itataia'),
  source('payback', 1, 'Angra 3', 'group'),
  popup('payback', 2, 'payback simples', 'calculator', 'payback'),
  source('who-pays', 0, 'tarifa', 'group'),
  source('who-pays', 1, 'EPE', 'cost'),
  source('messmer', 0, 'Plano Messmer', 'messmer'),
  popup('messmer', 1, 'contexto francês', 'timeline', 'world'),
  popup('world', 0, 'Alemanha e Itália', 'timeline', 'world'),
  source('world', 0, 'Japão', 'japan'),
  source('world', 0, 'Lituânia', 'lithuania'),
  source('world', 0, 'Coreia do Sul', 'korea'),
  source('public', 1, 'Weber', 'weber'),
  source('public', 2, 'desinformação', 'group'),
  popup('adolfo', 0, 'entrevista', 'interview'),
  source('adolfo', 1, 'IME', 'aeita'),
  source('adolfo', 3, 'Terminus', 'adolfo-abdan'),
  source('adolfo', 3, 'microrreator', 'adolfo-cnen'),
  source('interview-profile', 1, 'reservas de urânio', 'interview'),
  source('interview-profile', 2, 'Nordeste', 'interview'),
  source('balance', 1, 'Milton Santos', 'santos'),
  source('balance', 1, 'Weber', 'weber'),
  source('balance', 1, 'Wallerstein', 'wallerstein'),
  popup('balance', 3, 'Oferece critérios', 'checklist', 'balance'),
];

const attr = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const regexEscape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const find = (html, phrase) => new RegExp(`(?<![\\p{L}\\p{N}])${regexEscape(phrase)}(?![\\p{L}\\p{N}])`, 'u').exec(html);

function termHTML(anchor, text, evidence) {
  if (anchor.kind === 'popup') {
    const [title, note] = popupLabels[anchor.action.type];
    const target = anchor.action.pageId ? ` data-ref-page="${attr(anchor.action.pageId)}"` : '';
    return `<span class="inline-ref inline-ref-popup" role="button" tabindex="0" data-action="${anchor.action.type}"${target} data-ref-title="${attr(title)}" data-ref-note="${attr(note)}" aria-haspopup="dialog">${text}</span>`;
  }
  const item = evidence?.sources?.find(entry => entry.id === anchor.ref);
  const ref = references.find(entry => entry.id === anchor.ref);
  if (!ref || !item && evidence) return text;
  const data = `data-ref="${attr(anchor.ref)}" data-ref-location="${attr(item?.location || ref.location)}"`;
  return ref.url
    ? `<a class="inline-ref inline-ref-source" href="${attr(ref.url)}" target="_blank" rel="noopener noreferrer" ${data}>${text}</a>`
    : `<span class="inline-ref inline-ref-source" tabindex="0" ${data}>${text}</span>`;
}

/**
 * Envolve a primeira ocorrência de cada frase da tabela no HTML já escapado do parágrafo.
 * Nunca altera o texto visível. `evidence` é o registro de fontes do parágrafo, usado para validar e localizar a informação.
 */
export function linkInlineRefs(pageId, html, paragraphIndex, evidence) {
  const anchors = inlineRefs.filter(anchor => anchor.pageId === pageId && anchor.p === paragraphIndex);
  if (!anchors.length) return html;
  const hits = [];
  for (const anchor of anchors) {
    const match = find(html, anchor.phrase);
    if (!match) continue;
    const start = match.index, end = start + anchor.phrase.length;
    if (hits.some(hit => start < hit.end && end > hit.start)) continue;
    hits.push({ start, end, anchor });
  }
  let out = '', cursor = 0;
  for (const hit of hits.sort((a, b) => a.start - b.start)) {
    out += html.slice(cursor, hit.start) + termHTML(hit.anchor, html.slice(hit.start, hit.end), evidence);
    cursor = hit.end;
  }
  return out + html.slice(cursor);
}

const cardHTML = term => {
  if (term.classList.contains('inline-ref-popup')) {
    return `<span class="inline-ref-eyebrow">Interativo</span><strong>${attr(term.dataset.refTitle)}</strong><span class="inline-ref-note">${attr(term.dataset.refNote)}</span><span class="inline-ref-hint">Toque, clique ou pressione Enter</span>`;
  }
  const ref = references.find(entry => entry.id === term.dataset.ref);
  if (!ref) return '';
  const link = ref.url ? `<a class="inline-ref-link" href="${attr(ref.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte ${uiIcon('arrow_forward')}</a>` : '<span class="inline-ref-hint">Registro de pesquisa do grupo</span>';
  return `<span class="inline-ref-eyebrow">Fonte</span><strong>${attr(ref.short)}</strong><span class="inline-ref-note">${attr(term.dataset.refLocation)}</span>${link}`;
};

export function installInlineRefs() {
  if (document.querySelector('#inline-ref-popover')) return;
  const pop = document.createElement('div');
  pop.id = 'inline-ref-popover'; pop.className = 'inline-ref-popover'; pop.setAttribute('role', 'tooltip'); pop.setAttribute('aria-hidden', 'true');
  document.body.append(pop);
  let current = null, showTimer = 0, hideTimer = 0, pointerType = 'mouse', pointer = { x: 0, y: 0 };
  const visible = () => pop.classList.contains('is-visible');
  function place(term) {
    const rects = [...term.getClientRects()];
    const rect = rects.find(r => pointer.y >= r.top - 2 && pointer.y <= r.bottom + 2 && pointer.x >= r.left - 2 && pointer.x <= r.right + 2) || rects[0] || term.getBoundingClientRect();
    const margin = 8, width = pop.offsetWidth, height = pop.offsetHeight;
    const above = rect.top - height - margin >= margin;
    const top = above ? rect.top - height - margin : Math.min(rect.bottom + margin, innerHeight - height - margin);
    const left = Math.max(margin, Math.min(rect.left + rect.width / 2 - width / 2, innerWidth - width - margin));
    pop.style.top = `${Math.round(Math.max(margin, top))}px`;
    pop.style.left = `${Math.round(left)}px`;
    pop.dataset.side = above ? 'top' : 'bottom';
  }
  function show(term) {
    clearTimeout(showTimer); clearTimeout(hideTimer);
    const host = term.closest('dialog') || document.body;
    if (pop.parentNode !== host) host.append(pop);
    if (current && current !== term) current.removeAttribute('aria-describedby');
    current = term;
    pop.innerHTML = cardHTML(term);
    pop.classList.toggle('is-action', term.classList.contains('inline-ref-popup'));
    pop.classList.add('is-measuring'); place(term); pop.classList.remove('is-measuring');
    pop.classList.add('is-visible'); pop.setAttribute('aria-hidden', 'false');
    term.setAttribute('aria-describedby', pop.id);
  }
  function hide() {
    clearTimeout(showTimer); clearTimeout(hideTimer);
    pop.classList.remove('is-visible'); pop.setAttribute('aria-hidden', 'true');
    current?.removeAttribute('aria-describedby'); current = null;
  }
  const scheduleHide = () => { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 180); };
  const termOf = event => event.target instanceof Element ? event.target.closest('.inline-ref') : null;
  const inPop = node => node instanceof Node && pop.contains(node);

  document.addEventListener('pointerdown', event => { pointerType = event.pointerType || 'mouse'; }, true);
  document.addEventListener('mouseover', event => {
    pointer = { x: event.clientX, y: event.clientY };
    const term = termOf(event);
    if (term) { clearTimeout(hideTimer); if (term !== current || !visible()) { clearTimeout(showTimer); showTimer = setTimeout(() => show(term), pointerType === 'touch' ? 0 : 90); } }
    else if (inPop(event.target)) clearTimeout(hideTimer);
  });
  document.addEventListener('mouseout', event => {
    const from = termOf(event) || (inPop(event.target) ? pop : null);
    if (!from) return;
    const to = event.relatedTarget;
    if (to instanceof Element && (to.closest('.inline-ref') === from || inPop(to))) return;
    clearTimeout(showTimer); scheduleHide();
  });
  document.addEventListener('focusin', event => {
    const term = termOf(event);
    if (term) show(term); else if (visible() && !inPop(event.target)) hide();
  });
  document.addEventListener('focusout', event => {
    if (termOf(event) && !inPop(event.relatedTarget) && termOf({ target: event.relatedTarget }) == null) scheduleHide();
    else if (inPop(event.target) && !inPop(event.relatedTarget) && !(event.relatedTarget instanceof Element && event.relatedTarget.closest('.inline-ref'))) scheduleHide();
  });
  // Toque: o primeiro toque abre o cartão; o segundo segue para a ação (popup) ou o link da fonte.
  document.addEventListener('click', event => {
    const term = termOf(event);
    if (!term) { if (visible() && !inPop(event.target)) hide(); return; }
    if (pointerType === 'touch' && (current !== term || !visible())) { event.preventDefault(); event.stopImmediatePropagation(); show(term); return; }
    if (term.classList.contains('inline-ref-popup')) {
      // O seletor [data-page-id] identifica páginas; o destino só existe enquanto o clique chega a interactions.js.
      if (term.dataset.refPage) { term.dataset.pageId = term.dataset.refPage; setTimeout(() => term.removeAttribute('data-page-id')); }
      hide(); return;
    }
    show(term);
  }, true);
  document.addEventListener('keydown', event => {
    const term = termOf(event);
    if (term?.classList.contains('inline-ref-popup') && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); term.click(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !visible()) return;
    event.preventDefault(); event.stopPropagation();
    const back = current;
    hide();
    if (inPop(document.activeElement)) back?.focus({ preventScroll: true });
  }, true);
  addEventListener('scroll', () => { if (visible()) hide(); }, true);
  addEventListener('resize', () => { if (visible()) hide(); });
}
