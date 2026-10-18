import { pages, pageHTML, clampSpread, formatPages, interviewHTML } from './content.js';
import { createInteractions } from './interactions.js';
import { sourcePanelHTML } from './citations.js';
import { createExplorers, refreshExplorers } from './explorers.js';

const renderIndex = new URLSearchParams(location.search).get('render');
if (renderIndex !== null) {
  const index = Math.max(0,Math.min(pages.length - 1,Number(renderIndex) || 0));
  document.body.className = 'render-document';
  document.body.innerHTML = pageHTML(pages[index],index,{digital:false});
  await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
  await document.fonts.ready;
  document.body.dataset.ready = 'true';
} else {
  const stage = document.querySelector('#stage');
  const book = document.querySelector('#html-book');
  const landing = document.querySelector('#landing-view');
  const mobile = matchMedia('(max-width: 760px)');
  const params = new URLSearchParams(location.search);
  let mode = ['html','3d','landing'].includes(params.get('template')) ? params.get('template') : mobile.matches ? 'html' : '3d';
  let pageIndex = Math.max(0,Math.min(pages.length - 1,(Number(params.get('page')) || 1) - 1));
  let zoom = 1, turning = false, turnId = 0, modeId = 0, renderer, rendererPromise, failed = false, timer;
  createExplorers();
  const interactions = createInteractions(jump);
  let landingObserver;
  const single = () => mode === 'landing' || (mobile.matches && mode === 'html');
  const spread = () => Math.floor(pageIndex / 2);
  const previous = document.querySelector('#previous'), next = document.querySelector('#next');
  const sourcePanel = document.createElement('section');
  sourcePanel.id = 'reader-sources'; sourcePanel.className = 'reader-sources';
  sourcePanel.setAttribute('aria-label','Fontes dos trechos desta abertura');
  document.querySelector('.navigation').after(sourcePanel);
  let sourceSelection = '';
  function update() {
    previous.disabled = turning || (single() ? pageIndex === 0 : spread() === 0);
    next.disabled = turning || (single() ? pageIndex === pages.length - 1 : spread() === clampSpread(999));
    document.querySelector('#page-status').textContent = single() ? `${String(pageIndex + 1).padStart(2,'0')} / ${pages.length}` : formatPages(spread());
    document.querySelector('#section-label').textContent = pages[pageIndex].section;
    document.querySelector('.context-label').textContent = mode === 'landing' ? 'Nesta seção' : 'Nesta abertura';
    document.querySelector('.nav-caption').textContent = mode === 'landing' ? 'Seções' : 'Páginas';
    stage.setAttribute('aria-busy',String(turning));
    stage.classList.toggle('turning',turning);
    const sourceKey = `${mode}:${single() ? pageIndex : spread()*2}:${single()}`;
    sourcePanel.hidden = mode === 'landing';
    if (sourceKey !== sourceSelection) {
      sourceSelection = sourceKey;
      const first = single() ? pageIndex : spread()*2;
      const blocks = pages.slice(first,first+(single()?1:2)).map((page,i)=>sourcePanelHTML(page,first+i)).join('');
      sourcePanel.innerHTML = blocks ? `<h2>De onde vêm as informações desta abertura</h2><p>Fontes por trecho, com o local da informação no site ou documento. As interpretações e propostas são identificadas como trabalho do grupo.</p><div class="spread-evidence">${blocks}</div>` : '';
      sourcePanel.hidden ||= !blocks;
    } else if (!sourcePanel.children.length) sourcePanel.hidden = true;
    document.querySelector('#reading-progress').style.width = `${(single() ? pageIndex + 1 : Math.min(spread() * 2 + 2,pages.length)) / pages.length * 100}%`;
    const url = new URL(location.href); url.searchParams.set('template',mode); url.searchParams.set('page',String(pageIndex + 1)); if (mode === 'landing') url.hash = ''; history.replaceState(null,'',url);
  }
  function observeLanding() {
    landingObserver?.disconnect();
    const top = document.querySelector('#reader-toolbar').offsetHeight + 20;
    landingObserver = new IntersectionObserver(entries => {
      if (mode !== 'landing' || interactions.isOpen()) return;
      const active = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.boundingClientRect.top - a.boundingClientRect.top)[0];
      if (active) { pageIndex = Number(active.target.dataset.pageIndex); update(); }
    }, { rootMargin: `-${top}px 0px -${Math.max(0,innerHeight - top - 140)}px 0px` });
    landing.querySelectorAll('.magazine-page').forEach(article => landingObserver.observe(article));
  }
  function showLanding() {
    if (!landing.children.length) {
      landing.innerHTML = pages.map((page,index) => pageHTML(page,index)).join('');
      landing.querySelectorAll('.magazine-page').forEach((article,index) => {
        article.id = `landing-${pages[index].id}`;
        const title = article.querySelector('h2');
        title.id = `landing-title-${index}`; title.tabIndex = -1;
        article.setAttribute('aria-labelledby',title.id); article.removeAttribute('aria-label');
        article.querySelectorAll('img').forEach(img => { img.loading = index === 0 ? 'eager' : 'lazy'; });
      });
      landing.querySelector('#landing-public').insertAdjacentHTML('afterend',interviewHTML({inline:true}));
      const cover = landing.firstElementChild;
      const oldTitle = cover.querySelector('h2'), title = document.createElement('h1');
        title.id = oldTitle.id; title.className = oldTitle.className; title.tabIndex = -1; title.innerHTML = oldTitle.innerHTML; oldTitle.replaceWith(title);
      const actions = document.createElement('div'); actions.className = 'landing-cover-actions';
      actions.innerHTML = '<button type="button" data-jump="1">Explore a edição <svg class="reader-icon" aria-hidden="true"><use href="#ui-arrow_forward"/></svg></button><span>20 páginas · 5 temas</span>';
      cover.querySelector('.page-main').append(actions);
    }
    observeLanding(); refreshExplorers(landing);
  }
  function scrollLanding({ focus = false } = {}) {
    const article = landing.querySelector(`[data-page-index="${pageIndex}"]`);
    article.scrollIntoView({block:'start'});
    if (focus) article.querySelector('h1,h2').focus({preventScroll:true});
  }
  function layout() {
    document.querySelector('#zoom-controls').hidden = mode !== 'html' || mobile.matches;
    if (mode === 'landing') { observeLanding(); return; }
    const availableWidth = Math.max(300,stage.clientWidth - (mobile.matches ? 20 : 70));
    const availableHeight = Math.max(430,Math.min(950,innerHeight - (mobile.matches ? 200 : 190)));
    const count = single() ? 1 : 2;
    const scale = Math.min(availableWidth / (760 * count), availableHeight / 1064) * zoom;
    const frame = document.querySelector('#html-view');
    frame.style.width = `${760 * count * scale}px`; frame.style.height = `${1064 * scale}px`;
    book.style.transform = `scale(${scale})`; book.style.width = `${760 * count}px`;
    book.classList.toggle('single-page',single());
    stage.style.setProperty('--stage-height',`${Math.max(availableHeight + 30,mode === 'html' ? 1064 * scale + 30 : 0)}px`);
  }
  function showHTML(animate = false, direction = 1) {
    if (mode === 'landing') { showLanding(); return; }
    const old = book.querySelectorAll('article')[direction > 0 ? 1 : 0]?.cloneNode(true);
    clearTimeout(timer);
    const start = single() ? pageIndex : spread() * 2;
    const selection = pages.slice(start,start + (single() ? 1 : 2));
    book.innerHTML = selection.map((page,i) => pageHTML(page,start + i,{digital:single()})).join('');
    layout(); refreshExplorers(book);
    if (animate && !single() && !matchMedia('(prefers-reduced-motion: reduce)').matches && old) {
      const sheet = document.createElement('div'); sheet.className = `turn-sheet ${direction > 0 ? 'forward' : 'backward'}`; sheet.inert = true; sheet.setAttribute('aria-hidden','true'); sheet.append(old); book.append(sheet); timer = setTimeout(() => sheet.remove(),600);
    }
  }
  async function navigate(delta) {
    if (turning || interactions.isOpen()) return;
    const target = single() ? Math.max(0,Math.min(pages.length - 1,pageIndex + delta)) : clampSpread(spread() + delta) * 2;
    if (target === pageIndex || (!single() && Math.floor(target / 2) === spread())) return;
    if (mode === 'landing') { jump(target); return; }
    const from = spread(), request = ++turnId;
    pageIndex = target; turning = true; update();
    try {
      if (mode === '3d' && renderer && !failed) await renderer.turn(from,spread());
      else { showHTML(true,delta); await new Promise(resolve => setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches || single() ? 0 : 600)); }
    } catch { showGraphicsError(); }
    if (request === turnId) { turning = false; update(); }
  }
  async function jump(index) {
    pageIndex = Math.max(0,Math.min(pages.length - 1,index)); turning = false; ++turnId; renderer?.cancel();
    if (!single()) pageIndex = Math.floor(pageIndex / 2) * 2;
    showHTML(); update();
    if (mode === 'landing') { const target = pageIndex; requestAnimationFrame(() => { pageIndex = target; scrollLanding({focus:true}); update(); }); return; }
    if (mode === '3d' && renderer && !failed) { try { await renderer.show(spread()); } catch { showGraphicsError(); } }
    document.querySelector('#read-spread').focus();
  }
  function showGraphicsError() {
    if (mode !== '3d') return;
    failed = true; turning = false; ++turnId;
    document.querySelector('#stage-error').hidden = false;
    document.querySelector('#webgl-view').hidden = true;
    document.querySelector('#html-view').hidden = false;
    stage.classList.add('graphics-failed'); showHTML(); update();
  }
  async function setMode(value) {
    const request = ++modeId;
    const previousMode = mode;
    landingObserver?.disconnect();
    mode = value; turning = false; ++turnId; renderer?.cancel();
    document.body.dataset.readerMode = mode;
    stage.hidden = mode === 'landing'; landing.hidden = mode !== 'landing';
    if (!single()) pageIndex = Math.floor(pageIndex / 2) * 2;
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.mode === mode)));
    document.querySelector('#html-view').hidden = mode !== 'html';
    document.querySelector('#webgl-view').hidden = mode !== '3d';
    document.querySelector('#stage-error').hidden = true; stage.classList.remove('graphics-failed');
    document.querySelector('#zoom-controls').hidden = mode !== 'html';
    document.querySelector('#loading').hidden = mode !== '3d';
    showHTML(); update();
    if (mode === 'landing') { const target = pageIndex; requestAnimationFrame(() => { pageIndex = target; scrollLanding(); update(); }); return; }
    if (previousMode === 'landing') document.querySelector('#reader-toolbar').scrollIntoView({block:'start'});
    if (mode === 'html') return;
    try {
      if (failed) { showGraphicsError(); return; }
      rendererPromise ||= import('./webgl-reader.js').then(module => module.create3DReader(showGraphicsError));
      renderer = await rendererPromise;
      if (request === modeId) { await renderer.show(spread()); document.querySelector('#loading').hidden = true; }
    } catch { if (request === modeId) { document.querySelector('#loading').hidden = true; showGraphicsError(); } }
  }
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click',() => setMode(button.dataset.mode)));
  previous.addEventListener('click',() => navigate(-1)); next.addEventListener('click',() => navigate(1));
  document.querySelector('#open-index').addEventListener('click',event => interactions.open('index',pageIndex,event.currentTarget));
  document.querySelector('#read-linear').addEventListener('click',event => interactions.open('linear',pageIndex,event.currentTarget));
  document.querySelector('#read-spread').addEventListener('click',event => interactions.open('read',pageIndex,event.currentTarget));
  document.querySelector('#go-cover').addEventListener('click',() => jump(0));
  document.querySelector('#zoom-in').addEventListener('click',() => { zoom = Math.min(1.5,zoom + .15); layout(); document.querySelector('#zoom-status').textContent = `${Math.round(zoom * 100)}%`; });
  document.querySelector('#zoom-out').addEventListener('click',() => { zoom = Math.max(.85,zoom - .15); layout(); document.querySelector('#zoom-status').textContent = `${Math.round(zoom * 100)}%`; });
  document.querySelector('#fullscreen').addEventListener('click',async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { document.querySelector('#fullscreen').textContent = 'Indisponível'; } });
  document.addEventListener('keydown',event => {
    if (event.defaultPrevented || interactions.isOpen() || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable],[data-explorer]')) return;
    if (['ArrowRight','ArrowLeft'].includes(event.key)) { event.preventDefault(); navigate(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Home') { event.preventDefault(); jump(0); }
    if (event.key === 'End') { event.preventDefault(); jump(pages.length - 1); }
  });
  let pointer;
  stage.addEventListener('pointerdown',event => {
    if (!event.isPrimary || event.target.closest('button,a,input,select,[data-explorer]') || (event.pointerType === 'mouse' && mode === 'html')) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup',event => { if (!pointer || pointer.id !== event.pointerId) return; const dx = event.clientX - pointer.x,dy = event.clientY - pointer.y; pointer = null; if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1); });
  stage.addEventListener('pointercancel',() => { pointer = null; });
  window.addEventListener('resize',layout);
  mobile.addEventListener('change',() => { showHTML(); update(); });
  setMode(mode);
  if (params.get('interview') === 'adolfo') interactions.open('interview');
}
