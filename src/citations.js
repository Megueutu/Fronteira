import { uiIcon } from './icons.js';
export const references = [
  { id: 'epe', name: 'EPE. Anuário Estatístico de Energia Elétrica 2026, ano-base 2025.', url: 'https://dashboard.epe.gov.br/apps/anuario-livro/livro/pt/destaques.html' },
  { id: 'ben', name: 'EPE. Balanço Energético Nacional 2026, ano-base 2025.', url: 'https://www.epe.gov.br/pt/publicacoes-dados-abertos/publicacoes/balanco-energetico-nacional-2026' },
  { id: 'sin', name: 'ONS. O Sistema Interligado Nacional.', url: 'https://www.ons.org.br/paginas/sobre-o-sin/o-que-e-o-sin' },
  { id: 'santos', name: 'SANTOS, Milton. A natureza do espaço. Hucitec, 1996. SANTOS; SILVEIRA. O Brasil: território e sociedade no início do século XXI. Record, 2001. Apoio: biografia do autor.', url: 'https://miltonsantos.com.br/site/biografia/' },
  { id: 'iaea', name: 'AIEA. What is nuclear energy? The science of nuclear power.', url: 'https://www.iaea.org/newscenter/news/what-is-nuclear-energy-the-science-of-nuclear-power' },
  { id: 'waste', name: 'AIEA. Spent fuel management.', url: 'https://www.iaea.org/topics/spent-fuel-management' },
  { id: 'inb', name: 'INB. Ciclo do combustível nuclear.', url: 'https://www.inb.gov.br/Nossas-Atividades/Ciclo-do-combustivel-nuclear' },
  { id: 'enrichment', name: 'INB. Enriquecimento de urânio e salvaguardas.', url: 'https://www.inb.gov.br/Nossas-Atividades/Ciclo-do-combustivel-nuclear/Enriquecimento' },
  { id: 'wallerstein', name: 'WALLERSTEIN, Immanuel. The Modern World-System. Academic Press, 1974; World-Systems Analysis: An Introduction. Duke University Press, 2004.', url: 'https://www.dukeupress.edu/world-systems-analysis' },
  { id: 'critique', name: 'SKOCPOL, Theda. Wallerstein’s World Capitalist System: A Theoretical and Historical Critique. American Journal of Sociology, v. 82, n. 5, 1977.', url: 'https://doi.org/10.1086/226431' },
  { id: 'cost', name: 'EPE. Nota de esclarecimento sobre Angra 3. 11 abr. 2024.', url: 'https://www.epe.gov.br/pt/imprensa/noticias/nota-de-esclarecimento-abril-de-2024' },
  { id: 'group', name: 'Pesquisa do grupo. Revista Energia Nuclear Brasil, DOCX e cenários de payback fornecidos pelo grupo. Hipóteses acadêmicas de 2025; não são orçamento ou tarifa vigentes.', url: null },
  { id: 'weber', name: 'WEBER, Max. Economia e sociedade. Editora UnB, 2004. Referência de apoio: Stanford Encyclopedia of Philosophy, Max Weber.', url: 'https://plato.stanford.edu/entries/weber/' },
  { id: 'messmer', name: 'INA. Le lancement du nucléaire civil en France en 1974. Arquivo histórico.', url: 'https://www.ina.fr/ina-eclaire-actu/le-lancement-du-nucleaire-civil-en-france-en-1974' },
  { id: 'germany', name: 'Governo alemão. Encerramento dos últimos reatores, 15 abr. 2023.', url: 'https://www.bundeswirtschaftsministerium.de/Redaktion/DE/Pressemitteilungen/2023/04/20230413-deutschland-beendet-das-zeitalter-der-atomkraft.html' },
  { id: 'belgium', name: 'Governo belga. Acordo de extensão de Doel 4 e Tihange 3, 2023.', url: 'https://news.belgium.be/nl/engie-en-de-belgische-federale-regering-bereiken-een-akkoord-over-de-verlenging-van-de' },
  { id: 'japan', name: 'Missão do Japão em Viena. Declaração à AIEA sobre a retomada nuclear, 2015.', url: 'https://www.vie-mission.emb-japan.go.jp/itpr_en/PR14_09_2015_EN_HOD.html' },
  { id: 'italy', name: 'AIEA. Nuclear Technology Review 2012: referendo italiano de 2011.', url: 'https://www.iaea.org/sites/default/files/gc/gc56inf-3_en.pdf' },
  { id: 'lithuania', name: 'Parlamento Europeu. Ignalina Nuclear Power Plant, 2011.', url: 'https://www.europarl.europa.eu/doceo/document/E-7-2011-008709_EN.html' },
  { id: 'korea', name: 'MRE. Transição energética: experiências internacionais, maio de 2024.', url: 'https://www.gov.br/mdic/pt-br/composicao/se/cndi/gts/tematicos/gt-cb/entregas/arquivos/TransicaoEnergeticaExperienciasInternacionaisMREmaio2024.pdf' },
  { id: 'npt', name: 'ONU. Tratado sobre a Não Proliferação de Armas Nucleares.', url: 'https://www.un.org/en/conf/npt/2010/npttext.shtml' },
  { id: 'polis', name: 'Instituto Pólis. Justiça energética: relatório de pesquisa, 2024.', url: 'https://escoladeativismo.org.br/wp-content/uploads/2025/04/justica_energetica.pdf' },
  { id: 'interview', name: 'Entrevista com Adolfo Braid. Acervo de pesquisa do grupo, 2026.', url: null },
  { id: 'adolfo-abdan', name: 'ABDAN. Perfil de Adolfo Braid no Nuclear Summit 2026.', url: 'https://abdan.glueup.com/event/nuclear-summit-2026-162855/speakers.html' },
  { id: 'adolfo-cnen', name: 'CNEN. Participação de Adolfo Braid no projeto brasileiro de microrreator, dezembro de 2025.', url: 'https://www.gov.br/cnen/pt-br/assunto/ultimas-noticias/cerimonia-oficial-marca-o-inicio-formal-do-projeto-do-primeiro-microrreator-nuclear-brasileiro' },
];

