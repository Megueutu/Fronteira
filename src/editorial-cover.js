const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
let coverSequence = 0;

/** Physical covers are unnumbered surfaces, shared by HTML and texture rendering. */
export function coverHTML(page, index, { linear = false } = {}) {
  const title = page.title || 'Energia Nuclear no Brasil';
  const mask = `cover-lava-${++coverSequence}`;
  return `<article class="magazine-page page-cover edition-cover${linear ? ' linear-page' : ''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="Capa: ${escape(title.replaceAll('\n', ' '))}">
    <div class="page-main cover-artwork">
      <img class="cover-photograph" src="/assets/photos/angra-cover.jpg" alt="Vista da Central Nuclear Almirante Álvaro Alberto, em Angra dos Reis. Fotografia: Eletronuclear." decoding="async" fetchpriority="high" draggable="false">
      <svg class="cover-lava" viewBox="0 0 760 1064" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="${mask}-left"><rect y="292" width="370" height="772"/></clipPath>
          <clipPath id="${mask}-right"><rect x="440" y="600" width="320" height="464"/></clipPath>
          <linearGradient id="${mask}-green" x2=".25" y2="1"><stop stop-color="#138649"/><stop offset=".55" stop-color="#47a948"/><stop offset="1" stop-color="#c5dd86"/></linearGradient>
          <mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="1064" style="mask-type:luminance"><rect width="760" height="1064" fill="white"/>
            <g fill="black"><g clip-path="url(#${mask}-left)"><g class="lava-response"><path class="lava-window lava-window-a" d="M115 312C207 267 300 320 293 427C287 510 214 545 240 642C264 734 349 813 299 902C253 985 107 1029 35 944C-31 867 16 770 51 692C92 599 26 552 34 459C38 389 62 339 115 312Z"/></g></g>
            <g clip-path="url(#${mask}-right)"><g class="lava-response"><path class="lava-window lava-window-b" d="M506 669C557 624 655 631 702 690C757 758 741 847 668 887C606 922 504 900 474 835C443 768 459 712 506 669Z"/></g></g>
            <path class="lava-window lava-window-c" d="M410 982C488 925 548 958 610 940C693 915 746 938 796 997L810 1100L323 1100C322 1046 367 1013 410 982Z"/></g>
          </mask>
        </defs>
        <rect width="760" height="1064" fill="url(#${mask}-green)" mask="url(#${mask})"/>
        <path class="lava-accent lava-accent-a" d="M-47 18C29-15 95 35 86 109C77 178 14 199 44 268C72 334 49 393-18 405Z" fill="#99d635"/>
        <path class="lava-accent lava-accent-b" d="M724-35C680 17 689 77 737 111C782 143 799 197 780 251L845 239L840-40Z" fill="#087f89"/>
        <path class="lava-accent lava-accent-c" d="M292 1069C252 1020 293 984 303 945C314 900 288 871 318 846C352 817 393 840 395 880C397 921 356 941 360 984C365 1022 395 1042 395 1085Z" fill="#068d96"/>
      </svg>
      <div class="cover-copy"><span class="cover-eyebrow">ENERGIA · SOCIEDADE · BRASIL</span><h2 class="cover-title">Energia<br>Nuclear<br><span>no Brasil</span></h2><p class="cover-deck">${escape(page.subtitle)}</p></div>
      <div class="cover-lower"><p class="cover-callout"><strong>Da mina à tomada.</strong><span>Matriz, tecnologia, urânio,<br>custos e decisões políticas.</span></p><a class="cover-qr" href="https://megueutu.github.io/Fronteira/" aria-label="Abrir a edição digital da revista"><img src="/assets/qr/site.svg" alt="QR code para a revista digital" width="104" height="104"><span>A EDIÇÃO DIGITAL</span></a></div>
      <div class="cover-imprint"><img class="publisher-brand" src="/assets/branding/fronteira.svg" alt="Editora Fronteira" width="272" height="35"><img class="cover-barcode" src="/assets/qr/barcode.svg" alt="" aria-hidden="true" width="128" height="46"></div>
      <button type="button" class="cover-motion-toggle" aria-pressed="false">Pausar formas</button>
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
