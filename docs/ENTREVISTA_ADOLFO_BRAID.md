# Entrevista com Adolfo Braid

## Pedido e estado

O responsável solicitou, em 2026-10-17, uma seção própria para apresentar a trajetória de Adolfo Braid e o que ele disse na entrevista realizada pelo grupo, relacionando as respostas às perguntas da pesquisa.

Seção implementada em 2026-10-17, após autorização do responsável para usar o registro consolidado e pesquisar imagens na internet. A fonte principal é o [registro consolidado integral](../pesquisa/ENTREVISTA_ADOLFO_BRAID_REGISTRO_CONSOLIDADO.md): sínteses, roteiro de perguntas, conteúdo de slides e lacunas explicitadas. A consulta à CNEN identifica Adolfo de Aguiar Braid; a ABDAN o apresenta como diretor de pesquisa e desenvolvimento da Terminus. A cronologia detalhada e a motivação pessoal permanecem pendentes.

## Estrutura implementada

1. **Apresentação e trajetória.** Formação, ciclo do combustível/equipamentos e pesquisa em microrreatores, com fontes identificadas. Fotos institucionais integrais, com ampliação e créditos; retrato individual acessível por link no perfil da ABDAN.
2. **A conversa do grupo.** Perguntas e respostas em terceira pessoa, com opiniões atribuídas a Braid. Data exata, formato e participantes não são apresentados como fatos enquanto dependem de confirmação.
3. **Redação das respostas.** Três eixos em destaque e seleção expansível com cinco perguntas respondidas. A pedido do responsável, perguntas sem resposta completa foram excluídas, inclusive as anteriormente sinalizadas como parciais; não há rótulos de grau de informação. Os dois destaques incompletos (comparação de Angra 3 e oportunidades/riscos) também foram retirados. O perfil profissional é complementado por fontes institucionais identificadas. A redação usa paráfrases em terceira pessoa, sem criar aspas ou falas literais. A edição de 18/10/2026 removeu da matéria os comentários sobre anotações, sínteses e organização documental; a documentação original permanece no acervo de pesquisa.
4. **Relação com a pesquisa.** Para cada resposta selecionada, explicar que argumento ela esclarece, apoia, questiona ou deixa em aberto. Relacionar aos cinco temas apenas quando o conteúdo da resposta permitir; distinguir experiência pessoal, opinião e afirmações verificáveis.
5. **Fontes e créditos.** Links e localizadores permitem consultar a origem dos conteúdos. Decisões de condensação, limites do material e conferências pendentes ficam nesta documentação. Quando houver conferência da gravação, registrar aqui os tempos dos trechos utilizados; conservar eventuais respostas por escrito.

## Encaixe editorial implementado

Suplemento após a página 17 em Página inteira e na leitura contínua, com acesso pelo sumário e pela ação da página 17 no HTML. No 3D, essa ação está disponível em “Ampliar leitura”. `?template=landing&page=17&interview=adolfo` abre a entrevista diretamente. As vinte páginas originais, os cinco temas, o balanço, as referências e a transparência sobre IA foram preservados. Conteúdo em `src/interview.js`; um único renderer `interviewHTML` compõe a seção no fluxo e no diálogo.

## Material disponível e complementos necessários

- O registro recuperado mapeia perguntas e respostas na seção 10, com respostas parciais e lacunas identificadas. As sínteses podem ser usadas como anotações atribuídas; falas literais exigem conferência com a gravação.
- Nome completo e função profissional complementados pelas fontes institucionais abaixo. Datas iniciais, cargos históricos exatos e motivação pessoal ainda dependem de confirmação.
- O documento indica 13/10/2026 como data de referência a partir da apresentação e do nome de uma gravação; data completa da reunião, formato e participantes ainda precisam de confirmação.
- Eventuais condições combinadas para identificar o entrevistado e reproduzir suas falas.

## Validação e próximo passo

