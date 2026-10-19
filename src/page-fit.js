/** Ajusta o tamanho do texto de cada página de conteúdo ao espaço disponível, usando só degraus da escala tipográfica. */
const STEPS = [20, 18, 16];
const OPENING_STEPS = [32, 28, 24, ...STEPS];
const SKIP = '.page-cover, .page-contents, .page-team, .page-interview, .page-decorative, .linear-page';

function fits(page, scale) {
  const tail = page.querySelector('.page-tail');
  const main = page.querySelector('.page-main');
  if (!tail || !main) return true;
  const limit = tail.getBoundingClientRect().top - 12 * scale;
  const bottom = [...main.children].reduce((max, child) => Math.max(max, child.getBoundingClientRect().bottom), 0);
  return bottom <= limit;
}

export function fitPageText(root = document) {
  for (const page of root.querySelectorAll('.magazine-page')) {
    if (page.matches(SKIP) || !page.querySelector('.page-main .columns')) continue;
    const width = page.getBoundingClientRect().width;
    if (!width || !page.offsetWidth) continue;
    const scale = width / page.offsetWidth;
    page.style.removeProperty('--body-size');
    page.style.removeProperty('--body-leading');
    let chosen = 16;
    for (const size of page.dataset.pageId === 'opening' ? OPENING_STEPS : STEPS) {
      page.style.setProperty('--body-size', `${size}px`);
      page.style.setProperty('--body-leading', size >= 18 ? '1.5' : '1.45');
      if (fits(page, scale)) { chosen = size; break; }
    }
    page.style.setProperty('--body-size', `${chosen}px`);
    page.style.setProperty('--body-leading', chosen >= 18 ? '1.5' : '1.45');
  }
}

/** Reaplica o ajuste quando o conteúdo é inserido ou quando as fontes terminam de carregar. */
export function installPageFit() {
  let queued = false;
  const run = () => { queued = false; fitPageText(document); };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
  new MutationObserver(records => {
    if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 && (node.matches?.('.magazine-page, .page-frame, .html-book') || node.querySelector?.('.magazine-page'))))) schedule();
  }).observe(document.body, { childList: true, subtree: true });
  document.fonts?.ready.then(schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  schedule();
}
