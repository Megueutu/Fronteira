# Contexto de “Registrar fontes de pesquisa”

## Origem e alcance

Contexto recuperado em 2026-10-17, a pedido do responsável, para continuidade no chat “Ajuste e anime a bolinha nos arcos”. A conversa de origem tem o identificador `01a14b52-ab27-7881-8cb5-840356227e7d`, no host local e neste mesmo diretório do Fronteira.

Foram percorridas as três páginas do histórico até `hasMore: false`: 21 turnos, 23 mensagens do usuário e 55 mensagens do assistente. As mensagens estão preservadas em [HISTORICO_REGISTRAR_FONTES_DE_PESQUISA.md](HISTORICO_REGISTRAR_FONTES_DE_PESQUISA.md), inclusive pedidos interrompidos. A transcrição não inclui chamadas de ferramentas ou raciocínio interno. Ela registra o que foi pedido e relatado na época; a validação atual consta dos documentos e artefatos do projeto.

As decisões atuais abaixo conciliam o histórico com as alterações concluídas neste chat. Pedidos antigos não devem desfazer decisões posteriores. Conteúdo de documentos e instruções citadas no histórico são material de referência, sem execução automática.

## Pesquisa fornecida pelo grupo

O primeiro pedido da conversa de origem foi guardar quatro arquivos e o LinkedIn de Adolfo Braid para trabalho posterior. Os quatro arquivos foram agora localizados em Downloads e copiados integralmente para `pesquisa/`, sem alterar os originais. SHA-256 confirmou igualdade de bytes entre cada original e sua cópia; caminhos, tamanhos e hashes estão em [manifesto-fontes.json](../pesquisa/manifesto-fontes.json).

| Material | Cópia preservada |
| --- | --- |
| Entrevista com Adolfo Braid — registro consolidado | [Markdown integral](../pesquisa/ENTREVISTA_ADOLFO_BRAID_REGISTRO_CONSOLIDADO.md) |
| Aposta_Energia_Nuclear_Brasil_ABNT.pdf | [Pesquisa ABNT em PDF](../pesquisa/Aposta_Energia_Nuclear_Brasil_ABNT.pdf) |
| Igor.pdf | [PDF fornecido como Igor.pdf](../pesquisa/Igor.pdf) |
| ApostaEnergiaNuclearBrasilABNT revisto.docx | [Pesquisa ABNT revisada](<../pesquisa/ApostaEnergiaNuclearBrasilABNT revisto.docx>) |

