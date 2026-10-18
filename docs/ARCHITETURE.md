# Arquitetura da revista interativa

Status: edição de 20 páginas implementada em 2026-10-16. Mantém-se a grafia solicitada deste arquivo. Consulte [REVIEW.md](REVIEW.md) para decisões de revisão e limites de validação.

## Estrutura

Aplicação estática com JavaScript, HTML/CSS e WebGL nativos, sem bibliotecas, fontes remotas ou instalação de dependências. Node.js 22 ou superior serve os arquivos com `npm start`. O build `npm run build:pages` gera `_site/` e adapta os caminhos da raiz ao `BASE_PATH` de publicação. O workflow `.github/workflows/pages.yml` testa e publica a `main` no GitHub Pages a cada push, com acionamento manual disponível. Apenas arquivos do site entram no artefato; a branch da nova identidade visual permanece independente até sua integração à `main`.

| Arquivo | Responsabilidade |
| --- | --- |
| `src/content.js` | Vinte páginas, imagens, bibliografia, destinos do sumário e composição HTML. |
| `src/citations.js` | Catálogo de fontes, localizadores por parágrafo e gráfico, distinção entre fontes e análise do grupo, painel da abertura. |
| `src/interview.js` | Perfil, fontes, sínteses e roteiro da entrevista com Adolfo Braid; sem citações literais atribuídas às notas. |
| `src/data.js` | Dados da matriz, fórmulas e cenários, etapas e recortes históricos. |
| `src/explorers.js` | Carrosséis na leitura, exploração da matriz, simulador e gráfico comparativo de payback; controles e estado por componente. |
| `src/app.js` | Página atual, modos, navegação, URL, enquadramento, teclado, toque e falhas. |
| `src/interactions.js` | Galeria, notas, ampliação, sumário, fontes, diagramas, cenários e leitura ampliada. |
| `src/styles.css` | Tokens, composições editoriais, colunas, responsividade, foco e camadas. |
| `src/webgl-reader.js` | Geometria segmentada, projeção e API de criação do renderer. |
| `src/webgl-scene.js` | Recursos WebGL, texturas, virada e projeção dos botões HTML. |
| `scripts/chromium.mjs` | Controle de um Chromium local por CDP/WebSocket, sem biblioteca adicional. |
| `scripts/render-textures.mjs` | Geração e inspeção geométrica das vinte páginas. |
| `assets/photos/` | Fotografias locais e otimizadas. |
| `assets/textures/` | Composição editorial gerada em JPEG e manifesto de origem. |
| `tests/` | Invariantes, cálculos, recursos e fluxos reais no navegador. |

O conteúdo é local e confiável. Introduzir CMS ou conteúdo remoto exigirá validação e tratamento de HTML. Não há backend de produto, banco, autenticação ou telemetria.

## Uma composição para dois modos

`pageHTML` compõe a página lógica de 760 × 1064 pixels. O HTML usa essa composição diretamente. O script de renderização abre cada página em Chromium e grava uma textura de 1140 × 1596 pixels para o 3D. Assim, justificação, quebras, fotografias, fontes e espaçamentos são produzidos pelo mesmo mecanismo de layout.

O manifesto contém a contagem e um hash normalizado do conteúdo, dos dados e do CSS. O teste unitário detecta divergência após mudanças. Capturas PNG e o relatório de limites ficam em `artifacts/`, ignorado pelo Git; os JPEGs usados pelo leitor são versionados. O navegador do leitor não precisa gerar texturas em tempo real nem instalar dependências.

Não se trata de PDF ou captura de um documento Word. O HTML permanece selecionável e interativo. As texturas dão a mesma composição às superfícies curvas e são complementadas por botões HTML.

## Folheamento HTML

O desktop mostra duas páginas com transição CSS de folha plana. A cópia visual é `inert` e oculta de tecnologias assistivas. O texto pode ser selecionado; imagens e ações permanecem em DOM. Zoom aumenta a superfície e permite rolagem.

No celular, o HTML mostra uma página em fluxo vertical, com corpo de 18 px e uma coluna, preservando o conteúdo. Toque horizontal dispara a troca ao soltar. O gesto não acompanha continuamente o dedo. A leitura ampliada e a leitura contínua também funcionam sem depender de WebGL.

## Página inteira

Implementado em 2026-10-17 a pedido do responsável. `?template=landing` abre a edição como site: capa com título e fotografia lado a lado no desktop; vinte artigos em fluxo, com títulos laterais, texto legível e sumário em cartões. No celular, os blocos empilham. Esse modo não usa a escala fixa de impressão nem a textura WebGL.

