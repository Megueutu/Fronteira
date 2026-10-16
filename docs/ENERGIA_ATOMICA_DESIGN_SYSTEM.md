# Design system da Energia Atômica

Status: decisão aceita e implementada em 2026-10-16, em `edicoes/energia-atomica.html`. Este documento é a referência oficial de cor, tipografia, ícones, forma, estados e interações da revista. Os valores vivem como tokens CSS no início do `<style>` do arquivo. Ao mudar um token, atualize esta página.

Base: Material Design 3, com componentes escritos à mão em CSS, sem `@material/web`.

## 1. Tema: Verde Bandeira ES

A semente é o **Verde Bandeira ES**, código ARADEFE LAB VD1002, que o responsável enviou como referência. A amostra medida na imagem é `#1D7449`. Em HCT, ela fica com matiz 159, croma 43 e tom 43.

**Regra da paleta:**
- todas as cores de marca ficam no mesmo matiz (cerca de 159);
- o croma fica igual ou abaixo do da semente, sem verdes neon nem tons fluorescentes;
- as variações saem do tom, não do croma.

Os papéis M3 foram gerados com `@material/material-color-utilities` 0.3.0 (`SchemeContent`). Três foram dessaturados à mão, como indica a tabela.

### Marca e capa

| Token | Valor | Uso |
| --- | --- | --- |
| `--brand` / `--cover-bg` | `#1D7449` | Fundo da capa, aberturas das reportagens, fechamento |
| `--cover-blob-1` | `#44845E` | Mancha maior da capa e formas das aberturas (tom 50, croma 36) |
| `--cover-blob-2` | `#598F6D` | Segunda mancha (tom 55, croma 32) |
| `--cover-blob-3` | `#6BA27E` | Terceira mancha (tom 62, croma 32) |
| `--on-brand` | `#FFFFFF` | Títulos sobre o verde (contraste 5,7:1) |
| `--on-brand-variant` | `#D6EADC` | Texto secundário sobre o verde |

### Papéis M3

| Papel | Valor | Significado |
| --- | --- | --- |
| `primary` | `#005A35` | Links, rótulos, números de dados, estados ativos |
| `primary-container` / `on-primary-container` | `#1D7449` / `#FFFFFF` | Preenchimentos fortes: barras renováveis, destaque do payback, etapa selecionada. O `on` gerado era `#A3F7C1`; ficou branco, menos saturado |
| `secondary-container` / `on-secondary-container` | `#C6E8CE` / `#1F3D2A` | Seleção: chips, botões segmentados, item atual do sumário, layout ativo |
| `surface-container-lowest` | `#FFFFFF` | Papel das páginas |
| `surface-container-low` | `#F1F5EE` | Cartões e gráficos |
| `surface-container` | `#EBEFE9` | Fundo da aplicação |
| `surface-container-high` / `-highest` | `#E5E9E3` / `#E0E4DD` | Trilhos de barras, seletor de layout, palco do modo foco |
| `on-surface` / `on-surface-variant` | `#181D19` / `#3F4941` | Texto principal / secundário e ícones inativos |
| `outline` / `outline-variant` | `#6F7A71` / `#BEC9BF` | Fontes não renováveis nos gráficos / bordas e divisores |
| `inverse-surface` / `inverse-on-surface` | `#2D322E` / `#EEF2EC` | Pergunta da pesquisa, barra do modo foco, valores negativos |
| `inverse-primary` | `#9FD1B0` | Rótulos sobre superfície inversa (gerado `#85D8A4`, dessaturado) |
| `primary-fixed` / `-dim` | `#C3E2CC` / `#9CC5A8` | Decoração e fundo orgânico (gerados `#A1F5BF` e `#85D8A4`, dessaturados) |

### Dados

