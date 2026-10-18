# Design system da edição

Status: aplicado à edição de 20 páginas, conforme autorização do responsável em 2026-10-16. O estudo anterior está em [DESIGN_PROPOSAL.md](DESIGN_PROPOSAL.md).

## Referência e identidade

A composição adapta a referência editorial WIRED da coleção VoltAgent/awesome-design-md, licenciada em MIT. Não é um sistema oficial da WIRED. O projeto tem linguagem própria: branco e verde, mínima interface externa, fotografias grandes e leitura em camadas. Não incorpora logotipo nem fontes proprietárias da referência. Veja [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Fundamentos

Os tokens ficam no início de `src/styles.css`.

| Papel | Token | Valor |
| --- | --- | --- |
| Texto principal | `--ink` | `#172d24` |
| Ações e destaques | `--green` | `#1e7349` |
| Texto secundário | `--muted` | `#4e6659` |
| Papel | `--paper` | `#ffffff` |
| Notas e quadros | `--soft` | `#edf4f0` |
| Superfície da revista | `--stage` | `#e3ece7` |
| Divisores | `--line` | `#c9dcd1` |
| Narrativa | `--serif` | Georgia e alternativas locais |
| Controles e dados | `--sans` | Arial e alternativas locais |

Não há download de fontes ou dependência de CDN. A fotografia mantém suas cores; verde não funciona como declaração de que a tecnologia é ambientalmente positiva. “A favor” e “em debate” têm a mesma superfície, tamanho e hierarquia.

## Composição das páginas

Cada página tem uma área lógica de 760 × 1064 pixels. Margens, títulos, corpo, imagens, quadros e rodapé pertencem à mesma função de composição usada pelos dois modos. Texturas 3D de 1140 × 1596 pixels são geradas em Chromium a partir dessa página, preservando a tipografia e a justificação.

O corpo narrativo usa duas colunas equilibradas, texto justificado, última linha natural, hifenização em português e controle de viúvas/órfãs. O corpo lógico de 18 px tem entrelinha de 1,55. Capa, sumário e referências têm composições específicas; aberturas combinam fotografia e narrativa. A escala visível depende do espaço da tela, por isso há zoom no HTML e leitura ampliada em HTML nos dois modos.

No celular, o HTML é exibido em uma página por vez, em fluxo vertical, com corpo de 18 px e uma coluna legível. A leitura contínua também é responsiva. O 3D pode ser escolhido explicitamente, mas conserva uma abertura com duas páginas: o caminho de leitura ampliada evita depender da textura pequena.

## Componentes

As fontes junto aos trechos usam `.claim-source`: texto de 13 px em Arial, borda verde-clara à esquerda, link para o título e linha com o local da informação. O domínio fica visível. Na leitura fluida, a nota acompanha o parágrafo; nas páginas fixas/3D, `.reader-sources` abaixo da abertura usa duas colunas no desktop e uma no celular. O parágrafo mantém seu texto original, com análise do grupo e proposta editorial identificadas na nota. Os livros sem paginação confirmada informam essa limitação.

O suplemento de entrevista usa a mesma base branca e verde `#1E7349`, Georgia e Arial. O nome abre a seção; um painel verde identifica o profissional, acompanhado de fotografia institucional integral. A trajetória fica numa coluna lateral e perguntas/sínteses na área principal. Cada resposta tem um quadro de análise do grupo e link para o tema da revista. Roteiro completo e fontes usam `details` nativo; fotos ampliam com legenda e licença. Abaixo de 761 px, as áreas empilham. O atalho do sumário tem raio fixo de 8 px; as fotos não são mascaradas ou tratadas, respeitando a licença CC BY-ND 3.0.

O átomo decorativo da capa usa três elipses e um núcleo fixo. A bolinha menor começa na curva superior esquerda, centrada no traço, e percorre a elipse inclinada em 35° em oito segundos, com velocidade constante via SVG `animateMotion`. O caminho compartilha centro e raios com o arco (50, 50; 44 × 17). Em movimento reduzido, impressão e geração de texturas, só a bolinha estática aparece na posição inicial. HTML, Página inteira e leitura contínua usam a animação; o 3D mantém a composição estática da textura.

- Botão de página: ação principal com divisores finos, texto verde e seta no HTML. No 3D, a chamada de ação foi retirada; a leitura ampliada oferece os recursos.
- Fotografia: botão de ampliação, contexto e crédito; ampliação com legenda completa e links de autoria/licença.
- Quadro de equilíbrio: duas áreas com a mesma importância, sem oposição “verde bom / vermelho ruim”.
- Dialog: título acessível, foco inicial no fechamento, Escape, foco devolvido ao acionador e histórico para interações abertas da leitura contínua.
- Gráfico: barras com texto e valores, escala preservada nos filtros e origem identificada.
- Laboratório: controles rotulados, unidades visíveis, resultado anunciado e premissas/limites próximos do cálculo.
- Etapas e linha do tempo: seleção explícita e conteúdo textual acessível.
- Sumário: destinos diretos e fluxo da edição; fluxograma do editorial na nota correspondente.

## Validação e manutenção

### Aplicações de dados e carrosséis (2026-10-17)

Painéis brancos com borda `--line`, raio fixo de 12 px e controles com raio de 8 px, mantendo Georgia para títulos e Arial para controles e dados. Os atalhos junto aos títulos mostram a ação disponível. O número em destaque da matriz corresponde à fonte selecionada; filtros não mudam o denominador nem a escala. O simulador reúne controles, resultado e barras comparativas, com fórmula e fontes próximas. Os carrosséis têm navegação manual, indicadores e foco verde; fotos conservam proporção, contexto e crédito. Ao reduzir a largura, painéis e legendas empilham e os controles continuam utilizáveis. As versões fixas conservam seus gráficos estáticos e a leitura ampliada oferece os componentes digitais.

### Retratos dos integrantes (2026-10-17)

O sumário apresenta os seis integrantes em `.team-grid`, com fotografia quadrada, nome e botão de ampliação. `teamMembers`, em `src/content.js`, mantém a associação explícita entre nome e arquivo; `authors` deriva desses registros. Davi de Oliveira foi confirmado pelo responsável apesar do arquivo original se chamar `davi-silva.jpeg`.

No frame fixo, o sumário usa duas colunas de links e seis retratos em uma linha. O conteúdo termina em 828 px, antes das ações em 957 px. Em Página inteira, os retratos mantêm seis colunas no desktop e duas no celular; o HTML de página única também usa duas colunas no celular. Na leitura contínua e na área de créditos, são três colunas no desktop e duas no celular. Fotos com 500 × 500 px, nomes com 12 px no frame fixo e 15–16 px nas composições fluidas. Imagens preservam a proporção; botões têm borda, raio de 8 px e foco visível.

`teamHTML` é reutilizado no sumário e nos créditos. Cada retrato amplia seu arquivo correto, informa nome e origem no grupo e mantém a navegação de retorno dos diálogos. As fotografias do grupo têm registro próprio em [IMAGE_SOURCES.md](IMAGE_SOURCES.md); não recebem a licença do acervo de energia. Os JPEGs foram copiados sem alteração de bytes, com extensão `.jpg` para os recursos locais.

### Editorial final fornecido pelo responsável (2026-10-17)

O editorial tem quatro parágrafos integrais, sem cortes, e usa `kind: 'editorial'` / `.page-editorial`. No frame fixo de 760 × 1064 px, margens laterais de 32 px, título de 42 px em uma linha e corpo Georgia de 16 px com entrelinha 1,45 acomodam a versão final. O texto termina em 932 px e as ações começam em 957 px. A citação adicional da versão anterior foi retirada. Essas regras são limitadas a `.render-document` e `.html-book:not(.single-page)`; Página inteira, celular e leitura contínua mantêm a tipografia fluida e altura livre.

A nota interativa identifica a versão enviada pelo responsável; não apresenta o novo editorial como uma síntese redigida pela IA. O mesmo conteúdo alimenta os modos HTML e as texturas 3D. A nota de transparência na página 19 acompanha essa mudança de origem.

### Capa com recortes orgânicos (2026-10-17)

Antes da animação, o ponto menor do átomo foi centrado na extremidade da órbita inclinada de 35°, na coordenada local `(6, 50)`, com a mesma rotação da elipse. O ajuste atual começa em `(7.76, 45.24)`, sobre a curva superior esquerda da mesma elipse de centro `(50, 50)` e raios 44 × 17, conforme a regra de animação descrita em Componentes.

Ajuste posterior solicitado pelo responsável: removida a linha “Sociologia · Instituto J&F” abaixo da marca na capa. A remoção é compartilhada pelos modos HTML, Página inteira, leitura contínua e textura 3D.

Direção refinada após o responsável pedir literalmente o formato das curvas da referência Brasil Nuclear: silhueta contínua em S unindo painel, usina e foto inferior; área verde entrando pelo meio; ondas azuis na base; degradê de verde vivo a verde claro. A marca Fronteira em Arial bold acompanha um desenho vetorial de átomo. As chamadas principais e secundária são brancas sobre a área escura. A composição conserva o título, a abertura e os cinco temas da pesquisa. Não incorpora chamadas de INAC, medicina ou datas da publicação de referência.

A cor principal definida pelo responsável é `#1E7349`, compartilhada pela capa, controles, links, dados e demais destaques. A capa usa esse token, verde médio `#80ac94`, verde claro `#dcebe2` e azul `#087eaf`, além de branco e neutros. As séries secundárias dos gráficos usam `#6b9c82`. O verde vivo e o lima anteriores foram substituídos por tons dessa base. Chamadas sobre a parte escura da capa usam branco; abertura e créditos sobre a parte clara usam tinta escura. Mantém as duas famílias Georgia e Arial; o masthead e as chamadas da capa usam Arial. Os recortes são exceções ilustrativas aos raios de componentes: botões retangulares conservam raio de 8 px.

O bloco `.cover-artwork` escala como uma composição única, com posições proporcionais e tipografia em unidades `cqw`. A revista em páginas mantém a área lógica de 760 × 1064 px; o desenho da capa ocupa 760 × 780 px e a abertura/créditos/ações ficam abaixo. Em Página inteira, o desenho conserva essa proporção vertical em todas as larguras, centralizado até 1000 px, para preservar a silhueta solicitada. O texto de abertura permanece fora da colagem, com 18 px no celular. As três fotos compartilham uma máscara SVG em `.cover-photo-flow` e usam `object-fit: cover`, sem distorção; filtros e sobreposição CSS produzem o azulado apenas na capa. A ampliação exibe o original em cores. Os indicadores de ampliação aparecem no hover/foco e ficam sempre visíveis no celular.

O mesmo `coverHTML` fornece HTML, leitura contínua, Página inteira e textura 3D. Cada foto em HTML amplia seu próprio original com autoria, contexto e licença; a galeria da capa permanece disponível. O primeiro título vira `h1` em Página inteira, conservando sua classe e o destino de foco.

Validação: textos sem sobreposição entre si e dentro da composição nas seis larguras de 320 a 1896 px; três ampliações corretas com crédito, Escape e retorno do foco; parágrafos da pesquisa preservados. As vinte texturas foram regeneradas e os vinte PNGs revisados. A capa passou na checagem geométrica e as outras dezenove páginas mantiveram suas medidas anteriores. Os oito alertas preexistentes permanecem em [REVIEW.md](REVIEW.md). Evidências locais em `artifacts/cover/`; regressão das fotos em `tests/landing.browser.mjs`.

### Modo Página inteira (2026-10-17)

O terceiro botão do seletor apresenta a revista como site. A capa reúne título grande, linha fina, texto de abertura e CTA para o sumário, com a fotografia de Angra ao lado. A partir do sumário, vinte seções preservam os mesmos títulos, parágrafos, fotografias, créditos e ações da edição em páginas.

Os estilos ficam escopados a `.landing-view` e ao estado `body[data-reader-mode="landing"]`. Conteúdo fluido até 1520 px, margens de 48 px no desktop, 32 px em telas médias e 24 px no celular. O corpo usa Georgia 20/1,7 no desktop e 18/1,65 no celular; títulos e hierarquia mantêm Georgia e Arial. Não há novas famílias nem cores de marca. A altura dos artigos é livre, sem cortar conteúdo para caber em um frame.

Abaixo de 1001 px, os blocos editoriais empilham; abaixo de 761 px, o seletor ocupa uma linha própria e o contexto/ações aparecem abaixo. Essa organização também permite escolher os três modos em telas de 320 px. O sumário usa duas colunas de cartões no desktop e uma no celular. Títulos longos podem quebrar para respeitar o espaço útil da tela.

A barra do seletor permanece visível durante a rolagem desse modo. Sumário e setas navegam por seção; a URL e o contador acompanham a seção visível. O destino recebe foco no título, sem desenhar um contorno de botão ao redor do texto; controles interativos conservam foco visível. A leitura normal usa rolagem vertical e permite seleção de texto. Os modos anteriores continuam com sua composição fixa.

Validação: seis larguras entre 320 e 1896 px, vinte seções sem colisão entre conteúdo e ações, todos os parágrafos originais preservados e ausência de rolagem horizontal. Sumário, fotos, gráfico, Escape, foco, links diretos e troca HTML/3D conferidos. Evidências em `artifacts/landing/` e regressão em `tests/landing.browser.mjs`.

### Barra inferior e rodapé (2026-10-17)

A navegação acompanha o cabeçalho: setas e contador em um grupo com rótulo “Páginas”, próximo em verde, zoom em grupo próprio e identificação da turma no modo 3D. Botões têm pelo menos 44 × 44 px; raios fixos de 8 px nos botões e 12 px nos grupos. Os ícones de seta reutilizam o sprite existente, com rotação visual para voltar.

No desktop, dica de teclado, navegação e zoom ocupam três áreas. Em até 900 px, a dica sai e os controles usam duas áreas; no celular, a navegação é centralizada e a identificação da turma sai. O zoom mantém a regra anterior de aparecer apenas no HTML desktop. O rodapé reúne marca e descrição à esquerda e botões de fotos/créditos e fontes à direita; em até 760 px, os blocos empilham e os dois botões dividem a largura. O destino `#edition-footer` permite abrir a região diretamente.

Validação: seis larguras de 320 a 1896 px; limites de controles, navegação anterior/próxima em HTML e 3D, zoom, créditos, fontes, Escape e retorno do foco. Evidências em `artifacts/footer/`. A composição das vinte páginas continua com as mesmas medidas de conteúdo e rodapé da etapa do cabeçalho; os oito alertas anteriores permanecem.

### Cabeçalho do leitor (2026-10-17)

Implementado a partir do pedido de melhorar a área superior da edição Fronteira. A marca e a identificação da edição ficam juntas; sumário e leitura contínua têm botões de 44 px de altura. A barra de leitura agrupa os modos 3D e Páginas em um seletor segmentado com `aria-pressed`, identifica a seção atual e reúne ampliação e tela cheia. Os IDs e os comportamentos existentes foram preservados.

A interface usa Georgia e Arial já existentes, as cores da edição e raios fixos de 8 px nos botões (12 px no contêiner do seletor). Hover muda cor e borda; foco mantém o contorno visível. Os seis ícones são Material Symbols Rounded 400 reutilizados do sprite da Energia Atômica, com licença Apache-2.0, sem fonte de ícones ou dependência nova.

Em até 900 px, a identificação da edição e o contexto da abertura saem da barra; em até 760 px, os botões de ação mostram ícones, mantendo nome acessível e tooltip. Em até 380 px, o seletor de modo conserva os textos e oculta seus ícones para caber. Foram conferidas as larguras 1896, 1440, 1024, 768, 390 e 320 px, sem transbordamento do cabeçalho e com controles de pelo menos 44 × 44 px.

O cabeçalho pertence à interface externa. Não altera a composição editorial de 760 × 1064 px. A comparação com o CSS anterior confirmou os mesmos limites de conteúdo nas vinte páginas; os alertas preexistentes estão registrados em [REVIEW.md](REVIEW.md).

O processo confere limites de composição, imagens ausentes, justificação, navegação, foco e interações. Capturas são revisadas antes da publicação. Isso não equivale a uma auditoria completa de acessibilidade, testes em leitores de tela ou homologação em todos os navegadores.

Para mudanças visuais, regenere as texturas e execute as verificações documentadas no [README](../README.md). Não altere separadamente o texto desenhado em 3D: a fonte editorial é `src/content.js`.

## Composição editorial em fluxo (18/10/2026)

A Página inteira usa largura máxima de 1360 px por matéria, com 48 px de respiro vertical no desktop. Título e linha fina formam o cabeçalho; texto ocupa os dois lados em colunas iguais, separadas por 48 px e uma linha na cor `--line`. Corpo em Georgia, 19 px/1,65, justificado com hifenização; fontes em Arial, 12 px/1,55. Os verdes, brancos, raios e tipografias existentes foram mantidos.

As fontes ficam após o trecho correspondente, com domínio na mesma linha do link quando há espaço. Nos quadros de debate e após citações, as listas de fontes usam duas colunas no desktop e uma no celular, evitando uma lista longa ao lado de uma área vazia. O texto pode continuar na coluna seguinte; notas de fonte e fotografias não são fragmentadas. Figuras inseridas na leitura têm proporção 16:10, legenda de contexto e links de crédito/licença. Fotografias de abertura usam faixa 3:1 no desktop. As ampliações mostram o original com seu contexto.

Em até 1000 px, o cabeçalho empilha e o intervalo das colunas cai para 32 px. Em até 760 px, o texto passa a uma coluna, 18 px, alinhado à esquerda, e as aberturas usam 16:10. Capa, gráficos e carrosséis preservam seus componentes e controles. Aceitação: texto presente nos dois lados em desktop; nenhum corte de fonte/foto; conteúdo integral; foco de volta à fotografia ampliada; sem transbordamento em 1440, 1024, 768, 390 e 320 px.

## Diagrama da geração (18/10/2026)

O componente usa quatro ilustrações científicas de 72 × 72 em círculos de 104 px, com número de sequência, título em Georgia e linha curta em Arial. Os SVGs têm malha de 96 × 96, traço principal de 2,8 unidades, pontas e junções arredondadas e preenchimento a 14% ou 12% da cor atual. Os desenhos mostram fragmentos da fissão com partículas, trocador de calor com tubos, turbina em corte com eixo e pás e gerador com carcaça, eixo e saída elétrica. São esquemas ilustrativos, sem escala física. Seleção: borda verde, fundo `--soft` e ilustração branca sobre verde. Painel de explicação com número, título e descrição; retorno da água separado do fluxo principal. Raios de 8 px nos controles retangulares; setas do sprite existente. As etapas são botões de pelo menos 44 px e preservam foco ao atualizar a explicação.

Em até 760 px, a sequência fica vertical, com círculos de 64 px e desenhos de 48 px; as setas apontam para baixo. A mudança de etapa usa `aria-pressed` e anúncio educado, sem avanço automático. Transições de cor respeitam movimento reduzido. A fonte da explicação permanece logo abaixo do esquema.

## Acesso às fontes (18/10/2026)

No fluxo, o botão “Ver fontes desta matéria” ocupa o rodapé com ícone de livro, contagem e nomes das referências, seta e borda verde. Altura mínima de 88 px, ícone em área de 44 px, título de 16 px e descrição de 13 px. No celular, o ícone usa área de 32 × 36 px dentro do botão, título de 14 px e descrição de 12 px; o alvo permanece maior que 44 px. Nomes podem quebrar linha, sem corte por reticências. Raios de 8 px e cores existentes. Foco visível e hover em `--soft`.

Nas páginas fixas, o antigo texto “FONTES [5 · 12]” foi substituído por um botão compacto “Ver fontes”, com livro, contagem de documentos e seta. Altura lógica de 44 px; margens verticais negativas aproveitam o respiro do rodapé sem reduzir a área do texto ou sobrepor a ação acima. O leitor escala o botão junto com a página. A contagem reúne fontes do texto e dos gráficos, como na janela de consulta. Nas páginas sem referências específicas, o rótulo é “Fontes da edição”. A mesma composição aparece nas texturas do 3D; a consulta interativa permanece disponível na leitura HTML ampliada.

A janela de fontes usa cartões verticais com identificação do documento, domínio, localizadores e link de pelo menos 44 px. Título em Georgia, metadados em Arial. Detalhamento por trecho e bibliografia em elementos `details`. Aceitação: contagem corresponde aos documentos da matéria, links apontam às URLs registradas, fonte de gráfico não é omitida, não há localizador redundante nem transbordamento em 1440/768/390/320 px; Escape devolve foco ao botão, inclusive após consultar créditos.

## Apresentação do leitor 3D (18/10/2026)

Abertura quase frontal, ajustada ao espaço disponível, com lombada discreta, bordas de papel sem impressão repetida e sombra suave no fundo verde existente. A câmera recua durante a virada e retorna ao enquadramento de leitura. A densidade do canvas fica entre 1,5 e 2; isso não representa uma medição de desempenho ou garantia de legibilidade de texto pequeno em celulares.

As chamadas de ação foram removidas da textura e da faixa sob a abertura em 18/10/2026. A faixa mantém apenas “Fontes da página NN”, em Arial 13 px, com livro, fundo branco, borda `--line`, raio de 8 px, hover em `--soft` e foco verde. Os dois acessos ficam lado a lado no desktop e empilhados no celular, com pelo menos 44 px de altura. O número da página e a consulta às fontes permanecem no rodapé impresso. As ações de gráficos, notas e entrevista ficam disponíveis em “Ampliar leitura”, usando os diálogos existentes. A área antes ocupada pela chamada impressa é preservada para não alterar texto ou paginação.
