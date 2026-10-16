# Fronteira

Protótipo de revista interativa com dois templates comparáveis e o mesmo conteúdo demonstrativo:

- **Páginas interativas:** HTML selecionável, folheamento frontal, popup, carrossel na página e imagem ampliável.
- **Revista 3D:** folhas WebGL que curvam durante a virada; áreas clicáveis abrem popup, carrossel e imagem ampliada em HTML.

## Executar

Requer Node.js 22 ou superior. Não é necessário instalar dependências.

```sh
npm start
```

Abra [http://localhost:3000](http://localhost:3000). Links diretos: [HTML](http://localhost:3000/?template=html) e [3D](http://localhost:3000/?template=3d).

Use os botões ou as setas do teclado para navegar. No HTML, deslize a partir das margens; no celular, uma página é exibida por vez. O template 3D usa uma abertura com duas páginas. A troca de template preserva a abertura atual. O botão “Leitura linear” oferece o conteúdo sem animação, inclusive quando WebGL não está disponível.

Popups fecham pelo botão, por Escape ou ao clicar fora. Na leitura linear, fechar uma interação retorna ao texto.

## Verificar

```sh
npm test
```

Com o servidor rodando e Chromium instalado:

```sh
npm run test:browser
```

É possível indicar `CHROMIUM_PATH` e `TEST_URL`. As capturas de tela ficam em `artifacts/`, ignorado pelo Git. O teste de navegador utiliza Chromium headless com renderização WebGL por software; não substitui testes em aparelhos reais.

No Windows (PowerShell), informe o caminho de um executável Chromium ou Chrome instalado antes de executar o teste:

```powershell
$env:CHROMIUM_PATH = 'C:\caminho\para\chrome.exe'
npm run test:browser
```

O teste usa o WebSocket nativo do Node e uma porta de depuração local temporária, sem dependências adicionais.

## Estado do projeto

Estes são templates técnicos para escolher o núcleo. O folheamento HTML usa uma transição de folha plana; o 3D usa malha segmentada deformável. Não há simulação física, editor de revista, importação de PDF ou conteúdo remoto. O visual e as artes locais são demonstrativos; conceito editorial e design system continuam como TO DO.

A pesquisa recomendou avaliar StPageFlip e Three.js, mas o proxy do ambiente impediu instalar dependências. A comparação inicial foi implementada com APIs nativas, sem copiar código ou assets das referências. A decisão entre manter estes renderers ou adotar uma biblioteca depende da avaliação dos templates.

- [Orientações para agentes e regras de commits](AGENTS.md).
- [Finalidade](docs/PURPOSE.md).
- [Arquitetura, pesquisa e limitações](docs/ARCHITETURE.md).
- [Ideia editorial — TO DO](docs/MAGAZINE.md).
- [Design system — TO DO](docs/DESIGN_SYSTEM.md).

## Estudo visual e interativo

A direção solicitada é branca e verde, minimalista, com fotografia e exploração por camadas. Com o servidor rodando, abra [a prévia separada](http://localhost:3000/previews/index.html): cinco temas, sumário, fotografias ampliáveis, galeria, diagrama conceitual e notas. Ela demonstra composição e interação; o núcleo HTML/3D permanece em avaliação.

- [Proposta visual e próximos critérios de validação](docs/DESIGN_PROPOSAL.md).
- [Acervo e créditos fotográficos](docs/IMAGE_SOURCES.md).
- [Licença da referência de design](docs/THIRD_PARTY_NOTICES.md).
