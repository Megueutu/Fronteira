# Energia Atômica — edição versionada

Status: v1 implementada em 2026-10-16, a pedido do responsável. É uma revista separada da edição Fronteira de 20 páginas, que continua intacta na raiz do projeto.

## Onde fica e como abrir

- Decisão do responsável (2026-10-16): cada versão é **um único arquivo HTML**, `edicoes/energia-atomica/vN.html`, com CSS, JavaScript, favicon e fotografias embutidos (fotos em JPEG base64, reduzidas a 640 px). Não crie arquivos separados para a revista.
- Abra o arquivo direto no navegador, com dois cliques; não precisa de servidor. Com `npm start`, ele também abre em [localhost](http://localhost:3000/edicoes/energia-atomica/v1.html). `#p11` abre direto a página 11.
- Para uma nova versão, copie `vN.html` para `vN+1.html`, altere a cópia e registre as mudanças abaixo. Versões entregues não são editadas, exceto para correções.

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
- **Formas expressivas.** O script desenha formas inspiradas na biblioteca do M3 Expressive (cookie, clover, sunny, burst, flower, puffy, pentagon) como curvas polares com 144 pontos. Por isso qualquer forma morfa em outra com uma mola com overshoot, que imita o motion expressivo. São usadas na decoração das páginas, nos avatares, no sumário, nas etapas, no FAB e como máscara das fotografias. Não é o código oficial do Material; é uma reimplementação aproximada.
- **Arquivo único.** Na v1, o CSS está em `<style>` e o script em um `<script>` comum, não de módulo, para funcionar também por `file://`. As formas ficam no início do script (`SHAPES`, `radii`, `pathFrom`, `morph`), seguidas da navegação e das interações.
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

- Conversão para arquivo único: as 14 páginas foram capturadas de novo, abertas por `file://` sem servidor; nada ultrapassa o rodapé, e as fotos embutidas aparecem. As interações foram repetidas sem erros.
- Chromium headless (Playwright 1.56) em 1280 px: as 14 páginas foram capturadas e conferidas visualmente; nenhum bloco ultrapassa o rodapé. Também foi conferido o fluxo em 390 px.
- Foram exercitados no navegador, sem erros de console: filtro da matriz, etapas, ciclo com setas do teclado, cenários de payback, filtro de países, gaveta, `#p11`, Home.
- `npm test`: os 7 testes da edição Fronteira e os 4 de `tests/energia-atomica.test.mjs` (ordem das seções, arquivo único com fotos embutidas, editorial, contas do payback, formas) passam.
- Ainda não verificados: leitores de tela, Safari e iOS, aparelhos físicos, impressão e desempenho.

## v2 — fundo orgânico (2026-10-16)

Pedido do responsável: um canvas de fundo que simule formas orgânicas conforme a interação. Arquivo: `edicoes/energia-atomica/v2.html`, copiado da v1. A v1 não foi alterada.

- **O que faz.** Um `<canvas>` fixo, atrás das páginas, desenha sete manchas nas cores da capa, com transparência. Cada mancha é uma curva fechada de 56 pontos, suavizada por quadráticas, e seu raio é deformado por quatro harmônicos lentos.
- **Interação:**
  - cursor ou dedo: as manchas próximas se afastam e a borda voltada para o ponteiro incha na direção dele;
  - clique ou toque: uma onda empurra todas as manchas a partir do ponto;
  - rolagem: a velocidade agita as formas, e cada mancha se desloca com profundidade diferente (paralaxe);
  - mudança de página: a composição se rearranja suavemente.
- **Física:** mola amortecida até uma âncora, com passo de tempo limitado a 50 ms.
- **Cuidados:**
  - o canvas tem `aria-hidden` e `pointer-events: none` e não cobre o texto, porque as páginas são opacas;
  - a resolução é limitada a 2× a densidade de pixels da tela;
  - a animação pausa com a aba oculta;
  - com `prefers-reduced-motion`, desenha um quadro estático;
  - fica oculto na impressão.
- **Celular:** as páginas ocupam a largura toda, então o fundo aparece só entre as páginas.
- **Validação:**
  - Chromium headless em 1440 px, por `file://`: o canvas pinta cerca de 30% da tela e reage a movimento, clique e rolagem; sem erros de console; 61 quadros/s no headless, o que não comprova o desempenho em aparelhos reais;
  - as 14 páginas continuam sem transbordar;
  - `npm test`: 14 de 14.

## Próximo passo

O grupo revisa a v2, principalmente a reportagem 2 e as condensações, e indica as mudanças para a v2.