// Locators describe the material actually available; missing book pagination is explicit.
const researchURL = 'https://github.com/Megueutu/Fronteira/blob/main/pesquisa/';
const locations = {
  epe: ['EPE, Anuário 2026', 'Destaques / Geração de Eletricidade; ano-base 2025.'],
  ben: ['EPE, BEN 2026', 'Ano-base 2025; oferta interna de eletricidade.'],
  sin: ['ONS, O que é o SIN', 'Descrição do sistema, subsistemas e integração da geração e transmissão.'],
  santos: ['Santos e Silveira, O Brasil (2001)', 'Conceitos de espaços luminosos/opacos e meio técnico-científico-informacional; retomados na pesquisa do grupo, §3.3. Página da obra não informada no material fornecido.'],
  iaea: ['AIEA, What is Nuclear Energy?', 'Seções “What is nuclear fission?” e “How does a nuclear power plant work?”.'],
  waste: ['AIEA, Spent fuel management', 'Texto de abertura: armazenamento após a retirada do núcleo, reprocessamento/destinação e responsabilidades de longo prazo.'],
  inb: ['INB, Ciclo do combustível nuclear', 'Descrição das etapas: mineração, conversão, enriquecimento, reconversão, pastilhas e montagem.'],
  enrichment: ['INB, Enriquecimento', 'Descrição das ultracentrífugas e da ampliação industrial por etapas.'],
  wallerstein: ['Wallerstein, World-Systems Analysis (2004)', 'Obra indicada na pesquisa, §8.3 e §9; conceitos de centro, semiperiferia e periferia. Página da obra não informada; link para a editora.'],
  critique: ['Skocpol, crítica ao sistema-mundo (1977)', 'Artigo “Wallerstein’s World Capitalist System: A Theoretical and Historical Critique”; DOI 10.1086/226431.'],
  cost: ['EPE, Nota de esclarecimento (11/04/2024)', 'Esclarecimento sobre Angra 3 e os limites das informações e estimativas então disponíveis.'],
  group: ['Pesquisa do grupo, estudo ABNT revisto', 'Documento fornecido pelo grupo; seções identificadas em cada trecho.'],
  weber: ['Weber, apoio: Stanford Encyclopedia', 'Verbete “Max Weber”, §3 (History), §4 (Modernity) e §6 (Politics and Ethics). Aplicação à energia elaborada pelo grupo.'],
  messmer: ['INA, nuclear civil francês em 1974', 'Arquivo “Le lancement du nucléaire civil en France en 1974”. Recorte histórico, não avaliação da política atual.'],
  germany: ['Governo alemão, encerramento nuclear', 'Comunicado de 13/04/2023 sobre o desligamento das últimas centrais em 15/04/2023.'],
  belgium: ['Governo belga, acordo com a Engie', 'Acordo de 2023 sobre a extensão de Doel 4 e Tihange 3 por dez anos.'],
  japan: ['Missão do Japão em Viena, AIEA (2015)', 'Declaração de 14/09/2015; trecho sobre Sendai e a retomada sob os novos requisitos.'],
  italy: ['AIEA, Nuclear Technology Review 2012', 'Documento GC(56)/INF/3; passagem sobre o referendo italiano de junho de 2011. Sem página confirmada neste registro.'],
  lithuania: ['Parlamento Europeu, Ignalina (2011)', 'Pergunta parlamentar E-008709/2011: encerramento e compromissos associados à adesão à União Europeia.'],
  korea: ['MRE, experiências internacionais (2024)', 'Apresentação de maio de 2024; recorte sobre a Coreia do Sul. Página não registrada na pesquisa.'],
  npt: ['ONU, Tratado de Não Proliferação', 'Artigos II, III e IV: armas, salvaguardas e usos pacíficos.'],
  polis: ['Instituto Pólis, Justiça energética (2024)', 'Relatório de pesquisa; acesso, desigualdade e pobreza energética. Página não registrada na edição de origem.'],
  interview: ['Entrevista, Adolfo Braid', 'Trajetória profissional, ciclo do combustível, matriz elétrica e propostas de microrreatores. Seções 1, 2, 4, 6 e 7; apresentação na seção 9.'],
  'adolfo-abdan': ['ABDAN, Adolfo Braid', 'Nuclear Summit 2026 / Speakers / Adolfo Braid; função profissional e projetos citados no perfil.'],
  'adolfo-cnen': ['CNEN, projeto de microrreator', 'Notícia sobre o início formal do projeto; passagem que identifica a participação de Adolfo Braid.'],
};
for (const ref of references) {
  [ref.short,ref.location] = locations[ref.id];
  if (ref.id === 'group') { ref.url = researchURL + 'ApostaEnergiaNuclearBrasilABNT%20revisto.docx'; ref.name = 'Pesquisa do grupo. ApostaEnergiaNuclearBrasilABNT revisto.docx. Estudo acadêmico fornecido; cenários financeiros com hipóteses de 2025.'; }
  if (ref.id === 'interview') ref.url = researchURL + 'ENTREVISTA_ADOLFO_BRAID_REGISTRO_CONSOLIDADO.md';
  // The biography is not the source of Santos's territorial concepts.
  if (ref.id === 'santos') { ref.url = researchURL + 'ApostaEnergiaNuclearBrasilABNT%20revisto.docx'; ref.name = 'SANTOS, Milton. A natureza do espaço (1996). SANTOS; SILVEIRA. O Brasil: território e sociedade no início do século XXI (2001). Obras indicadas na pesquisa, §3.3; link para o documento do grupo, sem paginação confirmada dos livros.'; }
}
references.push(
  {id:'wallerstein-bio',short:'THE, Immanuel Wallerstein, 1930-2019',name:'REISZ, Matthew. Immanuel Wallerstein, 1930-2019. Times Higher Education, 12 set. 2019.',url:'https://www.timeshighereducation.com/people/immanuel-wallerstein-1930-2019-obituary',location:'Obituário: formação em Columbia, atuação em Columbia, McGill, Binghamton e Yale, direção do Centro Fernand Braudel e The Modern World-System (1974).'},
  {id:'tariff-study',short:'Pesquisa do grupo, PDF ABNT',name:'Pesquisa do grupo. Aposta Energia Nuclear Brasil, PDF ABNT. Tarifas por região.',url:researchURL+'Aposta_Energia_Nuclear_Brasil_ABNT.pdf',location:'Página 24, §5.1, Tabela 2; gráfico na p. 25, Figura 7. Valores da compilação Meutudo de 2026, reproduzidos conforme a pesquisa.'},
  {id:'tariff-compilation',short:'Meutudo, tabela por região (2026)',name:'Meutudo. Tabela de consumo de energia elétrica (Luz) 2026, 14 jan. 2026.',url:'https://meutudo.com.br/blog/tabelas/tabela-de-consumo-de-energia-eletrica-luz/',location:'Seção “Tabelas de Tarifas de Energia Elétrica (Luz) por Região”. Limites ordenados conforme a Tabela 2 do PDF; a página consultada apresenta os títulos mínima/máxima invertidos.'},
  {id:'aneel-tariffs',short:'ANEEL, Ranking das tarifas',name:'ANEEL. Ranking das Tarifas.',url:'https://www.gov.br/aneel/pt-br/assuntos/tarifas/ranking-das-tarifas',location:'Texto introdutório: unidades em R$/kWh e itens não contemplados nas tarifas homologadas, como tributos, iluminação pública e bandeiras.'},
  {id:'fukushima',short:'AIEA, Fukushima Daiichi',name:'AIEA. Fukushima Daiichi Nuclear Accident.',url:'https://www.iaea.org/topics/response/fukushima-daiichi-nuclear-accident',location:'Dossiê sobre o acidente de março de 2011, resposta e lições de segurança.'},
  {id:'aeita',short:'AEITA, formação de Adolfo Braid',name:'AEITA. Apresentação profissional de Adolfo Braid.',url:'https://pt.linkedin.com/posts/aeita_nesta-sexta-feira-2111-%C3%A0s-18h-hor%C3%A1rio-activity-7396519091383042048-_j4Q',location:'Publicação de divulgação da palestra; apresentação da formação no IME, Berkeley e COPPE/UFRJ.'},
  {id:'chernobyl',short:'AIEA, Chernobyl',name:'AIEA. Twenty Years After the Chernobyl Accident.',url:'https://www.iaea.org/newscenter/news/twenty-years-after-the-chernobyl-accident',location:'Texto sobre o acidente de abril de 1986, suas consequências e as lições para segurança.'},
  {id:'abacc',short:'ABACC, acordos de salvaguardas',name:'ABACC. Agreements and Statements.',url:'https://www.abacc.org.br/en/agreements-and-statements/',location:'Acordo Quadripartite entre Brasil, Argentina, ABACC e AIEA para aplicação de salvaguardas.'},
  {id:'itataia',short:'INB, Projeto Santa Quitéria',name:'INB. O que é o Projeto Santa Quitéria?',url:'https://www.inb.gov.br/Contato/Perguntas-Frequentes/Pergunta/Conteudo/o-que-e-o-projeto-santa-quiteria?Origem=1083',location:'Resposta sobre a jazida de Itataia, o projeto conjunto de mineração e o Consórcio Santa Quitéria.'},
);

