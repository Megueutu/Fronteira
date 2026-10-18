# Revisão da edição de 20 páginas

Data: 2026-10-16. Esta revisão registra decisões concretas de conteúdo, composição e funcionamento. Não constitui certificação científica, financeira ou de acessibilidade.

## Revisão do escopo

O responsável autorizou concluir a edição sem perguntas adicionais, com aproximadamente 20 páginas, texto justificado em colunas, branco e verde, fotografias e interatividade. Os cinco temas foram mantidos. Messmer e as experiências internacionais entraram em Política; desigualdade e Milton Santos no Panorama; Wallerstein, sua apresentação e críticas no tema Urânio e soberania. Custos, distribuição e Weber conectam os temas sem criar um sexto capítulo.

O plano inclui capa, sumário, editorial, balanço, uso de IA e referências. O primeiro texto de reportagem é “Um Brasil Desigual”. A edição recebeu exatamente 20 páginas, com fluxogramas da leitura e do editorial em HTML semântico.

## Revisão editorial e de evidências

1. A extração do DOCX confirmou dez seções, atestado e referências. O texto foi condensado e redistribuído, preservando os documentos originais.
2. A comparação que descrevia 2,0% como menor que 1,5% foi corrigida. O gráfico da matriz soma 100% e distingue geração nacional de oferta interna com importações.
3. O indicador de renovabilidade da oferta interna não foi misturado às participações da geração nacional. Foram consultados o Anuário e o BEN 2026 da EPE.
4. Os gráficos originais com percentuais incompletos, aproximações visuais ou fontes insuficientes não foram republicados como evidência. A edição priorizou a matriz e cenários reproduzíveis, mantendo desigualdade, tarifas e opinião pública na análise qualitativa.
5. O payback foi recalculado a partir de potência, horas, capacidade, tarifa, custos operacionais e investimento. O laboratório identifica suas hipóteses como exercício acadêmico de 2025, não orçamento vigente nem previsão. O resultado é em anos de operação; não se promete uma data de retorno.
6. A nota da EPE de 2024 foi tratada como documento datado sobre informações então preliminares, sem extrapolação para uma conclusão definitiva sobre o projeto atual.
7. As experiências internacionais distinguem abandono, suspensão, extensão e mudança de orientação. Os recortes têm datas; não se afirma que as políticas permaneceram inalteradas até 2026.
8. Os conceitos sociológicos são interpretações, com críticas à análise de sistema-mundo e sem transformar o nome de um autor em prova da viabilidade de uma usina.
9. Na versão inicial, o editorial sintetizava os objetivos da pesquisa com assistência de IA. Em 2026-10-17, essa síntese foi substituída integralmente pelo texto final enviado pelo responsável, conforme o registro abaixo. Não foram inventadas falas, entrevistas ou aprovação individual dos seis autores.
10. O atestado original, que restringia a IA à organização, não representava esta etapa. A edição explicita pesquisa complementar, redação, revisão, design, implementação e testes assistidos.

Fontes institucionais consultadas incluem EPE, ONS, INB, AIEA, ONU, arquivos do INA, governos alemão, belga e japonês, Parlamento Europeu, MRE e a editora da obra de Wallerstein. A bibliografia completa é acessível na revista; referências do grupo continuam identificadas como tal.

## Revisão fotográfica

O acervo de onze fotografias já estava baixado. Além dele, foram obtidas duas fotografias históricas de Angra no Wikimedia Commons, com licença CC BY 3.0 verificada nas páginas dos arquivos. Os créditos aparecem na página e nas ampliações. Datas e contexto acompanham os registros históricos.

Torres genéricas, paisagem costeira e painel histórico não foram identificados como instalações atuais de Angra. A fotografia noturna usada na discussão do Plano Messmer é ilustrativa, sem identificação como central francesa. Nenhuma foto da Eletronuclear foi extraída presumindo licença de reprodução.

## Revisão visual e reflexão

A primeira renderização encontrou conteúdo encostando ou ultrapassando o rodapé. Foram reduzidas repetições de texto, ajustadas a medida tipográfica e a entrelinha e revistos os espaços de tabelas e do sumário. A solução não foi esconder o conteúdo com recorte.

A revisão visual encontrou também uma colisão entre a classe da página de referências e a classe da lista bibliográfica, que retirava a margem daquela página. As classes foram separadas. As vinte páginas passaram pelo relatório de limites e por inspeção visual das capturas, com imagens presentes, colunas justificadas e áreas de ação livres.

