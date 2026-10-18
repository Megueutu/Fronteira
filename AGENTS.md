# Orientações para agentes

## Comece aqui

Este arquivo é o ponto de entrada e o handoff para quem trabalhar no Fronteira. Leia:

1. [Finalidade](docs/PURPOSE.md).
2. [Arquitetura e pesquisa](docs/ARCHITETURE.md).
3. [Estrutura editorial](docs/MAGAZINE.md).
4. [Design system da edição](docs/DESIGN_SYSTEM.md).
5. [Revisão e decisões](docs/REVIEW.md) e [créditos das fotografias](docs/IMAGE_SOURCES.md).
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

- Desde 2026-10-18, há uma única revista na raiz, por pedido do responsável: conteúdo e leitores da Fronteira (20 páginas e suplemento da entrevista), com a interface da Energia Atômica. `index.html`, `src/reader-shell.css` e `src/reader-shell.js` definem barra, ícones, sumário lateral e fundo orgânico. Preserve as páginas em `src/content.js`, o tema Verde Bandeira ES, o sprite Material Symbols e raios fixos nos componentes retangulares. O antigo HTML autocontido foi substituído por um redirecionamento; sua implementação completa permanece no Git. Não recrie duas revistas ou cópias `v1`/`v2`.
- Pesquise bibliotecas e implementações públicas antes de implementar. Verifique licenças antes de reutilizar código ou assets.
- O responsável autorizou concluir a edição e o design branco e verde. Preserve os cinco temas, o equilíbrio dos argumentos e a transparência sobre IA; não atribua falas ou aprovação individual aos autores.
- Depois de alterar `src/content.js`, `src/data.js` ou `src/styles.css`, execute `npm run render:textures` com o servidor ativo, confira os PNGs das 20 páginas e rode os testes. As texturas 3D são geradas da mesma composição HTML e devem permanecer sincronizadas.
- Execute verificações proporcionais à mudança e informe o que foi verificado. Não declare desempenho, testes ou compatibilidade sem medi-los.
