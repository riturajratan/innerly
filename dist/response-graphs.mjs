import {dimensionProfile,itemReflections} from './innerly-v1-insights.mjs?v=dimensions-1';
import {workbookQuestions,workbookChoices} from './innerly-v1-model.mjs?v=mh-14';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=(l,en,hi)=>l==='hi'?hi:en;
export const categoryColors=['#456fe8','#8060c9','#168b89','#b87814','#b4558a','#3d7886'];

// A marker is an ordinal frequency, never a score or a category total.
export function responsePositionGraph(answers,id,l='en',{selected,preview=false,detailId='wb-question-detail'}={}){
 const p=dimensionProfile(answers,id),choices=workbookChoices(l);
 selected=p.items.includes(selected)?selected:p.items[0];
 return `<div class="rp-plot" style="--category:${categoryColors[p.index]}"><div class="rp-axis" aria-hidden="true"><span></span><div>${choices.map(c=>`<span>${esc(c)}</span>`).join('')}</div></div><div role="group" aria-label="${say(l,'Select a question to explore your response','अपना जवाब समझने के लिए सवाल चुनें')}">${p.rows.map(r=>`<button type="button" class="rp-row" data-response-question="${r.index}" data-response-dimension="${p.id}" ${preview?'data-preview-response':''} aria-pressed="${r.index===selected}" aria-controls="${detailId}" aria-label="${esc(`${r.id}: ${workbookQuestions[r.index].texts[l]||workbookQuestions[r.index].texts.en} — ${r.value===null?say(l,'Not answered','जवाब नहीं दिया'):choices[r.value]}`)}"><span class="rp-row-label"><small>${r.id}</small><span>${esc(itemReflections[r.index][l==='hi'?1:0])}</span></span><span class="rp-positions" aria-hidden="true">${choices.map((_,v)=>`<i class="${r.value===v?'chosen':''}">${r.value===v?'●':''}</i>`).join('')}</span><span class="rp-row-value">${esc(r.value===null?say(l,'Not answered','जवाब नहीं दिया'):choices[r.value])}</span></button>`).join('')}</div></div>`;
}

export function responseDistribution(answers,id,l='en'){
 const p=dimensionProfile(answers,id),choices=workbookChoices(l);
 return `<div class="rp-distribution" style="--category:${categoryColors[p.index]}"><h4>${say(l,'Your response mix','आपके जवाबों की झलक')}</h4><p>${say(l,'Number of answers · out of 6 statements','जवाबों की संख्या · कुल 6 statements')}</p>${choices.map((c,v)=>`<div class="rp-count-row"><span>${esc(c)}</span><span class="rp-bar" aria-hidden="true"><i style="width:${p.counts[v]/6*100}%"></i></span><strong>${p.counts[v]}<small> / 6</small></strong></div>`).join('')}${p.skipped?`<p>${p.skipped} ${say(l,'not answered; shown separately','सवालों के जवाब नहीं दिए; अलग गिने गए हैं')}</p>`:''}</div>`;
}

export function previewResponseDetail(answers,index,l='en'){
 const p=dimensionProfile(answers,`dimension-${Math.floor(index/6)+1}`),r=p.rows.find(row=>row.index===index);
 if(!r)return '';
 return `<span class="rp-detail-kicker">${r.id} · ${say(l,'YOUR RESPONSE','आपका जवाब')}</span><h3>${esc(workbookQuestions[index].texts[l]||workbookQuestions[index].texts.en)}</h3><span class="wb-answer-pill">${esc(r.value===null?say(l,'Not answered','जवाब नहीं दिया'):workbookChoices(l)[r.value])}</span>${r.value===null?'':`<p class="rp-reflect-label">${say(l,'A moment to reflect','थोड़ा सोचने के लिए')}</p><p>${esc(itemReflections[index][l==='hi'?3:2])}</p>`}`;
}
