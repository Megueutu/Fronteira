# Energia Atômica

Status: em revisão com o responsável desde 2026-10-16. É uma revista separada da edição Fronteira de 20 páginas, que continua intacta na raiz do projeto.

## Onde fica e como versionar

- Decisão do responsável (2026-10-16): a revista é **um único arquivo**, `edicoes/energia-atomica.html`. CSS, JavaScript, favicon e fotografias ficam embutidos no arquivo; as fotos são JPEG em base64, reduzidas a 640 px. Não crie arquivos separados.
- **Versões são commits, não cópias.** Edite sempre o mesmo arquivo; o histórico do Git guarda cada versão. Para ver uma versão antiga, use `git log -- edicoes/energia-atomica.html` e `git show <commit>:edicoes/energia-atomica.html`. Os commits `e240b28` (primeira composição), `764ebe9` (arquivo único) e `038558e` (fundo orgânico) correspondem às antigas v1 e v2.
- Abra o arquivo direto no navegador, com dois cliques; não precisa de servidor. `#p11` abre direto a página 11.

## Ordem editorial (pedido do responsável)

| Página | Conteúdo | Interação |
| --- | --- | --- |
| 01 | Capa no estilo da referência *Brasil Nuclear*: fotos dentro das formas orgânicas, camadas de cor deslocadas e chamadas | — |
| 02 | Apresentação dos integrantes, turma e transparência sobre IA | Formas morfam ao passar o cursor |
| 03 | Sumário e pergunta da pesquisa | Links para cada seção |
| 04 | Editorial: texto do grupo, reproduzido sem alterações a partir do PDF | — |
| 05–06 | Panorama da matriz elétrica | Gráfico com filtro por tipo de fonte |
| 07, 10 | Como funciona a energia nuclear | Percurso em cinco etapas |
| 08–09 | Página dupla: usinas de Angra dos Reis, foto contínua nas duas páginas | Ampliar a foto inteira |
| 11–12 | O urânio brasileiro e o seu ciclo | Medidores; ciclo em cinco paradas |
| 13–14 | O custo e o payback | Cenários com botões segmentados |
| 15–16 | Política: posições e desinformação; países que tentaram abandonar a energia nuclear | Gráficos de percepção; tabela comparativa dos seis países |

Cada reportagem ocupa duas páginas: abertura no verde da marca e continuação. “Como funciona” tem ainda a página dupla 08–09, que no modo revista forma uma abertura contínua. As páginas não marcam o número da reportagem.

## Design

A referência oficial de cor, tipografia, ícones, forma, estados, números e layouts é o [design system da Energia Atômica](ENERGIA_ATOMICA_DESIGN_SYSTEM.md). Esta seção guarda o histórico das decisões.


- **Direção visual.** Em 2026-10-16 foi testada uma versão mais sóbria (commit `ab6b62f`): verde-floresta, Inter Tight e sem formas. O responsável não gostou e pediu a identidade anterior de volta. Vale a identidade abaixo, com o verde da capa nas aberturas, títulos em Montserrat e formas expressivas.
- **Material Design 3.** Os papéis de cor foram gerados com `@material/material-color-utilities` 0.3.0 (`SchemeContent`); desde 2026-10-16, a partir do Verde Bandeira ES #1D7449 (antes, #02A913) e ficam como tokens `--md-sys-*` no `<style>`. `on-secondary-container` foi escurecido para texto corrido. Seguem a especificação do M3: escala de forma, elevação, chips, botões segmentados, top app bar, gaveta de navegação modal e FAB. Os componentes foram escritos em CSS, sem a biblioteca `@material/web`.
- **Formas expressivas.** Formas inspiradas na biblioteca do M3 Expressive (cookie, clover, sunny, burst, flower, puffy, pentagon), desenhadas como curvas polares de 144 pontos. Por isso qualquer forma morfa em outra, com uma mola que imita o motion expressivo. Aparecem na decoração das páginas e como máscara das fotografias. É uma reimplementação aproximada, não o código oficial do Material.
- **Fundo orgânico.** Um `<canvas>` fixo atrás das páginas desenha sete manchas nas cores da capa. A física é uma mola amortecida.
  - Cursor ou dedo: afastam e incham as bordas próximas.
  - Clique ou toque: geram uma onda.
  - Rolagem: agita as manchas, com paralaxe.
  - Troca de página: rearranja a composição.
  - O canvas tem `aria-hidden` e `pointer-events: none`, pausa com a aba oculta, fica estático com `prefers-reduced-motion` e não aparece na impressão.
