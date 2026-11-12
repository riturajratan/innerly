import {categoryColors} from './response-graphs.mjs?v=report-3';
import {dimensionProfile} from './innerly-v1-insights.mjs?v=dimensions-1';
import {workbookChoices,workbookQuestions,workbookDimensions} from './innerly-v1-model.mjs?v=mh-14';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=(l,en,hi)=>l==='hi'?hi:en;
export const dimensionTitles=[
 ['Understanding yourself','खुद को समझना'],['How your thoughts move','आपकी सोच के तरीके'],
 ['Your emotional responses','आपकी भावनात्मक प्रतिक्रियाएँ'],['How you make decisions','आपके निर्णय लेने के तरीके'],
 ['You & your relationships','आप और आपके रिश्ते'],['Finding your way forward','मुश्किलों में आगे बढ़ना']
];
const directions=Array.from({length:6},()=>['Left to right','बाएँ से दाएँ']);
const palette=categoryColors;

export function dimensionObservation(answers,id,l='en'){
 const p=dimensionProfile(answers,id),labels=workbookChoices(l),maximum=Math.max(...p.counts);
 if(!p.answered)return say(l,'No responses recorded in this area.','इस पहलू में कोई जवाब दर्ज नहीं है।');
 const modes=p.counts.flatMap((n,i)=>n===maximum?[i]:[]);
 if(modes.length===1)return say(l,`“${labels[modes[0]]}” appears in ${maximum} of ${p.answered} answers.`,`“${labels[modes[0]]}” ${p.answered} में से ${maximum} जवाबों में है।`);
 const selected=p.counts.flatMap((n,i)=>n?[i]:[]);
 return say(l,`Your responses range from ${labels[selected[0]]} to ${labels[selected.at(-1)]}.`,`आपके जवाब “${labels[selected[0]]}” से “${labels[selected.at(-1)]}” तक हैं।`);
}

export function dimensionGraphic(answers,id,l='en',decorative=false,focusedQuestion=-1,keyboard=false){
 const p=dimensionProfile(answers,id),color=palette[p.index],labels=workbookChoices(l);
 const title=p.rows.map(r=>`${r.id}: ${r.value===null?say(l,'Not answered','जवाब नहीं दिया'):labels[r.value]}`).join('; ');
 const missing=(x,y)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#68798b" font-size="17">—</text>`;
 const mark=(row,content)=>{
  const i=p.items.indexOf(row.index);
  const boxes=Array.from({length:6},()=>[0,3+i*25,300,25]);
  const box=keyboard?boxes[p.index]:null;
  const hit=box?`<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="transparent" aria-hidden="true"/>`:'';
  return `<g class="ig-question${row.index===focusedQuestion?' is-focused':''}" data-graphic-question="${row.index}" ${keyboard?`role="button" tabindex="0" aria-label="${esc(`${row.id}: ${row.value===null?say(l,'Not answered','जवाब नहीं दिया'):labels[row.value]}`)}"`:''}>${hit}${content}</g>`;
 };
 const graphic=p.rows.map((r,i)=>{
  const y=16+i*25;
  return mark(r,`<text x="8" y="${y+5}" class="ig-id">${r.id}</text><path d="M65 ${y}H281" class="ig-track"/>${[0,1,2,3,4].map(v=>`<circle cx="${65+v*54}" cy="${y}" r="${r.value===v?5.5:2.5}" fill="${r.value===v?color:'#c9d3e2'}"/>`).join('')}${r.value===null?missing(173,y+5):''}`);
 }).join('');
 return `<svg class="wb-infographic" viewBox="0 -6 310 176" ${decorative?'aria-hidden="true"':`role="${keyboard?'group':'img'}" aria-label="${esc(title)}"`} focusable="false">${graphic}</svg>`;
}

export function dimensionInfographicCard(answers,id,l='en',{interactive=false,selected='',preview=false,question=0}={}){
 const p=dimensionProfile(answers,id),title=dimensionTitles[p.index][l==='hi'?1:0],tag=interactive?'button':'article';
 return `<${tag} class="wb-story-card${preview?' wb-free-card':''}" ${interactive?`data-workbook-dimension="${p.id}" data-infographic aria-label="${esc(`${title}. ${dimensionObservation(answers,id,l)} ${say(l,'Explore your answers','अपने जवाब देखें')}`)}" aria-controls="mh-topic-reading" aria-pressed="${selected===p.id}"`:''}><span class="wb-story-number">${String(p.index+1).padStart(2,'0')}</span>${dimensionGraphic(answers,id,l,false,interactive&&selected===id?question:-1)}<span class="wb-story-scale">${esc(directions[p.index][l==='hi'?1:0])}: ${esc(workbookChoices(l)[0])} → ${esc(workbookChoices(l)[4])}</span><span class="wb-story-title">${esc(title)}</span><span class="wb-story-observation">${esc(dimensionObservation(answers,id,l))}</span>${interactive?`<span class="wb-story-explore">${say(l,'Explore your answers','अपने जवाब देखें')} <span aria-hidden="true">↗</span></span>`:''}${preview?`<details class="wb-free-answer-detail"><summary>${say(l,'Explore these 6 answers','इन 6 जवाबों को देखें')}</summary><ol>${p.rows.map(r=>`<li><p><b>${r.id}</b> ${esc(workbookQuestions[r.index].texts[l]||workbookQuestions[r.index].texts.en)}</p><strong>${esc(r.value===null?say(l,'Not answered','जवाब नहीं दिया'):workbookChoices(l)[r.value])}</strong></li>`).join('')}</ol></details>`:''}</${tag}>`;
}

export function dimensionInfographicGrid(answers,l='en',selected='dimension-1',interactive=true,question=0){
 return `${interactive?`<p class="wb-graph-hint" id="wb-graph-hint">${say(l,'Hover to preview a question. Select a mark or card to explore your answer.','सवाल देखने के लिए निशान पर hover करें। जवाब समझने के लिए निशान या card चुनें।')}</p>`:''}<div class="wb-story-grid">${workbookDimensions.map(d=>dimensionInfographicCard(answers,d.id,l,{interactive,selected,question})).join('')}</div>${interactive?'<div id="wb-graphic-tooltip" class="wb-graphic-tooltip" role="tooltip" hidden></div>':''}`;
}
