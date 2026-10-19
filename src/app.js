import { pages, pageHTML, getSpread, spreadForPage, clampSpread, formatPages, formatPage } from './content.js';
import { createInteractions } from './interactions.js';
import { sourcePanelHTML } from './citations.js';
import { createExplorers, refreshExplorers } from './explorers.js';
import { installCoverMotion, mountCoverCanvases } from './cover-motion.js';

const renderIndex = new URLSearchParams(location.search).get('render');
if (renderIndex !== null) {
  const index = Math.max(0,Math.min(pages.length - 1,Number(renderIndex) || 0));
  const sprite=document.querySelector('.reader-icon-sprite')?.outerHTML || '';
  document.body.className = 'render-document page-surface';
  document.body.innerHTML = sprite + pageHTML(pages[index],index,{digital:false});
  mountCoverCanvases(document);
  await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
  await document.fonts.ready;
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve,250))));
  document.body.dataset.ready = 'true';
} else {
  installCoverMotion();
  const stage = document.querySelector('#stage');
  const book = document.querySelector('#html-book');
  const landing = document.querySelector('#landing-view');
  book.classList.add('page-surface'); landing.classList.add('page-surface');
  const mobile = matchMedia('(max-width: 760px)');
  const params = new URLSearchParams(location.search);
  let mode = ['html','3d','landing'].includes(params.get('template')) ? params.get('template') : 'html';
  let pageIndex = Math.max(0,Math.min(pages.length - 1,(Number(params.get('page')) || 1) - 1));
  let zoom = 1, turning = false, turnId = 0, modeId = 0, renderer, rendererPromise, failed = false, timer;
  createExplorers();
  const interactions = createInteractions(jump);
  let landingObserver;
  const single = () => mode === 'landing' || (mobile.matches && mode === 'html');
  const spread = () => spreadForPage(pageIndex);
  const firstInOpening = index => pages.indexOf(getSpread(index)[0]);
  const selectedPages = () => single() ? [pages[pageIndex]] : getSpread(spread());
  const previous = document.querySelector('#previous'), next = document.querySelector('#next');
  const sourcePanel = document.createElement('section');
  sourcePanel.id = 'reader-sources'; sourcePanel.className = 'reader-sources';
  sourcePanel.setAttribute('aria-label','Fontes dos trechos desta abertura');
  document.querySelector('.reading-progress').after(sourcePanel);
  let sourceSelection = '';
  function update() {
    previous.disabled = turning || (single() ? pageIndex === 0 : spread() === 0);
    next.disabled = turning || (single() ? pageIndex === pages.length - 1 : spread() === clampSpread(999));
    document.querySelector('#page-status').textContent = single() ? formatPage(pages[pageIndex]) : formatPages(spread());
    document.querySelector('#page-status').setAttribute('aria-label',`Posição ${selectedPages().map(page=>pages.indexOf(page)+1).join(' e ')} de ${pages.length}`);
    document.querySelector('#section-label').textContent = pages[pageIndex].section;
    document.querySelector('.context-label').textContent = mode === 'landing' ? 'Nesta seção' : 'Nesta abertura';
    document.querySelector('.nav-caption').textContent = mode === 'landing' ? 'Seções' : 'Páginas';
    stage.setAttribute('aria-busy',String(turning));
    stage.classList.toggle('turning',turning);
    const sourceKey = `${mode}:${single() ? pageIndex : spread()}:${single()}`;
    sourcePanel.hidden = mode === 'landing';
    if (sourceKey !== sourceSelection) {
      sourceSelection = sourceKey;
      const blocks = selectedPages().map(page=>sourcePanelHTML(page,pages.indexOf(page))).join('');
      sourcePanel.innerHTML = blocks ? `<h2>De onde vêm as informações desta abertura</h2><p>Fontes por trecho, com o local da informação no site ou documento. As interpretações e propostas são identificadas como trabalho do grupo.</p><div class="spread-evidence">${blocks}</div>` : '';
      sourcePanel.hidden ||= !blocks;
    } else if (!sourcePanel.children.length) sourcePanel.hidden = true;
    document.querySelector('#reading-progress').style.width = `${(single() ? pageIndex + 1 : Math.max(...selectedPages().map(page=>pages.indexOf(page)))+1) / pages.length * 100}%`;
    // Links antigos são lidos na abertura; a navegação mantém apenas a raiz visível.
    history.replaceState({ ...history.state, reader: { mode, page: pageIndex + 1 } },'',location.pathname);
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
      landing.innerHTML = pages.map((page,index) => `<div class="page-frame">${pageHTML(page,index)}</div>`).join('');
      landing.querySelectorAll('.magazine-page').forEach((article,index) => {
        article.id = `landing-${pages[index].id}`;
        const title = article.querySelector('h2') || article.insertBefore(Object.assign(document.createElement('h2'),{textContent:pages[index].readingLabel || pages[index].title,className:'sr-only'}),article.firstChild);
        title.id = `landing-title-${index}`; title.tabIndex = -1;
        article.setAttribute('aria-labelledby',title.id); article.removeAttribute('aria-label');
        article.querySelectorAll('img').forEach(img => { img.loading = index === 0 ? 'eager' : 'lazy'; });
      });

    }
    observeLanding(); refreshExplorers(landing);
  }
  function scrollLanding({ focus = false } = {}) {
    const article = landing.querySelector(`[data-page-index="${pageIndex}"]`);
    window.scrollTo({top:Math.max(0,scrollY+article.getBoundingClientRect().top-document.querySelector('#reader-toolbar').offsetHeight-16),behavior:'instant'});
    if (focus) article.querySelector('h1,h2').focus({preventScroll:true});
  }
  function layout() {
    stage.style.scrollMarginTop = `${document.querySelector('#reader-toolbar').offsetHeight + 16}px`;
    document.querySelector('#zoom-controls').hidden = mode === '3d';
    if (mode === 'landing') {
      const scale=Math.min(1,Math.max(240,landing.clientWidth-32)/760)*zoom;
      landing.style.setProperty('--page-scale',scale);
      observeLanding(); return;
    }
    const availableWidth = Math.max(300,stage.clientWidth - (mobile.matches ? 20 : 70));
    const availableHeight = Math.max(430,Math.min(950,innerHeight - (mobile.matches ? 200 : 190)));
    const count = selectedPages().length;
    const scale = Math.min(availableWidth / (760 * count), availableHeight / 1064) * zoom;
    const frame = document.querySelector('#html-view');
    frame.style.width = `${760 * count * scale}px`; frame.style.height = `${1064 * scale}px`;
    book.style.transform = `scale(${scale})`; book.style.width = `${760 * count}px`;
    book.classList.toggle('single-page',single());
    book.classList.toggle('closed-book',count===1 && !single());
    const stageHeight = mode === '3d' ? Math.min(availableHeight + 96,Math.max(340,stage.clientWidth / 1.43 + 144)) : Math.max(availableHeight + 30,1064 * scale + 30);
    stage.style.setProperty('--stage-height',`${stageHeight}px`);
  }
  function showHTML(animate = false, direction = 1) {
    if (mode === 'landing') { showLanding(); return; }
    const old = [...book.querySelectorAll(':scope > article')].at(direction > 0 ? -1 : 0)?.cloneNode(true);
    clearTimeout(timer);
    const selection = selectedPages();
    book.innerHTML = selection.map(page => pageHTML(page,pages.indexOf(page),{digital:false})).join('');
    layout(); refreshExplorers(book);
    if (animate && !single() && !matchMedia('(prefers-reduced-motion: reduce)').matches && old) {
      const sheet = document.createElement('div'); sheet.className = `turn-sheet ${direction > 0 ? 'forward' : 'backward'}`; sheet.inert = true; sheet.setAttribute('aria-hidden','true'); sheet.append(old); book.append(sheet); timer = setTimeout(() => sheet.remove(),600);
    }
  }
  async function navigate(delta) {
    if (turning || interactions.isOpen()) return;
    const target = single() ? Math.max(0,Math.min(pages.length - 1,pageIndex + delta)) : firstInOpening(clampSpread(spread() + delta));
    if (target === pageIndex || (!single() && spreadForPage(target) === spread())) return;
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
    if (!single()) pageIndex = firstInOpening(spread());
    showHTML(); update();
    if (mode === 'landing') { const target = pageIndex; requestAnimationFrame(() => { pageIndex = target; scrollLanding({focus:true}); update(); }); return; }
    if (mode === '3d' && renderer && !failed) { try { await renderer.show(spread()); } catch { showGraphicsError(); } }
    stage.scrollIntoView({block:'start',behavior:'instant'});
    document.querySelector('#reader-toolbar').focus({preventScroll:true});
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
    if (!single()) pageIndex = firstInOpening(spread());
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.mode === mode)));
    document.querySelector('#html-view').hidden = mode !== 'html';
    document.querySelector('#webgl-view').hidden = mode !== '3d';
    document.querySelector('#stage-error').hidden = true; stage.classList.remove('graphics-failed');
    document.querySelector('#zoom-controls').hidden = mode === '3d';
    document.querySelector('#loading').hidden = mode !== '3d';
    showHTML(); update();
    if (mode === 'landing') { const target = pageIndex; layout(); requestAnimationFrame(() => { pageIndex = target; scrollLanding(); update(); }); return; }
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
  function applyZoom(value) {
    const target=pageIndex; zoom=value; layout();
    document.querySelector('#zoom-status').textContent=`${Math.round(zoom*100)}%`;
    if(mode==='landing')requestAnimationFrame(()=>{pageIndex=target;scrollLanding();update();});
  }
  document.querySelector('#zoom-in').addEventListener('click',()=>applyZoom(Math.min(3,zoom+.15)));
  document.querySelector('#zoom-out').addEventListener('click',()=>applyZoom(Math.max(.5,zoom-.15)));
  for(const id of ['zoom-reset','zoom-fit'])document.querySelector(`#${id}`).addEventListener('click',()=>applyZoom(1));
  document.querySelector('#fullscreen').addEventListener('click',async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { const button=document.querySelector('#fullscreen'); button.title='Tela cheia indisponível neste navegador'; button.disabled=true; } });
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