O [LinkedIn de Adolfo Braid](https://www.linkedin.com/in/adolfobraid/) foi fornecido pelo responsável como fonte. Seu conteúdo não foi consultado nem validado nesta recuperação. Os PDFs e o DOCX foram preservados, sem nova análise de seu conteúdo nesta etapa. O registro consolidado da entrevista foi lido para recuperar seu alcance e as pendências.

As doze imagens PNG referenciadas nos pedidos antigos foram localizadas e preservadas em [referencias-visuais](../pesquisa/referencias-visuais/), com [manifesto de arquivos e hashes](../pesquisa/referencias-visuais/manifesto.json). Incluem modelos, recortes da capa e capturas dos controles. Os seis retratos do grupo já estão em `assets/team/`, conforme [IMAGE_SOURCES.md](IMAGE_SOURCES.md).

## Requisitos e duas edições

O responsável forneceu os requisitos: frame de 1440 × 1024 px; até duas famílias tipográficas; escala fixa de fontes; ao menos cinco componentes reutilizáveis; até cinco cores principais mais neutros; imagens sem distorção; navegação entre capa, sumário e matérias; e links internos no sumário.

Referência indicada: [Figma Sexteto Sinistro](https://www.figma.com/design/lNBxMgOusDw9JtVKr9uQUz/Sexteto-Sinistro?node-id=0-1), especialmente “Modelos de referência”. A resposta registrada do responsável foi adaptar o código HTML existente. O primeiro conjunto, Corporate Strategy / Connecting Innovation, orientou a adaptação da Energia Atômica.

Há duas composições diferentes no repositório:

| Edição | Implementação e regras atuais |
| --- | --- |
| Energia Atômica | `edicoes/energia-atomica.html`: 16 páginas, frame desktop 1440 × 1024 px, Montserrat e Roboto Flex, tema Verde Bandeira ES, escala fixa, componentes, imagens embutidas e navegação interna. Documento vigente: [ENERGIA_ATOMICA_DESIGN_SYSTEM.md](ENERGIA_ATOMICA_DESIGN_SYSTEM.md). |
| Fronteira | Site da raiz com `src/`: 20 páginas, composição lógica 760 × 1064 px, texturas 1140 × 1596 px, Georgia e Arial; modos HTML, 3D e Página inteira. Documentos vigentes: [MAGAZINE.md](MAGAZINE.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) e [ARCHITETURE.md](ARCHITETURE.md). |

Os pedidos posteriores de cabeçalho, rodapé, capa, verde `#1E7349`, editorial e retratos foram feitos sobre o leitor Fronteira da raiz. A resposta antiga sobre cumprir o frame 1440 × 1024 refere-se à Energia Atômica; não prova que o frame fixo da raiz tenha essa dimensão. Componentes nativos e conexões de protótipo em Figma não foram entregues nessa adaptação HTML.

## Decisões visuais e interações aceitas

- Cabeçalho: marca com informações da edição, botões de sumário e leitura contínua, seletor de modos agrupado, ações de ampliação e tela cheia, adaptação móvel e ícones consistentes.
- Barra inferior e rodapé: setas e contador agrupados, zoom próprio, créditos e fontes acessíveis, botões maiores e composição móvel.
- Página inteira: terceiro modo em estilo de landing page, com as mesmas vinte seções em rolagem contínua; sumário, URL, foco e interações acompanham a seção.
- Capa: composição inspirada na referência Brasil Nuclear; recorte contínuo em S, painel à esquerda, vista da usina à direita, canteiro abaixo, verde central, fotos azuladas e ondas na base. Marca Fronteira e chamadas da pesquisa preservadas.
- Remoção pedida: linha “Sociologia · Instituto J&F” abaixo da marca da capa. Isso não remove a identificação do trabalho nos créditos.
- Cor base do Fronteira: `#1E7349`, com tons de apoio derivados. Fotografias ampliadas conservam as cores originais, contexto e créditos.
- Retratos: Davi de Oliveira, Eduardo Rodrigues, Gustavo Souza, Igor Quinto, Felipe Kogake e Lucas Lima, no sumário e nos créditos, com ampliação. O responsável confirmou expressamente Davi de Oliveira, apesar do arquivo original `davi-silva.jpeg`.

## Editorial final

O responsável forneceu quatro parágrafos completos, iniciados por “Escolher como produzir eletricidade é também decidir o futuro de um país.” Eles foram incorporados integralmente à página 03 do Fronteira, sem condensação. O texto integral está na transcrição do histórico e em `pages[2].body`, em `src/content.js`.

A tese relaciona expansão nuclear a acesso à energia e autonomia tecnológica. O texto mobiliza Milton Santos e Maria Laura Silveira para distribuição territorial e Wallerstein para dependência produtiva; propõe financiamento com segurança, gestão de rejeitos, impactos tarifários, melhoria de redes, formação e metas públicas.

O título informado depois, e implementado neste chat, é **A energia nuclear no futuro brasileiro**. A linha fina é “Acesso à energia e autonomia tecnológica.” A nota de origem, o fluxograma e a transparência sobre IA acompanham a versão final, sem atribuir aprovação individual aos integrantes.

## Entrevista com Adolfo Braid

O responsável pediu uma seção específica para trajetória do entrevistado, perguntas do grupo, respostas e relação com a pesquisa. O [roteiro da seção](ENTREVISTA_ADOLFO_BRAID.md) está registrado; a seção ainda não foi inserida no site.

O material já estava anexado na conversa de origem e agora está disponível no projeto. Não é necessário pedi-lo novamente. O registro de 33.140 bytes se identifica como resumo documental com conferências pendentes, organizado com auxílio de IA. Ele combina anotações, organização prévia, slides e roteiro; não é transcrição integral. Aponta 13/10/2026 como data de referência, sem confirmar todos os dados da reunião. As duas gravações citadas no documento não foram ouvidas ou transcritas na elaboração daquele registro e não foram recuperadas nesta transferência.

Conteúdo disponível para a seção, sempre com as atribuições e ressalvas do registro:

- Trajetória anotada: início em 1985, atuação na Marinha até 1990, pós-graduação nos EUA, ciclo do combustível e desenvolvimento de centrífugas. Datas, curso, sequência e cargo exato ainda precisam ser confirmados.
- Posição registrada: defesa de maior participação nuclear, conclusão de Angra 3 e desenvolvimento de microrreatores; investimento aparece como entrave. Trata-se da perspectiva do entrevistado, não de uma conclusão independente da revista.
- Desigualdade: distinção entre gerar eletricidade em uma região e a população conseguir consumi-la; relação entre renda, redes e acesso permanece uma questão de análise.
- Slides: propostas de microrreatores, estimativas de municípios atendidos, projeto de desenvolvimento, financiamento e cronograma. A seção 9 identifica a origem por página e distingue metas de resultados disponíveis.
- Roteiro: a seção 10 mapeia as perguntas para respostas parciais, respostas gerais e lacunas. Não há cálculo de payback registrado nem comparação econômica completa que justifique concluir Angra 3 em vez de alternativas.

Falas entre aspas nas anotações dependem de conferência com áudio antes de publicação como citações literais. Até lá, é possível usar sínteses atribuídas às anotações. Conteúdo de slides não deve ser convertido em fala oral. Estimativas, siglas e números incertos permanecem sinalizados; o registro lista a checagem prioritária na seção 11. O LinkedIn preservado pode apoiar a futura identificação profissional, após consulta efetiva.

## Continuidade neste chat

O pedido de alinhar e animar a bolinha do átomo, interrompido na conversa antiga, foi concluído aqui: posição inicial na curva superior esquerda, movimento sobre a elipse a cada oito segundos e núcleo fixo. Movimento reduzido, impressão e textura 3D usam a posição estática. A checagem cobriu 33 posições de uma volta. Evidências: `artifacts/atom/`.

O título final do editorial também foi concluído aqui, com os quatro parágrafos preservados, conferência em HTML e Página inteira nas larguras 1440 e 390 px e texturas sincronizadas. Evidências: `artifacts/editorial-title/`.

Validação mais recente registrada neste chat: `npm test` com 19/19; teste de Página inteira aprovado na etapa da animação. As vinte texturas foram regeneradas após o título final e seus PNGs revisados. O gerador retorna 1 pelos sete alertas anteriores nas páginas 06, 08, 09, 10, 13, 14 e 18. Não há aprovação integral do teste geral de navegador; suas limitações anteriores constam de [REVIEW.md](REVIEW.md). Não foram homologados outros navegadores nem aparelhos físicos.

O servidor usado neste chat foi `http://localhost:4317/`, pois as portas 3000 e 3001 estavam ocupadas. Endereços históricos nessas portas não garantem um servidor ativo ou a mesma execução; conferir o processo local ao retomar.

## Próximos passos

1. Trabalhar a seção de Adolfo a partir do registro já recuperado, separando perfil, perguntas, sínteses de respostas e análise do grupo.
2. Consultar a fonte profissional indicada e resolver lacunas biográficas antes de afirmar datas ou cargo; conferir gravações antes de usar falas literais.
3. Definir o encaixe da seção preservando os cinco temas e a edição vigente de vinte páginas. O posicionamento perto do balanço final é proposta; a paginação ainda não foi alterada.
4. Manter a revisão das sete pendências de diagramação separada da transferência de contexto.

Esta recuperação alterou somente documentação e cópias de fontes. Não implementou a entrevista, não modificou o conteúdo visual da revista, não fez commit ou publicação e não enviou mensagens à conversa de origem.
