import { artworks, pages, pageHTML } from './content.js';

export function createInteractions() {
  const dialog = document.querySelector('#interaction-dialog');
  const content = document.querySelector('#dialog-content');
  const label = document.querySelector('#dialog-label');
  let origin = null;
  let slides = null;
  let slideIndex = 0;
  function setImage(index) {
    slideIndex = (index + artworks.length) % artworks.length;
    const art = artworks[slideIndex];
    content.querySelector('img').src = art.src;
    content.querySelector('img').alt = `${art.title} — composição abstrata`;
    content.querySelector('.dialog-carousel-caption').textContent = art.caption;
    content.querySelector('#slide-status').textContent = `${slideIndex + 1} / ${artworks.length}`;
  }
  function open(type, pageIndex = 0, trigger) {
    const page = pages[pageIndex] || pages[0];
    slides = null;
    if (!dialog.open) origin = trigger || document.activeElement;
    dialog.classList.toggle('linear-dialog', type === 'linear');
    if (type === 'image') {
      const art = page.kind === 'gallery' ? artworks[Number(trigger?.closest('[data-carousel]')?.dataset.index || 0)] : page.image || artworks[0];
      label.textContent = 'UM OLHAR MAIS PERTO';
      content.innerHTML = `<h2 id="dialog-title">${art.title}</h2><img class="dialog-image" src="${art.src}" alt="${art.title} — composição abstrata"><p class="image-description">Arte demonstrativa vetorial. Redimensione a janela para explorar a composição em uma área maior.</p>`;
    } else if (type === 'carousel') {
      label.textContent = 'ENSAIO VISUAL · 3 COMPOSIÇÕES';
      slides = artworks;
      content.innerHTML = `<h2 id="dialog-title">Outros olhares.</h2><img class="dialog-image" alt=""><p class="dialog-carousel-caption" role="status" aria-live="polite"></p><div class="dialog-carousel-navigation"><button type="button" class="round-button" data-dialog-slide="-1" aria-label="Imagem anterior">←</button><span id="slide-status"></span><button type="button" class="round-button" data-dialog-slide="1" aria-label="Próxima imagem">→</button></div>`;
      setImage(0);
    } else if (type === 'linear') {
      label.textContent = 'LEITURA SEM FOLHEAMENTO';
      content.innerHTML = `<h2 id="dialog-title">A revista, no seu ritmo.</h2><div class="linear-content">${pages.map((p, i) => pageHTML(p, i, { linear: true })).join('')}</div>`;
    } else {
      label.textContent = 'UMA CAMADA A MAIS';
      content.innerHTML = `<h2 id="dialog-title">${page.id === 'outro' ? 'Primeiro a experiência. Depois a história.' : 'Entre uma página e outra, uma descoberta.'}</h2><p>Esta janela faz parte da revista. Ela abre espaço para uma nota, uma referência ou uma história complementar, mantendo a leitura no mesmo lugar.</p><p>${page.body || 'O Fronteira é um laboratório para experimentar a leitura como uma experiência interativa.'}</p><p>Este conteúdo é demonstrativo. A proposta editorial e o design system serão definidos depois de validar os templates.</p><a class="inline-link" href="#sobre" data-close-dialog>Conheça o experimento ↗</a>`;
    }
    if (!dialog.open) dialog.showModal();
    document.querySelector('#close-dialog').focus();
    dialog.scrollTop = 0;
  }
  const history = [];
  function close() {
    if (history.length) {
      const previous = history.pop();
      content.replaceChildren(...previous.nodes);
      label.textContent = previous.label;
      dialog.classList.toggle('linear-dialog', previous.linear);
      slides = previous.slides;
      slideIndex = previous.slideIndex;
      dialog.scrollTop = previous.scrollTop;
      previous.trigger?.focus();
    } else dialog.close();
  }
  document.querySelector('#close-dialog').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => { history.length = 0; if (origin?.isConnected) origin.focus(); });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }
    const move = event.target.closest('[data-dialog-slide]');
    if (move) setImage(slideIndex + Number(move.dataset.dialogSlide));
    if (event.target.closest('[data-close-dialog]')) { history.length = 0; dialog.close(); }
  });
  document.addEventListener('click', event => {
    const slide = event.target.closest('[data-slide]');
    if (slide) {
      const carousel = slide.closest('[data-carousel]');
      const index = (Number(carousel.dataset.index || 0) + Number(slide.dataset.slide) + artworks.length) % artworks.length;
      carousel.dataset.index = String(index);
      const art = artworks[index];
      const img = carousel.querySelector('img'); img.src = art.src; img.alt = `${art.title} — composição abstrata`;
      carousel.querySelector('.carousel-count').textContent = `${String(index + 1).padStart(2, '0')} / 03`;
      carousel.querySelector('.carousel-caption').textContent = art.caption;
      carousel.querySelector('[data-action="image"]').setAttribute('aria-label', `Ampliar: ${art.title}`);
      return;
    }
    const trigger = event.target.closest('[data-action]');
    if (trigger) {
      if (dialog.open) history.push({ nodes: [...content.childNodes], label: label.textContent, linear: dialog.classList.contains('linear-dialog'), slides, slideIndex, scrollTop: dialog.scrollTop, trigger });
      open(trigger.dataset.action, Number(trigger.dataset.page), trigger);
    }
  });
  document.addEventListener('keydown', event => {
    if (dialog.open && slides && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); setImage(slideIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  return { open, isOpen: () => dialog.open };
}
