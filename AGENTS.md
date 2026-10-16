# Orientações para agentes

## Comece aqui

Este arquivo é o ponto de entrada e o handoff para quem trabalhar no Fronteira. Leia:

1. [Finalidade](docs/PURPOSE.md).
2. [Arquitetura e pesquisa](docs/ARCHITETURE.md).
3. [Estrutura editorial](docs/MAGAZINE.md).
4. [Design system da edição](docs/DESIGN_SYSTEM.md).
5. [Revisão e decisões](docs/REVIEW.md) e [créditos das fotografias](docs/IMAGE_SOURCES.md).
6. [Energia Atômica, edição versionada](docs/ENERGIA_ATOMICA.md), em `edicoes/energia-atomica/vN.html`.

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

- A edição Fronteira tem 20 páginas, autorizadas pelo responsável em 2026-10-16. A revista Energia Atômica é versionada à parte, e cada versão é um único arquivo HTML autocontido (`vN.html`), sem CSS, JS ou imagens separados. Crie uma nova versão em vez de editar uma já entregue. Prioridade: manter leitura, conteúdo e interação coerentes nos modos HTML e 3D.
- Pesquise bibliotecas e implementações públicas antes de implementar. Verifique licenças antes de reutilizar código ou assets.
- O responsável autorizou concluir a edição e o design branco e verde. Preserve os cinco temas, o equilíbrio dos argumentos e a transparência sobre IA; não atribua falas ou aprovação individual aos autores.
- Depois de alterar `src/content.js`, `src/data.js` ou `src/styles.css`, execute `npm run render:textures` com o servidor ativo, confira os PNGs das 20 páginas e rode os testes. As texturas 3D são geradas da mesma composição HTML e devem permanecer sincronizadas.
- Execute verificações proporcionais à mudança e informe o que foi verificado. Não declare desempenho, testes ou compatibilidade sem medi-los.
