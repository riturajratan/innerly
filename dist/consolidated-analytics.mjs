import {workbookChoices} from './innerly-v1-model.mjs?v=mh-14';

// Counts only: preserve the original frequency and the existing interpretation
// for each statement. No averaging, reverse-scoring or population inference.
export function consolidatedAnalytics(snapshot){
 const frequencies=Array(5).fill(0);
 for(const item of snapshot.items)frequencies[item.value]++;
 const rows=snapshot.areas.map((area,index)=>({index,items:area.items,counts:Object.fromEntries(['support','focus','varies'].map(key=>[key,area.items.filter(item=>item.category===key).length]))}));
 const max=Math.max(...frequencies);
 return {frequencies,rows,total:snapshot.items.length,mostCommon:frequencies.flatMap((n,i)=>n===max?[i]:[]),mixedAreas:rows.filter(row=>Object.values(row.counts).filter(Boolean).length>1).length};
}

export function consolidatedAnalyticsMarkup(snapshot,{language='en',areas,categories,icon,escapeHTML:esc}){
 const t=(en,hi)=>language==='hi'?hi:en,data=consolidatedAnalytics(snapshot),choices=workbookChoices(language);
 const common=data.mostCommon.map(i=>choices[i]).join(t(' & ',' और '));
 const frequencyChart=`<div class="cs-frequency-chart" role="img" aria-label="${esc(t('Answer frequency. ','जवाब की आवृत्ति। ')+choices.map((label,i)=>`${label}: ${data.frequencies[i]} / 36`).join('; '))}"><div class="cs-frequency-axis" aria-hidden="true"><span>0</span><span>36 ${t('answers','जवाब')}</span></div>${data.frequencies.map((count,i)=>`<div class="cs-frequency-row"><span>${esc(choices[i])}</span><div class="cs-frequency-track"><i class="${count===Math.max(...data.frequencies)?'most-selected':''}" style="width:${count/36*100}%"></i></div><strong>${count}</strong></div>`).join('')}</div>`;
 return `<section class="cs-analytics" id="cs-analytics" aria-label="${t('Analysis of all 36 answers','सभी 36 जवाबों का विश्लेषण')}">
 <div class="cs-answer-map"><div class="cs-chart-heading"><div><p class="small-label">${t('EVERY ANSWER, IN VIEW','हर जवाब, एक नज़र में')}</p><h3>${t('Your 36-answer map','आपके 36 जवाबों का नक्शा')}</h3></div><span class="cs-chart-total">36</span></div><div class="cs-map-legend">${['support','focus','varies'].map(key=>`<span><i class="${key}"></i>${esc(categories[key].short)}</span>`).join('')}</div>
 <div class="cs-map-rows">${data.rows.map(row=>`<div class="cs-map-row"><button class="cs-map-area" data-area-jump="${row.index}"><span>${icon(areas[row.index].icon)}${esc(areas[row.index].name)}</span>${icon('arrow')}</button><div class="cs-map-cells">${row.items.map(item=>`<button class="cs-answer-cell ${item.category}" data-map-answer="${item.index}" aria-expanded="false" aria-haspopup="dialog" aria-label="${esc(`${item.id}: ${item.label} · ${categories[item.category].short}. ${t('Show a short insight','छोटी insight देखें')}`)}"><span>${item.id.slice(1)}</span></button>`).join('')}</div></div>`).join('')}</div><p class="cs-chart-note">${t('Hover, focus or tap a tile to see why.','वजह जानने के लिए किसी खाने पर hover, focus या tap करें।')}</p></div>
 <div class="cs-frequency-panel"><div class="cs-chart-heading"><div><p class="small-label">${t('YOUR ACTUAL CHOICES','आपके असली विकल्प')}</p><h3>${t('Answer frequency','जवाबों की आवृत्ति')}</h3></div></div>${frequencyChart}<p class="cs-chart-note">${t('Counts of answers. Higher is not better.','जवाबों की गिनती। अधिक होना बेहतर होना नहीं है।')}</p><div class="cs-data-facts"><div><span>${t('Most selected','सबसे ज़्यादा चुना')}</span><strong>${esc(common)}</strong><b>${Math.max(...data.frequencies)} <small>/ 36</small></b></div><div><span>${t('Areas with mixed patterns','मिले-जुले पैटर्न वाले पहलू')}</span><strong>${data.mixedAreas} <small>/ 6</small></strong><p>${t('Two or more answer groups','दो या अधिक जवाब समूह')}</p></div></div></div>
 </section>`;
}
