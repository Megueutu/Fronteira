# Revisão visual e física — 18 de outubro de 2026

## Direção aprovada

Ajuste posterior de interface: o responsável pediu retirar a identificação da edição, favicon e título do topo, remover o fundo interativo e aproximar controles do seletor tonal enviado como referência. O topo usa ícones Material de 24 px; posição física em pílula (`02–03 / 36`); ampliação e leitura contínua compartilham o mesmo tratamento. O favicon continua na aba do navegador e a editora permanece na capa e nos créditos. O módulo de animação do fundo foi removido.

O responsável confirmou o título **Energia Nuclear no Brasil**, Fronteira como editora, fotografia única de Angra na capa, marca e favicon fornecidos, uma família sem serifa, liberdade de redistribuir parágrafos sem alterar a redação, entrevista integrada e capas físicas. Confirmou texto justificado no desktop e alinhado à esquerda no celular. A rodada da skill grilling terminou com autorização expressa para implementar.

## Diagnóstico e decisões

- A capa anterior combinava três fotos recortadas, átomo, ondas, título, marca, chamadas e rodapé. A arte ocupava cerca de 73% da folha. A nova fotografia ocupa a folha integral de 760 × 1064, preserva as instalações no recorte e deixa a marca subordinada ao título. Não há fólio nas quatro faces de capa.
- A interface e as páginas misturavam Georgia, Arial e Segoe UI. A edição usa Inter Variable 4.1 local, normal e itálico, com licença OFL preservada. O corpo fixo passou de 18 para 20 px com entrelinha 1,55. O tamanho aparente ainda depende da tela e do zoom; não há promessa de legibilidade idêntica em qualquer dispositivo.
- As colunas já eram justificadas e balanceadas. Foram refinados largura, hierarquia, espaçamento e distribuição do texto. Não se usaram espaçamento artificial de letras, última linha esticada, cortes de parágrafos ou transbordamento oculto para fazer o conteúdo caber.
- Capa sozinha e miolo em duplas exigem um mapa físico. `src/pagination.js` substitui as suposições de pares por índice; o HTML e o WebGL compartilham esse mapa. Capa e quarta capa ficam centralizadas e usam uma textura cada; aberturas internas usam duas.
- A entrevista agora ocupa sete faces. Respostas de Braid e análises do grupo continuam separadas. Os quinze registros de fontes e as quatro fotografias foram preservados. As referências detalhadas continuam próximas no fluxo e acessíveis pelas ações de fontes nos modos fixos.
- A equipe ganhou uma grade de retratos em três colunas e duas linhas. Fotografias existentes complementam segurança, soberania e distribuição dos custos, com legendas que esclarecem o caráter ilustrativo. Patterns ficam nos interiores e no fechamento, sem competir com a reportagem.

## Preservação e identidade

`tests/fixtures/editorial-original.json` registra os dados anteriores à redistribuição. Os testes comparam parágrafos em ordem, títulos, subtítulos, notas, balanços e referências, além dos conteúdos da entrevista. Ajustes de referências à paginação são resolvidos na apresentação, preservando os dados originais.

Marca e favicon foram copiados dos SVGs fornecidos. A foto institucional está em alta resolução original, sem ampliação artificial. Origem, crédito e ausência de licença explícita no portal estão registrados em [IMAGE_SOURCES.md](IMAGE_SOURCES.md). A fotografia não foi apresentada como imagem livre de direitos.

O QR codifica `https://megueutu.github.io/Fronteira/`. A geração local é reproduzível por `python scripts/generate-qr.py`, com ferramenta MIT versionada; o visitante não depende de serviço ou biblioteca de QR. O código de barras é decorativo, sem ISBN, ISSN ou identificador fictício.

## Verificação

As 36 faces foram renderizadas a partir do HTML e medidas: imagens presentes, ausência de transbordamento e respiro antes do rodapé. A checagem admite 0,25 px de arredondamento nas coordenadas fracionárias. PNGs e contact sheet ficam em `artifacts/`, fora do Git; texturas JPEG e manifesto são versionados.

O QR foi decodificado tanto no PNG da capa quanto na textura JPEG. A verificação no Chromium é headless e usa WebGL por software; não equivale a homologação em aparelhos físicos, Safari ou Firefox. Os resultados das suítes finais são registrados em [REVIEW.md](REVIEW.md).