`src/app.js` compõe `#landing-view` uma única vez com a mesma função `pageHTML`, acrescenta IDs de destino e um título principal `h1`, e reutiliza a delegação de interações existente. A seleção é sincronizada por um `IntersectionObserver` com a faixa visível abaixo da barra fixa. Sumário, Home/End e setas levam à seção; o destino recebe foco programático no título. A URL mantém `template=landing&page=N`. Ao sair, a posição é ajustada ao par de páginas quando necessário. Zoom de página e a ampliação de abertura ficam ocultos nesse modo; as ampliações de fotos, gráficos e notas continuam disponíveis.

Foram consultados os guias de [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) e [scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-margin-top) da MDN. A implementação usa APIs nativas do navegador e os componentes e assets locais; não incorpora código externo nem nova biblioteca.

O teste `npm run test:landing` cobre link direto, quantidade de seções, sumário, foco, atualização durante rolagem, troca de modos e limites responsivos. Capturas e medições da revisão ficam em `artifacts/landing/`.

## Aplicações na leitura (2026-10-17)

`src/explorers.js` acrescenta cinco componentes em Página inteira, HTML móvel, leitura contínua e leitura ampliada: ensaio fotográfico na página 04, exploração da matriz na 05, simulador de payback na 13, faixas de tarifas na 14 e carrossel internacional na 16. Atalhos junto aos títulos levam ao componente e dão foco a seus controles. O texto original e as fontes dos parágrafos permanecem no percurso.

Os componentes usam os dados e fórmulas de `src/data.js` e as fotografias já licenciadas do acervo. A matriz mantém a escala de 0 a 51,7% e o denominador nacional ao filtrar; o filtro Renováveis reúne somente as quatro fontes assim identificadas na tabela. O simulador compara R$ 23,9 bilhões e R$ 35,9 bilhões sob as mesmas premissas, em eixo fixo de 0 a 30 anos. A calculadora modal também passou a mostrar esse gráfico, disponível pelos hotspots do 3D. Cada instância tem estado no próprio DOM; não existem IDs de formulário duplicados entre leitura e diálogos.

Os carrosséis usam rolagem horizontal nativa e CSS Scroll Snap, com botões, indicadores, contagem, teclado e itens inativos `inert`. Não há avanço automático. A navegação local não vira a página da revista; gestos sobre o componente não disparam a virada do HTML móvel. O estado é mantido ao ampliar uma foto e retornar à leitura. Controles e gráficos respeitam movimento reduzido.