O celular deixou de reduzir uma página lógica inteira até tornar o corpo ilegível: o HTML passa a fluir em uma coluna de 18 px. No desktop, o objeto mantém duas páginas. O 3D ganha leitura ampliada em HTML para que a experiência de folhear não impeça compreender o texto.

Os dois modos passaram a compartilhar a composição. Texturas geradas pelo mesmo HTML evitam a duplicação anterior de layouts e impedem que uma mudança editorial altere apenas um dos modos. A GPU conserva o par atual e, durante a virada, os pares necessários à transição.

## Verificações

- Testes de invariantes da edição, referências e destinos; geometria curva e projeção; total da matriz; unidades, sensibilidade e rejeição de hipóteses inválidas no payback; sincronização das vinte texturas.
- Renderização das páginas com medição do conteúdo em relação ao rodapé, verificação de imagens e transbordamento, mais captura para inspeção visual.
- Fluxo de navegador pelas vinte páginas em HTML e 3D, com sumário, notas, gráfico, diagrama, ciclo, cenários, linha do tempo, checklist, fotografias, galeria e referências.
- Escape, foco inicial e retorno de foco; retorno à leitura contínua depois de uma camada; movimento reduzido; virada animada; cache de texturas; viewport móvel; link direto e perda de contexto WebGL com navegação em HTML.

Ambiente: Node.js 25.9.0, Chrome for Testing 153.0.8010.12 headless, Windows, WebGL por software. Capturas e relatórios ficam em `artifacts/`. Esse resultado não mede FPS, bateria, uso real de GPU ou experiência em aparelhos físicos.

Resultado da rodada final: `npm test` passou os sete testes; `npm run render:textures` verificou as vinte páginas sem imagens ausentes ou conflito com o rodapé; `npm run test:browser` concluiu o fluxo completo com sucesso. A edição também foi aberta no navegador do aplicativo, com o modo 3D carregado e o contador de vinte páginas confirmado.

## Cabeçalho do leitor (2026-10-17)

**Pedido e implementação.** O responsável enviou a imagem do cabeçalho da edição Fronteira e pediu melhoria visual. Foram reorganizados a marca, os metadados da edição e as ações, com seletor agrupado de 3D/Páginas, contexto da abertura e botões de sumário, leitura contínua, ampliação e tela cheia. Os ícones são reutilizados do sprite Material Symbols já licenciado. As alterações da Energia Atômica que estavam no diretório foram preservadas.

**Validação do escopo.** Cabeçalho capturado em 1896, 1440, 1024, 768, 390 e 320 px: sem transbordamento e com todos os botões medidos em pelo menos 44 × 44 px. Passaram abertura/fechamento do sumário, Escape e retorno do foco, leitura contínua, ampliação, troca HTML/3D, tela cheia por clique real e volta à capa. `npm test`: 19/19, incluindo sincronização do manifesto. Evidências em `artifacts/header/`.

**Páginas e alertas anteriores.** Foram geradas as vinte texturas e conferidos os vinte PNGs. A checagem geométrica retorna alerta nas páginas 03, 06, 08, 09, 10, 13, 14 e 18 por proximidade ou avanço do conteúdo sobre a área do rodapé. A comparação de todas as vinte páginas com o CSS da `HEAD` confirmou limites de conteúdo e rodapé idênticos antes e depois da alteração do cabeçalho (`artifacts/header/page-baseline.json`). O teste geral `npm run test:browser` interrompeu na mesma verificação preexistente da página 03; não se registra aprovação do fluxo geral. Esses problemas editoriais não foram alterados neste pedido de interface.

**Geração local.** Depois da primeira geração completa, novas gravações de JPEGs idênticos falharam com erro de filesystem na pasta sincronizada. O gerador passou a comparar os bytes e a preservar arquivos idênticos, evitando reabertura desnecessária. A rodada final gravou/verificou as vinte páginas e atualizou o manifesto; seu código de saída continua sendo 1 pelos oito alertas geométricos anteriores, sem erro de gravação nessa rodada.

**Próximo passo.** Revisar separadamente os espaços de conteúdo/rodapé indicados acima e repetir o teste geral após essa revisão. O cabeçalho está validado no Chromium local; outros navegadores e aparelhos físicos não foram homologados.

## Barra inferior e rodapé (2026-10-17)

