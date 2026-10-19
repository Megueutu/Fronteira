const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Physical covers are unnumbered surfaces, shared by HTML and texture rendering. */
export function coverHTML(page, index, { linear = false } = {}) {
  const title = page.title || 'Energia Nuclear no Brasil';
  return `<article class="magazine-page page-cover edition-cover${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="Capa: ${escape(title.replaceAll('\n', ' '))}">
    <div class="page-main cover-artwork">
      <img class="cover-photograph" src="/assets/photos/angra-cover.jpg" alt="Vista da Central Nuclear Almirante Álvaro Alberto, em Angra dos Reis. Fotografia: Eletronuclear." decoding="async" fetchpriority="high" draggable="false">
      <div class="cover-copy"><span class="cover-eyebrow">ENERGIA · SOCIEDADE · BRASIL</span><h2 class="cover-title">Energia<br>Nuclear<br><span>no Brasil</span></h2><p class="cover-deck">${escape(page.subtitle)}</p></div>
      <div class="cover-lower"><p class="cover-callout"><strong>Da mina à tomada.</strong><span>Matriz, tecnologia, urânio,<br>custos e decisões políticas.</span></p><a class="cover-qr" href="https://megueutu.github.io/Fronteira/" aria-label="Abrir a edição digital da revista"><img src="/assets/qr/site.svg" alt="QR code para a revista digital" width="104" height="104"><span>A EDIÇÃO DIGITAL</span></a></div>
      <div class="cover-imprint"><img class="publisher-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35"><img class="cover-barcode" src="/assets/qr/barcode.svg" alt="" aria-hidden="true" width="128" height="46"></div>
    </div>
  </article>`;
}

export function decorativeHTML(page, index, { linear = false } = {}) {
  const back = page.kind === 'back-cover';
  if (page.body?.length) {
    return `<article class="magazine-page page-decorative page-inside-cover edition-intro${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="${escape(page.title || 'Apresentação da edição')}"><div class="page-main"><span class="intro-eyebrow">UMA PUBLICAÇÃO FRONTEIRA</span><h2>${escape(page.title || 'Energia Nuclear no Brasil').replaceAll('\n', '<br>')}</h2><div class="columns">${page.body.map(text => `<p>${escape(text)}</p>`).join('')}</div><img class="publisher-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35"></div></article>`;
  }
  return `<article class="magazine-page page-decorative page-${escape(page.kind)}${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="${escape(page.title || (back ? 'Quarta capa' : 'Face interna da capa'))}"><div class="page-main decorative-artwork"><div class="publisher-pattern" aria-hidden="true">${Array.from({ length: 12 }, () => '<i></i>').join('')}</div>${back ? '<img class="publisher-brand decorative-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35">' : '<img class="publisher-brand decorative-brand decorative-brand-tonal" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35">'}</div></article>`;
}
