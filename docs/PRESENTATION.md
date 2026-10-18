# Roteiro de apresentação e paginação

## Composição canônica — 2026-10-19

Decisão vigente: HTML, rolagem e texturas 3D compartilham `pageHTML` e a superfície de 760 × 1064 px, inclusive no celular. A folha é reduzida ou ampliada proporcionalmente; as regras antigas de recomposição exclusiva por modo abaixo ficam como histórico. A rolagem usa molduras dimensionadas e transformação CSS, com zoom de 50% a 300%, preservando a página em leitura. A leitura ampliada em diálogo continua fluida para acessibilidade.

As ações principais e as fontes também estão disponíveis em controles HTML no 3D. As texturas incluem as mesmas chamadas visuais. A animação da capa permanece exclusiva do HTML; sua composição estática é compartilhada.

`src/editorial-panels.js` acrescenta explicações sobre matriz, geração/distribuição, combustível, custos, payback, planejamento, comparações e critérios do balanço. São sínteses do material existente, com fontes associadas; os parágrafos originais são preservados. Permanecem 20 páginas de conteúdo e 28 faces físicas. Não foram acrescentadas bibliotecas ou imagens.

A implementação foi executada em 19/10/2026. Por pedido explícito do responsável, os novos commits registram autor e committer em 18/10/2026 às 12h, UTC−03, sem reescrever o histórico anterior.


Decisão de 19/10/2026: a edição possui vinte páginas de conteúdo, sem contar a produção e o suplemento. São 28 faces físicas e 15 aberturas. As posições físicas internas usadas pelo código não são os fólios exibidos na revista.

| Responsável | Conteúdo | Páginas | Tempo |
| --- | --- | --- | --- |
| Pessoa 1 | Problema do acesso confiável, editorial e mapa da investigação | 1–3 | 45 s |
| Pessoa 2 | Desigualdade energética, matriz elétrica, território e Milton Santos | 4–6 | 1 min 35 s |
| Pessoa 3 | Funcionamento, segurança, resíduos e responsabilidades | 7–8 | 1 min 35 s |
| Pessoa 4 | Ciclo do combustível, Wallerstein, soberania e cooperação | 9–11 | 1 min 35 s |
| Pessoa 5 | Angra 3, payback, calculadora e distribuição dos custos | 12–14 | 1 min 35 s |
| Pessoa 6 | Messmer, trajetórias internacionais, Weber e suplemento de Adolfo Braid | 15–17 + suplemento | 1 min 35 s |
| Pessoa 1 | Balanço, fontes e posicionamento do editorial | 18–20 | 50 s |

Duração total do roteiro: 9 min 30 s. Os tempos orientam a apresentação oral e não iniciam contagem automática na interface.

## Produção e suplemento

Antes do conteúdo: capa, segunda capa com pattern, sumário e equipe. Depois: entrada do suplemento, expediente, terceira capa e quarta capa. Essas oito faces não entram na contagem de vinte. A entrevista integral, perguntas adicionais, análises, quinze registros de fontes e quatro fotografias permanecem na camada HTML acessível pela entrada do suplemento, pelo sumário e pela ação da página 17. A leitura funciona a partir dos modos HTML, 3D e rolagem.

## Preservação e composição

Os parágrafos das vinte faces originais permanecem integrais e em ordem por matéria, conferidos por fixture independente. O editorial tem os três primeiros parágrafos na página 2 e o parágrafo final na página 20, mantendo a redação do posicionamento já fornecido pelo responsável. Duas aberturas de orientação retomam o problema e explicam o percurso da pesquisa; não acrescentam dados científicos nem atribuem falas individuais aos integrantes.

O corpo fixo passou de 20 para 16 px (12 pt em unidades CSS), com entrelinha 1,45, colunas balanceadas e justificadas. As continuações de segurança, soberania e distribuição de custos foram reunidas. Margens e fotografias foram ajustadas sem cortar texto. A leitura ampliada continua disponível; no celular o texto fica alinhado à esquerda. A numeração do sumário, dos rodapés e dos controles distingue conteúdo e produção.