**Pedido implementado:** reformular os controles abaixo da revista e o rodapé para acompanhar o novo cabeçalho. Navegação e contador agrupados, próximo destacado em verde, zoom separado, dica de teclado e identificação da turma; fotos/créditos e fontes com botões legíveis e ícones existentes. IDs, estados desabilitados, contador anunciado e interações foram conservados.

**Verificação:** capturas nas larguras 1896, 1440, 1024, 768, 390 e 320 px, sem rolagem horizontal e com botões de pelo menos 44 × 44 px. Passaram anterior/próxima em HTML e 3D, zoom 100% → 115% → 100%, créditos e fontes (inclusive clique no SVG), Escape e retorno do foco. Sem exceções JavaScript. `npm test`: 19/19. Foram regeneradas as vinte texturas e revisados seus PNGs; as medidas das páginas continuam idênticas às da etapa anterior. `render:textures` retorna 1 pelos mesmos oito alertas geométricos já documentados, sem novos alertas. Evidências em `artifacts/footer/` e `artifacts/page-layout.json`.

**Próximo passo:** revisão editorial separada dos limites de conteúdo/rodapé pendentes. O pedido visual da barra está concluído.

## Modo Página inteira (2026-10-17)

**Pedido implementado.** Terceiro modo no seletor, com estilo de landing page e conteúdo amplo em rolagem contínua. Capa com foto e título em duas áreas no desktop, CTA para o sumário, vinte seções com a mesma pesquisa e interações. URL `?template=landing&page=N`, identificação da seção durante a rolagem, sumário e navegação por seção, foco no título e retorno aos modos em páginas e 3D. O modo inicial anterior foi preservado.

**Verificação.** `npm test`: 19/19. `npm run test:landing` passou: link direto para a página 13, vinte seções, sumário e foco, sincronização ao rolar, troca de modos e larguras de 1440, 768, 390 e 320 px. A revisão adicional cobriu 1896 e 1024 px, os oito destinos do sumário, galeria/foto, filtro do gráfico e leitura contínua em diálogo, sem exceções JavaScript. Os vinte artigos foram medidos sem colisão do conteúdo com suas ações e os parágrafos foram comparados, um a um, com a pesquisa original de `pages`. Um título longo foi ajustado para quebrar dentro da largura de 320 px.

**Texturas e limites.** As vinte texturas foram regeneradas e seus PNGs revisados. As medidas do conteúdo e rodapé dos modos em páginas continuam iguais às da referência anterior. `render:textures` mantém os oito alertas preexistentes documentados acima; isso não equivale a aprovação desse verificador. O modo Página inteira tem altura livre. Evidências em `artifacts/landing/`; não foram homologados outros navegadores nem dispositivos físicos.

**Próximo passo.** Revisão do responsável sobre o novo modo e revisão editorial separada dos alertas do leitor em páginas.

## Capa inspirada na referência Brasil Nuclear (2026-10-17)

**Pedido implementado.** Capa verde com marca Fronteira em destaque, chamadas brancas e três fotografias em recortes orgânicos: painel ilustrativo, Angra em 2009 e canteiro de Angra 3 em 2015. A composição da referência foi adaptada à identidade e à pesquisa da revista. O texto de abertura e os cinco temas foram preservados, sem incorporar as chamadas da publicação de referência.

**Verificação.** `npm test`: 19/19. `npm run test:landing` passou, incluindo abertura das três fotografias corretas com seus créditos e Escape/retorno do foco, além do sumário e da troca HTML/3D. Checagem adicional em 1896, 1440, 1024, 768, 390 e 320 px: textos da colagem dentro dos limites e sem sobreposição entre si; sem rolagem horizontal. Todos os parágrafos foram comparados com `pages`. As outras dezenove páginas mantiveram os mesmos limites de conteúdo e rodapé da referência anterior. Evidências em `artifacts/cover/`.

**Texturas e limites.** As vinte texturas foram regeneradas e os vinte PNGs revisados. A capa passou: conteúdo até 921 px e ações a partir de 958 px. O gerador ainda retorna 1 pelos mesmos oito alertas anteriores nas páginas 03, 06, 08, 09, 10, 13, 14 e 18; não há novo alerta na capa. A composição está verificada no Chromium local, sem homologação adicional em outros navegadores.

**Próximo passo.** Revisão visual do responsável e revisão editorial separada dos espaços pendentes nas páginas internas.

## Refinamento da silhueta da capa (2026-10-17)