- **Tipografia.** Montserrat nos títulos (700/800) e nos rótulos; Roboto Flex no texto e na interface; Playfair Display só no “ENERGIA” da capa, para preservar a capa enviada.
- **Páginas.** 794 × 1123 px (proporção A4) no desktop, com margem de 64 px e espaço de 26 px entre blocos. Não há rodapé corrido nem linha de seção no topo. Abaixo de 860 px, as páginas viram fluxo vertical de uma coluna. O texto é alinhado à esquerda, porque o Chromium em Linux não hifeniza português e o texto justificado abria rios.
- **Números.** Não há blocos de “contadores”, os quadros de número grande com legenda. Os números ficam no texto, nos gráficos e nas tabelas. O sumário usa numeração tipográfica leve, e as etapas usam números em caixas que viram pílula quando selecionadas.
- **Ícones.** Desde 2026-10-16, Material Symbols Rounded em um sprite SVG embutido. Antes eram caminhos soltos dos Material Icons.

## Conteúdo e fontes

- Os dados vêm do documento “Aposta e benefícios do investimento na energia nuclear no Brasil” (ABNT) e do editorial em PDF, ambos enviados pelo grupo.
- “Como funciona a energia nuclear” não tem capítulo próprio no documento. O texto técnico foi redigido com assistência de IA, com conhecimento geral sobre reatores PWR e dados públicos de Angra 1 (640 MW, 1985) e Angra 2 (1.350 MW, 2001). As páginas indicam que falta a revisão do grupo.
- Decisões de edição:
  - Não foi reproduzida a afirmação de que o Brasil é um de apenas três países com reserva, enriquecimento e usinas, porque a China também reúne as três condições.
  - A etapa de Caldas (MG) ficou fora do ciclo, porque a unidade está em descomissionamento.
  - Os e-mails das candidaturas contatadas não foram publicados.
  - Os 83% de dependência aparecem como conta do grupo, com a ressalva de que a base é diferente da do número francês.
- Pendentes: Itacuruba, a desigualdade regional de qualidade do fornecimento e furto de energia, Belo Monte, a lista completa de referências e os gráficos originais do DOCX.
- Fotografias: `angra.jpg` e `angra3.jpg`, documentadas em [IMAGE_SOURCES.md](IMAGE_SOURCES.md), com crédito e licença CC BY 3.0 na própria página.

## Validação

Ajustes de 2026-10-16: espaçamento maior, títulos sem serifa, sem contadores, sem linhas de topo e rodapé e sem marcação da reportagem.

- Chromium headless (Playwright 1.56), por `file://`, em 1280 px: as 14 páginas foram capturadas e conferidas. Nenhum bloco entra na margem inferior de 48 px; a capa é de sangria total.
- Para caber o espaçamento maior, alguns trechos foram encurtados: a nota de cautela do payback, uma frase da página 8, as fontes das páginas 12 e 14 e o subtítulo da página 14.
- Sem erros de console, foram exercitados: filtro da matriz, etapas, ciclo com teclado, cenários de payback, filtro de países, gaveta, `#p11` e Home.
- `npm test`: 13 de 13, incluindo `tests/energia-atomica.test.mjs` (ordem das seções, arquivo único, ausência de marcação de reportagem e rodapé, fundo orgânico, payback e formas).
- Não verificados: leitores de tela, Safari e iOS, aparelhos físicos, impressão e desempenho real. Os 61 quadros/s do canvas foram medidos só no headless.

- Página 14: o título “Desligar e religar” não se explicava. Virou “Os países que tentaram abandonar a energia nuclear”, com um parágrafo de contexto e uma tabela no lugar dos cartões com filtro. O conceito de Beck entrou no parágrafo; a menção a Gramsci saiu da página por espaço. Essa mudança foi mantida depois da volta à identidade visual anterior.

