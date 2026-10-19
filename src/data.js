import { citationHTML } from './citations.js';
import { uiIcon } from './icons.js';
// Pesquisa ABNT fornecida, p. 24, §5.1, Tabela 2 (compilação Meutudo, 2026).
export const regionalTariffs = [
  {region:'Sudeste',min:.578,max:1.484},
  {region:'Nordeste',min:.588,max:1.044},
  {region:'Sul',min:.413,max:1.033},
  {region:'Norte',min:.641,max:.938},
  {region:'Centro-Oeste',min:.678,max:.878},
];
export const matrixData = [
  { name: 'Hidrelétrica', value: 51.7, renewable: true },
  { name: 'Eólica', value: 15, renewable: true },
  { name: 'Solar', value: 11.4, renewable: true },
  { name: 'Biomassa', value: 8.5, renewable: true },
  { name: 'Gás natural', value: 7.6, renewable: false },
  { name: 'Nuclear', value: 2, renewable: false },
  { name: 'Carvão mineral', value: 1.4, renewable: false },
  { name: 'Petróleo e derivados', value: .9, renewable: false },
  { name: 'Outras', value: 1.5, renewable: null },
];
export const zoomButton = title => `<button type="button" class="chart-zoom" data-action="zoom" aria-label="Ampliar gráfico: ${title}" title="Ampliar gráfico">${uiIcon('open_in_full')}</button>`;
const decimal = (number, digits = 1) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(number);
export function chartHTML(filter = 'all') {
  const rows = matrixData.filter(row => filter === 'all' || (filter === 'renewable' ? row.renewable : row.name === 'Nuclear'));
  return `<figure class="matrix-chart" data-zoom-target data-zoom-title="Matriz elétrica brasileira, 2025"><figcaption><span>PARTICIPAÇÃO NA GERAÇÃO NACIONAL · %</span>${zoomButton('matriz elétrica brasileira, 2025')}</figcaption><div class="chart-rows">${rows.map(row => `<div class="chart-row${row.name === 'Nuclear' ? ' nuclear-row' : ''}" tabindex="0"><span>${row.name}</span><div class="bar-track"><i style="width:${row.value / 51.7 * 100}%"></i></div><b>${decimal(row.value)}%</b></div>`).join('')}</div><p class="visual-caption">EPE · Anuário 2026 · ano-base 2025. A escala é mantida ao filtrar; “outras” reúne fontes de classificação mista. Arredondamentos conforme a pesquisa.</p></figure>`;
}
export const fuelSteps = [
  ['Mineração e beneficiamento', 'A rocha é extraída e processada para obter o concentrado de urânio. Caetité, na Bahia, integra essa etapa da cadeia brasileira.'],
  ['Conversão', 'O concentrado é convertido em uma forma química adequada ao enriquecimento. A cadeia brasileira pode contratar esse serviço no exterior.'],
  ['Enriquecimento', 'A proporção do isótopo urânio-235 é aumentada. A INB utiliza ultracentrífugas em Resende e expande a capacidade por etapas.'],
  ['Fabricação', 'O material é convertido em pó e pastilhas e montado em conjuntos de combustível, sob controle de qualidade.'],
  ['Uso e gestão posterior', 'Depois de utilizado no reator, o combustível requer resfriamento, blindagem, controle e uma estratégia de armazenamento e destinação.'],
];
export const reactorSteps = [
  ['Fissão controlada', 'A divisão de núcleos libera energia. Barras de controle e outros sistemas mantêm a reação nas condições previstas de operação.'],
  ['Transferência de calor', 'Nos reatores de água pressurizada, o circuito primário transfere calor ao gerador de vapor, mantendo separados os circuitos.'],
  ['Vapor e turbina', 'O vapor do circuito secundário movimenta a turbina, que aciona o gerador.'],
  ['Eletricidade e rede', 'O gerador transforma energia mecânica em elétrica. Transformadores e linhas conectam a produção ao sistema.'],
  ['Resfriamento e controle', 'O vapor é condensado e o ciclo continua. Remover calor, controlar materiais e manter barreiras são funções permanentes da instalação.'],
];
/** Metadados de cada etapa de `fuelSteps` (mesma ordem): local, operador e situação, sempre conforme a página "uranium" e as fontes INB. */
export const fuelStages = [
  { icon: 'landscape', place: 'Caetité (BA)', operator: 'INB', status: 'br', state: 'No Brasil', map: 'caetite', extra: 'Produto: o concentrado de urânio, conhecido como yellow cake, um pó amarelado rico em óxido de urânio (U3O8). Ainda não é combustível.', source: ['inb'] },
  { icon: 'science', place: 'Exterior', operator: 'Serviço contratado', status: 'abroad', state: 'No exterior', map: 'exterior', extra: 'A conversão e parte do processamento podem envolver serviços no exterior. A edição não indica em quais países.', source: [['inb', 'Etapa “Conversão”: serviço contratado no exterior.']] },
  { icon: 'cyclone', place: 'Resende (RJ)', operator: 'INB', status: 'br', state: 'No Brasil, em etapas', map: 'resende', extra: 'Dominar a tecnologia não significa possuir, no mesmo momento, capacidade industrial para atender a toda a demanda.', source: ['inb', 'enrichment'] },
  { icon: 'factory', place: 'Resende (RJ)', operator: 'INB', status: 'br', state: 'No Brasil', map: 'resende', source: ['inb'] },
  { icon: 'bolt', place: 'Angra dos Reis (RJ)', operator: 'Eletronuclear · Angra 1 e 2', status: 'br', state: 'No Brasil', map: 'angra', source: ['inb', 'waste'] },
];
export const fuelProject = { name: 'Santa Quitéria (Itataia, CE)', place: 'Santa Quitéria (CE)', operator: 'Projeto Santa Quitéria · INB', state: 'Projeto, não combustível disponível', text: 'O projeto, associado ao depósito de Itataia, no Ceará, aparece como possibilidade de ampliar a oferta. Reserva geológica, licenciamento e produção efetiva são situações distintas: um projeto não é combustível já disponível.' };
const stageIcon = uiIcon;
/** Conteúdo de um cartão de etapa, compartilhado pela versão estática e pelo explorador. */
export function fuelStageInner(i) {
  const stage = fuelStages[i];
  return `<span class="fuel-top"><span class="fuel-num">${i + 1}</span><span class="fuel-icon">${stageIcon(stage.icon)}</span></span><strong>${fuelSteps[i][0]}</strong><span class="fuel-place">${stageIcon(stage.status === 'abroad' ? 'public' : 'location_on')}<span>${stage.place}</span></span><span class="fuel-op">${stage.operator}</span><span class="fuel-state" data-status="${stage.status}">${stage.state}</span>`;
}
/** Infográfico estático (textura, impressão, leitura em página). A versão interativa vive em explorers.js. */
export function cycleHTML() {
  return `<figure class="fuel-infographic" aria-label="Ciclo do combustível nuclear no Brasil, em cinco etapas"><ol class="fuel-flow">${fuelSteps.map((_, i) => `<li class="fuel-stage fuel-card" data-status="${fuelStages[i].status}">${fuelStageInner(i)}</li>`).join('')}</ol><div class="fuel-notes"><p class="fuel-cake"><i class="cake-dot" aria-hidden="true"></i><span><strong>Yellow cake</strong> · etapa 1 → 2. Pó amarelado, rico em U3O8; ainda não é combustível.</span></p><p class="fuel-project"><strong>Santa Quitéria (Itataia, CE)</strong> · projeto que pode ampliar a oferta; reserva não é produção nem combustível.</p></div></figure>`;
}
export const scenarios = [
  { name: 'Conservador', capacity: 75, tariff: 778.86, operating: 35 },
  { name: 'Base', capacity: 85, tariff: 791.81, operating: 30 },
  { name: 'Otimista', capacity: 90, tariff: 817.27, operating: 25 },
];
export function calculateScenario({ capacity = 85, tariff = 791.81, operating = 30, investment = 23.9 } = {}) {
  if (![capacity, tariff, operating, investment].every(Number.isFinite) || capacity <= 0 || capacity > 100 || tariff <= 0 || operating < 0 || operating >= 100 || investment <= 0) throw new RangeError('Premissas inválidas');
  const generation = 1405 * 8760 * capacity / 100;
  const revenue = generation * tariff / 1e9;
  const cash = revenue * (1 - operating / 100);
  return { generation, revenue, cash, years: investment / cash };
}
export function scenarioTable() {
  return `<div class="scenario-table"><table><caption>PAYBACK SIMPLES · ANOS DE OPERAÇÃO</caption><thead><tr><th>Cenário</th><th>Restante<br>R$ 23,9 bi</th><th>Total<br>R$ 35,9 bi</th></tr></thead><tbody>${scenarios.map(s => `<tr><th>${s.name}</th><td>${decimal(calculateScenario(s).years)}</td><td>${decimal(calculateScenario({ ...s, investment: 35.9 }).years)}</td></tr>`).join('')}</tbody></table><p class="visual-caption">Exercício do grupo, hipóteses de 2025. Valores em reais nominais; sem juros, impostos e cronograma completo. Não é orçamento vigente nem previsão de retorno.</p></div>`;
}
export const timeline = [
  { country: 'Alemanha', year: '2023', title: 'Encerramento dos últimos reatores', text: 'As três últimas centrais em operação encerraram a produção em 15 de abril de 2023, após um processo gradual de saída.', ref: 'germany' },
  { country: 'Itália', year: '1987 / 2011', title: 'Referendos e abandono', text: 'A trajetória de encerramento posterior ao referendo de 1987 foi seguida, em 2011, por nova rejeição à retomada. São momentos distintos da política italiana.', ref: 'italy' },
  { country: 'Lituânia', year: '2009', title: 'Fechamento de Ignalina', text: 'O último reator de Ignalina foi desligado em 31 de dezembro de 2009, em um processo associado aos compromissos de adesão à União Europeia.', ref: 'lithuania' },
  { country: 'Japão', year: '2011 / 2015', title: 'Suspensão e retomada', text: 'Após Fukushima, o parque passou por paralisações e novas exigências regulatórias. Em 2015, Sendai marcou a retomada sob os novos requisitos.', ref: 'japan' },
  { country: 'Bélgica', year: '2022 / 2023', title: 'Extensão negociada', text: 'O governo reviu o calendário de saída e negociou com a operadora a extensão de Doel 4 e Tihange 3 por dez anos. Não equivale ao abandono integral da fonte.', ref: 'belgium' },
  { country: 'Coreia do Sul', year: '2017 / 2022', title: 'Mudança de orientação', text: 'A política de redução gradual defendida em 2017 deu lugar à retomada da aposta nuclear pelo governo iniciado em 2022, conforme o levantamento do MRE de 2024.', ref: 'korea' },
];
export function timelineHTML(compact = false) {
  return `<div class="timeline${compact ? ' compact-timeline' : ''}">${timeline.map((event, i) => `<${compact ? 'div' : 'button'} ${compact ? '' : `type="button" data-event="${i}" aria-pressed="${i === 0}"`} class="timeline-item"><span>${event.year}</span><strong>${event.country}</strong><small>${event.title}</small>${compact ? citationHTML({kind:'Fonte do recorte histórico',sources:[{id:event.ref}]},{className:'inline-citation'}) : ''}</${compact ? 'div' : 'button'}>`).join('')}</div>`;
}
export { decimal };