**Pedido implementado.** O responsável pediu literalmente o formato da referência recortada. A capa passou a usar uma silhueta contínua em S: painel no topo esquerdo, curva para Angra à direita e canteiro no recorte inferior esquerdo; área verde central, ondas azuis na base e degradê claro. A marca Fronteira acompanha um átomo vetorial. O modo Página inteira preserva a proporção vertical, com arte centralizada até 1000 px. A linha “Sociologia · Instituto J&F” continua removida.

**Fotografias.** Tratamento azulado apenas na composição, identificado no crédito; os arquivos locais e as ampliações mantêm as cores originais. Contexto histórico, autoria e licença permanecem acessíveis. As chamadas conservam os temas da pesquisa.

**Verificação.** `npm test`: 19/19. `npm run test:landing` passou, incluindo as três fotos corretas, créditos, Escape e retorno do foco, sumário e troca HTML/3D. A capa foi medida em seis larguras entre 320 e 1896 px, sem sobreposição entre textos nem rolagem horizontal. Todos os parágrafos foram comparados com a fonte editorial. As vinte texturas foram regeneradas e os vinte PNGs revisados, além de captura do leitor 3D sem exceções JavaScript. Capa: conteúdo até 921 px, ações a partir de 958 px. As outras dezenove páginas conservaram suas medidas anteriores.

**Limites e próximo passo.** O gerador mantém saída 1 pelos oito alertas anteriores das páginas internas; o refinamento não acrescentou alertas. Evidências em `artifacts/cover/` e `artifacts/header/PAGES.png`. Próximo passo: revisão visual do responsável e revisão editorial separada das páginas internas pendentes.


## Cor principal #1E7349 (2026-10-17)

**Pedido implementado.** A edição Fronteira usa `#1E7349` como base de capa, controles, links e destaques. As variações claras da capa foram ajustadas para `#80ac94` e `#dcebe2`; a série secundária dos gráficos usa `#6b9c82`. Notas, fundo e divisores acompanham a nova base. Favicon e metadado de cor do navegador foram sincronizados. O recorte em S e o azul das fotografias permanecem.

**Validação.** Vinte texturas regeneradas e vinte PNGs revisados. `npm test`: 19/19. A checagem em seis larguras passou, com os textos e a geometria das dezenove páginas internas preservados. `test:landing` teve uma falha intermitente no retorno do foco ao fechar a primeira foto; a repetição isolada passou, sem alterações no comportamento. O gerador continua retornando 1 pelos mesmos oito alertas internos anteriores; a capa passa sem novo alerta. Próximo passo: revisão visual do responsável e revisão editorial dos alertas já documentados.

## Editorial final enviado pelo responsável (2026-10-17)

**Pedido implementado.** Os quatro parágrafos recebidos substituem o corpo do editorial na página 03, integralmente e sem reescrita. O título existente permanece, agora em uma linha, e a linha fina resume acesso à energia e autonomia tecnológica. A citação avulsa anterior foi retirada. O sumário, a nota de origem, o fluxograma e a transparência na página 19 acompanham a versão final; não se atribui sua redação à IA nem aprovação individual aos integrantes.

**Composição.** No frame fixo, margens de 32 px, título de 42 px e corpo Georgia 16/1,45 acomodam o texto. O conteúdo termina em 932 px, antes das ações em 957 px. Os modos de altura livre mantêm seus tamanhos de leitura anteriores. A fonte editorial continua única para HTML e 3D.

**Verificação.** As vinte texturas foram regeneradas e os vinte PNGs revisados. A página 03 agora passa na checagem geométrica; permanecem sete alertas anteriores (06, 08, 09, 10, 13, 14 e 18). `npm test`: 19/19; `test:landing` passou. A checagem específica comparou os quatro parágrafos entre fonte, HTML desktop/celular, Página inteira desktop/celular e leitura contínua; conferiu limites, nota de origem e novo fluxograma, sem exceções JavaScript. Evidências em `artifacts/editorial/`.

**Limitação do teste geral.** A expectativa do fluxograma foi atualizada para os cinco passos do argumento final. Na nova execução, `test:browser` percorreu as interações até interromper na expectativa geral de texto justificado: a capa existente usa alinhamento à esquerda. Não se registra aprovação integral desse teste. Próximo passo: revisão visual do responsável e revisão separada dos sete alertas de páginas internas e dessa expectativa geral de alinhamento.

## Retratos dos seis integrantes (2026-10-17)