| Token | Valor | Uso |
| --- | --- | --- |
| `--data-ink` | `= primary` | Números de dados no texto |
| `--data-emphasis` | `#1D7449` | Anel de ênfase de um valor no gráfico |
| `--data-emphasis-container` | `#D7ECDC` | Fundo do valor em ênfase e da nota “Em destaque” |

O verde não é usado para dizer que a energia nuclear é “boa”. Nos gráficos, verde marca as fontes renováveis e o valor em ênfase; os quadros “A favor” e “Em debate” têm o mesmo peso visual.

## 2. Tipografia

| Token | Valor | Uso |
| --- | --- | --- |
| `--type-display` | Montserrat 800, 44/1.1 | Título das aberturas |
| `--type-headline` | Montserrat 800, 40/1.1 | Título das páginas |
| `--type-title-large` | Montserrat 700, 20/1.25 | Itens do sumário |
| `--type-title-medium` | Roboto Flex 600, 16/22 | Título de cartão e de diálogo |
| `--type-title-small` | Roboto Flex 600, 14/20 | Título de gráfico |
| `--type-body-large` | Roboto Flex 400, 18/1.45 | Linha fina (subtítulo) |
| `--type-body-medium` | Roboto Flex 400, 14/1.62 | Texto corrido |
| `--type-body-small` | Roboto Flex 400, 12,5/1.45 | Cartões, tabelas, ficha de número |
| `--type-label-large` | Roboto Flex 500, 14/20 | Botões, chips, contador de páginas |
| `--type-label-medium` | Roboto Flex 500, 12/16 | Legendas de gráfico, dica do modo foco |
| `--type-overline` | Montserrat 800, 11/16, caixa alta, +0,1em | Rótulos (“Conceito · …”, “A favor”) |
| `--type-caption` | Roboto Flex 400, 11/1.4 | Fontes e notas |

A capa é exceção: “ENERGIA” usa Playfair Display e “ATÔMICA”, Montserrat 800, como na arte enviada.

**Cor do texto:**
- `on-surface` para o texto principal;
- `on-surface-variant` para o secundário;
- `primary` para rótulos, links e dados;
- `on-brand` e `on-brand-variant` sobre o verde.

## 3. Ícones

