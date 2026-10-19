const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
let coverSequence = 0;

/** Physical covers are unnumbered surfaces, shared by HTML and texture rendering. */
export function coverHTML(page, index, { linear = false } = {}) {
  const title = page.title || 'Energia Nuclear no Brasil';
  const windows = `cover-windows-${++coverSequence}`;
  return `<article class="magazine-page page-cover edition-cover${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="Capa: ${escape(title.replaceAll('\n', ' '))}">
    <div class="page-main cover-artwork">
      <canvas class="cover-lava-gl" width="380" height="532" aria-hidden="true"></canvas>
      <svg class="cover-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><clipPath id="${windows}" clipPathUnits="objectBoundingBox"><path transform="scale(.0013158 .00093985)" d="M140 428C225 399 303 439 294 523C286 598 217 631 240 706C264 781 340 827 299 902C253 985 107 1029 35 944C-31 867 16 800 51 728C88 650 31 605 36 540C40 485 83 447 140 428Z"/><path transform="scale(.0013158 .00093985)" d="M506 669C557 624 655 631 702 690C757 758 741 847 668 887C606 922 504 900 474 835C443 768 459 712 506 669Z"/></clipPath></defs></svg>
      <div class="cover-windows" style="clip-path:url(#${windows})"><img class="cover-photograph" src="/assets/photos/angra-cover.jpg" alt="Vista da Central Nuclear Almirante Álvaro Alberto, em Angra dos Reis. Fotografia: Eletronuclear." decoding="async" fetchpriority="high" draggable="false"></div>
      <p class="cover-eyebrow"><span>ENERGIA, SOCIEDADE E BRASIL</span></p>
      <div class="cover-copy"><h2 class="cover-title">Energia<br>Nuclear<br><span>no Brasil</span></h2></div>
      <div class="cover-imprint"><span aria-hidden="true"></span><img class="publisher-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35"><img class="cover-barcode" src="/assets/qr/barcode.svg" alt="" aria-hidden="true" width="128" height="46"></div>
    </div>
  </article>`;
}

export function decorativeHTML(page, index, { linear = false } = {}) {
  const back = page.kind === 'back-cover';
  if (page.body?.length) {
    return `<article class="magazine-page page-decorative page-inside-cover edition-intro${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="${escape(page.title || 'Apresentação da edição')}"><div class="page-main"><span class="intro-eyebrow">UMA PUBLICAÇÃO FRONTEIRA</span><h2>${escape(page.title || 'Energia Nuclear no Brasil').replaceAll('\n', '<br>')}</h2><div class="columns">${page.body.map(text => `<p>${escape(text)}</p>`).join('')}</div><img class="publisher-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35"></div></article>`;
  }
  if (back) return `<article class="magazine-page page-decorative page-back-cover${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="${escape(page.title || 'Contracapa')}"><div class="page-main decorative-artwork cover-artwork"><canvas class="cover-lava-gl" width="380" height="532" data-count="8" data-size=".68" aria-hidden="true"></canvas><img class="publisher-brand decorative-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35"><p class="back-caption">Energia Nuclear no Brasil<br>Publicado pela Editora Fronteira</p></div></article>`;
  return `<article class="magazine-page page-decorative page-${escape(page.kind)}${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="${escape(page.title || (back ? 'Contracapa' : 'Verso da capa'))}"><div class="page-main decorative-artwork"><div class="publisher-pattern" aria-hidden="true">${Array.from({ length: 12 }, () => '<i></i>').join('')}</div>${back ? '<img class="publisher-brand decorative-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35">' : '<img class="publisher-brand decorative-brand decorative-brand-tonal" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35">'}</div></article>`;
}
