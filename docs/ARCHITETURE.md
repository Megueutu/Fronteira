# Arquitetura da revista interativa

Status: dois templates técnicos implementados e verificados no Chromium; núcleo final ainda em avaliação.
Pesquisa e decisões: 2026-10-15.

## Objetivo e decisões do produto

Simular uma revista no centro da interface, com páginas e navegação por folheamento. O responsável confirmou que folheamento frontal atende; depois pediu dois templates comparáveis: um 3D real e outro com páginas interativas. Confirmou também popup, carrossel e imagem ampliável como interações desejadas.

Os dois templates compartilham seis páginas neutras e as mesmas ações. A ideia editorial e o design system aguardam a conclusão e validação do núcleo. O nome deste arquivo segue o solicitado: `ARCHITETURE.md`.

## Alternativas pesquisadas

| Abordagem | Vantagem | Limitação |
| --- | --- | --- |
| Three.js + React Three Fiber | Cena 3D, iluminação e folhas deformáveis | Exige gerenciamento de GPU, interações e leitura acessível fora do canvas |
| StPageFlip (`page-flip`) | Folheamento pronto para HTML e imagens, suporte declarado a toque e retrato/paisagem | Ainda exige validar gestos, foco, páginas ocultas e compatibilidade |
| APIs nativas de HTML/CSS e WebGL | Protótipo local sem dependências; controle direto da comparação | Mais responsabilidade pela geometria, animação, manutenção e acessibilidade |

O tutorial de Wawa Sensei demonstra a viabilidade de um livro 3D, não a qualidade de leitura ou desempenho do Fronteira. O link de código final no tutorial apontou para outro projeto na consulta; confirmar o repositório e a licença antes de reutilizar material.

## Implementação desta comparação

A proposta anterior era avaliar StPageFlip para folheamento frontal e Three.js para 3D. O acesso ao npm falhou porque o proxy local do ambiente estava indisponível. Para entregar uma comparação executável, os templates foram implementados em JavaScript com APIs nativas, sem dependências, CDN ou assets remotos. Isso é uma decisão provisória do protótipo, não uma conclusão de que escrever um motor próprio seja a melhor opção de produção.

Não há React, Three.js, StPageFlip, framework ou etapa de build nesta versão. O servidor Node serve arquivos estáticos; `npm start` inicia o projeto. Uma hospedagem estática pode servir os mesmos arquivos.

### Template HTML

`src/html-reader.js` monta a abertura usando HTML semântico. A transição de desktop usa uma cópia visual da página com rotação CSS e perspectiva; essa cópia é `inert` e oculta de tecnologias assistivas. A folha dessa transição é plana, sem deformação curva.

Texto, botões e carrossel permanecem em DOM. No celular, uma página por vez; páginas ocultas ficam `inert`. Botões e setas navegam, e um deslize iniciado nas margens também troca páginas. O centro preserva seleção e scroll. O gesto dispara a transição ao soltar: a folha não acompanha continuamente o dedo. Em telas pequenas, a troca é imediata.

### Template 3D

`src/webgl-reader.js` implementa uma cena WebGL com projeção em perspectiva, folhas segmentadas e animação que as levanta e curva no espaço. A malha é recalculada durante a virada. Frente e verso recebem mapeamentos distintos para evitar texto espelhado. Camadas simplificadas sugerem espessura; o enquadramento é fixo, sem rotação livre.

O conteúdo de cada página é desenhado em canvas 2D e enviado à GPU como textura. A interface posiciona botões HTML sobre pontos projetados da folha. Eles abrem as mesmas interações do template HTML. Os hotspots ficam ocultos enquanto a folha vira.

O texto da textura não é selecionável. O carrossel do 3D abre em uma janela HTML; não é um componente DOM curvado sobre a malha. A leitura linear permite acessar o conteúdo sem depender do canvas. O template 3D mantém duas páginas também no celular; a legibilidade nessa tela é uma limitação conhecida.

Apenas a animação e o redimensionamento solicitam novos frames. As seis texturas da amostra são carregadas na inicialização do template 3D. Isso não é uma estratégia para uma edição grande: antes de ampliar o volume, implementar cache limitado e carregamento de aberturas vizinhas. A amostra usa aproximadamente 32 MiB para seis texturas RGBA de 1000 × 1400, além dos demais recursos.

## Conteúdo e interações compartilhadas

- `src/content.js`: seis páginas, ordem editorial, artes, textos, ações e composição HTML. Uma abertura possui duas páginas.
- `src/app.js`: template ativo, abertura, página móvel, navegação, coordenação das transições e links `?template=html` / `?template=3d`.
- `src/interactions.js`: popup, carrossel circular, ampliação e leitura linear, usando um `dialog` nativo com rótulo, foco inicial e restauração de foco. Interações abertas da leitura linear retornam ao texto ao fechar.
- `src/styles.css`: apresentação demonstrativa, comportamento responsivo e movimento reduzido.
- `assets/`: três artes SVG locais, criadas para o protótipo.
- `server.mjs`: servidor de desenvolvimento sem dependências.