**Pedido implementado.** As seis fotos fornecidas pelo responsável aparecem no sumário, com nome e ampliação individual, e na área de créditos. Davi de Oliveira foi confirmado pelo responsável, apesar do nome `davi-silva.jpeg`. Os outros nomes seguem a associação dos arquivos enviados. Não houve reconhecimento facial, recompressão ou alteração das cores dos retratos.

**Composição.** Mantidas vinte páginas. No frame fixo, o sumário ganhou duas colunas de links e uma linha com seis retratos; conteúdo até 828 px e ações a partir de 957 px. Página inteira, leitura contínua e HTML móvel usam o mesmo componente com grade adaptada. A textura 3D do sumário contém os retratos.

**Verificação.** `npm test`: 19/19. `test:landing` passou, incluindo os seis nomes, arquivos ampliados corretos, Escape e retorno do foco. A checagem específica confirmou a igualdade de bytes dos seis originais e das cópias, imagens de 500 × 500 px, proporção preservada e ausência de rolagem horizontal em HTML e Página inteira nas larguras 1440, 768, 390 e 320 px. Retorno de ampliações abertas na leitura contínua e nos créditos conferido; captura do 3D sem exceções JavaScript. Evidências em `artifacts/team/`.

**Texturas e próximo passo.** Vinte texturas regeneradas e vinte PNGs revisados. Nenhum novo alerta; permanecem os sete alertas anteriores das páginas 06, 08, 09, 10, 13, 14 e 18, pelos quais o gerador retorna 1. Próximo passo: revisão visual do responsável e revisão editorial separada dessas páginas internas.

## Bolinha do átomo e animação da capa (2026-10-17)

**Pedido implementado.** Ajustada a posição inicial da bolinha para a curva superior esquerda da elipse. O centro permanece sobre o traço durante todo o percurso: dois arcos SVG compartilham centro, raios e rotação com a elipse. A volta dura oito segundos, com velocidade constante e núcleo fixo. A animação aparece nos modos HTML, Página inteira e leitura contínua; movimento reduzido, impressão e textura 3D usam a posição estática. Sem dependências ou assets novos; pesquisa e implementação nativa registradas em [ARCHITETURE.md](ARCHITETURE.md).

**Verificação.** Conferidos 33 pontos ao longo de uma volta completa, incluindo fechamento do ciclo; todos satisfazem a equação da elipse, com tolerância de 0,002. Conferidos avanço do relógio da animação, três fases em captura, larguras 1440, 390 e 320 px sem rolagem horizontal, movimento reduzido, impressão, HTML, 3D e renderização estática, sem exceções JavaScript. `npm test`: 19/19; `test:landing` passou. Evidências em `artifacts/atom/`.

**Texturas e próximo passo.** As vinte texturas foram regeneradas e os vinte PNGs revisados. Os limites de conteúdo e rodapé continuam idênticos aos anteriores. O gerador retorna 1 pelos sete alertas anteriores das páginas 06, 08, 09, 10, 13, 14 e 18, sem novo alerta na capa. Próximo passo: revisão visual do responsável; a revisão editorial das páginas internas permanece separada.

## Título final do editorial (2026-10-17)

**Pedido implementado.** O título da página 03 passou a ser “A energia nuclear no futuro brasileiro”, exatamente como enviado pelo responsável. Os quatro parágrafos, a linha fina e as interações foram preservados. Esse título já constava da edição autocontida Energia Atômica; a atualização foi feita na composição compartilhada do Fronteira.

**Verificação.** Conferidos título exato, quatro parágrafos, limites do título e ausência de rolagem horizontal em HTML e Página inteira nas larguras 1440 e 390 px, sem exceções JavaScript. A página fixa mantém o conteúdo até 932 px e as ações a partir de 957 px. As vinte texturas foram regeneradas e seus PNGs revisados. O gerador mantém saída 1 pelos sete alertas anteriores nas páginas 06, 08, 09, 10, 13, 14 e 18, sem novo alerta. `npm test`: 19/19. Evidências em `artifacts/editorial-title/`.

**Próximo passo.** Revisão visual do responsável e elaboração da seção de entrevista a partir do registro posteriormente recuperado, conforme [ENTREVISTA_ADOLFO_BRAID.md](ENTREVISTA_ADOLFO_BRAID.md).

## Entrevista com Adolfo Braid (2026-10-17)

