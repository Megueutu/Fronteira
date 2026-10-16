# Proposta visual e interativa

Status: estudo para avaliação, 2026-10-16. Preferências confirmadas: branco, verde, minimalismo, fotografia e interação como parte da leitura. Não substitui a validação do núcleo nem consolida o design system.

## Referência escolhida para o estudo

O repositório local `Inter/awesome-design-md` corresponde a [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), revisão local `13be5c05c63be24b57581162364167028020f043`, licença MIT. Ele oferece análises e instruções de design, sem entregar componentes nem motor de revista.

Foram comparadas as referências WIRED, IBM, Claude e The Verge. Recomenda-se a composição editorial da [análise WIRED](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/wired/DESIGN.md): contraste tipográfico, fotografias grandes, divisores discretos e pouca interface externa. A escolha é uma avaliação de adequação ao conteúdo. IBM contribui como referência futura para dados; Claude aproxima-se da leitura acolhedora, mas seus tons creme e coral não correspondem à preferência recebida. The Verge exige adaptação maior de saturação e linguagem.

A análise WIRED é uma interpretação de terceiros; não é um sistema oficial da marca. A proposta adapta a referência à identidade própria: verde profundo e branco, em vez da restrição monocromática original. Não reutiliza logotipo ou fontes proprietárias. A prévia usa Georgia e Arial como fontes disponíveis no sistema. Futuras fontes locais de código aberto precisam ter licença e arquivos registrados antes da adoção.

## Direção para a experiência

A revista ocupa o centro e a maior parte da área disponível. Cabeçalho e controles são compactos; a introdução promocional do protótipo atual deve ceder espaço à leitura. O folheamento físico permanece responsabilidade do núcleo. O estudo separado não implementa curvatura, capa ou arraste.

O branco sustenta texto e fotografias; verde profundo identifica seções e ações. Verde claro pode apoiar notas, sem sugerir que uma fonte de energia seja intrinsecamente positiva. “A favor” e “em debate” usam o mesmo peso, espaço e legibilidade. Fotografias conservam as cores reais, evitando filtros verdes que alterem sua leitura.

Valores provisórios usados no estudo: tinta `#172d24`, verde `#24583f`, apoio `#edf3ee`, papel `#ffffff`, texto `#384b42`, linhas `#d4ded6`. Títulos serifados e metadados sem serifa têm papéis distintos. Tamanhos precisam ser conferidos nos alvos de leitura e, no 3D, após a projeção.

## Interação como linguagem editorial

| Conteúdo | Experiência proposta | Preservação da leitura |
| --- | --- | --- |
| Fotografia | Ampliar, ler legenda e crédito; galeria com diferentes enquadramentos. | Imagem e legenda disponíveis na página. |
| Matriz elétrica | Destacar séries ou categorias, revelar valores, período e fonte. | Resumo e tabela acessível acompanham o gráfico final. |
| Funcionamento nuclear | Diagrama em etapas com camadas explicativas. | Explicação sequencial completa fora da interação. |
| Ciclo do urânio | Percurso explorável com etapas e fontes. | Ordem linear e contextualização de Wallerstein no texto. |
| Payback | Comparar cenários e exibir premissas revisadas. | Sem apresentar estimativa como promessa ou simulação validada. |
| Política e experiências internacionais | Linha do tempo com documentos, datas e contexto. | Panorama dos acontecimentos visível na reportagem. |
| Teóricos e curiosidades | Notas e referências em camada HTML. | Conceitos essenciais e críticas permanecem no corpo principal. |
| Navegação | Sumário direto, marcadores de seção, teclado e retorno à posição. | Leitura linear e foco previsível. |

Os gráficos quantitativos e a linha do tempo são propostas, ainda não implementados. [Carbon](https://www.carbondesignsystem.com/building-blocks/data-visualization/overview) é uma referência de visualização de dados a avaliar; não foi instalada biblioteca ou adotado seu sistema de componentes.

No 3D, as camadas HTML podem abrigar os controles e conteúdos interativos. No celular, a leitura precisa ocupar a largura útil; o estudo reorganiza a abertura em sequência vertical. Isso não resolve a limitação atual de duas páginas pequenas no renderer 3D.

## Prévia entregue

Com `npm start`, abrir [o estudo](http://localhost:3000/previews/index.html). Ele permite selecionar cinco temas, navegar por botões ou teclado, usar sumário, ampliar fotografias, percorrer galeria, explorar um diagrama conceitual, abrir notas e ler em sequência. Dialogs usam Escape, foco inicial e retorno ao acionador.

Os textos são demonstrações de estrutura, não as reportagens editadas. O diagrama não apresenta dados quantitativos. Não há simulação nova de payback nem afirmação de checagem de fontes. O acervo e os créditos estão em [IMAGE_SOURCES.md](IMAGE_SOURCES.md).

Validação do estudo: verificação de sintaxe JavaScript e fluxo automatizado no Chrome for Testing 153 headless no Windows. Passaram seleção dos cinco temas, limites de navegação, sumário com salto de tema, ampliação, galeria, diagrama por etapas, nota, leitura linear, Escape, foco inicial e retorno de foco. Foram inspecionadas capturas de desktop (1440 px), galeria e viewport móvel (390 px), sem transbordamento horizontal do documento. Isso não comprova uso por toque físico, desempenho do núcleo 3D, compatibilidade com outros navegadores ou auditoria completa de acessibilidade.

## Próxima validação

Avaliar se a linguagem visual e as camadas interativas correspondem à intenção do responsável. Depois, priorizar enquadramento e leitura no 3D, toque/arraste, zoom, capa, paginação e adaptação do conteúdo. Aplicar o sistema escolhido aos dois renderers com a mesma fonte de conteúdo, antes de ampliar para a edição completa.