const c = (id,location) => ({id,...(location ? {location} : {})});
const evidence = (...sources) => ({kind:'Fonte',sources:sources.map(source=>typeof source === 'string' ? c(source) : source)});
const analysis = (...sources) => ({...evidence(...sources),kind:'Análise do grupo, com base em'});
const study = section => c('group',section);
const theory = study('§3.3: Milton Santos; §8.3: Wallerstein; §9: síntese da fundamentação teórica. Páginas das obras originais não informadas.');
const finance = study('§7, “Previsão de payback”: valores adotados, Tabela 4 (cenários) e Tabela 5 (payback). Hipóteses do exercício de 2025.');

// One record per paragraph; interpretation is never presented as the source's conclusion.
export const pageEvidence = {
  opening: [evidence(study('§1, “Tese”: pergunta que resume o problema de pesquisa.')),evidence('epe',study('§1, “Tese”: reserva de urânio, enriquecimento e usinas em operação; §3.1, Tabela 1: nuclear = 2,0%.')),evidence(study('§3.2, Sistemas Isolados: dependência do diesel e grupo técnico do MME (jan. 2026).'))],
  editorial: [analysis('iaea'),analysis('santos','sin'),analysis('wallerstein','enrichment'),{kind:'Proposta editorial do grupo',sources:[]}],
  unequal: [evidence('polis',study('§5.4, “Pobreza energética”.')),analysis('sin','polis'),evidence('polis',study('§5.4, “Pobreza energética”: pesquisa IPEC/Instituto Pólis (2023 e 2024) e Figura 11.'),study('§8, abertura: acesso a eletricidade nos domicílios, dados do IBGE (2024).'))],
  matrix: [evidence(c('epe','Destaques / Geração de Eletricidade: participação hidráulica e soma eólica + solar em 2025.'),study('§3.1, Tabela 1: composição por fonte; nuclear = 2,0%.')),evidence('epe','ben'),analysis('epe')],
  territory: [evidence('sin'),analysis('sin','polis'),analysis('santos'),analysis(study('§3.3 e §5.5, “O caso Belo Monte: custo aqui, benefício ali”.'),'polis'),evidence('sin',study('§3.2, “Como o SIN realmente distribui a energia”: subsistemas, linhas de 500 kV e o apagão de agosto de 2023.')),analysis(study('§5.5, “O caso Belo Monte: custo aqui, benefício ali”: famílias deslocadas (Norte Energia; Instituto Socioambiental) e tarifas no Pará e em São Paulo (ANEEL, via Brasil de Fato, 2019).'))],
  reactor: [evidence('iaea'),evidence(study('§2, descrição do ciclo nuclear e reatores de Angra.'),'iaea'),evidence(study('§5, abertura: participação de Angra 1 e 2 no consumo; §7: potência e geração anunciadas de Angra 3 (Eletronuclear).'))],
  safety: [evidence('iaea','npt'),evidence('waste'),evidence('fukushima','chernobyl',study('§6, impactos dos acidentes nas decisões nacionais.')),analysis('waste','weber'),analysis(study('§1, referencial de Ulrich Beck: sociedade de risco.')),analysis('waste')],
  uranium: [evidence('inb'),evidence('inb'),evidence('inb','enrichment'),evidence(c('inb','Etapa “Conversão”: serviço contratado no exterior.')),evidence('itataia'),evidence('inb'),evidence(c('inb','Etapa “Conversão”: serviço contratado no exterior.')),evidence('inb','enrichment'),evidence('inb','enrichment'),evidence('waste')],
  wallerstein: [evidence('wallerstein-bio'),evidence('wallerstein'),evidence('wallerstein',theory),analysis('wallerstein','inb'),analysis('wallerstein','enrichment')],
  sovereignty: [evidence('critique'),analysis('wallerstein','critique'),evidence('npt','abacc'),analysis('npt',study('§2, distinção entre propulsão e armamento nuclear.')),analysis(study('§8.4, “Maria Regina Soares de Lima e a Autonomia com Vulnerabilidade”: Acordo Nuclear Brasil-Alemanha de 1975 e TNP (adesão do Brasil em 1998).'),'npt')],
  cost: [analysis(finance),evidence(finance)],
  payback: [evidence(finance),evidence(finance),analysis(finance),evidence(study('§7, “Previsão de payback”: payback descontado, taxas de 6% a 10% ao ano. Hipóteses do exercício de 2025.'))],
  'who-pays': [analysis(finance),evidence('cost'),analysis(finance,'polis'),evidence(study('§7.1, contraponto crítico: World Nuclear Industry Status Report e decisão do TCU de fevereiro de 2026.')),evidence(study('§5.3, “Furto de energia (“gatos”)”: perdas não técnicas (Abradee) e custo repassado à tarifa.'),study('§5.1, “Tarifas de energia por região”: variação das tarifas (Abraceel) e projeção da TR Soluções (2026).'))],
  messmer: [evidence('messmer'),analysis('messmer','weber'),evidence(study('§4.1, “O Plano Messmer e a Racionalização de Max Weber”: custo e estrutura de financiamento do programa.')),analysis(study('§4.1, retorno e exportação de eletricidade; §2, urânio enriquecido russo usado pela França em 2025.'),'weber')],
  world: [evidence('germany','italy','japan','belgium','lithuania','korea'),{kind:'Critério editorial: recortes históricos datados',sources:[]},analysis('weber'),evidence('germany',study('§6.1 e §6.4: Alemanha, 62 anos de energia nuclear comercial; Japão, 54 reatores e déficit comercial de 2011 a 2012.')),evidence(study('§6.2 e §6.6: Itália (referendos de 1987 e 2011, legislação de 2026) e Bélgica (lei de 2003, adiamento e revogação).'))],
  public: [analysis('weber','polis'),analysis(c('weber','Verbete “Max Weber”, §6.1, “Domination and Legitimacy”; aplicação à prestação de contas feita pelo grupo.')),analysis('npt',study('§4.3, “Desinformação sobre energia nuclear”.')),{kind:'Método editorial da revista: conferir origem, período e contexto',sources:[]},analysis(study('§4.3, “Desinformação sobre energia nuclear”: pesquisa CGEE/MCTI de 2023 (Figuras 4 e 5) e leitura do grupo.')),evidence(study('§4.3: caso verificado pela Aos Fatos em 17 jun. 2025 (ampolas de urânio enriquecido em Resende).'))],
  balance: [analysis('iaea','waste',finance),analysis('santos','weber','wallerstein','critique'),analysis(finance,'polis'),analysis(study('§9, “Síntese da fundamentação teórica”, Tabela 6: teóricos e capítulos em que se aplicam.')),analysis(study('§8.4, conclusão do capítulo: benefícios nacionais e regiões de baixa infraestrutura.')),{kind:'Síntese e critérios de avaliação elaborados pelo grupo',sources:[]}],
  credits: [evidence(study('Documento acadêmico fornecido pelo grupo; sumário e capítulos 1–9.')),{kind:'Registro do processo de edição da revista',sources:[]},{kind:'Registro de revisão: dados oficiais, hipóteses e interpretações separados',sources:[]},{kind:'Registro editorial: versão do responsável de 17/10/2026 e créditos das imagens',sources:[]},{kind:'Registro editorial: como conferir as fontes da edição',sources:[]},{kind:'Registro editorial: licenças e créditos das imagens da edição',sources:[]}],
};
export const visualEvidence = {
  tariffs: {...evidence('tariff-study','tariff-compilation'),kind:'Dados reproduzidos da pesquisa'},
  matrix: evidence(c('epe','Destaques / Geração de Eletricidade; dados por fonte reproduzidos na pesquisa, §3.1, Tabela 1.'),study('§3.1, Tabela 1: participação por fonte em 2025.')),
  reactor: evidence(c('iaea','Seções “What is nuclear fission?” e “How does a nuclear power plant work?”; esquema simplificado pela edição.')),
  cycle: evidence('inb','waste'),
  payback: {...evidence(finance),kind:'Cálculo da edição a partir de'},
};
export const evidenceFor = (id,paragraph) => pageEvidence[id]?.[paragraph];
const escape = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function citationHTML(record, {className='',label} = {}) {
  if (!record) return '';
  return `<div class="claim-source ${className}" role="note"><strong>${escape(label || record.kind)}${record.sources.length ? ':' : '.'}</strong>${record.sources.map(({id,location})=>{
    const ref=references.find(item=>item.id===id);
    if (!ref) throw new Error(`Unknown source: ${id}`);
    const host=new URL(ref.url).hostname.replace(/^www\./,'');
    return `<span class="claim-source-item" data-source-id="${escape(id)}"><a href="${escape(ref.url)}" target="_blank" rel="noopener noreferrer">${escape(ref.short)} ${uiIcon("arrow_forward")}</a><span class="source-location">${escape(location || ref.location)}</span><small>${escape(host)}</small></span>`;
  }).join('')}</div>`;
}
function pageVisualRecords(page) {
  if((page.sourceId || page.id)==='who-pays') return [visualEvidence.tariffs,{kind:'Composição da conta',sources:[{id:'aneel-tariffs'}]}];
  return visualEvidence[page.visual] ? [visualEvidence[page.visual]] : [];
}
export function pageSourceRecords(page) {
  const records=[...paragraphRecords(page).filter(Boolean),...pageVisualRecords(page),...(page.enrichment?[{kind:'Leitura complementar',sources:page.enrichment.refs.map(id=>({id}))}]:[])];
  const ids=[...new Set([...(page.refs || []),...records.flatMap(record=>record.sources.map(source=>source.id))])];
  return ids.map(id=>{
    const ref=references.find(item=>item.id===id);
    const locations=[...new Set(records.flatMap(record=>record.sources.filter(source=>source.id===id).map(source=>source.location || ref.location)))];
    const specific=locations.filter(location=>!locations.some(other=>other.length>location.length && other.startsWith(location.replace(/[.;]\s*$/,''))));
    return {...ref,locations:specific.length?specific:[ref.location]};
  });
}
export function sourceButtonHTML(page,index) {
  const used=pageSourceRecords(page),count=used.length || references.length;
  const names=[...new Set(used.map(ref=>ref.short.split('; ')[0]))];
  const preview=used.length ? names.slice(0,3).join(', ')+(names.length>3?`, +${names.length-3}`:'') : 'Bibliografia e documentos da pesquisa';
  const title=used.length?'Ver fontes desta matéria':'Fontes da edição';
  return `<button type="button" class="source-link" data-action="sources" data-page="${index}" aria-label="${title}, ${page.folio ? 'página '+page.folio : page.readingLabel}, ${count} ${count===1?'referência':'referências'}" aria-haspopup="dialog"><span class="source-compact"><svg class="reader-icon" aria-hidden="true"><use href="#ui-menu_book"/></svg><span>${used.length?'Ver fontes':'Fontes da edição'}</span><span class="source-count">${count}</span><span aria-hidden="true">${uiIcon("arrow_forward")}</span></span><span class="source-card-icon" aria-hidden="true"><svg class="reader-icon"><use href="#ui-menu_book"/></svg></span><span class="source-card-copy"><strong>${title}</strong><small>${count} ${count===1?'referência':'referências'}, ${escape(preview)}</small></span><svg class="reader-icon source-card-arrow" aria-hidden="true"><use href="#ui-arrow_forward"/></svg></button>`;
}
export function sourceCardsHTML(page) {
  return `<div class="source-catalog">${pageSourceRecords(page).map(ref=>`<article class="source-document" data-document-source="${ref.id}"><header><span class="source-reference-number" aria-label="Referência ${references.findIndex(item=>item.id===ref.id)+1}">${references.findIndex(item=>item.id===ref.id)+1}</span><div><h3>${escape(ref.short)}</h3><small>${escape(new URL(ref.url).hostname.replace(/^www\./,''))}</small></div></header><p>${escape(ref.name)}</p><div class="source-document-locations"><strong>Onde encontrar a informação</strong><ul>${ref.locations.map(location=>`<li>${escape(location)}</li>`).join('')}</ul></div><a class="source-document-open" href="${escape(ref.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte original <svg class="reader-icon" aria-hidden="true"><use href="#ui-arrow_forward"/></svg></a></article>`).join('')}</div>`;
}
export function sourcePanelHTML(page,index) {
  const records=paragraphRecords(page);
  if (!records.length) return '';
  return `<section class="page-evidence"><h3>${page.folio ? String(page.folio).padStart(2,'0')+', ' : ''}${escape(page.title.replaceAll('\n',' '))}</h3>${records.map((record,i)=>record ? `<div class="evidence-entry"><h4>Trecho ${(page.sourceParagraphOffset || 0)+i+1}, ${escape((page.evidencePassages?.[i] || page.body[i] || page.title).split(/[.!?]/)[0])}</h4>${citationHTML(record)}</div>` : '').join('')}${pageVisualRecords(page).map(record=>citationHTML(record,{label:'Gráfico ou esquema'})).join('')}${page.balance ? citationHTML(analysis(...(page.refs || [])),{label:'Balanço: síntese do grupo com base em'}) : ''}</section>`;
}
function paragraphRecords(page) {
  if(page.evidence) return page.evidence;
  const source=pageEvidence[page.sourceId || page.id];
  return source ? (page.body || []).map((_,i)=>source[(page.sourceParagraphOffset || 0)+i]) : [];
}