## Ampliação de fotos e gráficos (2026-10-16)

Pedido do responsável: ao clicar em uma imagem ou gráfico, ele deve se expandir para ser visto melhor.

- **O que se expande:** as 2 fotos e os 10 gráficos, tabelas e diagramas (classes `.shaped-photo`, `.chart-card`, `.table-card`, `.stepper-card` e `.cycle-card`).
- **Como abrir:** clique em qualquer área do elemento que não seja botão ou link, ou use o botão de ampliar no canto, que também funciona pelo teclado.
- **Como funciona:** abre um `<dialog>` modal no estilo M3, que ocupa a tela toda no celular. O próprio elemento é movido para o diálogo, então filtros, abas e cenários continuam funcionando lá, e o estado se mantém ao fechar.
  - Gráficos: são ampliados com `zoom` até caber na tela, no máximo 2,6×.
  - Fotos: aparecem inteiras, sem a máscara de forma, com a legenda legível. Foram reembutidas em 1280 px; o arquivo passou de cerca de 245 KB para cerca de 600 KB.
- **Como fechar:** Esc, o botão ✕ ou um clique fora. O foco volta ao botão que abriu, e as setas do teclado não trocam de página com o diálogo aberto.
- **Validação (Chromium headless):**
  - em 1440 px: o payback ampliado (1,66×) trocou de cenário dentro do diálogo e manteve o estado ao fechar; a foto de Angra abriu inteira; Esc e clique fora fecham; clicar em uma aba do ciclo não abre o diálogo;
  - em 390 px, com toque: o filtro da matriz funcionou dentro do diálogo;
  - sem erros de console; `npm test` passa 14 de 14.
- Não verificados: leitores de tela, Safari e iOS. O `zoom` exige Firefox 126 ou posterior.

## Padronização: ícones, números, tema e layouts (2026-10-16)

O responsável pediu cinco mudanças. Todas estão implementadas e descritas em detalhe no [design system](ENERGIA_ATOMICA_DESIGN_SYSTEM.md).

1. **Formas consistentes.** Componentes retangulares não mudam mais de raio ao interagir: chips, itens do sumário, botões de ícone, botão de ampliar, cartões de país e números das etapas. O estado agora aparece só pela camada de estado. As formas expressivas continuam morfando.
2. **Ícones e tipografia.** A biblioteca escolhida foi o Material Symbols Rounded. Os ícones ficam em um sprite, com três tamanhos e papéis de cor documentados. A tipografia virou tokens `--type-*`, aplicados aos componentes.
3. **Números de dados.** 80 valores do texto corrido ficaram em verde.
   - 26 abrem o gráfico correspondente, com o valor em ênfase.
   - 54 abrem uma ficha com o significado e a fonte.
   - Foram criadas ênfases nos gráficos que não tinham. Na página 13, os valores de percepção e confiança entraram no texto para ligar o texto aos gráficos.
4. **Tema.** O tema passou a ser o Verde Bandeira ES, aplicado também à capa, ao favicon e ao fundo orgânico. A paleta usa um matiz só, com croma igual ou menor.
5. **Layouts.** O seletor na barra superior oferece rolagem, revista (duas páginas) e foco (tela inteira, zoom e arrasto).

**Validação (Chromium headless, `file://`):**
- **Composição:** as 14 páginas, em 1280 px, ficam dentro da margem. A página 13 precisou de uma frase mais curta.
- **Desktop (1440 px):**
  - o número “15,8 TWh” abriu a matriz com “Nuclear” em ênfase e a nota de fonte; ao fechar, a ênfase some;
  - “91 anos” abriu a ficha, que fecha com Esc;
  - “62,1%” selecionou a parada “Salvador” do ciclo;
  - “R$ 23,9 bilhões” destacou as 3 barras do custo restante;
  - “1,8 a 2,6 anos” destacou as colunas de payback da tabela.
