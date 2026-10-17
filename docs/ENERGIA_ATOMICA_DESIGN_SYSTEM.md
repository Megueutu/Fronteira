# Design system da Energia Atômica

Status: requisitos recebidos e adaptação HTML implementada em 2026-10-17. Referência vigente para `edicoes/energia-atomica.html`. Substitui o frame A4 e a exceção tipográfica da capa registrados em 2026-10-16; o histórico permanece nos commits e em [ENERGIA_ATOMICA.md](ENERGIA_ATOMICA.md).

## 1. Direção e referência

O responsável pediu adaptação do HTML existente, com referência à área **Modelos de referência** do [Figma Sexteto Sinistro](https://www.figma.com/design/lNBxMgOusDw9JtVKr9uQUz/Sexteto-Sinistro?node-id=99-12).

Modelo escolhido: primeiro conjunto, identificado visualmente como **Corporate Strategy / Connecting Innovation** (nodes 99:2–99:11). A consulta incluiu a visão geral dos quatro conjuntos e o contexto de design do sumário 99:3. A adaptação usa painéis verticais, números fortes, títulos em negrito, divisores e espaço branco. Os verdes fluorescentes do modelo foram traduzidos para o tema Verde Bandeira ES já aprovado. As máscaras orgânicas das fotografias e as interações da revista foram conservadas.

Nenhum código, fotografia, marca ou bitmap do template foi incorporado. A licença de redistribuição do template não foi estabelecida; ele foi usado como referência visual. Fotos e ícones continuam sujeitos às licenças registradas em [IMAGE_SOURCES.md](IMAGE_SOURCES.md) e [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## 2. Frame e composição

| Regra | Implementação |
| --- | --- |
| Frame desktop | **1440 × 1024 px**, tokens `--page-w` e `--page-h` |
| Margens | 48 px; capa e foto dupla usam sangria |
| Grade | Duas áreas para texto e gráfico; três colunas nas reportagens corridas; editorial com título lateral e duas colunas de texto |
| Espaço entre blocos | 16 px; 8 px nas páginas densas 13–15 |
| Capa | Título e chamada no painel verde; Angra 1, 2 e 3 em fotos na área clara |
| Sumário | Faixa verde lateral com pergunta da pesquisa; links numerados à direita |
| Mobile | Abaixo de 861 px, fluxo vertical e corpo de 18 px, sem reduzir todo o texto à proporção do frame |

O JavaScript lê as dimensões dos tokens CSS para calcular o zoom. Rolagem, revista e foco usam a mesma composição. A impressão adota 1440 × 1024 px. Esta edição autocontida não usa o renderer WebGL nem as texturas da edição Fronteira da raiz.

## 3. Cor: cinco cores principais e neutros

| Token | Cor | Uso |
| --- | --- | --- |
| `--brand` | #1D7449 | Capa, aberturas, destaques |
| `--brand-dark` | #005A35 | Links, números, texto de destaque |
| `--brand-mid` | #44845E | Série secundária e decoração |
| `--brand-light` | #6BA27E | Formas e variação de tom |
| `--brand-pale` | #C6E8CE | Área clara da capa e seleção |

Os papéis Material 3 são aliases dessas cores ou neutros (branco, #F4F5F4, #ECEEEC, #E5E7E5, #DFE2DF, #C4C9C5, #737A75, #525955 e #202623). Sombras usam transparência. As cores das fotos não integram a paleta de interface. A cor não serve como julgamento de que a energia nuclear é boa ou ruim; os quadros “A favor” e “Em debate” têm o mesmo peso visual.

## 4. Tipografia e escala

Exatamente duas famílias: **Montserrat** (títulos, rótulos e números) e **Roboto Flex** (texto e interface). Playfair Display foi removida da capa e da requisição do Google Fonts. As fontes são carregadas por uma folha remota do Google Fonts, com alternativas locais; o arquivo continua contendo seu próprio CSS, JavaScript e imagens, mas a aparência exata das fontes depende da rede ou do cache.

Escala fixa em px: **12, 14, 16, 18, 20, 24, 32, 40, 56, 72, 96 e 128**. Os tamanhos antigos fora da escala foram normalizados. Pesos e entrelinhas variam por função, sem criar novas famílias.

| Papel | Token | Tamanho / entrelinha |
| --- | --- | --- |
| Abertura e título | `--type-display` / `--type-headline` | 56 / 1,08 |
| Título de continuação | `.headline` de reportagem | 40 / 1,08 |
| Item do sumário | `--type-title-large` | 24 / 1,25 |
| Título de cartão | `--type-title-medium` | 20 / 1,3 |
| Título de gráfico | `--type-title-small` | 18 / 1,3 |
| Linha fina | `--type-body-large` | 24 / 1,4; aberturas usam 20 |
| Texto corrido | `--type-body-medium` | 18 / 1,55 |
| Cartão | `--type-body-small` | 16 / 1,5 |
| Botão e rótulo | `--type-label-large` / `--type-label-medium` | 16 / 1,4 e 14 / 1,4 |
| Rótulo editorial / crédito | `--type-overline` / `--type-caption` | 12 / 1,4 |

## 5. Componentes reutilizáveis

| Componente | Estrutura e comportamento |
| --- | --- |
| Cartão | `.card`, variantes tonal, preenchida e contornada; títulos e textos padronizados |
| Abertura de matéria | `.opener`, título, linha fina e fotografias em formas |
| Item de sumário | `.toc a`, número, título, descrição e destino interno |
| Navegação da página | `.page-route`, links para capa e sumário e número da página |
| Fotografia ampliável | `.shaped-photo`, proporção preservada, contexto e crédito |
| Gráfico | `.chart-card`, valores textuais, escala e fonte; ampliação |
| Filtro | `.chip`, seleção explícita com `aria-pressed` |
| Seletor de cenário | `.segmented`, estado `aria-checked` e atualização do payback |
| Etapas | `.stepper-card` / `.cycle-card`, abas e descrição textual |
| Número explicável | `.dnum`, ficha de fonte ou gráfico com valor em destaque |
| Ampliação | `.viewer`, diálogo com título, fechamento e retorno do foco |

Componentes retangulares mantêm o mesmo raio em hover, foco, pressão e seleção. Estados mudam cor e camada, sem mudar geometria. Máscaras e formas decorativas podem morfar. Ícones continuam sendo Material Symbols Rounded 400 do sprite SVG local, Apache-2.0, com 18, 20 e 24 px.

## 6. Navegação e interações

- Capa: “Explore esta edição” leva ao sumário, página 03.
- Sumário: links diretos para editorial e cinco temas, páginas 04, 05, 07, 11, 13 e 15.
- Páginas 02–16: links de retorno à capa e ao sumário. Todos passam pela mesma função de navegação, incluindo o modo foco.
- Barra: página anterior/seguinte, sumário modal, rolagem, revista, foco, zoom e ajuste à tela.
- Revista: capa sozinha à direita; pares 02–03 até 14–15; a foto das páginas 08–09 é contínua.
- Foco: página ajustável com zoom, arrasto e pinça; setas, Home/End e Esc. A escolha de rolagem/revista é persistida; foco não é persistido.
- Ampliações: Escape fecha e o foco volta ao acionador. Foco visível, rótulos nos botões e movimento reduzido foram mantidos.

Dados quantitativos permanecem marcados com `.dnum`: `data-info` e `data-src`, mais `data-chart` e `data-emph` quando associados a um gráfico. Sem gráfico, abrem ficha explicativa. Com gráfico, abrem a ampliação com valor realçado e fonte. Datas e nomes próprios não recebem a marcação automaticamente.

## 7. Fotografias

JPEGs são embutidos uma única vez no bloco JSON `#photo-data` e reutilizados por `data-photo`. O registro contém origem, autoria, licença, proporção e contexto. A capa usa `object-fit: cover`; as fotos SVG usam `preserveAspectRatio`. Recorte altera enquadramento, sem esticar a imagem. A ampliação mostra a proporção original.

Angra 1 e 2 são recortes do registro de Sturm, 2009; Angra 3 é a foto histórica de Wusel007, 2015. As datas são identificadas na capa, no texto alternativo ou no crédito, sem apresentar a obra histórica como situação atual. Créditos da capa estão na página 02. O tratamento de cor anterior está descrito no histórico; nenhuma fotografia nova foi obtida nesta adaptação.

## 8. Verificação e continuidade

Validação desta etapa em [ENERGIA_ATOMICA.md](ENERGIA_ATOMICA.md). Para novas mudanças: conferir as 16 páginas no frame, manter duas famílias e a escala, testar todos os links do sumário e o retorno no foco, conferir fotos e créditos e executar os testes. Não esconder transbordamento como forma de fazer o texto caber.

As capturas e relatórios de revisão ficam em `artifacts/editorial/` (ignorado pelo Git). O código do produto permanece em um único HTML. Não foram homologados outros navegadores nem aparelhos físicos.
