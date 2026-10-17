# Fronteira

Revista interativa em 20 páginas sobre energia nuclear no Brasil. Reúne os cinco temas acordados — Panorama, Como funciona, Urânio, Custo e payback, Política — com Milton Santos, Max Weber e Immanuel Wallerstein, balanço final, transparência sobre IA e referências.

## Executar

Requer Node.js 22 ou superior. Não há dependências para instalar.

```sh
npm start
```

Abra [a revista](http://localhost:3000). No desktop, o modo inicial é 3D; no celular, páginas HTML legíveis. Links diretos: [3D](http://localhost:3000/?template=3d) e [HTML](http://localhost:3000/?template=html). `?page=13` abre a região correspondente da edição.

## Publicar no GitHub Pages

Site: [megueutu.github.io/Fronteira](https://megueutu.github.io/Fronteira/).

O workflow [Deploy GitHub Pages](.github/workflows/pages.yml) executa os testes, gera o site e publica a `main` a cada push. Também pode ser iniciado manualmente em Actions. Nas configurações do repositório, Pages deve usar **GitHub Actions** como origem. Outras branches não são publicadas automaticamente; a nova identidade visual chegará ao site quando for incorporada à `main`.

`npm run build:pages` gera `_site/`, usando `BASE_PATH` para adaptar imagens, texturas, scripts e links ao endereço da publicação. O workflow obtém esse caminho da configuração do Pages. Somente `index.html`, `src/`, `assets/` e `previews/` entram no pacote; documentos locais e artefatos de teste ficam fora. As texturas já versionadas são reutilizadas.

## Ler e explorar

- Botões e setas do teclado viram páginas. Home volta à capa; End vai ao fim.
- O sumário leva a uma seção. “Ler esta abertura” amplia o conteúdo em HTML; “Leitura contínua” reúne as 20 páginas.
- Fotografias ampliam, a galeria aceita botões e setas e cada imagem tem contexto, autoria e licença.
- O gráfico da matriz permite filtros. Diagramas revelam etapas. O laboratório de payback permite mudar premissas. A linha do tempo abre seis trajetórias e suas fontes.
- Notas, fluxogramas, referências e o quadro de avaliação complementam a leitura. Escape fecha uma camada e o foco retorna ao acionador.
- Em HTML no desktop há zoom; no celular, uma página em fluxo legível. Deslizes por toque disparam a troca. O gesto não acompanha continuamente o dedo.

O 3D usa folhas segmentadas que curvam durante a virada e camadas HTML para interação. Texto e fotos têm a composição dos arquivos HTML, por meio de texturas locais geradas a partir das páginas. O texto das texturas não é selecionável; a leitura ampliada e o modo HTML são selecionáveis.

## Verificar

```sh
npm test
npm run test:browser
```

O teste de navegador precisa do servidor ativo e de um Chromium instalado. Aceita `CHROMIUM_PATH` e `TEST_URL`; no Windows procura também uma instalação local do Chrome for Testing headless ou Chrome. Exemplo PowerShell:

```powershell
$env:CHROMIUM_PATH = 'C:\caminho\para\chrome.exe'
npm run test:browser
```

Capturas e relatórios ficam em `artifacts/`, ignorado pelo Git. Os testes headless usam WebGL por software; não comprovam desempenho em aparelhos físicos.

## Atualizar a edição

Conteúdo, fontes, fotos e composição: `src/content.js`. Dados e fórmulas: `src/data.js`. Tokens e componentes: `src/styles.css`. Depois de alterar a composição, regenere as texturas com o servidor ativo:

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