- **Modo revista:** colunas de 794 px na escala; a escolha persiste ao recarregar; a seta vai de 04–05 para 06–07.
- **Modo foco:** abre ajustado (70%); zoom + leva a 110%; o arrasto move a página; a seta vai para a página seguinte; Esc volta ao modo anterior com as 14 páginas no lugar.
- **Celular (390 px, toque):** o botão “Revista” fica oculto; a ênfase “Brasil” funciona; a ficha abre; o foco ajusta pela largura (100%).
- Sem erros de console. `npm test`: 17 de 17.
- **Não verificados:** Safari e iOS, leitores de tela, trackpads reais (pinça e Ctrl + rolagem) e desempenho em aparelhos.

## Imagens (2026-10-16)

Pedido do responsável: imagens em todo lugar cabível, ligadas ao tema, como Angra e microrreatores. Os pontos citados foram a capa (seguindo a referência *Brasil Nuclear*), a parte dos estados, as figuras das aberturas e uma página dupla. As fontes preferidas são Unsplash e Eletronuclear.

**Bloqueio de rede.** A política de rede do ambiente desta sessão recusou (403) unsplash.com, images.unsplash.com, eletronuclear.gov.br, commons.wikimedia.org e agenciabrasil.ebc.com.br. Nenhuma imagem nova pôde ser baixada nem verificada. Para continuar, libere esses domínios nas configurações de rede do ambiente.

**O que foi feito, só com as 9 fotos já licenciadas do repositório** (ver [IMAGE_SOURCES.md](IMAGE_SOURCES.md)):
- **Capa:** três fotos dentro das formas orgânicas, com camadas de cor deslocadas e duas chamadas, como na referência. As fotos são Angra, um painel de controle e linhas de transmissão.
- **Aberturas:** as duas formas expressivas de cada abertura agora mostram fotos.

| Abertura | Fotos |
| --- | --- |
| Matriz | Transmissão e eólicas |
| Como funciona | Painel histórico e torres de resfriamento no exterior |
| Urânio | Duas usinas no exterior |
| Custo | Angra 3 e Angra |
| Política | Angra e a costa de Angra |

- **Estados:** a página 06 (rede e regiões) tem foto de transmissão no canto. A página 12 (ciclo pelos estados) tem a costa de Angra dos Reis, ponto final do ciclo.
- **Página dupla 08–09:** a foto de Angra (Sturm, CC BY 3.0) ocupa as duas páginas, com título e dados sobre a imagem. O botão de ampliar mostra a foto inteira.
- **Créditos e transparência:** toda foto tem crédito na linha de fontes da página (as da capa, na página 02). As fotos de usinas no exterior aparecem como ilustrativas, porque Angra não tem torres de resfriamento.
- **Técnica:** cada foto é embutida uma única vez, num bloco JSON (`#photo-data`), e aplicada por `data-photo`. O arquivo passou de cerca de 650 KB para cerca de 1,3 MB.

**Pendências:**
- **Microrreatores:** nenhuma foto disponível no acervo.
- **Etapas do ciclo:** faltam fotos de mineração em Caetité e da fábrica de combustível de Resende.
- **Eletronuclear:** só usar fotos com licença ou autorização confirmada. Até agora, nenhuma licença geral de reprodução foi verificada.
- **Unsplash:** busca por “nuclear”, “Angra”, “uranium” e “reactor” assim que a rede for liberada, com a página de cada foto verificada.

**Validação (Chromium headless, `file://`):**
- as 16 páginas, em 1280 px, ficam dentro da margem; as páginas 8 e 9 são de sangria total;
- no modo revista, as páginas 08–09 formam uma foto contínua, e a ampliação mostra a foto inteira e a devolve escondida ao fechar;
- todas as 21 marcações `data-photo` receberam a imagem;
- números, ênfases e layouts foram repetidos; o Esc no modo foco agora funciona mesmo com o foco numa aba;
- sem erros de console; `npm test`: 18 de 18.

## Sombras, tamanho das páginas e capa (2026-10-16)

