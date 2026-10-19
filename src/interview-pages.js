import { uiIcon } from './icons.js';
import { adolfoInterview as interview } from './interview.js';
import { citationHTML } from './citations.js';

const escape = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const interviewSource = location => citationHTML({kind:'Fonte da entrevista',sources:[{id:'interview',location}]});
const careerSources = [[{id:'aeita'}],[{id:'interview',location:'§1, “Trajetória profissional e atuação no ciclo nuclear”.'},{id:'adolfo-abdan'}],[{id:'adolfo-abdan'},{id:'adolfo-cnen'}]];
const analysisSources = [['wallerstein','inb'],['iaea','waste'],['santos','polis']];
const conclusion = 'A conversa reúne experiência industrial e propostas para ampliar a geração nuclear. A distância entre desenvolver uma tecnologia, produzi-la em escala e levar seus benefícios à população atravessa os temas desta edição.';
const sourcesIntroduction = 'Entrevista realizada pelo grupo com Adolfo Braid. As fontes abaixo complementam o perfil profissional e apresentam os projetos ilustrados nesta matéria.';
const sourcesNote = 'As imagens identificam os eventos e projetos retratados, com autoria e condições de uso em cada legenda. Os registros do IRD/ANSN, o protótipo da NASA e a representação digital do DOE/INL são exibidos integralmente, sem recorte ou filtro. Fontes consultadas em 17 e 18/10/2026.';

// The source dialog uses the same records as the visible interview composition.
// Keep the complete locators even when fixed pages hide their inline labels.
export function interviewRecords(page) {
  if (page.segment === 'profile') return [{kind:'Fonte da entrevista',sources:[{id:'interview',location:'§1: trajetória; §4: posição sobre a matriz; §6: microrreatores.'}]}];
  if (page.segment === 'career') return careerSources.map(sources=>({kind:'Fontes do perfil',sources}));
  if (Number.isInteger(page.segment)) return [
    {kind:'Fonte da entrevista',sources:[{id:'interview',location:interview.conversations[page.segment].record}]},
    {kind:'Análise do grupo, com base em',sources:analysisSources[page.segment].map(id=>({id}))},
  ];
  if (page.segment === 'questions') return interview.questions.map(item=>({kind:'Fonte',sources:item.sources || [{id:'interview',location:item.record}]}));
  return [];
}

export function createInterviewPages(photos) {
  const base = {kind:'interview',section:'ENTREVISTA DO GRUPO',sourceId:'interview',refs:['interview','adolfo-abdan','adolfo-cnen','aeita','santos','wallerstein','inb','iaea','waste'],action:{type:'sources',label:'Fontes da entrevista',x:.5,y:.925}};
  const page = (id, title, subtitle, body, segment, imageKey) => ({...base,id,title,subtitle,body,segment,imageKey,image:imageKey ? photos[imageKey] : undefined,evidence:interviewRecords({segment}),...(segment==='questions'?{evidencePassages:interview.questions.map(item=>item.question)}:{})});
  return [
    page('interview-profile',interview.name,interview.title,[interview.introduction],'profile','adolfoLicensing'),
    page('interview-career','UMA TRAJETÓRIA\nNO SETOR',interview.fullName,interview.career.map(item=>item.text),'career'),
    ...interview.conversations.map((item,index)=>page(['interview-uranium','interview-matrix','interview-territory'][index],item.topic,item.question,[item.answer,item.reading],index,['kilopower','adolfoAmazul','marvel'][index])),
    page('interview-questions','Mais perguntas\ne respostas','ENTREVISTA DO GRUPO',interview.questions.flatMap(item=>[item.question,item.answer]),'questions'),
    page('interview-sources','Da tecnologia ao\nacesso à energia','Fontes e créditos das imagens',[conclusion,sourcesIntroduction,sourcesNote],'sources'),
  ];
}

function imageHTML(page,index) {
  const art = page.image;
  if (!art) return '';
  return `<figure class="interview-page-photo"><button type="button" data-action="image" data-page="${index}" data-photo-key="${page.imageKey}" aria-label="Ampliar: ${escape(art.title)}"><img src="${art.src}" alt="${escape(art.caption)}" width="${art.width || 1599}" height="${art.height || 1066}" decoding="async" draggable="false"></button><figcaption>${escape(art.caption)}<br><a href="${art.url}" target="_blank" rel="noopener noreferrer">${escape(art.credit)}</a> · <a href="${art.licenseUrl}" target="_blank" rel="noopener noreferrer">${escape(art.license.split(' · ')[0])}</a></figcaption></figure>`;
}

