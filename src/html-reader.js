import { getSpread, pageHTML } from './content.js';

export function createHTMLReader() {
  const book = document.querySelector('#html-book');
  let current = 0;
  let mobileSide = 0;
  let timer;
  const mobile = matchMedia('(max-width: 600px)');
  function render(index, side = 0) {
    current = index; mobileSide = side;
    book.innerHTML = getSpread(index).map((page, offset) => pageHTML(page, index * 2 + offset)).join('');
    book.children[side]?.classList.add('mobile-visible');
    for (const [i, page] of [...book.children].entries()) page.inert = mobile.matches && i !== side;
  }
  function show(index, side = 0, animate = true) {
    const old = current;
    const turning = index !== old && animate && !mobile.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const oldPage = book.children[index > old ? 1 : 0]?.cloneNode(true);
    clearTimeout(timer);
    render(index, side);
    if (turning && oldPage) {
      const sheet = document.createElement('div'); sheet.className = `turn-sheet ${index > old ? 'forward' : 'backward'}`;
      sheet.inert = true; sheet.setAttribute('aria-hidden', 'true'); sheet.append(oldPage); book.append(sheet);
      timer = setTimeout(() => sheet.remove(), 580);
    }
  }
  mobile.addEventListener('change', () => render(current, mobileSide));
  render(0);
  return { show };
}
