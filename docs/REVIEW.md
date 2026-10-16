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
9. O editorial sintetiza os objetivos da pesquisa com assistência de IA. Não foram inventadas falas, entrevistas ou aprovação individual dos seis autores.
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

## Limites remanescentes

Safari, Firefox, toque físico e leitores de tela não foram homologados. O 3D continua com texto em textura e não oferece seleção direta; existem caminhos HTML para a leitura. Não há capa articulada, arraste contínuo, editor, importação de PDF ou vídeo. A checagem desta edição é proporcional ao trabalho escolar e não equivale a uma auditoria independente de toda a pesquisa original.
