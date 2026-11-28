import {ANALYTICS_CHOICE} from './analytics.mjs?v=community-1';

const say=(language,en,hi)=>language==='hi'?hi:en;
const MINUTE=60_000;
let token=null, lastPulse=0;

export function pulseCheckinActivity(){
 if(document.hidden||location.origin!=='https://knowyourmind.ai')return;
 try{
  const now=Date.now();
  if(localStorage.getItem(ANALYTICS_CHOICE)!=='yes'||now-lastPulse<MINUTE)return;
  // Expire the browser's random value across inactive stretches too.
  if(!token||now-lastPulse>=5*MINUTE)token=crypto.randomUUID().replaceAll('-','');
  lastPulse=now;
  fetch('/api/metrics/checkin/presence',{
   method:'POST',credentials:'omit',referrerPolicy:'no-referrer',keepalive:true,
   headers:{'X-Checkin-Presence':token},
  }).catch(()=>{});
 }catch{}
}

export function mountCommunityStats(root,language){
 const section=root.querySelector('[data-community-stats]');
 if(!section)return ()=>{};
 const abort=new AbortController();
 const completed=section.querySelector('[data-total-completed]');
 const active=section.querySelector('[data-total-active]');
 const format=new Intl.NumberFormat(language==='hi'?'hi-IN':'en-IN');
 async function update(){
  if(document.hidden)return;
  try{
   const response=await fetch('/api/checkin-stats',{credentials:'omit',signal:abort.signal});
   if(!response.ok)return;
   const totals=await response.json();
   if(abort.signal.aborted||!Number.isSafeInteger(totals.completed)||totals.completed<0)return;
   completed.textContent=format.format(totals.completed);
   completed.closest('[hidden]')?.removeAttribute('hidden');
   const showActive=Number.isSafeInteger(totals.active)&&totals.active>=3;
   active.parentElement.hidden=!showActive;
   if(showActive)active.textContent=format.format(totals.active);
   section.hidden=false;
  }catch{}
 }
 update();
 const timer=setInterval(update,MINUTE);
 document.addEventListener('visibilitychange',update,{signal:abort.signal});
 return ()=>{clearInterval(timer);abort.abort();};
}

export function communityStatsMarkup(language){
 return `<section class="in-community-stats" data-community-stats hidden aria-label="${say(language,'Community check-in activity','समुदाय की check-in गतिविधि')}">
 <ul><li hidden><strong data-total-completed></strong><span>${say(language,'check-ins completed','पूरे हुए check-ins')}</span></li>
 <li hidden><strong data-total-active></strong><span>${say(language,'active in the last 5 min','पिछले 5 मिनट में सक्रिय')}</span></li></ul>
 <p>${say(language,'Counts are based on visitors who allow analytics.','गिनती में वे लोग शामिल हैं जो analytics की अनुमति देते हैं।')}</p>
 </section>`;
}
