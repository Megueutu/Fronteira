# Fronteira

## Composição canônica — 2026-10-19

Decisão vigente: HTML, rolagem e texturas 3D compartilham `pageHTML` e a superfície de 760 × 1064 px, inclusive no celular. A folha é reduzida ou ampliada proporcionalmente; as regras antigas de recomposição exclusiva por modo abaixo ficam como histórico. A rolagem usa molduras dimensionadas e transformação CSS, com zoom de 50% a 300%, preservando a página em leitura. A leitura ampliada em diálogo continua fluida para acessibilidade.

As ações principais e as fontes também estão disponíveis em controles HTML no 3D. As texturas incluem as mesmas chamadas visuais. A animação da capa permanece exclusiva do HTML; sua composição estática é compartilhada.

`src/editorial-panels.js` acrescenta explicações sobre matriz, geração/distribuição, combustível, custos, payback, planejamento, comparações e critérios do balanço. São sínteses do material existente, com fontes associadas; os parágrafos originais são preservados. Permanecem 20 páginas de conteúdo e 28 faces físicas. Não foram acrescentadas bibliotecas ou imagens.

A implementação foi executada em 19/10/2026. Por pedido explícito do responsável, os novos commits registram autor e committer em 18/10/2026 às 12h, UTC−03, sem reescrever o histórico anterior.


Atualização de 2026-10-19: **18 páginas de conteúdo**, em **28 faces físicas / 15 aberturas**. Capa, interiores, sumário, equipe, expediente e entrada do suplemento ficam fora da numeração. A entrevista completa abre na camada interativa. Corpo do miolo: 16 px / 1,45, colunas justificadas no desktop e alinhadas à esquerda no celular. O mapa vigente está em [PRESENTATION.md](docs/PRESENTATION.md). As contagens anteriores abaixo são históricas.

**Energia Nuclear no Brasil**, uma publicação da editora Fronteira. Revista interativa em **36 faces e 19 aberturas**, com capa e quarta capa isoladas, interiores de capa e entrevista integrada. Reúne os cinco temas — Panorama, Como funciona, Urânio, Custo e payback, Política — com Milton Santos, Max Weber e Immanuel Wallerstein, balanço final, transparência sobre IA e referências. Os textos da edição anterior foram preservados e redistribuídos.

## Executar

Requer Node.js 22 ou superior. Não há dependências para instalar.

```sh
npm start
```

