const photos = [
  { file: 'transmission.jpg', alt: 'Torres de transmissão ao entardecer', credit: 'Matthew Henry / Unsplash', url: 'https://unsplash.com/photos/yETqkLnhsUI', caption: 'Fotografia ilustrativa de transmissão. A imagem não identifica uma instalação brasileira.' },
  { file: 'nuclear-night.jpg', alt: 'Torres de resfriamento iluminadas à noite', credit: 'Nicolas Hippert / Unsplash', url: 'https://unsplash.com/photos/C82jAEQkfE0', caption: 'Fotografia ilustrativa de usina. Não representa as instalações de Angra.' },
  { file: 'control-room.jpg', alt: 'Painel histórico de controle com instrumentos analógicos', credit: 'Dan Meyers / Unsplash', url: 'https://unsplash.com/photos/cHR1Q2g1_F4', caption: 'Painel histórico de controle. Não representa a sala de controle de Angra.' },
  { file: 'nuclear-lake.jpg', alt: 'Torres de resfriamento vistas através de um lago', credit: 'Hansjorg Keller / Unsplash', url: 'https://unsplash.com/photos/WmQgU73hngg', caption: 'Fotografia ilustrativa de instalação industrial com torres de resfriamento. Localização não validada; não representa Angra.' },
  { file: 'wind.jpg', alt: 'Aerogeradores em paisagem de dunas', credit: 'Jaime Dantas / Unsplash', url: 'https://unsplash.com/photos/ppAKt8nCVoI', caption: 'Fotografia ilustrativa de geração eólica. Integra o acervo para a comparação entre fontes.' },
];
const chapters = [
  { label: 'Panorama', title: 'Um Brasil<br><em>desigual.</em>', deck: 'Olhar para a energia também é olhar para o território, para a conta de luz e para quem participa das decisões.', heading: 'A energia não termina<br>no interruptor.', one: 'Uma revista sobre energia nuclear também precisa perguntar como a eletricidade se relaciona com o cotidiano. A geração é uma parte da história; o acesso, as tarifas e o território completam essa leitura.', two: 'Milton Santos acompanha o olhar sobre desigualdade. Ao longo dos cinco temas, Weber e Wallerstein ajudam a organizar outras perguntas sobre decisões políticas, tecnologia e soberania.', note: 'Uma lente para o território', noteText: 'O texto de Milton Santos será relacionado a território, distribuição e desigualdade. O box explica o conceito; a análise central permanece na reportagem, acessível sem abrir esta janela.', photo: 0, kicker: 'UMA QUESTÃO DE ACESSO' },
  { label: 'Como funciona', title: 'Por dentro<br><em>da energia.</em>', deck: 'Uma leitura visual do funcionamento de uma usina, do combustível aos resíduos.', heading: 'Entender antes<br>de tomar posição.', one: 'Esta seção reúne a explicação do processo nuclear, do funcionamento do reator e do caminho até a eletricidade. Um esquema pode ser explorado por etapas, respeitando a ordem de leitura.', two: 'Segurança, resíduos e limites da tecnologia entram na reportagem. As curiosidades ficam em notas laterais; as explicações necessárias à compreensão continuam disponíveis no texto principal.', note: 'Tecnologia em contexto', noteText: 'Proposta de interação: explicar termos técnicos com notas curtas, diagramas por etapas e imagens identificadas. O conteúdo científico final será adaptado do DOCX e revisado antes da publicação.', photo: 2, kicker: 'TECNOLOGIA EM PERSPECTIVA' },
  { label: 'Urânio', title: 'Do minério<br><em>à soberania.</em>', deck: 'O ciclo do combustível como ponto de partida para discutir a posição brasileira no mundo.', heading: 'De onde vem.<br>Por onde passa.', one: 'Reservas, produção e etapas do combustível formam o percurso deste tema. Um mapa ou esquema pode abrir informações sobre cada etapa sem exigir a saída da revista.', two: 'Wallerstein entra aqui: quem foi, como funciona a ideia de sistema-mundo e quais críticas ela recebe. A explicação terá espaço na leitura principal, além de notas complementares.', note: 'Conhecer Wallerstein', noteText: 'A seção deve apresentar o autor, centro, semiperiferia e periferia, aplicação ao caso brasileiro e críticas à teoria. Esta nota demonstra o acesso à camada complementar; o texto final ainda será editado.', photo: 1, kicker: 'COMBUSTÍVEL E SOBERANIA' },
  { label: 'Custo e payback', title: 'Quanto custa<br><em>essa aposta?</em>', deck: 'Cenários, premissas e limites do cálculo de Angra 3, colocados lado a lado.', heading: 'O cálculo precisa<br>mostrar suas premissas.', one: 'Os cenários de payback do trabalho terão apresentação comparável. Um gráfico poderá destacar cada cenário e exibir as premissas correspondentes, sem transformar estimativa em promessa.', two: 'Tarifas, distribuição dos benefícios e quem arca com os custos conectam o cálculo à análise sociológica. Os valores do acervo precisam de revisão de fontes antes de virar visualização interativa.', note: 'Como ler os cenários', noteText: 'Interação prevista para a edição: escolher um cenário, consultar suas hipóteses e voltar à comparação. Este estudo não calcula nem apresenta uma projeção financeira nova.', photo: 3, kicker: 'CUSTOS, ESCOLHAS E CONSEQUÊNCIAS' },
  { label: 'Política', title: 'Quem decide<br><em>o futuro?</em>', deck: 'Política, opinião pública e experiências internacionais como parte da mesma discussão.', heading: 'Uma tecnologia.<br>Diferentes escolhas.', one: 'O Plano Messmer e os países que abandonaram ou reconsideraram o nuclear integram este tema. A proposta é uma linha do tempo explorável com datas e fontes revisadas.', two: 'Max Weber orienta a leitura sobre decisões e racionalização. Opinião pública, confiança e participação completam a reportagem, mantendo os argumentos a favor e em debate com o mesmo peso visual.', note: 'Uma lente para as decisões', noteText: 'A relação entre Weber, racionalização e escolhas de Estado será desenvolvida no texto. Notas e documentos podem aprofundar a leitura, sem ocupar o lugar dos argumentos principais.', photo: 1, kicker: 'DECISÕES PÚBLICAS' },
];
const $ = selector => document.querySelector(selector);
let current = 0, galleryIndex = 0, origin;
const dialog = $('#study-dialog');
const content = $('#dialog-content');
function render(index) {
  current = index;
  const chapter = chapters[index], photo = photos[chapter.photo];
  $('#chapter-label').textContent = `${String(index + 1).padStart(2, '0')} / ${chapter.label.toUpperCase()}`;
  $('#chapter-title').innerHTML = chapter.title;
  $('#chapter-deck').textContent = chapter.deck;
  $('#reading-title').innerHTML = chapter.heading;
  $('#paragraph-one').textContent = chapter.one;
  $('#paragraph-two').textContent = chapter.two;
  $('#note-name').textContent = chapter.note;
  $('.kicker').textContent = chapter.kicker;
  $('#cover-photo').src = `./assets/${photo.file}`;
  $('#cover-photo').alt = photo.alt;
  $('#expand-photo').setAttribute('aria-label', `Ampliar: ${photo.alt}`);
  $('#photo-credit').textContent = `${photo.credit} · imagem ilustrativa${chapter.photo === 0 || chapter.photo === 4 ? '' : '; não representa Angra'}`;
  $('#position').textContent = `${String(index + 1).padStart(2, '0')} / 05 TEMAS`;
  $('#left-number').textContent = `ABERTURA ${String(index + 1).padStart(2, '0')}`;
  $('#right-number').textContent = `LEITURA ${String(index + 1).padStart(2, '0')}`;
  $('#previous').disabled = index === 0;
  $('#next').disabled = index === chapters.length - 1;
  document.querySelectorAll('[data-chapter]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.chapter) === index)));
}
function open(markup, trigger) {
  origin = trigger || document.activeElement;
  content.innerHTML = markup;
  dialog.showModal();
  $('#close-dialog').focus();
  dialog.scrollTop = 0;
}
function photoHTML(photo) {
  return `<figure><img src="./assets/${photo.file}" alt="${photo.alt}"><figcaption>${photo.caption} <a href="${photo.url}" target="_blank" rel="noopener">${photo.credit} ↗</a></figcaption></figure>`;
}
document.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => render(Number(button.dataset.chapter))));
$('#previous').addEventListener('click', () => render(Math.max(0, current - 1)));
$('#next').addEventListener('click', () => render(Math.min(chapters.length - 1, current + 1)));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { if (origin?.isConnected) origin.focus(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
$('#expand-photo').addEventListener('click', event => open(`<h2 id="dialog-title">Um olhar mais perto.</h2>${photoHTML(photos[chapters[current].photo])}`, event.currentTarget));
$('#open-note').addEventListener('click', event => open(`<h2 id="dialog-title">${chapters[current].note}</h2><p>${chapters[current].noteText}</p><p class="credit">Nota demonstrativa de planejamento editorial.</p>`, event.currentTarget));
$('#open-index').addEventListener('click', event => open(`<h2 id="dialog-title">Cinco temas. Uma leitura.</h2><ul class="index-list">${chapters.map((chapter, i) => `<li><button data-jump="${i}"><span>0${i + 1}</span>${chapter.label} ↗</button></li>`).join('')}</ul><p class="credit">Antes: capa, sumário e editorial do grupo. Depois: balanço final, atestado de IA e referências. Nome definitivo da revista em aberto.</p>`, event.currentTarget));
$('#open-gallery').addEventListener('click', event => {
  galleryIndex = chapters[current].photo;
  open(`<h2 id="dialog-title">Outros enquadramentos.</h2><div id="gallery-photo">${photoHTML(photos[galleryIndex])}</div><div class="gallery-nav"><button data-gallery="-1" aria-label="Foto anterior">←</button><span id="gallery-position" role="status">${galleryIndex + 1} / ${photos.length}</span><button data-gallery="1" aria-label="Próxima foto">→</button></div>`, event.currentTarget);
});
const steps = [
  ['Geração', 'O ponto de partida é a produção de eletricidade. A reportagem compara fontes e apresenta o funcionamento nuclear.'],
  ['Transmissão', 'A leitura passa pelas redes e pelo território. A fotografia desta abertura é ilustrativa dessa etapa.'],
  ['Distribuição e acesso', 'O foco chega ao cotidiano: acesso, qualidade do fornecimento e tarifas são perguntas da reportagem.'],
];
$('#open-diagram').addEventListener('click', event => open(`<h2 id="dialog-title">Da geração ao cotidiano.</h2><p>Explore uma etapa. Esta demonstração organiza perguntas da reportagem; não apresenta dados quantitativos.</p><div class="diagram-tabs" role="group" aria-label="Etapas da eletricidade">${steps.map((step, i) => `<button data-step="${i}" aria-pressed="${i === 0}">${i + 1}. ${step[0]}</button>`).join('')}</div><p class="diagram-copy" id="step-copy" role="status">${steps[0][1]}</p>`, event.currentTarget));
content.addEventListener('click', event => {
  const jump = event.target.closest('[data-jump]');
  if (jump) { render(Number(jump.dataset.jump)); dialog.close(); }
  const move = event.target.closest('[data-gallery]');
  if (move) {
    galleryIndex = (galleryIndex + Number(move.dataset.gallery) + photos.length) % photos.length;
    $('#gallery-photo').innerHTML = photoHTML(photos[galleryIndex]);
    $('#gallery-position').textContent = `${galleryIndex + 1} / ${photos.length}`;
  }
  const step = event.target.closest('[data-step]');
  if (step) {
    content.querySelectorAll('[data-step]').forEach(button => button.setAttribute('aria-pressed', String(button === step)));
    $('#step-copy').textContent = steps[Number(step.dataset.step)][1];
  }
});
$('#linear').addEventListener('click', event => open(`<h2 id="dialog-title">Leia no seu ritmo.</h2>${chapters.map(chapter => `<section class="linear-section"><h3>${chapter.label}</h3><p>${chapter.deck}</p><p>${chapter.one}</p><p>${chapter.two}</p></section>`).join('')}`, event.currentTarget));
document.addEventListener('keydown', event => {
  if (dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); render(Math.max(0, current - 1)); }
  if (event.key === 'ArrowRight') { event.preventDefault(); render(Math.min(chapters.length - 1, current + 1)); }
});
render(0);
