import {dimensionProfile} from './innerly-v1-insights.mjs?v=dimensions-1';
import {workbookChoices,workbookQuestions,workbookDimensions} from './innerly-v1-model.mjs?v=mh-14';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=(l,en,hi)=>l==='hi'?hi:en;
export const dimensionTitles=[
 ['Understanding yourself','खुद को समझना'],['How your thoughts move','आपकी सोच के तरीके'],
 ['Your emotional responses','आपकी भावनात्मक प्रतिक्रियाएँ'],['How you make decisions','आपके निर्णय लेने के तरीके'],
 ['You & your relationships','आप और आपके रिश्ते'],['Finding your way forward','मुश्किलों में आगे बढ़ना']
];
const directions=[['Left to right','बाएँ से दाएँ'],['Bottom to top','नीचे से ऊपर'],['Inner to outer','अंदर से बाहर'],['Left to right','बाएँ से दाएँ'],['Left to right','बाएँ से दाएँ'],['Clockwise','घड़ी की दिशा में']];
const palette=['#5579b6','#8b70af','#56a0ad','#d4a940','#b26d99','#527e8a'];

export function dimensionObservation(answers,id,l='en'){
 const p=dimensionProfile(answers,id),labels=workbookChoices(l),maximum=Math.max(...p.counts);
 if(!p.answered)return say(l,'No responses recorded in this area.','इस पहलू में कोई जवाब दर्ज नहीं है।');
 const modes=p.counts.flatMap((n,i)=>n===maximum?[i]:[]);
 if(modes.length===1)return say(l,`“${labels[modes[0]]}” appears in ${maximum} of ${p.answered} answers.`,`“${labels[modes[0]]}” ${p.answered} में से ${maximum} जवाबों में है।`);
 const selected=p.counts.flatMap((n,i)=>n?[i]:[]);
 return say(l,`Your responses range from ${labels[selected[0]]} to ${labels[selected.at(-1)]}.`,`आपके जवाब “${labels[selected[0]]}” से “${labels[selected.at(-1)]}” तक हैं।`);
}

export function dimensionGraphic(answers,id,l='en',decorative=false,focusedQuestion=-1){
 const p=dimensionProfile(answers,id),color=palette[p.index],labels=workbookChoices(l);
 const title=p.rows.map(r=>`${r.id}: ${r.value===null?say(l,'Not answered','जवाब नहीं दिया'):labels[r.value]}`).join('; ');
 const missing=(x,y)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#68798b" font-size="17">—</text>`;
 const mark=(row,content)=>`<g class="ig-question${row.index===focusedQuestion?' is-focused':''}" data-graphic-question="${row.index}">${content}</g>`;
 let graphic='';
 if(p.index===0){
  graphic=p.rows.map((r,i)=>{const y=16+i*25,end=r.value===null?null:65+r.value*48;return mark(r,`<text x="8" y="${y+5}" class="ig-id">${r.id}</text><path d="M65 ${y}H257" class="ig-track"/>${end===null?missing(160,y+5):`<path d="M65 ${y}H${end}" stroke="${color}" stroke-width="8" opacity=".23"/><circle cx="${end}" cy="${y}" r="5" fill="${color}"/>`}`);}).join('');
 }else if(p.index===1){
  graphic=`${[0,1,2,3,4].map(v=>`<path d="M15 ${131-v*25}H285" class="ig-grid"/>`).join('')}${p.rows.map((r,i)=>{const x=22+i*46,h=r.value===null?0:r.value*25;return mark(r,`${r.value===null?missing(x+13,104):`<rect x="${x}" y="${131-h}" width="26" height="${Math.max(h,2)}" rx="3" fill="${i%2?'#ccbade':color}"/><circle cx="${x+13}" cy="${131-h}" r="4" fill="${color}"/>`}<text x="${x+13}" y="153" text-anchor="middle" class="ig-id">${r.id}</text>`);}).join('')}`;
 }else if(p.index===2){
  const position=(i,r)=>{const a=(-90+i*60)*Math.PI/180;return [150+Math.cos(a)*r,79+Math.sin(a)*r];};
  graphic=`<circle cx="150" cy="79" r="30" fill="#edf4f5"/><text x="150" y="77" text-anchor="middle" fill="#365b65" font-size="18" font-weight="600">${p.answered}</text><text x="150" y="92" text-anchor="middle" class="ig-id">${say(l,'answers','जवाब')}</text>${p.rows.map((r,i)=>{const [x,y]=position(i,61),[tx,ty]=position(i,79);return mark(r,`<path d="M${position(i,36).join(' ')}L${x} ${y}" class="ig-track"/>${r.value===null?missing(x,y+5):[0,1,2,3,4].map(v=>{const [dx,dy]=position(i,39+v*5.5);return `<circle cx="${dx}" cy="${dy}" r="${r.value===v?4.5:2}" fill="${r.value===v?color:'#d2dfe3'}"/>`;}).join('')}<text x="${tx}" y="${ty+4}" text-anchor="middle" class="ig-id">${r.id}</text>`);}).join('')}`;
 }else if(p.index===3){
  graphic=p.rows.map((r,i)=>{const x=9+(i%3)*98,y=6+Math.floor(i/3)*80;return mark(r,`<rect x="${x}" y="${y}" width="88" height="66" rx="7" fill="#fcf9ed" stroke="#e9dfbb"/><text x="${x+12}" y="${y+21}" class="ig-id">${r.id}</text>${[0,1,2,3,4].map(v=>`<rect x="${x+12+v*13}" y="${y+37}" width="9" height="15" rx="2" fill="${r.value===v?color:'#e7e2d3'}"/>`).join('')}`);}).join('');
 }else if(p.index===4){
  graphic=p.rows.map((r,i)=>{const x=9+(i%3)*98,y=8+Math.floor(i/3)*78;return mark(r,`<path d="M${x+7} ${y}H${x+79}Q${x+87} ${y} ${x+87} ${y+8}V${y+48}Q${x+87} ${y+56} ${x+79} ${y+56}H${x+24}L${x+13} ${y+65}V${y+56}H${x+7}Q${x} ${y+56} ${x} ${y+48}V${y+8}Q${x} ${y} ${x+7} ${y}" fill="${i%2?'#f7f0f7':'#f1edf8'}" stroke="#d8cce0"/><text x="${x+12}" y="${y+20}" class="ig-id">${r.id}</text>${[0,1,2,3,4].map(v=>`<circle cx="${x+15+v*14}" cy="${y+39}" r="${r.value===v?4.5:2.5}" fill="${r.value===v?color:'#d9ccdc'}"/>`).join('')}`);}).join('');
 }else{
  graphic=p.rows.map((r,i)=>{const x=52+(i%3)*98,y=33+Math.floor(i/3)*83;return mark(r,`${[0,1,2,3,4].map(v=>{const a=(-90+v*72)*Math.PI/180,b=a+53*Math.PI/180;return `<path d="M${x+23*Math.cos(a)} ${y+23*Math.sin(a)}A23 23 0 0 1 ${x+23*Math.cos(b)} ${y+23*Math.sin(b)}" fill="none" stroke="${r.value===v?color:'#dce5e8'}" stroke-width="6" stroke-linecap="round"/>`;}).join('')}<text x="${x}" y="${y+5}" text-anchor="middle" class="ig-id">${r.id}</text>`);}).join('');
 }
 return `<svg class="wb-infographic" viewBox="0 -6 310 176" ${decorative?'aria-hidden="true"':`role="img" aria-label="${esc(title)}"`} focusable="false">${graphic}</svg>`;
}