**Pedido implementado.** Seção completa com identificação profissional, formação/trajetória, cinco eixos de perguntas e respostas sintetizadas e roteiro expansível com dezessete perguntas/intensões e suas lacunas. As conexões com a pesquisa são identificadas como análise do grupo; cada eixo permite abrir o tema relacionado. Não foram inventadas falas literais, motivação pessoal, cronologia detalhada ou cálculos de payback ausentes do registro. As fontes profissionais e os limites de atribuição estão em [ENTREVISTA_ADOLFO_BRAID.md](ENTREVISTA_ADOLFO_BRAID.md).

**Composição e navegação.** Suplemento após a página 17 na landing e na leitura contínua, mantendo as vinte páginas e seus parágrafos. Atalho no sumário, no sumário modal e na ação da página 17 do HTML/3D. `interview=adolfo` abre diretamente a entrevista. Links das páginas posteriores usam `data-page-index`, evitando que o suplemento desloque os destinos. A correção de Escape impede que o fechamento nativo também encerre a camada acabada de restaurar, preservando o retorno de foto → entrevista → sumário → acionador.

**Imagens.** Duas fotos institucionais do IRD/ANSN, com participação de Adolfo registrada nas notícias, créditos e licença CC BY-ND 3.0. Arquivos integrais sem recorte, filtro ou recompressão; hashes preservados. As legendas distinguem os eventos da entrevista escolar. O retrato individual da ABDAN ficou acessível por link, sem incorporar uma foto cuja licença de redistribuição não foi identificada.

**Verificação.** `npm test`: 19/19; `test:landing` e `test:interview` passaram. O teste novo cobre link direto, preservação das vinte páginas/parágrafos, navegação 17 → 18 após o suplemento, acesso por sumário nos três modos e ação do 3D, ambas as fotos, créditos, manutenção do roteiro aberto, Escape/foco em três camadas e larguras 1440, 768, 390 e 320 px sem transbordamento horizontal. As fotos mantêm a proporção natural. Checagem adicional de leitura contínua e retorno da ampliação em 1440 e 390 px passou. Capturas de título, respostas e roteiro revisadas; evidências em `artifacts/interview/`.

**Texturas e limites.** Vinte texturas regeneradas e vinte PNGs revisados. Sumário com atalho: conteúdo até 931 px, ações a partir de 957 px. Página 17: conteúdo até 945 px. O gerador mantém saída 1 pelos sete alertas anteriores em 06, 08, 09, 10, 13, 14 e 18, sem novo alerta. O teste geral de navegador continua com os limites históricos descritos acima; não foi declarado aprovado nesta etapa. Próximo passo: revisão das sínteses pelo grupo e, se disponíveis, conferência das gravações para acrescentar citações literais e respostas ainda sem registro. Sem nova publicação nesta etapa.

## Fontes junto aos trechos (2026-10-17)

**Pedido implementado.** Informar a origem logo abaixo de cada informação de pesquisa, com site/documento e local de consulta. `src/citations.js` mantém o catálogo e a associação por parágrafo, gráfico e esquema. As notas aparecem após o trecho em Página inteira, leitura contínua e HTML móvel. O 3D e o HTML fixo têm o detalhamento por trecho abaixo da abertura e no botão de fontes. A composição de vinte páginas foi preservada.

**Atribuição.** Os cenários financeiros apontam para §7/Tabelas 4 e 5 do estudo ABNT revisto; as respostas da entrevista apontam para as seções do registro consolidado, distinguindo notas de slides. Formação e função profissional usam AEITA, ABDAN e CNEN. Interpretações sociológicas e propostas recebem rótulo de análise do grupo. A biografia de Milton Santos deixou de ser usada como link de seus conceitos: a nota identifica os livros, a síntese do grupo em §3.3 e a falta de páginas confirmadas. Referências acrescentadas para Fukushima, Chernobyl, ABACC e Santa Quitéria. Não foram inventadas páginas de livros ou PDFs; lacunas de paginação são explícitas.

**Verificação.** `npm test`: 22/22; `test:citations`, `test:landing` e `test:interview` passaram. Conferidos os trechos preservados, links e localizadores no DOM, fontes da calculadora e dos seis países, atualização do painel no HTML/3D, entrevista e larguras 1440/768/390/320 sem transbordamento horizontal. As vinte texturas foram regeneradas e os vinte PNGs revisados; sem imagens ausentes ou novo alerta. O gerador mantém saída 1 pelos sete alertas anteriores (06, 08, 09, 10, 13, 14 e 18). Evidências em `artifacts/citations/`.

