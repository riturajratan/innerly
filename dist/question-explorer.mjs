import {workbookChoices,workbookQuestions,frequencyCounts} from './innerly-v1-model.mjs?v=mh-14';
import {workbookTimeline} from './innerly-v1-insights.mjs?v=report-3';
import {simulatedComparison} from './report-benchmark.mjs?v=1';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=(l,en,hi)=>l==='hi'?hi:en;
const colors={support:'#6b9e83',focus:'#cb827d',varies:'#bfa24f'};
const frequencyColors=['#a5b7d8','#829dcc','#6689bf','#4c70ac','#31568f'];
export const questionViews=['answers','strengths','growth','frequency','history','world'];
const names={en:['All 36 answers','Your strengths','Growth opportunities','Answer frequency','Your changes','World comparison · mock'],hi:['सभी 36 जवाब','आपकी मजबूतियाँ','बेहतरी के अवसर','जवाबों की आवृत्ति','आपके बदलाव','दुनिया से तुलना · mock']};
const tabIcons=[
 '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>',
 '<path d="M5 20V10m0 10h14M9 14l4-4 3 2 5-7m-5 0h5v5"/>',
 '<path d="M5 20V13m7 7V5m7 15V9"/>',
 '<path d="M4 8a9 9 0 1 1-1 8M4 3v5h5m3-2v6l4 2"/>',
 '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'
];
function questionTabs(l){
 return questionViews.map((v,i)=>`<button type="button" role="tab" id="qe-tab-${v}" data-question-view="${v}" aria-label="0${i+1} ${names[l][i]}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" aria-controls="qe-panel"><span class="qe-tab-top" aria-hidden="true"><span class="qe-tab-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${tabIcons[i]}</svg></span><span class="qe-tab-number">${v==='world'?'MOCK':`0${i+1}`}</span></span><span class="qe-tab-label">${names[l][i]}</span><span class="qe-tab-indicator" aria-hidden="true"></span></button>`).join('');
}
function categoryName(item,l){return say(l,{support:'Strength',focus:'Growth opportunity',varies:'Sometimes'}[item.category],{support:'मजबूती',focus:'बेहतरी का अवसर',varies:'कभी-कभी'}[item.category]);}
export function responseRuler(item,l='en'){
 return `<span class="qe-ruler" aria-hidden="true"><span class="qe-ruler-track"></span>${workbookChoices(l).map((choice,i)=>`<i class="${item.value===i?'chosen':''}" title="${esc(choice)}" style="--position:${i*25}%"></i>`).join('')}</span>`;
}
export function comparisonLineChart(index,value,l='en'){
 const data=simulatedComparison(index,value);if(!data)return '';
 const labels=workbookChoices(l),x=i=>36+i*80,y=count=>160-count*2.8;
 const points=data.counts.map((count,i)=>({x:x(i),y:y(count)}));
 const path=points.map((p,i)=>i?`C${points[i-1].x+32} ${points[i-1].y} ${p.x-32} ${p.y} ${p.x} ${p.y}`:`M${p.x} ${p.y}`).join(' ');
 const selected=points[value];
 return `<span class="qe-position-graph"><span class="qe-graph-canvas"><svg viewBox="0 0 392 180" role="img" aria-label="${esc(say(l,`Simulated response distribution. Your answer: ${labels[value]}. Mock counts from Never to Almost Always: ${data.counts.join(', ')}.`,`काल्पनिक जवाबों का वितरण। आपका जवाब: ${labels[value]}। कभी नहीं से लगभग हमेशा तक mock गिनती: ${data.counts.join(', ')}।`))}">
  <g class="qe-square-grid" aria-hidden="true">${Array.from({length:17},(_,i)=>`<path d="M${36+i*20} 20V160"/>`).join('')}${Array.from({length:8},(_,i)=>`<path d="M36 ${20+i*20}H356"/>`).join('')}</g>
  <rect class="qe-position-window" x="${selected.x-18}" y="20" width="36" height="140" rx="8"/>
  <path class="qe-curve-area" d="${path} L356 160H36Z"/>
  <path class="qe-distribution-line" pathLength="1" d="${path}"/>
  <g class="qe-curve-dots">${points.map((p,i)=>i===value?'':`<circle cx="${p.x}" cy="${p.y}" r="3"/>`).join('')}</g>
  <path class="qe-position-guide" d="M${selected.x} ${selected.y}V160"/>
  <circle class="qe-position-halo" cx="${selected.x}" cy="${selected.y}" r="12"/>
  <circle class="qe-position-dot" cx="${selected.x}" cy="${selected.y}" r="5.5"/>
 </svg><span class="qe-position-label" aria-hidden="true" style="left:clamp(84px,${selected.x/392*100}%,calc(100% - 54px));top:calc(${selected.y/180*100}% - 37px)">${say(l,'YOU ARE HERE','आप यहाँ हैं')}</span>
 <span class="qe-curve-y" aria-hidden="true">${[0,20,40].map(count=>`<span style="top:${y(count)/180*100}%">${count}</span>`).join('')}</span></span>
 <span class="qe-curve-axis" aria-hidden="true">${labels.map((label,i)=>`<span class="${i===value?'is-selected':''}">${esc(label)}</span>`).join('')}</span></span>`;
}
function questionLineCard(item,l,world=false){
 const data=simulatedComparison(item.index,item.value);
 return `<button class="${world?'qe-world-row':'qe-row'}" data-question="${item.index}" style="--question-color:${colors[item.category]}"><span class="qe-row-head"><b>${item.id}</b><span>${categoryName(item,l)}</span><i>↗</i></span><strong class="qe-question-title">${esc(item.label)}</strong><span class="qe-curve-context"><span>${say(l,'Responses (%)','जवाब (%)')}</span><b>${say(l,'MOCK · 100 RESPONSES','MOCK · 100 जवाब')}</b></span>${comparisonLineChart(item.index,item.value,l)}<span class="qe-position-reading"><span><small>${say(l,'YOUR ANSWER','आपका जवाब')}</small><b>${esc(item.response)}</b></span><span class="qe-position-percent"><b>${data.atOrBelowPercent}<small>%</small></b><small>${say(l,'at / below · mock','बराबर / नीचे · mock')}</small></span></span><span class="qe-line-card-foot">${say(l,'See your insight & next step','समझ और अगला कदम देखें')}<i>→</i></span></button>`;
}
function questionRows(items,l){
 if(!items.length)return `<div class="qe-empty"><h3>${say(l,'No answers in this group.','इस समूह में कोई जवाब नहीं है।')}</h3><p>${say(l,'Explore the other views for more context.','अन्य views में अपने जवाबों को समझें।')}</p></div>`;
 return `<div class="qe-rows">${items.map(item=>questionLineCard(item,l)).join('')}</div>`;
}
export function benchmarkReading(index,value,l='en'){
 const data=simulatedComparison(index,value);if(!data)return '';
 return `<div class="qe-benchmark-detail"><span class="qe-mock-badge">${say(l,'SIMULATED DATA · NOT A WORLD RANK','काल्पनिक डेटा · असली विश्व रैंक नहीं')}</span><h3>${say(l,'An example comparison','तुलना का एक उदाहरण')}</h3><p><strong>${data.atOrBelowPercent}%</strong> ${say(l,'of 100 fictional responses are at or below your selected answer frequency.','केवल 100 काल्पनिक जवाबों में आपकी चुनी हुई आवृत्ति के बराबर या नीचे हैं।')}</p>${comparisonLineChart(index,value,l)}<p class="fine-print">${say(l,`${data.below} lower · ${data.same} same · ${data.above} higher frequency. This is not the percentage of people you are healthier than.`,`${data.below} कम · ${data.same} समान · ${data.above} अधिक आवृत्ति। यह नहीं बताता कि आप कितने लोगों से अधिक स्वस्थ हैं।`)}</p></div>`;
}
export function questionViewMarkup(snapshot,report,history=[],view='answers',l='en',question=0){
 if(!questionViews.includes(view))view='answers';
 if(view==='answers')return `<div class="qe-panel-heading"><h3>${say(l,'See where your answer sits.','देखें, आपका जवाब कहाँ है।')}</h3><p>${say(l,'The highlighted point is your answer. Each curve shows 100 fictional responses; the percentage counts those at or below your answer frequency. This is a mock comparison, not a world ranking. Open a graph for your insight and next step.','हाइलाइट किया हुआ बिंदु आपका जवाब है। हर curve में 100 काल्पनिक जवाब हैं; प्रतिशत आपकी आवृत्ति के बराबर या नीचे वाले जवाबों का है। यह mock तुलना है, असली world ranking नहीं। समझ और अगला कदम देखने के लिए graph खोलें।')}</p></div>${questionRows(snapshot.items,l)}`;
 if(view==='strengths'||view==='growth'){
  const key=view==='strengths'?'support':'focus',items=snapshot.items.filter(item=>item.category===key);
  return `<div class="qe-panel-heading"><span class="qe-total" style="color:${colors[key]}">${items.length}<small> / 36</small></span><h3>${say(l,view==='strengths'?'What you can lean on.':'Where a small step could help.',view==='strengths'?'कौन-सी आदतें आपकी मदद करती हैं।':'कहाँ एक छोटा कदम मदद कर सकता है।')}</h3><p>${say(l,'These groups follow each statement’s wording and your selected frequency. Lower frequency can be supportive for a difficulty; higher can be supportive for a helpful habit.','ये समूह हर कथन के अर्थ और आपके जवाब पर आधारित हैं। किसी कठिनाई की कम आवृत्ति और मददगार आदत की अधिक आवृत्ति सहायक हो सकती है।')}</p></div>${questionRows(items,l)}`;
 }
 if(view==='frequency'){
  const distribution=frequencyCounts(report.answers);
  return `<div class="qe-panel-heading"><h3>${say(l,'The rhythm of your answers.','आपके जवाबों का पैटर्न।')}</h3><p>${say(l,'Each bar counts your own answers. Percentages use your 36 questions as the denominator, not other people.','हर bar आपके अपने जवाब गिनता है। प्रतिशत आपके 36 सवालों का है, दूसरे लोगों का नहीं।')}</p></div><div class="qe-frequency-chart" tabindex="0" role="region" aria-label="${say(l,'Answer frequency chart','जवाबों की आवृत्ति का graph')}">${distribution.counts.map((count,i)=>`<button data-frequency-filter="${i}" aria-pressed="false" style="--frequency-color:${frequencyColors[i]}"><strong>${count}<small> / 36</small></strong><span class="qe-frequency-track"><i style="--frequency-share:${count/36*100}%"></i></span><b>${esc(workbookChoices(l)[i])}</b><span>${(count/36*100).toFixed(1)}% ${say(l,'of your answers','आपके जवाब')}</span></button>`).join('')}</div><p class="qe-explainer">${say(l,'Select a bar to see the questions with that answer.','उस जवाब वाले सवाल देखने के लिए bar चुनें।')}</p><div id="qe-frequency-items"></div>`;
 }
 if(view==='history'){
  const index=Number.isInteger(question)&&question>=0&&question<36?question:0,points=workbookTimeline(report,history,index),valid=points.filter(p=>p.value!==null);
  const labels=workbookChoices(l),x=i=>100+(points.length===1?190:i*380/(points.length-1)),y=v=>175-v*35;
  const segments=[];for(const [i,p] of points.entries()){if(p.value===null){segments.push([]);continue;}if(!segments.length)segments.push([]);segments.at(-1).push([x(i),y(p.value)]);}
  return `<div class="qe-panel-heading"><h3>${say(l,'Your own reference point.','आपके अपने पिछले जवाब।')}</h3><p>${say(l,'Compare one exact question across saved check-ins in the same questionnaire and language. A different response is not automatically an improvement.','उसी प्रश्नावली और भाषा के सेव check-ins में एक ही सवाल की तुलना करें। बदला हुआ जवाब अपने आप बेहतरी नहीं है।')}</p></div><label class="qe-question-select">${say(l,'Choose a question','सवाल चुनें')}<select data-history-question>${snapshot.items.map(item=>`<option value="${item.index}"${item.index===index?' selected':''}>${item.id} · ${esc(item.label)}</option>`).join('')}</select></label><p class="qe-history-statement">${esc(workbookQuestions[index].texts[l])}</p><div class="qe-history-scroll" tabindex="0" role="region" aria-label="${say(l,'Response history chart','पिछले जवाबों का graph')}"><svg class="qe-history-chart" viewBox="0 0 560 225" role="img" aria-label="${esc(say(l,`${valid.length} recorded responses for ${snapshot.items[index].id}. Exact values below.`,`${snapshot.items[index].id} के ${valid.length} जवाब। असली मान नीचे हैं।`))}">${labels.map((label,i)=>`<text x="83" y="${y(i)+4}" text-anchor="end">${label.split(' ').map((word,j)=>`<tspan x="83" dy="${j?14:0}">${esc(word)}</tspan>`).join('')}</text><path d="M100 ${y(i)}H500" class="qe-history-grid"/>`).join('')}${segments.filter(s=>s.length>1).map(s=>`<polyline points="${s.map(p=>p.join(',')).join(' ')}"/>`).join('')}${points.map((p,i)=>`${p.value===null?'':`<circle cx="${x(i)}" cy="${y(p.value)}" r="6"><title>${esc(new Date(p.createdAt).toLocaleDateString(l))}: ${esc(labels[p.value])}</title></circle>`}<text x="${x(i)}" y="205" text-anchor="middle">${esc(new Date(p.createdAt).toLocaleDateString(l,{month:'short',day:'numeric'}))}</text>`).join('')}</svg></div>${points.length<2?`<p class="qe-empty-note">${report.illustrative?say(l,'This fictional example has one point. Real reports compare actual saved check-ins in the same questionnaire and language.','इस काल्पनिक उदाहरण में एक बिंदु है। असली reports उसी प्रश्नावली और भाषा के सेव check-ins की तुलना करती हैं।'):say(l,'Your first point is here. Save this report, then complete and save a future check-in to compare your answers.','आपका पहला बिंदु यहाँ है। यह report सेव करें; अगला check-in पूरा और सेव करके तुलना कर पाएँगे।')}</p>`:''}<div class="qe-history-records">${points.map(p=>`<span>${esc(new Date(p.createdAt).toLocaleString(l))} <b>${p.value===null?say(l,'Not answered','जवाब नहीं दिया'):esc(labels[p.value])}</b></span>`).join('')}</div>`;
 }
 return `<div class="qe-world-note"><span class="qe-mock-badge">${say(l,'MOCK COMPARISON · 100 FICTIONAL RESPONSES PER QUESTION','MOCK तुलना · हर सवाल के लिए 100 काल्पनिक जवाब')}</span><h3>${say(l,'A preview of population comparison.','लोगों से तुलना का एक preview।')}</h3><p>${say(l,'Your answers below are yours. The comparison group is entirely simulated, so these percentages do not tell you where you stand in the world. No real population benchmark is connected.','नीचे आपके अपने जवाब हैं। तुलना का समूह पूरी तरह काल्पनिक है; ये प्रतिशत दुनिया में आपकी स्थिति नहीं बताते। असली population benchmark जुड़ा नहीं है।')}</p><p>${say(l,'Example: 70% means 70 of the 100 fictional answers have the same or lower frequency than your answer. It does not mean “healthier than 70% of people”.','उदाहरण: 70% यानी 100 काल्पनिक जवाबों में 70 की आवृत्ति आपके जवाब के बराबर या कम है। इसका अर्थ “70% लोगों से अधिक स्वस्थ” नहीं है।')}</p></div><div class="qe-world-grid">${snapshot.items.map(item=>questionLineCard(item,l,true)).join('')}</div>`;
}
export function questionExplorerMarkup(snapshot,report,history=[],l='en'){
 return `<section class="question-explorer" id="question-insights"><div class="section-heading"><div><p class="small-label">${say(l,'36 ANSWERS · SIX WAYS TO UNDERSTAND THEM','36 जवाब · समझने के छह तरीके')}</p><h2>${say(l,'Go beyond the six areas.','छह पहलुओं से आगे देखें।')}</h2><p>${say(l,'Explore your individual answers, strengths, growth opportunities and next steps.','अपने हर जवाब, मजबूतियों, बेहतरी के अवसरों और अगले कदम को समझें।')}</p></div><span class="small-chip">36 / 36</span></div><div class="qe-tabs" role="tablist" aria-label="${say(l,'Question insights','सवालों की समझ')}">${questionTabs(l)}</div><div id="qe-panel" role="tabpanel" aria-labelledby="qe-tab-answers" tabindex="0">${questionViewMarkup(snapshot,report,history,'answers',l)}</div><div class="sr-only" id="qe-status" role="status"></div></section>`;
}
export function mountQuestionExplorer(root,{getSnapshot,getReport,getHistory=()=>[],language='en',signal}){
 let view='answers',question=0;
 const panel=root.querySelector('#qe-panel');if(!panel)return ()=>{};
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('qe-chart-revealed');observer.unobserve(entry.target);}},{threshold:.25}):null;
 function observeCharts(){observer?.disconnect();panel.querySelectorAll('.qe-row,.qe-world-row').forEach(card=>observer?.observe(card));}
 signal?.addEventListener('abort',()=>observer?.disconnect(),{once:true});
 observeCharts();
 function render(){panel.innerHTML=questionViewMarkup(getSnapshot(),getReport(),getHistory(),view,language,question);panel.setAttribute('aria-labelledby',`qe-tab-${view}`);root.querySelectorAll('[data-question-view]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.questionView===view));b.tabIndex=b.dataset.questionView===view?0:-1;});observeCharts();}
 root.addEventListener('click',e=>{
  const button=e.target.closest('[data-question-view],[data-frequency-filter]');if(!button)return;
  if(button.dataset.questionView){view=button.dataset.questionView;render();root.querySelector('#qe-status').textContent=names[language][questionViews.indexOf(view)];}
  else{const value=Number(button.dataset.frequencyFilter);root.querySelectorAll('[data-frequency-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));root.querySelector('#qe-frequency-items').innerHTML=questionRows(getSnapshot().items.filter(item=>item.value===value),language);observeCharts();}
 },{signal});
 root.addEventListener('keydown',e=>{const tab=e.target.closest('[data-question-view]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=questionViews.indexOf(tab.dataset.questionView),next=e.key==='Home'?0:e.key==='End'?5:(i+(e.key==='ArrowRight'?1:5))%6;view=questionViews[next];render();root.querySelector(`[data-question-view="${view}"]`).focus();},{signal});
 root.addEventListener('change',e=>{if(e.target.matches('[data-history-question]')){question=Number(e.target.value);render();root.querySelector('[data-history-question]').focus();}},{signal});
 return render;
}