Pesquisa técnica: [W3C WAI, carrosséis](https://www.w3.org/WAI/tutorials/carousels/), [MDN, Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-snap-type) e [MDN, input range](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range). Implementação própria com DOM/CSS nativos; não foi copiado código externo nem acrescentada biblioteca ou fotografia. As licenças das imagens continuam em [IMAGE_SOURCES.md](IMAGE_SOURCES.md).

As páginas fixas e as texturas mantêm as figuras estáticas. `pageHTML(...,{digital:false})` evita montar os componentes e suas imagens lazy na geração das texturas e no HTML desktop fixo. Os módulos ficam disponíveis na ampliação/rolagem. O manifesto de origem inclui `src/explorers.js`. Teste de fluxo: `npm run test:explorers`.

## Folheamento 3D

WebGL desenha folhas segmentadas com deformação durante a virada, iluminação simplificada e texturas de frente/verso orientadas para a leitura. Camadas sugerem espessura. O enquadramento é fixo, sem câmera livre ou simulação física completa.

Carrega-se o par atual sob demanda. Uma virada mantém os pares de origem e destino; ao terminar, texturas que não pertencem à abertura atual são descartadas. Os testes conferem dois recursos ao estabilizar. Não se carregam as vinte páginas na GPU simultaneamente.

Botões HTML são projetados sobre a faixa de ação das páginas e ocultados durante a virada. O texto das texturas não é selecionável; “Ler esta abertura” abre a composição HTML em tamanho confortável. O 3D mantém duas páginas no celular quando escolhido explicitamente; o modo inicial em uma visita móvel sem preferência na URL é HTML.

Falha ao iniciar ou perda de contexto WebGL mostra a composição HTML e mantém a navegação. Não há recuperação automática do contexto perdido. Não se afirmam FPS, consumo energético ou compatibilidade em hardware real.

## Interações e acessibilidade

Desde 17/10/2026, `src/citations.js` associa cada parágrafo de pesquisa a fontes e localizadores (seção, tabela, artigo ou conceito). A leitura em Página inteira, a leitura contínua e o HTML móvel exibem a origem imediatamente após o trecho; gráficos, esquemas, cenários e países da linha do tempo também têm fontes próximas. No HTML fixo e no 3D, um painel abaixo da abertura identifica os trechos e suas fontes sem acrescentar texto à textura ou alterar a paginação. A lista acompanha a navegação. O botão de fontes abre o mesmo detalhamento. Interpretações, propostas e registros de edição recebem atribuição explícita; não são apresentados como conclusões de uma instituição externa.

Os cenários apontam para o estudo ABNT revisto do grupo, §7/Tabelas 4 e 5. A entrevista aponta para as seções correspondentes do registro consolidado, já versionado no repositório público, e distingue notas, slides e análise do grupo. Biografia de Milton Santos não é usada como fonte de seus conceitos; a referência aponta à síntese do grupo em §3.3, identificando os livros e a ausência de páginas confirmadas. Páginas de livros ou relatórios não registradas no acervo não foram inventadas. O manifesto das texturas passa a incluir também `src/citations.js`.

A entrevista de Adolfo Braid usa um único renderer `interviewHTML`, em `src/content.js`, com conteúdo em `src/interview.js`. Aparece como suplemento após a página 17 na landing e na leitura contínua, sem alterar a lista de vinte páginas ou o manifesto de quantidade. As camadas de entrevista e fotografia reutilizam o histórico de diálogos, Escape e devolução de foco. Sumário e ação da página 17 abrem a entrevista também no HTML e no 3D. `interview=adolfo` na URL abre a camada diretamente. Os destinos da landing são procurados por `data-page-index`, pois há um suplemento entre os artigos numerados; a posição no array de filhos deixou de ser um índice editorial válido.

As fotos do suplemento são locais e separadas da galeria temática de nove imagens. O componente preserva a imagem inteira, sem filtros ou recortes, conforme a licença CC BY-ND 3.0 indicada no portal IRD/ANSN. Créditos e procedência estão em [IMAGE_SOURCES.md](IMAGE_SOURCES.md). O código usa HTML, CSS e os diálogos nativos já presentes, sem biblioteca nova. A consulta pública identificou atribuições profissionais na ABDAN e CNEN; o perfil indicado do LinkedIn foi mantido como link, sem contornar seu bloqueio de acesso.

Dialogs nativos têm rótulo, fechamento por Escape, foco inicial e devolução do foco. A leitura contínua mantém um histórico de camadas para que fechar uma nota devolva o texto anterior. O sumário navega diretamente; Home e End alcançam os extremos. Atalhos de navegação não capturam controles de formulário ou interações abertas.

Gráficos expõem números em texto; filtros mantêm a escala. O laboratório mostra fórmula, unidades, parâmetros e limites. As marcações do quadro de avaliação não são enviadas a um serviço. Movimento reduzido evita a virada prolongada. Essas medidas não equivalem a uma auditoria completa de acessibilidade.

## Pesquisa e decisões anteriores

O ajuste do átomo da capa em 2026-10-17 usa SVG nativo `animateMotion`, conforme a [documentação MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateMotion), sem biblioteca, código ou assets externos incorporados. Dois arcos elípticos formam o percurso fechado com os mesmos centro, raios e rotação da elipse desenhada. CSS troca a representação animada pela posição estática em `prefers-reduced-motion`, impressão e `.render-document`; assim as texturas permanecem determinísticas.

No refinamento da capa em 2026-10-17, `.cover-photo-flow` passou a aplicar uma máscara SVG embutida como data URI no CSS. A silhueta contínua é desenhada no código e compartilhada pelas três fotografias; ondas e átomo são vetores originais no HTML. A composição conserva a proporção vertical também no modo Página inteira. A pesquisa incluiu a documentação [MDN sobre coordenadas de recorte SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/clipPathUnits); não foi incorporado código de bibliotecas. O tratamento azulado é CSS, e os JPEGs originais e suas ampliações continuam em cores.

A capa orgânica de 2026-10-17 usa CSS nativo, sem biblioteca nova. Foi consultada a documentação MDN de [unidades relativas a contêineres](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length#container_query_length_units): `container-type: inline-size` e `cqw` mantêm a proporção da tipografia dentro de `.cover-artwork`. As fotografias locais são as já licenciadas; não houve reutilização de código ou assets externos para a nova composição. `coverHTML` é chamado por `pageHTML`, e os botões identificam a fotografia por `data-photo-key` para ampliar o original correto.

A pesquisa inicial considerou StPageFlip para HTML e Three.js/React Three Fiber para 3D. O ambiente de nuvem não conseguiu instalar pacotes devido ao proxy, motivando os protótipos nativos. Nenhum código ou asset dessas referências foi copiado.

- [StPageFlip](https://github.com/Nodlik/StPageFlip): alternativa de folheamento HTML/imagem, licença MIT.
- [Three.js — SkinnedMesh](https://threejs.org/docs/pages/SkinnedMesh.html): deformação por esqueleto.
- [React Three Fiber — desempenho](https://r3f.docs.pmnd.rs/advanced/scaling-performance): renderização sob demanda e reutilização de recursos.
- [Drei — Html](https://drei.docs.pmnd.rs/misc/html): posicionamento de DOM no espaço 3D.
- [Wawa Sensei — livro 3D](https://wawasensei.dev/tuto/3d-book-slider-landing-page-threejs-and-react): demonstração de animação; verificar licença e repositório antes de reutilizar.
- [PDF.js](https://mozilla.github.io/pdf.js/): alternativa futura para PDF; não usada nesta edição.

A implementação atual conserva o renderer nativo e resolve a divergência entre a composição HTML e a textura desenhada manualmente. Uma futura troca de motor deve preservar conteúdo, interações, leitura acessível e testes.

## Recuperação e limites

O código da nuvem foi recuperado de ZIP em 2026-10-15. O pacote não preservava o commit `0f36176`, por isso a recuperação recebeu novo commit sobre a main inicial. A publicação pelo Git local passou a funcionar nesta máquina.

Não há editor, importação de PDF, vídeo, capa com abertura/fechamento articulados, zoom gestual, arraste contínuo ou rotação livre da cena. Não foram homologados Safari, Firefox, aparelhos físicos, leitores de tela ou impressões do navegador. Os testes atuais são de Chromium headless no Windows com WebGL por software.

## Complementos de 18/10/2026

### Distribuição editorial na Página inteira

O responsável apontou grandes vazios ao lado dos textos na versão local da porta 5500. O título lateral e a coluna única à direita deram lugar a um cabeçalho de matéria, seguido de texto que ocupa a largura disponível em duas colunas balanceadas. Em até 760 px, o corpo volta a uma coluna. Sumário e referências conservam uma coluna introdutória e seus próprios componentes.

`showLanding` chama `pageHTML` com `{flow:true}`. Essa opção agrupa cada parágrafo e sua fonte em `.reading-passage` e insere fotografias editoriais em sete matérias. Os parágrafos originais, sua sequência e as referências foram preservados. O texto pode continuar na coluna seguinte; fontes e fotografias não são cortadas entre colunas. A legenda identifica contexto, autoria, licença e link de origem. Cada imagem amplia o original correto e devolve foco ao fechar.

A opção é exclusiva da composição em fluxo. O HTML paginado, a leitura ampliada e as vinte texturas mantêm sua composição anterior. A capa conserva sua arte e animação. As quatro fotografias de abertura existentes ocupam a largura da matéria na Página inteira. Não houve biblioteca, texto de pesquisa ou asset novo.

Pesquisa técnica: [MDN, balanceamento de colunas](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout/Spanning_balancing_columns), [MDN, break-inside](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-inside) e [W3C WAI, imagens informativas](https://www.w3.org/WAI/tutorials/images/informative/). Implementação com CSS multicol e HTML próprios. `npm run test:layout` confere largura ocupada, texto nos dois lados, conteúdo preservado, fotos/fontes e cinco larguras. O servidor estático da porta 4317 é preferível para capturas automáticas, pois gravações em `artifacts/` podem disparar a recarga do Live Server da porta 5500.

### Tarifas e limpeza da interface

As tarifas vêm do PDF fornecido, p. 24, §5.1/Tabela 2. O gráfico de intervalos usa escala de 0 a R$ 1,60/kWh; a opção de consumo multiplica os mesmos limites por 50–500 kWh. Não calcula a fatura final. A fonte Meutudo tem cabeçalhos mínima/máxima invertidos na página consultada; os limites seguem a ordenação numérica da tabela do PDF. Fonte original, PDF e esclarecimento da ANEEL ficam próximos. O componente não representa médias regionais nem dados em tempo real.

A capa deixou de oferecer a faixa “Explore as fotografias”, também retirada do hotspot 3D; as fotografias ainda podem ser ampliadas. A posição do hotspot do sumário é calculada pelo índice editorial, mesmo quando é o único botão da abertura. Disciplina e escola foram retiradas da interface pública das duas edições. O arquivo autocontido Energia Atômica tem gráfico/tabela de tarifas com estado preservado na ampliação. O build inclui `edicoes/`, sem incluir os documentos de pesquisa ou artefatos locais; teste dedicado: `npm run test:tariffs`.
