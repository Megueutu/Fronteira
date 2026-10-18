# Fronteira

Revista interativa em 20 páginas sobre energia nuclear no Brasil. Reúne os cinco temas acordados — Panorama, Como funciona, Urânio, Custo e payback, Política — com Milton Santos, Max Weber e Immanuel Wallerstein, balanço final, transparência sobre IA e referências.

## Executar

Requer Node.js 22 ou superior. Não há dependências para instalar.

```sh
npm start
```

Abra [a revista](http://localhost:3000). No desktop, o modo inicial é 3D; no celular, páginas HTML legíveis. Links diretos: [3D](http://localhost:3000/?template=3d) e [HTML](http://localhost:3000/?template=html). `?page=13` abre a região correspondente da edição.

O seletor também oferece [Página inteira](http://localhost:3000/?template=landing): a edição em formato de site, com capa ampla e vinte seções em rolagem contínua. Sumário e botões levam diretamente às seções; a URL acompanha a leitura. `?template=landing&page=13` abre a seção correspondente à página 13. A troca entre os três modos conserva a posição editorial, ajustada ao par no 3D/HTML desktop.

A entrevista com Adolfo Braid é um suplemento após a página 17 em Página inteira e na leitura contínua. O sumário e a ação da página 17 abrem a seção completa nos três modos. `?template=landing&page=17&interview=adolfo` abre diretamente a entrevista, com trajetória, sínteses das respostas, roteiro completo e fotografias institucionais creditadas. As vinte páginas originais são preservadas.

## Publicar no GitHub Pages

Site: [megueutu.github.io/Fronteira](https://megueutu.github.io/Fronteira/).

O workflow [Deploy GitHub Pages](.github/workflows/pages.yml) executa os testes, gera o site e publica a `main` a cada push. Também pode ser iniciado manualmente em Actions. Nas configurações do repositório, Pages deve usar **GitHub Actions** como origem. Outras branches não são publicadas automaticamente; a nova identidade visual chegará ao site quando for incorporada à `main`.

`npm run build:pages` gera `_site/`, usando `BASE_PATH` para adaptar imagens, texturas, scripts e links ao endereço da publicação. O workflow obtém esse caminho da configuração do Pages. Somente `index.html`, `src/`, `assets/`, `previews/` e `edicoes/` entram no pacote; documentos locais e artefatos de teste ficam fora. As texturas já versionadas são reutilizadas.

## Ler e explorar

- Botões e setas do teclado viram páginas. Home volta à capa; End vai ao fim.
- No 3D, os controles abaixo da abertura abrem as fontes de cada página. Gráficos, notas e demais recursos ficam em “Ampliar leitura”.
- O sumário leva a uma seção. “Ler esta abertura” amplia o conteúdo em HTML; “Leitura contínua” reúne as 20 páginas.
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

Conteúdo, fotos e composição: `src/content.js`. Catálogo de fontes e associação por trecho: `src/citations.js`. Dados e fórmulas: `src/data.js`. Carrosséis e aplicações de dados na leitura: `src/explorers.js`. Tokens e componentes: `src/styles.css`. As fontes aparecem abaixo dos trechos na leitura fluida e abaixo da abertura nos modos fixos. Depois de alterar a composição, regenere as texturas com o servidor ativo:

```sh
npm run render:textures
```

O comando captura as 20 páginas, verifica limites de composição e grava JPEGs em `assets/textures/`, PNGs de revisão em `artifacts/pages/` e um manifesto de origem. Revise os PNGs antes de publicar. As texturas são versionadas; quem apenas abre a revista não precisa de Chromium nem de etapa de build.

## Documentação

- [Orientações para agentes](AGENTS.md).
- [Finalidade](docs/PURPOSE.md).
- [Arquitetura e limites](docs/ARCHITETURE.md).
- [Estrutura editorial](docs/MAGAZINE.md).
- [Design system](docs/DESIGN_SYSTEM.md).
- [Revisão e decisões de edição](docs/REVIEW.md).
- [Fotografias e licenças](docs/IMAGE_SOURCES.md).
- [Energia Atômica](docs/ENERGIA_ATOMICA.md): um único arquivo, `edicoes/energia-atomica.html`, que abre direto no navegador; as versões ficam nos commits.
- [Créditos da referência visual](docs/THIRD_PARTY_NOTICES.md).

O estudo anterior permanece em [previews/index.html](http://localhost:3000/previews/index.html) como histórico da direção; a edição está na página principal. Não há editor de conteúdo, importação de PDF ou vídeo nesta versão.
