// Respostas sintetizadas do registro do grupo; não são transcrições literais.
export const adolfoInterview = {
  name: 'Adolfo Braid',
  fullName: 'Adolfo de Aguiar Braid',
  role: 'Diretor de pesquisa e desenvolvimento da Terminus',
  title: 'Da experiência nuclear às perguntas sobre o futuro.',
  introduction: 'O grupo conversou com Adolfo Braid para aproximar a pesquisa de quem trabalha no setor. Sua trajetória passa pelo ciclo do combustível e por projetos industriais; na entrevista, ele defende a expansão nuclear e apresenta os microrreatores como uma possibilidade para o Brasil.',
  career: [
    { title: 'Formação em engenharia', text: 'Braid é graduado em Engenharia Química pelo IME, mestre em Engenharia Nuclear por Berkeley e doutor em Engenharia Metalúrgica e de Materiais pela COPPE/UFRJ.', source: 'aeita' },
    { title: 'Do combustível aos equipamentos', text: 'Sua trajetória inclui atuação na Marinha, no ciclo do combustível nuclear e no desenvolvimento de centrífugas. Também participou de projetos industriais, como a fabricação dos geradores de vapor de Angra 1.', source: 'abdan' },
    { title: 'Pesquisa em microrreatores', text: 'Na Terminus, Braid dirige a pesquisa e o desenvolvimento e participa do projeto brasileiro de microrreator. O projeto reúne empresas e institutos de pesquisa e passa por etapas de licenciamento nuclear e ambiental.', source: 'cnen' },
  ],
  conversations: [
    { topic: 'Urânio e soberania', question: 'Em que parte do ciclo do combustível seu trabalho se encaixa?', answer: 'Braid trabalhou no ciclo do combustível nuclear e no desenvolvimento de centrífugas para enriquecimento de urânio. Para ele, dominar uma tecnologia e produzi-la em escala industrial são desafios diferentes. Defende ampliar os investimentos para transformar o conhecimento acumulado em produção.', reading: 'A resposta ajuda a discutir a diferença entre ter reservas, dominar técnicas e sustentar uma cadeia produtiva. Essa relação aproxima a entrevista do debate sobre dependência e autonomia tecnológica.', chapter: 8, chapterLabel: 'Urânio e soberania', record: '§1: trajetória e ciclo do combustível; §2: reservas e produção industrial.' },
    { topic: 'Geração e matriz', question: 'O Brasil deveria apostar mais em energia nuclear? Por quê?', answer: 'Braid defende ampliar a participação da energia nuclear no Brasil. Apoia essa posição nas reservas de urânio, na experiência tecnológica brasileira e na oferta contínua de eletricidade, que poderia complementar a geração solar, eólica e hidrelétrica.', reading: 'Essa é uma perspectiva do setor. Para avaliá-la, a pesquisa também precisa considerar segurança, resíduos, custos, rede e alternativas de geração, sem transformar a defesa de uma fonte em conclusão automática.', chapter: 6, chapterLabel: 'Funcionamento e segurança', record: '§2: reservas e ciclo do combustível; §4: matriz e papel da energia nuclear.' },
    { topic: 'Território e desigualdade', question: 'Seria viável levar energia nuclear a regiões com menos condições?', answer: 'Braid apresenta os microrreatores como uma proposta de geração próxima dos consumidores. Ao discutir o Nordeste, distingue a produção regional de eletricidade do acesso da população ao consumo. O projeto brasileiro de microrreator ainda está em desenvolvimento.', reading: 'A aproximação com Milton Santos está na distribuição dos benefícios. Uma instalação local, sozinha, não demonstra que haverá renda maior ou conta de luz acessível; preço, infraestrutura e participação das comunidades precisam entrar na análise.', chapter: 3, chapterLabel: 'Panorama e território', record: '§6: microrreatores; §7: produção e consumo no Nordeste; apresentação, §9.4 e §9.5: propostas de aplicação.' },
  ],
  questions: [
    { question: 'Qual é seu papel hoje?', answer: 'Adolfo Braid é diretor de pesquisa e desenvolvimento da Terminus e participa do projeto brasileiro de microrreatores.', sources: [{id:'adolfo-abdan'},{id:'adolfo-cnen'}] },
    { question: 'Em que etapa do ciclo do combustível trabalha?', answer: 'Sua atuação passa pelo ciclo do combustível nuclear e pelo desenvolvimento de centrífugas para enriquecimento de urânio.', record: '§1, “Trajetória profissional e atuação no ciclo nuclear”; §10, pergunta sobre a etapa do ciclo.' },
    { question: 'Levar nuclear a regiões com menos condições seria viável?', answer: 'Braid apresenta os microrreatores como proposta de geração local, próxima dos consumidores. As aplicações discutidas incluem municípios e regiões que exigem soluções adequadas à sua infraestrutura; o projeto ainda está em desenvolvimento.', record: '§6, microrreatores; §7, Nordeste e consumo; slides em §9.4 e §9.5; §10, pergunta sobre regiões com menos condições.' },
    { question: 'Como avalia as reservas de urânio pouco aproveitadas?', answer: 'Defende aproveitar as reservas e o conhecimento técnico brasileiro com responsabilidade, ampliando os investimentos para transformar esse potencial em produção industrial.', record: '§2, “Reservas brasileiras, ciclo do combustível e retorno do investimento”; §10, pergunta sobre reservas.' },
    { question: 'O Brasil deveria apostar mais em nuclear? Por quê?', answer: 'Sim. Sua defesa se apoia nas reservas brasileiras de urânio, na experiência tecnológica do país e na oferta contínua de eletricidade, que poderia complementar outras fontes da matriz.', record: '§2, reservas e ciclo do combustível; §4, matriz e papel da energia nuclear; §10, pergunta sobre ampliar a aposta nuclear.' },
  ],
  sources: {
    cnen: { label: 'CNEN · projeto e participação de Adolfo Braid', url: 'https://www.gov.br/cnen/pt-br/assunto/ultimas-noticias/cerimonia-oficial-marca-o-inicio-formal-do-projeto-do-primeiro-microrreator-nuclear-brasileiro' },
    abdan: { label: 'ABDAN · perfil do Nuclear Summit 2026', url: 'https://abdan.glueup.com/event/nuclear-summit-2026-162855/speakers.html' },
    aeita: { label: 'AEITA · apresentação profissional', url: 'https://pt.linkedin.com/posts/aeita_nesta-sexta-feira-2111-%C3%A0s-18h-hor%C3%A1rio-activity-7396519091383042048-_j4Q' },
    licensing: { label: 'ANSN/IEN · licenciamento em janeiro de 2026', url: 'https://www.gov.br/cnen/pt-br/assunto/ultimas-noticias/reuniao-entre-ien-cnen-e-a-ansn-para-discutir-termo-de-referencia-acontece-na-sede-da-cnen' },
    kilopower: { label: 'NASA · protótipo Kilopower', url: 'https://www.nasa.gov/image-article/kilopower-13/' },
    marvel: { label: 'DOE / INL · representação do MARVEL', url: 'https://www.flickr.com/photos/departmentofenergy/55461564410' },
    linkedin: { label: 'LinkedIn indicado pelo grupo', url: 'https://www.linkedin.com/in/adolfobraid/' },
  },
};