**Relato separado do 3D.** A URL publicada foi inspecionada em 1440 × 900, 390 × 844 e 320 × 700, com carregamento e uma virada em cada largura, sem exceções JavaScript ou requisições HTTP com erro. A falha relatada não foi reproduzida; o diagnóstico ainda depende da descrição do comportamento esperado/observado. Não houve alteração especulativa no renderer.

**Próximo passo.** Revisão editorial pelo grupo para completar as páginas das obras originais e conferir as notas da entrevista com o áudio. A checagem dos localizadores não equivale à revisão científica independente de toda a pesquisa.

## Seleção das perguntas registradas (2026-10-17)

**Pedido implementado.** Retirados os sete itens da lista da entrevista que estavam classificados como “Sem registro”, “Sem resposta direta”, “Sem cálculo registrado” ou “Sem explicação registrada”. A seção agora se chama “Perguntas com respostas registradas” e mostra dez perguntas com conteúdo recuperado ou complementado por fontes identificadas. As respostas parciais mantêm seu rótulo. O registro documental original foi preservado; não foram criadas respostas para preencher os itens retirados.

**Verificação.** `npm test`: 22/22; `test:interview` passou, incluindo a contagem de dez perguntas, ausência dos rótulos sem resposta e remoção da pergunta sobre o momento mais marcante. Navegação, imagens, fontes, foco/Escape e quatro larguras conferidos. Vinte texturas regeneradas e vinte PNGs revisados; permanecem os sete alertas de composição anteriores, sem novo alerta. Capturas da seleção de perguntas em desktop e celular em `artifacts/interview/`. Próximo passo: revisão das respostas mantidas pelo grupo.

## Entrevista sem perguntas incompletas ou graus de informação (2026-10-17)

**Pedido implementado.** A seleção foi restringida a perguntas respondidas por inteiro. Retiradas cinco perguntas antes classificadas como parciais (motivação, tempo de atuação, entraves, oportunidade/risco e comparação de Angra 3 com alternativas). Os dois destaques incompletos sobre Angra 3 e oportunidades/riscos também foram excluídos. Permanecem três destaques e cinco perguntas adicionais, sem rótulos de completude ou menções editoriais às perguntas excluídas. As respostas não foram completadas por suposição. As fontes permanecem abaixo de cada resposta; a função atual aponta às fontes institucionais que a confirmam.

**Verificação.** `npm test`: 22/22; `test:interview` e `test:citations` passaram. Conferidas a ausência dos rótulos, a retirada das perguntas incompletas na seção inteira, as cinco respostas adicionais e os três destaques. Fontes, fotos, navegação, foco e quatro larguras mantidos. Vinte texturas regeneradas e vinte PNGs revisados; permanecem apenas os sete alertas anteriores de composição. Capturas em `artifacts/interview/`.

**Continuidade.** O registro original da pesquisa é preservado. A seleção publicada contém somente respostas sustentadas pelo material disponível. Próximo passo: revisão da seleção final pelo grupo.

## Recursos interativos e tarifas (2026-10-18)

**Implementado.** Cinco componentes na leitura: carrossel de fotografias (04), matriz com filtros e seleção por fonte (05), simulador com controles e comparação de investimentos (13), tarifas com consumo ajustável (14) e carrossel de seis países (16). Há atalhos próximos aos títulos, fontes junto aos dados, controles por teclado, foco preservado ao ampliar fotografias e ausência de avanço automático. As setas e os gestos dentro dos componentes não viram a revista. A calculadora modal também mostra o gráfico de payback. No 3D, os recursos em fluxo ficam disponíveis em “Ler esta abertura” e na leitura contínua; as texturas conservam a composição estática.

**Tarifas.** Valores conferidos no PDF fornecido, p. 24, §5.1/Tabela 2, e na compilação Meutudo de 2026. O gráfico apresenta limites, sem sugerir médias regionais ou atualização em tempo real. A simulação calcula consumo × tarifa e explicita que não calcula a fatura final. As colunas da página Meutudo estavam rotuladas em ordem inversa à dos valores; mantida a ordenação mínima/máxima do PDF, com nota na fonte. O gráfico da edição autocontida Energia Atômica oferece alternância Gráfico/Tabela e ampliação por região, com fontes abaixo. O build inclui essa edição em `edicoes/`.