- **Biblioteca:** [Material Symbols](https://fonts.google.com/icons), estilo **Rounded**, peso 400, preenchimento 0. Fonte: o pacote `@material-symbols/svg-400` 0.48.0, licença Apache-2.0 (ver [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)). Foi escolhida por ser a família oficial do Material 3 e por ter versão SVG, que cabe no arquivo único e funciona sem internet.
- **Como usar:** os ícones ficam em um sprite no início do `<body>`, como `<symbol id="i-nome">`, e são usados com `<svg class="icon"><use href="#i-nome"/></svg>`. Para incluir um ícone novo, copie o `<symbol>` do pacote, mantendo o `viewBox="0 -960 960 960"`. Não desenhe caminhos à mão.

| Tamanho | Token | Onde |
| --- | --- | --- |
| 18 px | `--icon-sm` (`.icon-sm`) | Dentro de chips, da ficha de número, da nota de ênfase e da dica do foco |
| 20 px | `--icon-md` (`.icon-md`) | Botões compactos: ampliar e barra do modo foco |
| 24 px | `--icon-lg` (`.icon`) | Padrão: barra superior, diálogos, FAB, seletor de layout |

**Cor:** o ícone herda `currentColor` e segue o papel do componente.

| Cor | Significado |
| --- | --- |
| `on-surface-variant` | Ação disponível, inativa |
| `on-secondary-container` + versão preenchida (`-fill`) | Opção selecionada (layout ativo) |
| `on-primary-container` | Sobre preenchimento forte (FAB) |
| `inverse-on-surface` | Sobre superfície escura (barra do foco) |
| `primary` | Informação sobre dados (ícone da ficha e da nota) |

**Ícones em uso:**

| Ícone | Função |
| --- | --- |
| `menu` | Abrir o sumário |
| `close` | Fechar |
| `arrow_back` / `arrow_forward` | Página anterior / seguinte |
| `arrow_downward` | FAB |
| `open_in_full` | Ampliar |
| `view_agenda` | Layout rolagem |
| `menu_book` | Layout revista |
| `center_focus_strong` | Layout foco |
| `fullscreen_exit` | Sair do foco |
| `zoom_in` / `zoom_out` | Zoom |
| `fit_screen` | Ajustar à tela |
| `pan_tool` | Dica de arrasto |
| `check` | Chip selecionado |
| `info` | Ficha de número |
| `bar_chart` | Nota de ênfase no gráfico |

## 4. Forma e estados

- **Duas famílias de forma:**
  - **Formas expressivas** (cookie, clover, sunny, burst, flower, puffy, pentagon): só em decorações, avatares, máscaras de foto, formas das aberturas e FAB. São as únicas que morfam.
  - **Componentes retangulares** (cartões, chips, botões, botões segmentados, itens do sumário, tabelas, botão de ampliar, etapas): **o raio é fixo em todos os estados**. Hover, foco, pressão e seleção mudam só cor e camada de estado, nunca o raio.
- **Raios:**

| Raio | Componentes |
| --- | --- |
| 4 px | Anel de ênfase |
| 8 px | Chips, botões compactos |
| 12 px | Ficha de número, nota de ênfase |
| 16 px | Cartões |
| 28 px | Diálogo, pergunta da pesquisa, fechamento, itens do sumário |
| Pílula | Botões de ícone, botões segmentados, seletor de layout, números das etapas, barra do foco |

- **Camadas de estado:** cor do conteúdo misturada ao fundo, nas proporções hover 8%, foco 10%, pressionado 10% e arrasto 16% (`--md-sys-state-*`). Foco de teclado: contorno de 3 px em `primary`.

## 4.1 Sombras

As sombras são suaves e em camadas: uma de contato, curta e quase invisível, e uma de ambiente, larga e difusa. A cor vem do verde-escuro do tema (`--shadow-ink: 16 38 25`), nunca do preto puro, e as opacidades ficam entre 5% e 22%.

| Token | Uso |
| --- | --- |
| `--md-sys-elevation-1` | Botão de ampliar e de página dupla |
| `--md-sys-elevation-2` | Ficha de número |
| `--md-sys-elevation-3` | Diálogo ampliado, página no modo foco, barra do foco |
| `--shadow-page` | Páginas na rolagem e capa no modo revista |
| `--shadow-drop` | Formas com foto (aberturas e cantos) e FAB, como `filter: drop-shadow` |

No **modo revista**, as duas páginas se comportam como um livro aberto:
- cada página projeta sombra só para o lado de fora, sem sombra cruzando a dobra;
- a dobra central tem um escurecimento curto, que some em 72 px;
- a página da direita tem um reflexo fino de papel.

## 5. Números de dados no texto

- **Aparência:** todo valor numérico do texto corrido (percentuais, valores, quantidades, prazos) vem em verde `primary`, peso 600 e sublinhado. Datas e nomes próprios com números ficam de fora.
- **Ligado a gráfico** (sublinhado contínuo, `data-chart` + `data-emph`): abre o gráfico ampliado com o valor em ênfase. Os elementos com a mesma `data-key` ou `data-group` ganham o anel e o fundo de ênfase; os demais vão para 32% de opacidade. Uma nota mostra “Em destaque: valor — significado. Fonte.”. Nas abas, como o ciclo do urânio, a ênfase também seleciona a etapa.
- **Sem gráfico** (sublinhado pontilhado): abre uma ficha com o valor, o significado e a fonte. Fecha com Esc, com o botão fechar, com um clique fora ou ao rolar.
- **Marcação:** `<button type="button" class="dnum" data-info="…" data-src="…" [data-chart="id" data-emph="chave"]>`.
- **Ênfases criadas para isso:**
  - matriz: linhas por fonte e por grupo renovável/não renovável;
  - dependência: Brasil e França;
  - payback: barras do custo restante e do custo total;
  - tabela de cenários: colunas de payback;
  - percepção, confiança, tarifas e países: linhas;
  - ciclo do urânio: paradas.

## 6. Layouts de leitura

Seletor na barra superior, em grupo de botões de ícone:

| Layout | Ícone | Comportamento |
| --- | --- | --- |
| Rolagem | `view_agenda` | Uma página abaixo da outra (padrão) |
| Revista | `menu_book` | Duas páginas lado a lado, como uma revista aberta: capa sozinha à direita, depois 02–03, 04–05… Sombra na dobra central; escala automática para caber na largura; setas avançam por abertura. Indisponível abaixo de 860 px |
| Foco | `center_focus_strong` | Uma página em 100% da tela, com zoom e arrasto. Mais detalhes abaixo |

**Modo foco:**
- **Arrastar:** arraste com o cursor de mãozinha (grab) ou com o dedo.
- **Zoom:** Ctrl ou ⌘ + rolagem, pinça, botões + e − ou teclas `+`, `−` e `0` (ajustar à tela). A rolagem sem Ctrl desloca a página.
- **Páginas:** setas, Home e End.
- **Saída:** Esc sai do modo.
- **Cliques:** um arrasto não dispara clique nos botões da página.

**Tamanho das páginas.** Na rolagem e na revista, a barra superior tem diminuir, porcentagem, aumentar e “Página inteira” (`fit_screen`).

| Modo | Tamanho |
| --- | --- |
| Padrão | 100% na rolagem; na revista, a largura que cabe na tela |
| Página inteira | Ajusta altura e largura para ver a página toda |
| Manual | De 40% a 200%, em passos de 15% |

O clique na porcentagem volta ao padrão. O ajuste fica oculto no celular e no modo foco.

A escolha entre Rolagem e Revista fica salva no navegador (`localStorage`, com falha silenciosa). O foco não é salvo.

## 7. Fotografia

- **Tema:** só imagens ligadas à energia nuclear e ao território da pesquisa, como Angra, a rede elétrica, as fontes da matriz e as instalações do ciclo. Usinas do exterior aparecem sempre como “ilustrativas”.
- **Fontes, por prioridade:**
  1. Unsplash, com a página da foto verificada;
  2. Eletronuclear, só com autorização ou licença explícita;
  3. Wikimedia Commons, com licença individual.
- **Registro:** cada foto aparece no bloco JSON `#photo-data` com `src` (JPEG em base64, até 1800 px na página dupla e 900–1280 px nas demais), `ratio`, `credit`, `license`, `url` e `context`. Na capa: Angra (Sturm), o canteiro de Angra 3 (Wusel007) e uma usina nuclear no exterior, ilustrativa (Nicolas Hippert). O painel de controle e as linhas de transmissão saíram da capa, a pedido do responsável, por fugirem do assunto. Os elementos usam `data-photo="chave"`, e a mesma foto nunca é embutida duas vezes.
- **Onde aparecem:**

| Lugar | Moldura |
| --- | --- |
| Capa | Formas orgânicas, com camada de cor deslocada |
| Aberturas | Formas expressivas, que morfam |
| Canto das páginas dos estados | Forma expressiva |
| Página dupla | Foto contínua nas duas páginas, com gradiente para o texto |
| Fotos no corpo do texto | Forma expressiva |

- **Ampliação:** mostra a foto inteira, na proporção original.
- **Crédito:** obrigatório na própria página, na linha de fontes ou na legenda; o crédito da capa fica na página 02.

## 8. Validação

Validação desta etapa: [ENERGIA_ATOMICA.md](ENERGIA_ATOMICA.md#padronização-ícones-números-tema-e-layouts-2026-10-16).
