# Roteiro de apresentação e paginação

## Composição canônica — 2026-10-19

Decisão vigente: HTML, rolagem e texturas 3D compartilham `pageHTML` e a superfície de 760 × 1064 px, inclusive no celular. A folha é reduzida ou ampliada proporcionalmente; as regras antigas de recomposição exclusiva por modo abaixo ficam como histórico. A rolagem usa molduras dimensionadas e transformação CSS, com zoom de 50% a 300%, preservando a página em leitura. A leitura ampliada em diálogo continua fluida para acessibilidade.

As ações principais e as fontes também estão disponíveis em controles HTML no 3D. As texturas incluem as mesmas chamadas visuais. A animação da capa permanece exclusiva do HTML; sua composição estática é compartilhada.

`src/editorial-panels.js` acrescenta explicações sobre matriz, geração/distribuição, combustível, custos, payback, planejamento, comparações e critérios do balanço. São sínteses do material existente, com fontes associadas; os parágrafos originais são preservados. Permanecem 20 páginas de conteúdo e 24 faces físicas. Não foram acrescentadas bibliotecas ou imagens.

A implementação foi executada em 19/10/2026. Por pedido explícito do responsável, os novos commits registram autor e committer em 18/10/2026 às 12h, UTC−03, sem reescrever o histórico anterior.


Atualização de 18/10/2026 (pedido do responsável): a página 3 ("Uma pergunta. Cinco perspectivas.") foi retirada e a vaga virou a página 20, dedicada a Adolfo Braid, montada com textos já existentes da entrevista. Em seguida, por pedido do responsável, a ordem passou a ser sistema-mundo, não proliferação, ciclo do urânio e payback; custo e payback foram unidos em uma página (a página de tarifas perdeu o parágrafo de Max Weber) e a revista fechou em 19 páginas, com uma face de notas para manter 24 faces. A tabela abaixo reflete a nova numeração; a página 10 (Wallerstein) não cita mais o autor.

Atualização seguinte (18/10/2026): a página "Volte às fontes" foi removida; as páginas de Adolfo Braid viraram duas páginas-resumo numeradas (16 e 17) e o antigo suplemento deixou de ser uma face à parte, mantendo-se o popup da entrevista completa; o balanço final e o posicionamento do editorial foram unidos na última página (18). A tabela abaixo reflete essa numeração.

Decisão de 19/10/2026: a edição possui dezoito páginas de conteúdo (ver atualizações de 18/10/2026 abaixo), sem contar a produção e o suplemento. São 24 faces físicas e 13 aberturas, sem faces de notas nem terceira capa em branco. As posições físicas internas usadas pelo código não são os fólios exibidos na revista.

| Responsável | Conteúdo | Páginas | Tempo |
| --- | --- | --- | --- |
| Pessoa 1 | Problema do acesso confiável e editorial | 1–2 | 45 s |
| Pessoa 2 | Desigualdade energética, matriz elétrica, território e Milton Santos | 3–5 | 1 min 35 s |
| Pessoa 3 | Funcionamento, segurança, resíduos e responsabilidades | 6–7 | 1 min 35 s |
| Pessoa 4 | Sistema-mundo, soberania e tratado de não proliferação | 8–9 | 1 min 35 s |
| Pessoa 5 | Ciclo do combustível, Angra 3 e payback (visão geral e laboratório unificados) | 10–11 | 1 min 35 s |
| Pessoa 6 | Quem paga a tarifa, Messmer, trajetórias internacionais e opinião pública | 12–15 | 1 min 35 s |
| Pessoa 1 | Entrevista com Adolfo Braid (duas páginas-resumo, com a entrevista completa no popup) e balanço final com o posicionamento do editorial | 16–18 | 1 min |

Duração total do roteiro: 9 min 30 s. Os tempos orientam a apresentação oral e não iniciam contagem automática na interface.

## Produção e suplemento

Antes do conteúdo: capa, segunda capa com pattern, sumário e equipe. Depois: entrada do suplemento, expediente, terceira capa e quarta capa. Essas oito faces não entram na contagem de vinte. A entrevista integral, perguntas adicionais, análises, quinze registros de fontes e quatro fotografias permanecem na camada HTML acessível pela entrada do suplemento, pelo sumário e pela ação da página 17. A leitura funciona a partir dos modos HTML, 3D e rolagem.

## Preservação e composição

Os parágrafos das vinte faces originais permanecem integrais e em ordem por matéria, conferidos por fixture independente. O editorial tem os três primeiros parágrafos na página 2 e o parágrafo final na página 20, mantendo a redação do posicionamento já fornecido pelo responsável. Duas aberturas de orientação retomam o problema e explicam o percurso da pesquisa; não acrescentam dados científicos nem atribuem falas individuais aos integrantes.

O corpo fixo passou de 20 para 16 px (12 pt em unidades CSS), com entrelinha 1,45, colunas balanceadas e justificadas. As continuações de segurança, soberania e distribuição de custos foram reunidas. Margens e fotografias foram ajustadas sem cortar texto. A leitura ampliada continua disponível; no celular o texto fica alinhado à esquerda. A numeração do sumário, dos rodapés e dos controles distingue conteúdo e produção.
