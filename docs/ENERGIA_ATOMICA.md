# Energia Atômica — edição versionada

Status: v1 implementada em 2026-10-16, a pedido do responsável. É uma revista separada da edição Fronteira de 20 páginas, que continua intacta na raiz do projeto.

## Onde fica e como abrir

- Cada versão é uma pasta autocontida em `edicoes/energia-atomica/vN/` (`index.html`, `styles.css`, `shapes.js`, `app.js`).
- Com `npm start`, abra [a v1](http://localhost:3000/edicoes/energia-atomica/v1/). `#p11` abre direto a página 11.
- Para uma nova versão, copie a pasta da versão anterior para `vN+1`, altere a cópia e registre as mudanças abaixo. Versões publicadas não são editadas, exceto para correções.

## Ordem editorial (pedido do responsável)

| Página | Conteúdo | Interação |
| --- | --- | --- |
| 01 | Capa, reproduzindo a capa enviada (verde #02A913, ENERGIA/ATÔMICA e três formas) | — |
| 02 | Apresentação dos integrantes, turma e transparência sobre IA | Formas morfam ao passar o cursor |
| 03 | Sumário e pergunta da pesquisa | Links para cada seção |
| 04 | Editorial: texto do grupo, reproduzido sem alterações a partir do PDF | — |
| 05–06 | Reportagem 1: Panorama da matriz elétrica | Gráfico com filtro por tipo de fonte |
| 07–08 | Reportagem 2: Como funciona a energia nuclear | Percurso em cinco etapas |
| 09–10 | Reportagem 3: O urânio brasileiro e o seu ciclo | Medidores ondulados; ciclo em cinco paradas |
| 11–12 | Reportagem 4: O custo e o payback | Cenários com botões segmentados |
| 13–14 | Reportagem 5: Política | Gráficos de percepção; filtro de países |

Cada reportagem ocupa duas páginas: abertura em verde da capa e continuação.

## Design

- **Material Design 3.** Os papéis de cor foram gerados com `@material/material-color-utilities` 0.3.0 (`SchemeContent`), a partir de #02A913, e ficam como tokens `--md-sys-*` no início de `styles.css`. `on-secondary-container` foi escurecido para texto corrido. Escala de forma, elevação, chips, botões segmentados, top app bar, gaveta de navegação modal e FAB seguem a especificação do M3. Os componentes foram escritos em CSS, sem a biblioteca `@material/web`.
- **Formas expressivas.** `shapes.js` desenha formas inspiradas na biblioteca do M3 Expressive (cookie, clover, sunny, burst, flower, puffy, pentagon) como curvas polares com 144 pontos. Por isso qualquer forma morfa em outra com uma mola com overshoot, que imita o motion expressivo. São usadas na decoração das páginas, nos avatares, no sumário, nas etapas, no FAB e como máscara das fotografias. Não é o código oficial do Material; é uma reimplementação aproximada.
- **Tipografia.** Playfair Display (títulos, como “ENERGIA”), Montserrat 800 (rótulos, como “ATÔMICA”) e Roboto Flex (texto e interface), via Google Fonts com fontes locais de reserva. É a primeira dependência de CDN do projeto; sem rede, a página usa Georgia/Arial.
- **Ícones.** Caminhos SVG dos Material Icons (Apache 2.0), embutidos no HTML.
- **Páginas.** 794 × 1123 px (proporção A4) no desktop. Abaixo de 860 px, viram fluxo vertical de uma coluna. O texto é alinhado à esquerda, sem justificação: o Chromium em Linux não hifenizou o português, e o texto justificado abria rios.
- **Movimento.** As formas das capas das reportagens morfam uma vez quando a página entra na tela. `prefers-reduced-motion` desliga animações.

## Conteúdo e fontes

- Os dados vêm do documento “Aposta e benefícios do investimento na energia nuclear no Brasil” (ABNT) e do editorial em PDF, ambos enviados pelo grupo.
- “Como funciona a energia nuclear” não tem capítulo próprio no documento. O texto técnico foi redigido com assistência de IA, com conhecimento geral sobre reatores PWR e dados públicos de Angra 1 (640 MW, 1985) e Angra 2 (1.350 MW, 2001). As páginas indicam que falta a revisão do grupo.
- Decisões de edição. Não foi reproduzida a afirmação de que o Brasil é um de apenas três países com reserva, enriquecimento e usinas, porque a China também reúne as três condições. A etapa de Caldas (MG) ficou fora do ciclo: a unidade está em descomissionamento. Os e-mails das candidaturas contatadas não foram publicados. Os 83% de dependência aparecem como conta do grupo, com a ressalva de que a base é diferente do número francês.
- Ficaram para versões seguintes: Itacuruba, a desigualdade regional de qualidade e furto de energia, Belo Monte, a lista completa de referências e os gráficos originais do DOCX.
- Fotografias: `angra.jpg` e `angra3.jpg`, já documentadas em [IMAGE_SOURCES.md](IMAGE_SOURCES.md), com crédito e licença CC BY 3.0 na própria página.

## Validação da v1

- Chromium headless (Playwright 1.56) em 1280 px: as 14 páginas foram capturadas e conferidas visualmente; nenhum bloco ultrapassa o rodapé. Também foi conferido o fluxo em 390 px.
- Foram exercitados no navegador, sem erros de console: filtro da matriz, etapas, ciclo com setas do teclado, cenários de payback, filtro de países, gaveta, `#p11`, Home.
- `npm test`: os 7 testes da edição Fronteira e os 4 de `tests/energia-atomica.test.mjs` (ordem das seções, fotos, editorial, contas do payback, formas) passam.
- Ainda não verificados: leitores de tela, Safari e iOS, aparelhos físicos, impressão e desempenho.

## Próximo passo

O grupo revisa a v1, principalmente a reportagem 2 e as condensações, e indica as mudanças para a v2.
