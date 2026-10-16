# Design system da edição

Status: aplicado à edição de 20 páginas, conforme autorização do responsável em 2026-10-16. O estudo anterior está em [DESIGN_PROPOSAL.md](DESIGN_PROPOSAL.md).

## Referência e identidade

A composição adapta a referência editorial WIRED da coleção VoltAgent/awesome-design-md, licenciada em MIT. Não é um sistema oficial da WIRED. O projeto tem linguagem própria: branco e verde, mínima interface externa, fotografias grandes e leitura em camadas. Não incorpora logotipo nem fontes proprietárias da referência. Veja [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Fundamentos

Os tokens ficam no início de `src/styles.css`.

| Papel | Token | Valor |
| --- | --- | --- |
| Texto principal | `--ink` | `#172d24` |
| Ações e destaques | `--green` | `#24583f` |
| Texto secundário | `--muted` | `#53665b` |
| Papel | `--paper` | `#ffffff` |
| Notas e quadros | `--soft` | `#edf3ee` |
| Superfície da revista | `--stage` | `#e6ebe5` |
| Divisores | `--line` | `#cdd9cf` |
| Narrativa | `--serif` | Georgia e alternativas locais |
| Controles e dados | `--sans` | Arial e alternativas locais |

Não há download de fontes ou dependência de CDN. A fotografia mantém suas cores; verde não funciona como declaração de que a tecnologia é ambientalmente positiva. “A favor” e “em debate” têm a mesma superfície, tamanho e hierarquia.

## Composição das páginas

Cada página tem uma área lógica de 760 × 1064 pixels. Margens, títulos, corpo, imagens, quadros e rodapé pertencem à mesma função de composição usada pelos dois modos. Texturas 3D de 1140 × 1596 pixels são geradas em Chromium a partir dessa página, preservando a tipografia e a justificação.

O corpo narrativo usa duas colunas equilibradas, texto justificado, última linha natural, hifenização em português e controle de viúvas/órfãs. O corpo lógico de 18 px tem entrelinha de 1,55. Capa, sumário e referências têm composições específicas; aberturas combinam fotografia e narrativa. A escala visível depende do espaço da tela, por isso há zoom no HTML e leitura ampliada em HTML nos dois modos.

No celular, o HTML é exibido em uma página por vez, em fluxo vertical, com corpo de 18 px e uma coluna legível. A leitura contínua também é responsiva. O 3D pode ser escolhido explicitamente, mas conserva uma abertura com duas páginas: o caminho de leitura ampliada evita depender da textura pequena.

## Componentes

- Botão de página: ação principal com divisores finos, texto verde e seta. No 3D, botão HTML projetado sobre a posição correspondente.
- Fotografia: botão de ampliação, contexto e crédito; ampliação com legenda completa e links de autoria/licença.
- Quadro de equilíbrio: duas áreas com a mesma importância, sem oposição “verde bom / vermelho ruim”.
- Dialog: título acessível, foco inicial no fechamento, Escape, foco devolvido ao acionador e histórico para interações abertas da leitura contínua.
- Gráfico: barras com texto e valores, escala preservada nos filtros e origem identificada.
- Laboratório: controles rotulados, unidades visíveis, resultado anunciado e premissas/limites próximos do cálculo.
- Etapas e linha do tempo: seleção explícita e conteúdo textual acessível.
- Sumário: destinos diretos e fluxo da edição; fluxograma do editorial na nota correspondente.

## Validação e manutenção

O processo confere limites de composição, imagens ausentes, justificação, navegação, foco e interações. Capturas são revisadas antes da publicação. Isso não equivale a uma auditoria completa de acessibilidade, testes em leitores de tela ou homologação em todos os navegadores.

Para mudanças visuais, regenere as texturas e execute as verificações documentadas no [README](../README.md). Não altere separadamente o texto desenhado em 3D: a fonte editorial é `src/content.js`.