export function interviewPageHTML(page,index,{linear=false,flow=false}={}) {
  let content;
  if (page.segment === 'profile') {
    content = `<div class="interview-page-prose"><p class="interview-eyebrow">PESQUISA DE CAMPO · ENTREVISTA DO GRUPO</p><p class="interview-eyebrow">QUEM CONVERSOU COM A GENTE</p><h3>${escape(interview.fullName)}</h3><p class="interview-role">${escape(interview.role)}</p><p>${escape(interview.introduction)}</p><a href="${interview.sources.abdan.url}" target="_blank" rel="noopener noreferrer">Perfil profissional e retrato na ABDAN ${uiIcon("arrow_forward")}</a>${interviewSource('§1: trajetória; §4: posição sobre a matriz; §6: microrreatores.')}</div>${imageHTML(page,index)}<button type="button" class="supplement-open" data-action="interview">Abrir entrevista completa ${uiIcon('arrow_forward')}</button>`;
  } else if (page.segment === 'career') {
    content = `<div class="interview-page-career">${interview.career.map((item,i)=>`<section><h4>${escape(item.title)}</h4><p>${escape(item.text)}</p>${citationHTML({kind:'Fontes do perfil',sources:careerSources[i]})}</section>`).join('')}</div>`;
  } else if (Number.isInteger(page.segment)) {
    const item = interview.conversations[page.segment];
    const imageHeading = page.segment === 0 ? '<p class="interview-eyebrow">TECNOLOGIA EM TESTE</p><h3>Um protótipo por dentro.</h3>' : page.segment === 2 ? '<p class="interview-eyebrow">MICRORREATORES</p><h3>Uma escala menor, novos projetos.</h3>' : '';
    content = `<div class="interview-page-prose"><h3 class="interview-section-title">Perguntas e respostas.</h3><p>${escape(item.answer)}</p>${interviewSource(item.record)}</div><div class="interview-page-image">${imageHeading}${imageHTML(page,index)}</div><aside class="interview-page-analysis"><h3>Como isso entra na nossa pesquisa</h3><p>${escape(item.reading)}</p>${citationHTML({kind:'Análise do grupo, com base em',sources:analysisSources[page.segment].map(id=>({id}))})}<button type="button" data-jump-id="${['uranium','reactor','unequal'][page.segment]}">Ler: ${escape(item.chapterLabel)}</button></aside>`;
  } else if (page.segment === 'questions') {
    content = `<dl class="interview-page-questions">${interview.questions.map(item=>`<div><dt>${escape(item.question)}</dt><dd><p>${escape(item.answer)}</p>${citationHTML({kind:'Fonte',sources:item.sources || [{id:'interview',location:item.record}]})}</dd></div>`).join('')}</dl>`;
  } else {
    content = `<div class="interview-page-prose"><p>${escape(conclusion)}</p><button type="button" data-action="popup" data-page-id="public">Quatro perguntas antes de compartilhar</button></div><section class="interview-page-sources"><h3>Fontes e créditos das imagens</h3><p>${escape(sourcesIntroduction)}</p><ul>${Object.values(interview.sources).map(source=>`<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${escape(source.label)}</a></li>`).join('')}</ul><p>${escape(sourcesNote)}</p></section>`;
  }
  return `<article class="magazine-page page-interview${linear?' linear-page':''}${flow?' flow-interview':''}" data-page-index="${index}" data-page-id="${page.id}" aria-label="${escape(page.readingLabel)}: ${escape(page.title.replaceAll('\n',' '))}"><header class="page-top"><span>ENTREVISTA DO GRUPO</span><span>${escape(page.section)}</span></header><div class="page-main"><h2>${escape(page.title).replaceAll('\n','<br>')}</h2><p class="page-subtitle">${escape(page.subtitle)}</p><div class="interview-page-content">${content}</div></div><div class="page-tail"><footer class="page-bottom"><button type="button" class="source-link" data-action="sources" data-page="${index}">Fontes da entrevista</button><span>${page.folio ? String(page.folio).padStart(2,'0') : page.readingLabel}</span></footer></div></article>`;
}
