import {completeWorkbook,INNERLY_V1_VERSION} from './innerly-v1-model.mjs';
import {reportSnapshot,reportAreas,reportCategories,escapeHTML as esc} from './report-concept-view.mjs';

const keys=['support','focus','varies'];
const names={support:'Strengths',focus:'Room to grow',varies:'Sometimes'};
const countItems=items=>Object.fromEntries(keys.map(key=>[key,items.filter(item=>item.category===key).length]));
const difference=value=>value>0?`+${value}`:String(value);

export function consolidatedComparisonData(before,after){
 if(!before||!after||before.version!==INNERLY_V1_VERSION||before.version!==after.version||before.language!==after.language||!completeWorkbook(before.answers)||!completeWorkbook(after.answers))return null;
 const start=reportSnapshot(before.answers),end=reportSnapshot(after.answers);
 const delta=Object.fromEntries(keys.map(key=>[key,end.counts[key]-start.counts[key]]));
 return {before:start.counts,after:end.counts,delta,areas:start.areas.map((area,i)=>({
  name:reportAreas()[i].name,before:countItems(area.items),after:countItems(end.areas[i].items),
  changed:area.items.filter(item=>before.answers[item.index]!==after.answers[item.index]).length,
 }))};
}

export function consolidatedComparisonMarkup(before,after){
 const data=consolidatedComparisonData(before,after);if(!data)return '';
 const colors=reportCategories(),date=r=>new Date(r.createdAt).toLocaleString(undefined,{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
 const bar=(counts,total,label)=>`<div class="consolidated-compare-bar" role="img" aria-label="${esc(label+': '+keys.map(key=>`${names[key]} ${counts[key]} of ${total}`).join('; '))}">${keys.filter(key=>counts[key]>0).map(key=>`<span style="flex:${counts[key]};background:${colors[key].color}" title="${esc(names[key]+': '+counts[key]+' of '+total)}" aria-hidden="true">${counts[key]}</span>`).join('')}</div>`;
 return `<section class="consolidated-comparison" aria-labelledby="consolidated-comparison-title"><p class="mh-kicker">THE WHOLE PICTURE</p><h2 id="consolidated-comparison-title">Your overall report, before &amp; after.</h2><p>The same response groups used in your consolidated report, compared across these two check-ins.</p><div class="consolidated-compare-legend">${keys.map(key=>`<span><i style="background:${colors[key].color}"></i>${names[key]}</span>`).join('')}</div><div class="consolidated-compare-overall">${[['Before',before,data.before],['After',after,data.after]].map(([label,report,counts])=>`<article><div class="consolidated-compare-date"><strong>${label}</strong><span>${esc(date(report))}</span></div>${bar(counts,36,label)}<p>36 answers</p></article>`).join('')}</div><div class="consolidated-compare-deltas">${keys.map(key=>`<article><span>${names[key]}</span><strong>${data.before[key]} <span aria-label="to">→</span> ${data.after[key]}</strong><small>${data.delta[key]===0?'No change in count':`${difference(data.delta[key])} ${Math.abs(data.delta[key])===1?'answer':'answers'}`}</small></article>`).join('')}</div><h3>Where did your responses change?</h3><div class="consolidated-compare-areas">${data.areas.map(area=>`<article><header><h4>${esc(area.name)}</h4><span>${area.changed} / 6 answers changed</span></header><div class="consolidated-compare-area-row"><strong>Before</strong>${bar(area.before,6,area.name+' before')}</div><div class="consolidated-compare-area-row"><strong>After</strong>${bar(area.after,6,area.name+' after')}</div></article>`).join('')}</div><p class="history-notice">These are counts of your responses, not a health score, diagnosis or proof of improvement. The groups use the meaning of each statement, including reverse-worded questions. Counts can stay the same even when individual answers change; use “Compare all 36 answers” above for the exact differences.</p></section>`;
}