As informações comuns vêm do manifesto, mas a composição visual HTML e o desenho de textura 3D são implementações separadas. Mudanças de layout precisam ser conferidas nos dois templates. Todo conteúdo é local e confiável; introduzir conteúdo externo exigirá validação e tratamento de HTML antes da renderização.

Não há backend de produto, banco de dados, CMS ou autenticação. PDF, vídeo, editor de edição, zoom gestual e publicação de conteúdo não foram implementados.

## Acessibilidade e falhas

Botões possuem nomes acessíveis e foco visível. Dialogs permitem Escape e clique fora; o foco retorna ao acionador. O conteúdo pode ser lido em modo linear, inclusive sem WebGL. Movimento reduzido evita viradas prolongadas. Uma falha ao iniciar WebGL ou perda de contexto mostra uma mensagem e mantém HTML e leitura linear disponíveis; a recuperação automática do contexto 3D não foi implementada.

Essas medidas não equivalem a uma auditoria de acessibilidade. Leitor de tela, contraste, toque físico e diferentes navegadores ainda precisam de avaliação.

## Verificações e limites

- `npm test`: limites e ordem de páginas, geometria curva, orientação do verso e projeção dos hotspots.
- `npm run test:browser`: navegação HTML e 3D; popup, Escape e foco; carrossel e ampliação; retorno à leitura linear; modo de uma página; ausência de transbordamento horizontal no celular; movimento reduzido; perda de contexto WebGL; ausência de exceções JavaScript no fluxo.
- Capturas de desktop e viewport móvel são geradas em `artifacts/` e foram inspecionadas visualmente.

Na sessão de nuvem, as verificações foram executadas no Chromium 154 headless, com WebGL por software. Não foram medidos FPS, bateria ou memória real do navegador; não há garantia de compatibilidade com Safari, Firefox ou aparelhos móveis físicos.

### Recuperação e validação local — 2026-10-15

Os arquivos foram recuperados do pacote `fronteira-templates.zip`, que contém o código e a documentação, mas não o histórico Git. A implementação foi registrada em um novo commit sobre a `main` inicial; o hash da sessão de nuvem não é preservado pelo ZIP.

No Windows, com Node.js 25.9.0 e Chrome for Testing 153.0.8010.12 headless, passaram os três testes do núcleo e o fluxo completo de navegador descrito acima. Foram inspecionadas as capturas HTML e 3D em desktop e viewport móvel. O 3D continua com duas páginas pequenas no celular; a escolha do núcleo permanece pendente da avaliação com o responsável.

O teste de navegador passou a usar CDP por WebSocket em uma porta local temporária, em vez dos descritores de pipe usados na nuvem, e a aguardar novas tentativas de remoção do perfil temporário no Windows. A aplicação continua sem dependências externas. O Edge 155 instalado encerrou durante a inicialização headless; esta validação local utilizou o Chrome for Testing, sem comprovar compatibilidade com Edge.

## Próximas decisões

1. Comparar os templates visualmente com o responsável e escolher o núcleo principal, ou manter ambos.
2. Definir se a folha precisa acompanhar o arraste e se capa fechada/abertura fazem parte da primeira experiência. A amostra inicia aberta e não implementa abrir/fechar a revista.
3. Definir celulares e navegadores de referência e quantidade esperada de páginas por edição.
4. Avaliar biblioteca de folheamento/3D antes de consolidar o renderer de produção, agora com interações concretas para comparar.
5. Validar desempenho e acessibilidade nos alvos definidos.
6. Depois de concluir o núcleo, iniciar ideia editorial e design system. Os documentos correspondentes permanecem TO DO.

## Fontes primárias da pesquisa

- [StPageFlip — repositório oficial](https://github.com/Nodlik/StPageFlip): alternativa com HTML e imagens, licença MIT. Verificar versão, manutenção e compatibilidade antes de adotar.
- [Wawa Sensei — livro 3D com Three.js e React](https://wawasensei.dev/tuto/3d-book-slider-landing-page-threejs-and-react): referência de animação e demonstração pública.
- [Three.js — SkinnedMesh](https://threejs.org/docs/pages/SkinnedMesh.html): deformação de malha por esqueleto, alternativa ao renderer experimental atual.
- [React Three Fiber — desempenho](https://r3f.docs.pmnd.rs/advanced/scaling-performance): referência de renderização sob demanda e reutilização de recursos.
- [Drei — Html](https://drei.docs.pmnd.rs/misc/html): posicionar DOM em uma cena não o transforma automaticamente em superfície deformável.
- [Mozilla — PDF.js](https://mozilla.github.io/pdf.js/): possível renderização futura de PDF, licença Apache 2.0.

Nenhum código, biblioteca ou asset dessas fontes foi incorporado aos templates.