**Limpeza solicitada.** Removida a faixa “Explore as fotografias” da capa e o hotspot correspondente no 3D; o botão do sumário permanece corretamente posicionado. Removidas as menções à disciplina e ao instituto na interface pública das duas edições. Os documentos originais da pesquisa foram preservados.

**Validação.** `npm test`: 22/22. Passaram `test:explorers`, `test:tariffs`, `test:landing`, `test:citations` e `test:interview`. Conferidos os cálculos e filtros, unidades, limites de consumo e payback, navegação local por teclado e rolagem nativa, foco/Escape, estado independente entre instâncias, fontes e créditos, HTML/3D e larguras de 1440/768/390/320 px sem transbordamento horizontal nos componentes. A edição autocontida foi conferida em 1600 e 390 px. Capturas dos cinco componentes, da página 6 da Energia Atômica e da folha de vinte páginas foram revisadas.

**Texturas e limites.** Vinte texturas regeneradas e vinte PNGs revisados; permanecem os mesmos sete alertas anteriores (06, 08, 09, 10, 13, 14 e 18), por isso o gerador retorna saída 1. Nenhum novo alerta de composição ou imagem ausente. O teste geral `test:browser` continua sujeito aos limites históricos registrados acima e não foi declarado aprovado nesta etapa. Evidências em `artifacts/explorers/`, `artifacts/tariffs/` e `artifacts/citations/`. Próximo passo: revisão editorial dos dados e das simulações pelo grupo; homologação em aparelhos físicos permanece pendente.

**Limpeza complementar (2026-10-18).** Removidas as duas menções restantes à disciplina e ao instituto na prévia pública de design (`previews/index.html`). A edição principal e a Energia Atômica já estavam sem esses créditos. A busca nos arquivos publicados confirmou a ausência das expressões; `npm test`: 22/22. Os documentos originais de pesquisa e o histórico editorial foram preservados. Não houve alteração em `src/` nem necessidade de regenerar texturas.

## Distribuição editorial em Página inteira (2026-10-18)

**Pedido implementado.** Após revisão da versão local na porta 5500, os títulos e linhas finas passaram ao topo da matéria. O corpo ocupa a largura em duas colunas no desktop/tablet e uma no celular, em vez de permanecer à direita com um grande espaço vazio à esquerda. Todos os parágrafos e suas fontes foram preservados. A continuação de texto entre colunas segue a leitura editorial; fontes e figuras não são cortadas. Os quadros de argumentos também distribuem suas listas de fontes em duas colunas no desktop.

**Fotografias.** Sete imagens já licenciadas foram distribuídas no fluxo: editorial, território, segurança, sistema-mundo, soberania, opinião pública e balanço. Cada uma identifica contexto histórico/ilustrativo, autor, licença e página de origem. As quatro fotos de abertura existentes usam a largura da matéria. Ampliação e retorno do foco conferidos para as sete imagens; não houve asset novo ou alteração nas fotos institucionais BY-ND.

**Verificação.** `npm test`: 22/22. Passaram `test:layout`, `test:landing`, `test:citations`, `test:explorers` e `test:interview`. O teste de composição verifica texto nos dois lados e largura completa em dezessete matérias, conteúdo e ordem originais, fotos/fontes, ampliação/foco e ausência de transbordamento em 1440, 1024, 768, 390 e 320 px. Sumário e referências mantêm sua composição própria. Capturas das dezenove seções após a capa e do celular foram revisadas; evidências em `artifacts/layout/`.

**Paginação e limites.** A nova distribuição é exclusiva de Página inteira; a capa, a entrevista e as composições paginadas foram preservadas. Vinte texturas regeneradas e vinte PNGs revisados, com os mesmos sete alertas históricos (06, 08, 09, 10, 13, 14 e 18) e saída 1 do gerador, sem novo alerta ou imagem ausente. Não foi declarado aprovado o teste geral `test:browser`, sujeito aos limites anteriores. Próximo passo: revisão visual pelo grupo na janela e no aparelho que usará para apresentar a revista.

## Limites remanescentes

Safari, Firefox, toque físico e leitores de tela não foram homologados. O 3D continua com texto em textura e não oferece seleção direta; existem caminhos HTML para a leitura. Não há capa articulada, arraste contínuo, editor, importação de PDF ou vídeo. A checagem desta edição é proporcional ao trabalho escolar e não equivale a uma auditoria independente de toda a pesquisa original.
