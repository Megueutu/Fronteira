export const artworks = [
  { src: '/assets/landscape.svg', title: 'Entre planos', caption: '01 / Planos que se encontram. Estudo de formas, luz e profundidade.' },
  { src: '/assets/orbit.svg', title: 'Em órbita', caption: '02 / Um círculo, muitas direções. Estudo de ritmo e movimento.' },
  { src: '/assets/arch.svg', title: 'Passagem', caption: '03 / Uma abertura para outro olhar. Estudo de espaço e contraste.' },
];

export const pages = [
  { id: 'cover', kind: 'cover', label: 'EDIÇÃO EXPERIMENTAL · 001', title: 'Entre\numa página\ne outra.', subtitle: 'Um estudo sobre a forma de ler.', image: artworks[0], action: { type: 'popup', label: 'Abra uma nova perspectiva', x: .5, y: .84 } },
  { id: 'intro', kind: 'intro', label: 'NOTA DE ABERTURA', title: 'A leitura\nnão precisa\nparar aqui.', body: 'Uma revista pode guardar mais do que cabe no papel. Uma imagem se abre. Uma história ganha outra camada. Um pequeno gesto muda o caminho.', quote: 'Folhear é só\no começo.', action: { type: 'popup', label: 'Uma nota sobre este estudo', x: .5, y: .84 } },
  { id: 'gallery', kind: 'gallery', label: 'ENSAIO VISUAL / 01', title: 'O mesmo lugar.\nOutros olhares.', body: 'Três composições, um convite: demorar um pouco mais na imagem.', image: artworks[0], action: { type: 'carousel', label: 'Explorar as três imagens', x: .5, y: .84 } },
  { id: 'story', kind: 'story', label: 'NAS ENTRELINHAS / 02', title: 'Há histórias\nque começam\ncom um clique.', body: 'Nem tudo precisa estar visível à primeira vista. Abra a nota para encontrar um detalhe que estava esperando por você.', quote: 'O detalhe também\nfaz parte da história.', action: { type: 'popup', label: 'Ler nas entrelinhas', x: .5, y: .84 } },
  { id: 'detail', kind: 'detail', label: 'EM FOCO / 03', title: 'Um convite\na olhar de perto.', body: 'Uma imagem pode ser uma pausa. Amplie e descubra os encontros entre linhas, cores e formas.', image: artworks[2], action: { type: 'image', label: 'Ampliar a imagem', x: .5, y: .84 } },
  { id: 'outro', kind: 'outro', label: 'O PRÓXIMO CAPÍTULO', title: 'A forma muda.\nA curiosidade\ncontinua.', body: 'Este é um espaço de experimentação. Primeiro, descobrimos como a revista funciona. Depois, o que ela quer contar.', quote: 'O que você gostaria\nde encontrar aqui?', action: { type: 'popup', label: 'Sobre os próximos passos', x: .5, y: .84 } },
];

export const spreadCount = Math.ceil(pages.length / 2);
export const clampSpread = value => Math.max(0, Math.min(spreadCount - 1, value));
export function getSpread(index) { return pages.slice(clampSpread(index) * 2, clampSpread(index) * 2 + 2); }
export function formatPages(index) { return `${String(index * 2 + 1).padStart(2, '0')} — ${String(Math.min(index * 2 + 2, pages.length)).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`; }

export function pageHTML(page, index, { linear = false } = {}) {
  const action = `<button type="button" class="page-action" data-action="${page.action.type}" data-page="${index}"><span>${page.action.label}</span><b aria-hidden="true"><i class="${page.action.type === 'image' ? 'icon-expand' : 'icon-diagonal'}"></i></b></button>`;
  const image = page.image ? `<${linear ? 'div' : 'button'} ${linear ? '' : `type="button" data-action="image" data-page="${index}" aria-label="Ampliar: ${page.image.title}"`} class="page-art"><img src="${page.image.src}" alt="${page.image.title} — composição abstrata" draggable="false"></${linear ? 'div' : 'button'}>` : '';
  const carousel = page.kind === 'gallery' && !linear ? `<div class="inline-carousel" data-carousel="${index}"><div class="carousel-art"><button type="button" class="page-art" data-action="image" data-page="${index}" aria-label="Ampliar imagem do carrossel"><img src="${artworks[0].src}" alt="${artworks[0].title} — composição abstrata" draggable="false"></button><div class="carousel-controls"><button type="button" data-slide="-1" aria-label="Imagem anterior">←</button><span class="carousel-count" role="status" aria-live="polite">01 / 03</span><button type="button" data-slide="1" aria-label="Próxima imagem">→</button></div></div><p class="carousel-caption">${artworks[0].caption}</p></div>` : image;
  return `<article class="magazine-page page-${page.kind}${linear ? ' linear-page' : ''}" aria-label="Página ${index + 1}: ${page.title.replaceAll('\n', ' ')}"><div class="page-top"><span>FRONTEIRA</span><span>${page.label}</span></div><div class="page-main"><h2>${page.title.replaceAll('\n', '<br>')}</h2>${page.subtitle ? `<p class="page-subtitle">${page.subtitle}</p>` : ''}${page.body ? `<p class="page-body">${page.body}</p>` : ''}${carousel}${page.quote ? `<blockquote>${page.quote.replaceAll('\n', '<br>')}</blockquote>` : ''}</div>${action}<div class="page-bottom"><span>UM ESTUDO EM ABERTO</span><span>${String(index + 1).padStart(2, '0')}</span></div></article>`;
}
