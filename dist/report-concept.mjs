import {mountQuestionExplorer,benchmarkReading} from './question-explorer.mjs?v=1';
import {sampleProfiles,conceptSampleReport,areaDesign,categories,reportSnapshot,graphPath,areaGraph,insightMarkup,questionReading,planMarkup,responseTable,focusItems} from './report-concept-view.mjs?v=2';
import {workbookQuestions} from './innerly-v1-model.mjs?v=mh-14';

let answers=[...sampleProfiles.everyday.answers],snapshot=reportSnapshot(answers),selected=0,filter='support',lastTrigger=null;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],dialog=$('#question-dialog');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let tried=new Set(),dialogArea=-1;
const refreshQuestionExplorer=mountQuestionExplorer(document,{getSnapshot:()=>snapshot,getReport:()=>conceptSampleReport(answers),language:'en',signal:new AbortController().signal});
function updateFilters(){
 $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
 $('#focus-title').textContent=categories[filter].name;
 $('#focus-items').innerHTML=focusItems(snapshot,filter);
 $('#focus-items').dataset.category=filter;
}
function updateReport(changedQuestion=null){
 snapshot=reportSnapshot(answers);
 let offset=0;
 for(const [key,category] of Object.entries(categories)){
  const count=snapshot.counts[key],length=Math.max(0,count/36*100-1.7),segment=$(`[data-donut="${key}"]`);
  segment.setAttribute('stroke-dasharray',`${length} ${100-length}`);segment.setAttribute('stroke-dashoffset',-offset);segment.style.opacity=count?'1':'0';offset+=count/36*100;
  $(`[data-count="${key}"]`).textContent=count;
 }
 $('.donut-chart').setAttribute('aria-label',`${snapshot.counts.support} supportive responses, ${snapshot.counts.focus} growth opportunities, ${snapshot.counts.varies} sometimes responses`);
 for(const [i,area] of snapshot.areas.entries()){
  for(const [key,category] of Object.entries(categories)){
   const count=area.items.filter(item=>item.category===key).length,segment=$(`[data-stack="${i}-${key}"]`);
   segment.style.width=`${count/6*100}%`;segment.hidden=count===0;segment.title=`${count} ${category.name}`;segment.querySelector('b').textContent=count||'';
  }
  $$(`[data-line="${i}"]`).forEach(line=>line.setAttribute('d',graphPath(area)));
  $(`[data-insights="${i}"]`).innerHTML=insightMarkup(area);
  $(`#area-${i} .area-open`).dataset.question=area.next.index;
  for(const item of area.items){
   for(const bar of $$(`[data-bar="${item.index}"]`)){
    const mark=bar.closest('[data-question]');
    bar.setAttribute('y',166-item.value*34);bar.setAttribute('height',Math.max(3,item.value*34));
    mark.querySelector('[data-point]').setAttribute('cy',166-item.value*34);
    mark.querySelector('[data-status-dot]').setAttribute('fill',categories[item.category].color);
    mark.setAttribute('aria-label',`${item.id}: ${item.label}. ${item.response}. ${categories[item.category].short}. View question.`);
    mark.querySelector('title').textContent=`${workbookQuestions[item.index].texts.en} — ${item.response}`;
    if(changedQuestion===item.index){bar.classList.remove('is-changed');requestAnimationFrame(()=>bar.classList.add('is-changed'));}
   }
  }
 }
 updateFilters();
 $('#plan-list').innerHTML=planMarkup(snapshot);
 $$('[data-tried]').forEach(input=>{input.checked=tried.has(input.dataset.tried);});
 updateTried();$('#response-table').innerHTML=responseTable(snapshot);refreshQuestionExplorer();
}
function updateTried(){const count=$$('[data-tried]:checked').length;$('#tried-count').textContent=count;}
function showQuestion(index,trigger){
 if(!Number.isInteger(index)||index<0||index>=36)return;
 selected=index;if(trigger&&!dialog.contains(trigger))lastTrigger=trigger;
 const item=snapshot.items[selected],area=areaDesign[Math.floor(selected/6)];
 $('#question-area').textContent=area.name;
 $('#question-number').textContent=`${item.id} · QUESTION ${selected+1} OF 36`;
 $('#question-title').textContent=workbookQuestions[selected].texts.en;
 $('#question-reading').innerHTML=questionReading(item);
 $('#sample-benchmark-content').innerHTML=benchmarkReading(selected,item.value);
 const areaIndex=Math.floor(selected/6);
 if(dialogArea!==areaIndex){
  $('#dialog-graph').innerHTML=areaGraph(snapshot.areas[areaIndex],areaIndex);
  $('#dialog-graph').style.setProperty('--area',area.color);$('#dialog-graph').style.setProperty('--area-light',area.light);dialogArea=areaIndex;
 }
 $$('#dialog-graph [data-question]').forEach(mark=>mark.classList.toggle('is-selected',Number(mark.dataset.question)===selected));
 $$('[data-answer]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.answer)===item.value)));
 $('[data-question-prev]').disabled=selected===0;$('[data-question-next]').disabled=selected===35;
 $('#answer-status').textContent='';
 if(!dialog.open)dialog.showModal();
}
function jumpToArea(i){
 const area=$(`#area-${i}`);if(!area)return;
 area.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});
 $$('.is-highlighted').forEach(el=>el.classList.remove('is-highlighted'));area.classList.add('is-highlighted');
 area.querySelector('[data-question]')?.focus({preventScroll:true});
}
document.addEventListener('click',e=>{
 const trigger=e.target.closest('[data-question], [data-filter], button[data-chart-mode], [data-area-jump], [data-answer], [data-question-prev], [data-question-next], [data-print], .close-dialog');
 if(!trigger)return;
 if(trigger.hasAttribute('data-question')){showQuestion(Number(trigger.dataset.question),trigger);return;}
 if(trigger.hasAttribute('data-filter')){filter=trigger.dataset.filter;updateFilters();$('#report-status').textContent=`Showing ${categories[filter].name}. ${snapshot.counts[filter]} responses.`;return;}
 if(trigger.hasAttribute('data-chart-mode')){document.body.dataset.chartMode=trigger.dataset.chartMode;$$('[data-chart-mode]').filter(el=>el.tagName==='BUTTON').forEach(b=>b.setAttribute('aria-pressed',String(b===trigger)));return;}
 if(trigger.hasAttribute('data-area-jump')){jumpToArea(Number(trigger.dataset.areaJump));return;}
 if(trigger.hasAttribute('data-answer')){
  const previous=snapshot.items[selected],value=Number(trigger.dataset.answer);if(value===previous.value)return;
  answers[selected]=value;updateReport(selected);const next=snapshot.items[selected];showQuestion(selected);
  const message=previous.category===next.category?`${next.id} changed from ${previous.response} to ${next.response}. Graphs updated; this stays in ${categories[next.category].name.toLowerCase()}.`:`${next.id}: ${previous.response} → ${next.response}. ${categories[previous.category].name} → ${categories[next.category].name}. All six-area summaries updated.`;
  $('#answer-status').textContent=message;$('#report-status').textContent=message;
  $('#profile-description').textContent='Your edited example. Each answer adds a little more context.';
  return;
 }
 if(trigger.hasAttribute('data-question-prev')){showQuestion(selected-1);return;}
 if(trigger.hasAttribute('data-question-next')){showQuestion(selected+1);return;}
 if(trigger.matches('.close-dialog')){dialog.close();return;}
 if(trigger.hasAttribute('data-print'))window.print();
});
document.addEventListener('keydown',e=>{
 const mark=e.target.closest('.chart-mark');if(!mark)return;
 if(e.key==='Enter'||e.key===' '){e.preventDefault();showQuestion(Number(mark.dataset.question),mark);}
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
  e.preventDefault();const siblings=[...mark.parentElement.querySelectorAll('.chart-mark')],i=siblings.indexOf(mark),next=(i+(e.key==='ArrowRight'?1:-1)+6)%6;siblings[next].focus();
 }
});
dialog.addEventListener('close',()=>{if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$('#sample-profile').addEventListener('change',e=>{
 const profile=sampleProfiles[e.target.value];if(!profile)return;
 answers=[...profile.answers];tried.clear();updateReport();$('#profile-description').textContent=profile.description;
 $('#report-status').textContent=`${profile.name} loaded. All 36 sample answers and six report areas updated.`;
});
$('#plan-list').addEventListener('change',e=>{const input=e.target.closest('[data-tried]');if(!input)return;if(input.checked)tried.add(input.dataset.tried);else tried.delete(input.dataset.tried);updateTried();$('#report-status').textContent=`${$('#tried-count').textContent} of 6 sample activities marked as tried.`;});
const method=$('.report-method details');let methodWasOpen=false;
window.addEventListener('beforeprint',()=>{methodWasOpen=method.open;method.open=true;});
window.addEventListener('afterprint',()=>{method.open=methodWasOpen;});
if(!reduced.matches&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('entering');observer.unobserve(entry.target);setTimeout(()=>entry.target.classList.remove('entering'),1400);}},{threshold:.2});
 $$('.response-chart,.donut-wrap').forEach(el=>observer.observe(el));
}
