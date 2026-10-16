# Orientações para agentes

## Comece aqui

Este arquivo é o ponto de entrada e o handoff para quem trabalhar no Fronteira. Leia:

1. [Finalidade](docs/PURPOSE.md).
2. [Arquitetura e pesquisa](docs/ARCHITETURE.md).
3. [Ideia editorial — TO DO](docs/MAGAZINE.md).
4. [Design system — TO DO](docs/DESIGN_SYSTEM.md).
5. [Proposta visual e interativa em avaliação](docs/DESIGN_PROPOSAL.md) e [créditos das fotografias](docs/IMAGE_SOURCES.md).

## Commits e branches

- Sempre use Conventional Commits: `type(scope): description` ou `type: description`.
- Toda a mensagem de commit deve ser em inglês e lowercase, incluindo scope e corpo, quando houver.
- Exemplos: `docs: document magazine architecture`, `feat(reader): add page navigation`, `fix(reader): prevent duplicate page turns`.
- Tipos usuais: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf` e `style`.
- É permitido trabalhar e fazer commits diretamente na `main`. Branch e pull request não são obrigatórios.
- Preserve alterações existentes e não sobrescreva trabalho alheio.

## Documentação e continuidade

- Use nomes de arquivos Markdown em maiúsculas, com extensão `.md`.
- Mantenha este guia curto; coloque detalhes em `docs/` e adicione links aqui.
- Diferencie proposta, decisão aceita e comportamento implementado. Registre alternativas, fontes, limitações e pendências.
- Ao concluir uma etapa, atualize o documento correspondente com a validação e o próximo passo.

## Ordem do trabalho

- Prioridade atual: definir e validar o núcleo que simula uma revista física, suas páginas e navegação.
- Pesquise bibliotecas e implementações públicas antes de implementar. Verifique licenças antes de reutilizar código ou assets.
- A ideia editorial e o design system aguardam a conclusão e validação do núcleo inicial. Use conteúdo neutro no protótipo.
- Execute verificações proporcionais à mudança e informe o que foi verificado. Não declare desempenho, testes ou compatibilidade sem medi-los.
