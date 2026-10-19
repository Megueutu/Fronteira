# Orientações para agentes

## Comece aqui

Este arquivo é o ponto de entrada e o handoff para quem trabalhar no Fronteira. Leia:

1. [Finalidade](docs/PURPOSE.md).
2. [Arquitetura e pesquisa](docs/ARCHITETURE.md).
3. [Estrutura editorial](docs/MAGAZINE.md).
4. [Design system da edição](docs/DESIGN_SYSTEM.md).
5. [Roteiro de apresentação e paginação](docs/PRESENTATION.md), [revisão e decisões](docs/REVIEW.md) e [créditos das fotografias](docs/IMAGE_SOURCES.md).
6. [Histórico da Energia Atômica](docs/ENERGIA_ATOMICA.md) e [referência visual da interface unificada](docs/ENERGIA_ATOMICA_DESIGN_SYSTEM.md). A revista atual abre somente na raiz; `edicoes/energia-atomica.html` é um redirecionamento de compatibilidade.
7. [Contexto da conversa “Registrar fontes de pesquisa”](docs/CONTEXTO_REGISTRAR_FONTES_DE_PESQUISA.md), com histórico, fontes recuperadas e pendências da entrevista.

## Commits e branches

- Sempre use Conventional Commits: `type(scope): description` ou `type: description`.
- Toda a mensagem de commit deve ser em inglês e lowercase, incluindo scope e corpo, quando houver.
- Exemplos: `docs: document magazine architecture`, `feat(reader): add page navigation`, `fix(reader): prevent duplicate page turns`.
- Tipos usuais: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf` e `style`.
- É permitido trabalhar e fazer commits diretamente na `main`. Branch e pull request não são obrigatórios.
- Sempre faça `git pull` da branch antes de subir um commit (`git pull origin <branch>` e depois `git push`). Resolva conflitos localmente, sem sobrescrever o trabalho remoto.
- Preserve alterações existentes e não sobrescreva trabalho alheio.

## Documentação e continuidade

- Use nomes de arquivos Markdown em maiúsculas, com extensão `.md`.
- Mantenha este guia curto; coloque detalhes em `docs/` e adicione links aqui.
- Diferencie proposta, decisão aceita e comportamento implementado. Registre alternativas, fontes, limitações e pendências.
- Ao concluir uma etapa, atualize o documento correspondente com a validação e o próximo passo.

## Ordem do trabalho

- Desde 2026-10-18, há uma única revista na raiz, com URL limpa. Desde 2026-10-19, a edição tem exatamente 20 páginas de conteúdo em 28 faces físicas e 15 aberturas. Capa, faces internas, sumário, equipe, expediente e entrada do suplemento não recebem fólio. A entrevista completa abre no suplemento interativo; não volta a ocupar sete páginas do miolo. O roteiro e os intervalos estão em docs/PRESENTATION.md. O título é **Energia Nuclear no Brasil**; Fronteira é a editora, com os SVGs fornecidos. Use Inter local como única família, ícones Material, colunas desktop justificadas e mobile alinhado à esquerda. `src/pagination.js` separa face de abertura; nunca volte a calcular aberturas por `index*2`. Preserve os textos com `tests/fixtures/editorial-original.json` e os testes de preservação. O antigo HTML autocontido é somente um redirecionamento; não recrie duas revistas ou cópias `v1`/`v2`.
- Pesquise bibliotecas e implementações públicas antes de implementar. Verifique licenças antes de reutilizar código ou assets.
- O responsável autorizou concluir a edição e o design branco e verde. Preserve os cinco temas, o equilíbrio dos argumentos e a transparência sobre IA; não atribua falas ou aprovação individual aos autores.
- Depois de alterar composição, fontes ou assets presentes em `scripts/texture-fingerprint.mjs`, execute `npm run render:textures` com o servidor ativo, confira os PNGs de todas as 28 faces e rode os testes. As texturas 3D são geradas da mesma composição HTML e devem permanecer sincronizadas. O script verifica limites sem ocultar transbordamento; a tolerância de arredondamento é de 0,25 px no respiro de 10 px.
- Execute verificações proporcionais à mudança e informe o que foi verificado. Não declare desempenho, testes ou compatibilidade sem medi-los.
