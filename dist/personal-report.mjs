import {reportSnapshot} from './report-concept-view.mjs?v=6';
import {personalQuestionMarkup} from './personal-report-view.mjs?v=5';
import {mountQuestionExplorer} from './question-explorer.mjs?v=5';

export function mountPersonalReport(root,report,history=[],language='en'){
 const abort=new AbortController(),signal=abort.signal,l=language==='hi'?'hi':'en',snapshot=reportSnapshot(report.answers,l);
 const dialog=root.querySelector('#personal-question-dialog');let selected=0,lastTrigger=null;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),behavior=()=>reduce.matches||document.body.classList.contains('mh-paused')?'instant':'smooth';
 mountQuestionExplorer(root,{getSnapshot:()=>snapshot,getReport:()=>report,getHistory:()=>history,language:l,signal});
 function openQuestion(index,trigger){
  if(!Number.isInteger(index)||index<0||index>=36)return;
  selected=index;if(trigger&&!dialog.contains(trigger))lastTrigger=trigger;
  dialog.innerHTML=personalQuestionMarkup(snapshot,index,l);
  if(!dialog.open)dialog.showModal();else dialog.querySelector('.close-dialog').focus();
 }
 root.addEventListener('click',e=>{
  const b=e.target.closest('[data-question],[data-area-jump],button[data-chart-mode],[data-personal-group],[data-personal-prev],[data-personal-next],.close-dialog');if(!b)return;
  if(b.hasAttribute('data-question')){openQuestion(Number(b.dataset.question),b);return;}
  if(b.hasAttribute('data-area-jump')){const card=root.querySelector(`#area-${Number(b.dataset.areaJump)}`);card?.scrollIntoView({behavior:behavior(),block:'center'});card?.querySelector('[data-question]')?.focus({preventScroll:true});return;}
  if(b.hasAttribute('data-chart-mode')){document.body.dataset.chartMode=b.dataset.chartMode;root.querySelectorAll('button[data-chart-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));return;}
  if(b.hasAttribute('data-personal-group')){const view={support:'strengths',focus:'growth',varies:'answers'}[b.dataset.personalGroup];root.querySelector(`[data-question-view="${view}"]`).click();root.querySelector('#question-insights').scrollIntoView({behavior:behavior(),block:'start'});root.querySelector(`[data-question-view="${view}"]`).focus({preventScroll:true});return;}
  if(b.hasAttribute('data-personal-prev')){openQuestion(selected-1);return;}
  if(b.hasAttribute('data-personal-next')){openQuestion(selected+1);return;}
  if(b.matches('.close-dialog'))dialog.close();
 },{signal});
 root.addEventListener('keydown',e=>{const mark=e.target.closest('.chart-mark');if(!mark)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();openQuestion(Number(mark.dataset.question),mark);}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const siblings=[...mark.parentElement.querySelectorAll('.chart-mark')],i=siblings.indexOf(mark);siblings[(i+(e.key==='ArrowRight'?1:5))%6].focus();}},{signal});
 root.addEventListener('change',e=>{if(e.target.matches('[data-personal-tried]'))root.querySelector('#tried-count').textContent=root.querySelectorAll('[data-personal-tried]:checked').length;},{signal});
 dialog.addEventListener('close',()=>{if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});},{signal});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();},{signal});
 // The host's print lifecycle expands and restores the full answer record.
 let observer;const timers=[];
 if(!reduce.matches&&!document.body.classList.contains('mh-paused')&&'IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('entering');observer.unobserve(entry.target);timers.push(setTimeout(()=>entry.target.classList.remove('entering'),1400));}},{threshold:.15});root.querySelectorAll('.response-chart,.donut-wrap').forEach(el=>observer.observe(el));}
 return {destroy(){abort.abort();observer?.disconnect();timers.forEach(clearTimeout);if(dialog.open)dialog.close();delete document.body.dataset.chartMode;}};
}