Na primeira pesquisa do repositório, a entrevista ainda não estava copiada para ele. A leitura posterior dos 21 turnos da conversa de origem identificou o anexo em Downloads. Sua cópia integral foi preservada em `pesquisa/`, com igualdade de bytes confirmada por SHA-256. O [contexto recuperado](CONTEXTO_REGISTRAR_FONTES_DE_PESQUISA.md) reúne as fontes e decisões anteriores. Não houve mudança no site ou nas texturas nesta recuperação.

Na implementação posterior, o perfil e as sínteses foram publicados na composição local, com ligação aos cinco temas. O teste `npm run test:interview` cobre os três modos, link direto, imagens, créditos, histórico de camadas, Escape/foco, navegação após o suplemento e quatro larguras. Evidências em `artifacts/interview/`; resultado final em [REVIEW.md](REVIEW.md). Próximo passo: revisão do grupo e eventual conferência do áudio para acrescentar falas literais e respostas não localizadas nas anotações. O registro original não foi reescrito.

## Fontes profissionais e fotografias

Revisão editorial de 18/10/2026, solicitada pelo responsável: perfil, respostas, legendas e rótulos bibliográficos usam linguagem de revista. Removidos o bloco metodológico e os comentários repetidos sobre anotações; as fontes conservam seus links e localizadores. Opiniões continuam atribuídas a Braid e microrreatores continuam apresentados como proposta em desenvolvimento. Não foram acrescentadas falas literais, datas biográficas incertas ou números pendentes de conferência. O registro original permanece integral em `pesquisa/`. Validação: `npm test` (23/23), `test:interview` e `test:citations`; capturas de computador e celular conferidas em `artifacts/interview/`. Próximo passo: revisão editorial pelo grupo; eventual uso de citações literais depende da conferência do áudio.

Pesquisa complementar de 18/10/2026: encontrados retratos individuais no Petronotícias e na ABDAN. Enquadramento, dimensões, links e pendências de autorização estão em [PESQUISA_RETRATOS_ADOLFO_BRAID.md](PESQUISA_RETRATOS_ADOLFO_BRAID.md). A seleção ainda não substitui as fotos publicadas.

- [ABDAN, perfil do Nuclear Summit 2026](https://abdan.glueup.com/event/nuclear-summit-2026-162855/speakers.html): função na Terminus e experiência com equipamentos de Angra 1.
- [CNEN, notícia do projeto brasileiro de microrreator](https://www.gov.br/cnen/pt-br/assunto/ultimas-noticias/cerimonia-oficial-marca-o-inicio-formal-do-projeto-do-primeiro-microrreator-nuclear-brasileiro): nome completo e participação no projeto.
- [AEITA, apresentação profissional](https://pt.linkedin.com/posts/aeita_nesta-sexta-feira-2111-%C3%A0s-18h-hor%C3%A1rio-activity-7396519091383042048-_j4Q): formação no IME, Berkeley e COPPE/UFRJ, apresentada como informação dessa fonte institucional.
- [ANSN/IEN, licenciamento em janeiro de 2026](https://www.gov.br/cnen/pt-br/assunto/ultimas-noticias/reuniao-entre-ien-cnen-e-a-ansn-para-discutir-termo-de-referencia-acontece-na-sede-da-cnen): contexto regulatório.

O LinkedIn fornecido pelo grupo foi mantido como link; o bloqueio de acesso direto não foi contornado. Não foi incorporado retrato individual sem licença de redistribuição identificada.

Duas fotos do IRD/ANSN ilustram eventos com participação de Adolfo: Amazul, 2025, crédito Ana Paula Artaxo/ANSN; reunião de licenciamento de 21/01/2026, crédito Douglas Troufa. Os portais indicam CC BY-ND 3.0. Os bytes baixados foram preservados e as imagens são mostradas inteiras, sem recorte, filtro ou recompressão. As legendas não as apresentam como registro da entrevista escolar nem identificam a posição de pessoas por reconhecimento facial. Fontes, dimensões e hashes em [IMAGE_SOURCES.md](IMAGE_SOURCES.md) e [SOURCES.json](../assets/interview/SOURCES.json).
