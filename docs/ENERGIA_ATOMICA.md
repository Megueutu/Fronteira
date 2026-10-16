# Energia Atômica

Status: em revisão com o responsável desde 2026-10-16. É uma revista separada da edição Fronteira de 20 páginas, que continua intacta na raiz do projeto.

## Onde fica e como versionar

- Decisão do responsável (2026-10-16): a revista é **um único arquivo**, `edicoes/energia-atomica.html`. CSS, JavaScript, favicon e fotografias ficam embutidos no arquivo; as fotos são JPEG em base64, reduzidas a 640 px. Não crie arquivos separados.
- **Versões são commits, não cópias.** Edite sempre o mesmo arquivo; o histórico do Git guarda cada versão. Para ver uma versão antiga, use `git log -- edicoes/energia-atomica.html` e `git show <commit>:edicoes/energia-atomica.html`. Os commits `e240b28` (primeira composição), `764ebe9` (arquivo único) e `038558e` (fundo orgânico) correspondem às antigas v1 e v2.
- Abra o arquivo direto no navegador, com dois cliques; não precisa de servidor. `#p11` abre direto a página 11.

## Ordem editorial (pedido do responsável)

| Página | Conteúdo | Interação |
| --- | --- | --- |
| 01 | Capa, reproduzindo a capa enviada (verde #02A913, ENERGIA/ATÔMICA e três formas) | — |
| 02 | Apresentação dos integrantes, turma e transparência sobre IA | Formas morfam ao passar o cursor |
| 03 | Sumário e pergunta da pesquisa | Links para cada seção |
| 04 | Editorial: texto do grupo, reproduzido sem alterações a partir do PDF | — |
| 05–06 | Panorama da matriz elétrica | Gráfico com filtro por tipo de fonte |
| 07–08 | Como funciona a energia nuclear | Percurso em cinco etapas |
| 09–10 | O urânio brasileiro e o seu ciclo | Medidores ondulados; ciclo em cinco paradas |
| 11–12 | O custo e o payback | Cenários com botões segmentados |
| 13–14 | Política: posições e desinformação; países que tentaram abandonar a energia nuclear | Gráficos de percepção; tabela comparativa dos seis países |

Cada reportagem ocupa duas páginas: abertura em verde da capa e continuação. As páginas não marcam o número da reportagem.

## Design

- **Direção visual.** Em 2026-10-16 foi testada uma versão mais sóbria (commit `ab6b62f`): verde-floresta, Inter Tight e sem formas. O responsável não gostou e pediu a identidade anterior de volta. Vale a identidade abaixo, com o verde da capa nas aberturas, títulos em Montserrat e formas expressivas.
- **Material Design 3.** Os papéis de cor foram gerados com `@material/material-color-utilities` 0.3.0 (`SchemeContent`) a partir de #02A913 e ficam como tokens `--md-sys-*` no `<style>`. `on-secondary-container` foi escurecido para texto corrido. Seguem a especificação do M3: escala de forma, elevação, chips, botões segmentados, top app bar, gaveta de navegação modal e FAB. Os componentes foram escritos em CSS, sem a biblioteca `@material/web`.
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
- **Ícones.** Caminhos SVG dos Material Icons (Apache 2.0), embutidos no HTML.

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

## Próximo passo

O grupo revisa o arquivo, principalmente a reportagem 2 e as condensações, e indica as próximas mudanças.