- **Sombras:** padronizadas e suavizadas, em camadas e tingidas de verde-escuro. No modo revista, cada página projeta sombra só para fora, e a dobra central tem um escurecimento curto e um reflexo de papel. Ver [design system, 4.1](ENERGIA_ATOMICA_DESIGN_SYSTEM.md#41-sombras).
- **Tamanho das páginas:** na rolagem não dava para ver a página inteira. A barra superior ganhou diminuir, porcentagem, aumentar e “Página inteira”, também no modo revista.
- **Capa:** o painel de controle e as linhas de transmissão foram trocados pelo canteiro de Angra 3 e por uma usina nuclear em operação (ilustrativa), por pedido do responsável.
- **Correção:** a reescrita das sombras tinha removido a regra que deixa a capa sozinha à direita no modo revista. A regra foi restaurada, e os pares voltaram a 02–03 … 08–09.
- **Pendente:** os arquivos de marca (favicon “FR”, logotipo), o QR Code e o código de barras citados pelo responsável estão no computador dele (`C:\Users\…\Downloads`) e não chegaram ao ambiente desta sessão.
- **Validação (Chromium headless, `file://`):**
  - na rolagem, “Página inteira” ajusta a 72% em 1440 × 900 e a página 05 cabe inteira (804 px de altura);
  - +, − e a porcentagem funcionam;
  - no modo revista, a capa fica sozinha à direita, a dupla 08–09 forma uma imagem contínua e “Página inteira” mostra as duas páginas a 72%;
  - sem erros de console; `npm test`: 18 de 18.

## Capa: Angra 1, 2 e 3 (2026-10-16)

O responsável pediu uma usina em cada foto da capa: Angra 1 na forma da esquerda, Angra 2 na da direita e Angra 3 em construção na de baixo.
- O acervo tem só uma foto com Angra 1 e Angra 2 juntas (Sturm, 2009, CC BY 3.0). Por isso, cada usina é um recorte dela: o prédio cilíndrico de Angra 1 e a cúpula esférica de Angra 2.
- A forma de baixo usa a foto do canteiro de Angra 3 (Wusel007, 2015), enquadrada nos guindastes.
- O crédito na página 02 informa os recortes.
- A foto ilustrativa de usina no exterior saiu da capa.
- **Validação:** captura da capa em Chromium headless; `npm test`, 18 de 18.

## Capa profissional e fotos mais vivas (2026-10-16)

**Pedido do responsável:** fotos mais vivas, capa mais próxima de revistas profissionais, com mais texto e com a marca do grupo.

**Fotos.** A rede desta sessão continua bloqueando Unsplash, Eletronuclear e Wikimedia (403 no proxy), então não houve fotos novas. As atuais ganharam tratamento de cor (`grade()` em `photos.py`):
- abertura de sombras (gama 0,9) e leve aquecimento;
- saturação +30% e contraste +5%;
- compressão dos altos, para não estourar o céu.

A licença CC BY permite adaptação com indicação, e os créditos informam “cor ajustada”.

**Capa**, com a mesma composição de formas e Angra 1, 2 e 3:
- **expediente:** barra no topo, com “Revista de reportagem · Sociologia” e “Nº 01 · Outubro 2026 · Distribuição gratuita”;
- **chamada principal:** “Reportagem especial — A aposta nuclear”, com linha fina;
- **chamadas com números:** três à direita (2%, R$ 23,9 bi, 83%) e uma à esquerda (6 países);
- **selo:** em forma expressiva (sunny), com “16 páginas interativas”;
- **etiquetas:** Angra 1, Angra 2 e “Angra 3 · em obras” sobre as fotos;
- **rodapé:** faixa “Por dentro”, com as cinco reportagens e “Instituto J&F”.

**Marca: pendente.** Os SVGs de marca (favicon “FR” e logotipo), o QR Code e o código de barras não estão no repositório nem nos anexos da sessão. Não há commit com eles na `main` nem nesta branch. O favicon continua o provisório (“A” sobre o verde). Quando chegarem, o logotipo entra no expediente da capa e na barra do topo, o favicon substitui o atual, e o QR Code e o código de barras vão para o canto inferior da capa.

**Validação:**
- capa capturada em Chromium headless;
- 16 páginas dentro da margem;
- página dupla e ampliação funcionando;
- `npm test`: 18 de 18.

## Próximo passo

O grupo revisa o arquivo, principalmente a reportagem 2 e as condensações, e indica as próximas mudanças.