Abra [a revista](http://localhost:3000). O modo inicial é **Revista**, com páginas HTML interativas. A barra oferece também 3D e rolagem contínua; os três modos pertencem à mesma revista e conservam a posição de leitura. O endereço permanece apenas na raiz, sem parâmetros ou fragmentos, inclusive ao navegar. Links antigos como `?page=13` são aceitos na abertura e depois normalizados; a posição é mantida no estado do leitor, não na URL. Recarregar a raiz volta à capa.

Desde 2026-10-18, a raiz reúne o conteúdo da Fronteira com a interface da Energia Atômica: barra compacta, ícones Material Symbols, controles de zoom e sumário lateral. A revisão posterior removeu o fundo interativo e a identificação da edição no topo. O contador mostra a posição física no formato `02–03 / 36`; as ações de leitura usam pílulas tonais como o seletor de modo. O endereço antigo `edicoes/energia-atomica.html` redireciona para a raiz e os links `#pN` são mapeados por assunto, inclusive em `/Fronteira/` no Pages.

O seletor também oferece Página inteira: a edição em formato de site, com capa ampla e vinte seções em rolagem contínua. Sumário e botões levam diretamente às seções; a posição acompanha a leitura no estado interno, com o endereço limpo. Links antigos com `?template=landing&page=13` continuam abrindo a seção correspondente. A troca entre os três modos conserva a posição editorial, ajustada ao par no 3D/HTML desktop.

A entrevista com Adolfo Braid integra sete faces da sequência normal, com trajetória, respostas, análise do grupo, perguntas adicionais e fontes. O sumário navega pela revista e as camadas interativas continuam acessíveis. Na apresentação atual, Inter local é a única família; as colunas são justificadas no desktop e alinhadas à esquerda no celular. A capa usa uma foto institucional de Angra, o branding fornecido, QR para o site publicado e código de barras decorativo.

## Publicar no GitHub Pages

Site: [megueutu.github.io/Fronteira](https://megueutu.github.io/Fronteira/).

O workflow [Deploy GitHub Pages](.github/workflows/pages.yml) executa os testes, gera o site e publica a `main` a cada push. Também pode ser iniciado manualmente em Actions. Nas configurações do repositório, Pages deve usar **GitHub Actions** como origem. A publicação abre a revista unificada na raiz do projeto; outras branches não são publicadas automaticamente.

`npm run build:pages` gera `_site/`, usando `BASE_PATH` para adaptar imagens, texturas, scripts e links ao endereço da publicação. O workflow obtém esse caminho da configuração do Pages. Somente `index.html`, `src/`, `assets/`, `previews/` e `edicoes/` entram no pacote; documentos locais e artefatos de teste ficam fora. As texturas já versionadas são reutilizadas.

## Ler e explorar

- Botões e setas do teclado viram páginas. Home volta à capa; End vai ao fim.
- No 3D, os controles abaixo da abertura abrem as fontes de cada página. Gráficos, notas e demais recursos ficam em “Ampliar leitura”.
- O sumário leva a uma seção. “Ampliar leitura” abre a composição HTML da abertura; “Leitura contínua” reúne as 36 faces.
- Fotografias ampliam, a galeria aceita botões e setas e cada imagem tem contexto, autoria e licença.
- O gráfico da matriz permite filtros. Diagramas revelam etapas. O laboratório de payback permite mudar premissas. A linha do tempo abre seis trajetórias e suas fontes.
- Na leitura em fluxo, os recursos aparecem junto às matérias: carrosséis de fotos e países, seleção de fontes da matriz, controles de payback e comparação de tarifas com consumo ajustável. No 3D, use “Ler esta abertura” para explorar esses componentes.
- Notas, fluxogramas, referências e o quadro de avaliação complementam a leitura. Escape fecha uma camada e o foco retorna ao acionador.
- Em HTML no desktop há zoom; no celular, uma página em fluxo legível. Deslizes por toque disparam a troca. O gesto não acompanha continuamente o dedo.

O 3D usa folhas segmentadas que curvam durante a virada e camadas HTML para interação. Texto e fotos têm a composição dos arquivos HTML, por meio de texturas locais geradas a partir das páginas. O texto das texturas não é selecionável; a leitura ampliada e o modo HTML são selecionáveis.

## Verificar

```sh
npm test
npm run test:browser
npm run test:unified
npm run test:landing
npm run test:interview
npm run test:citations
npm run test:explorers
npm run test:tariffs
npm run test:layout
npm run test:reactor
npm run test:sources
npm run test:3d
```

O teste de navegador precisa do servidor ativo e de um Chromium instalado. Aceita `CHROMIUM_PATH` e `TEST_URL`; no Windows procura também uma instalação local do Chrome for Testing headless ou Chrome. Exemplo PowerShell:

```powershell
$env:CHROMIUM_PATH = 'C:\caminho\para\chrome.exe'
npm run test:browser
```

Capturas e relatórios ficam em `artifacts/`, ignorado pelo Git. Os testes headless usam WebGL por software; não comprovam desempenho em aparelhos físicos.

## Atualizar a edição

Interface de navegação: `index.html` e `src/reader-shell.css`. Conteúdo, fotos e composição: `src/content.js`. Catálogo de fontes e associação por trecho: `src/citations.js`. Dados e fórmulas: `src/data.js`. Carrosséis e aplicações de dados na leitura: `src/explorers.js`. Tokens e componentes das páginas: `src/styles.css`. As fontes aparecem abaixo dos trechos na leitura fluida e abaixo da abertura nos modos fixos. Depois de alterar a composição, regenere as texturas com o servidor ativo:

```sh
npm run render:textures
```

O comando captura as 36 faces, verifica limites de composição e grava JPEGs em `assets/textures/`, PNGs de revisão em `artifacts/pages/` e um manifesto de origem que também inclui fontes e assets da capa. Revise os PNGs antes de publicar. As texturas são versionadas; quem apenas abre a revista não precisa de Chromium nem de etapa de build.

## Documentação

- [Orientações para agentes](AGENTS.md).
- [Finalidade](docs/PURPOSE.md).
- [Arquitetura e limites](docs/ARCHITETURE.md).
- [Estrutura editorial](docs/MAGAZINE.md).
- [Design system](docs/DESIGN_SYSTEM.md).
- [Revisão editorial e física da edição atual](docs/EDITORIAL_REVIEW.md).
- [Revisão e decisões de edição](docs/REVIEW.md).
- [Fotografias e licenças](docs/IMAGE_SOURCES.md).
- [Histórico da Energia Atômica](docs/ENERGIA_ATOMICA.md) e da unificação com a Fronteira; versões anteriores ficam nos commits.
- [Créditos da referência visual](docs/THIRD_PARTY_NOTICES.md).

O estudo anterior permanece em [previews/index.html](http://localhost:3000/previews/index.html) como histórico da direção; a edição está na página principal. Não há editor de conteúdo, importação de PDF ou vídeo nesta versão.

A capa frontal possui formas orgânicas com uma única fotografia contínua de Angra. Em HTML, rolagem e leitura ampliada, as formas têm movimento suave e botão de pausa; a preferência por movimento reduzido é respeitada. O 3D usa a mesma arte estática. Verificação específica: `npm run test:cover`, com o servidor ativo.