export function dimensionInfographicCard(answers,id,l='en',{interactive=false,selected='',preview=false,question=0}={}){
 const p=dimensionProfile(answers,id),title=dimensionTitles[p.index][l==='hi'?1:0],tag=interactive?'button':'article';
 return `<${tag} class="wb-story-card${preview?' wb-free-card':''}" ${interactive?`data-workbook-dimension="${p.id}" data-infographic aria-label="${esc(`${title}. ${dimensionObservation(answers,id,l)} ${say(l,'Explore your answers','अपने जवाब देखें')}`)}" aria-controls="mh-topic-reading" aria-pressed="${selected===p.id}"`:''}><span class="wb-story-number">${String(p.index+1).padStart(2,'0')}</span>${dimensionGraphic(answers,id,l,false,interactive&&selected===id?question:-1)}<span class="wb-story-scale">${esc(directions[p.index][l==='hi'?1:0])}: ${esc(workbookChoices(l)[0])} → ${esc(workbookChoices(l)[4])}</span><span class="wb-story-title">${esc(title)}</span><span class="wb-story-observation">${esc(dimensionObservation(answers,id,l))}</span>${interactive?`<span class="wb-story-explore">${say(l,'Explore your answers','अपने जवाब देखें')} <span aria-hidden="true">↗</span></span>`:''}${preview?`<details class="wb-free-answer-detail"><summary>${say(l,'Explore these 6 answers','इन 6 जवाबों को देखें')}</summary><ol>${p.rows.map(r=>`<li><p><b>${r.id}</b> ${esc(workbookQuestions[r.index].texts[l]||workbookQuestions[r.index].texts.en)}</p><strong>${esc(r.value===null?say(l,'Not answered','जवाब नहीं दिया'):workbookChoices(l)[r.value])}</strong></li>`).join('')}</ol></details>`:''}</${tag}>`;
}

export function dimensionInfographicGrid(answers,l='en',selected='dimension-1',interactive=true,question=0){
 return `${interactive?`<p class="wb-graph-hint" id="wb-graph-hint">${say(l,'Hover to preview a question. Select a mark or card to explore your answer.','सवाल देखने के लिए निशान पर hover करें। जवाब समझने के लिए निशान या card चुनें।')}</p>`:''}<div class="wb-story-grid">${workbookDimensions.map(d=>dimensionInfographicCard(answers,d.id,l,{interactive,selected,question})).join('')}</div>${interactive?'<div id="wb-graphic-tooltip" class="wb-graphic-tooltip" role="tooltip" hidden></div>':''}`;
}
