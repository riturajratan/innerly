// GA4 measures consented public-page visits only. No answers, account identifiers,
// report events, query strings or hash fragments enter the analytics payload.
export const MEASUREMENT_ID='G-RCRXJ28CSM';
export const ANALYTICS_CHOICE='knowyourmind-analytics-v2';

export function countCheckin(kind){
 if(kind!=='start'&&kind!=='complete')return;
 try{
  if(window.location.origin!=='https://knowyourmind.ai'||window.localStorage.getItem(ANALYTICS_CHOICE)!=='yes')return;
  fetch('/api/metrics/checkin/'+kind,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',keepalive:true}).catch(()=>{});
 }catch{}
}
const publicPages=new Map([['/','Know Your Mind'],['/how-it-works','How it works'],['/faq','Frequently asked questions'],['/report-preview','Sample report'],['/privacy','Privacy policy'],['/terms','Terms of use'],['/self-reflection-check-in','How to do a self-reflection check-in'],['/journaling-prompts-for-overthinking','Five journaling prompts for overthinking']]);
export function publicPage(url){const parsed=new URL(url),path=parsed.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';return parsed.hostname==='knowyourmind.ai'&&!['view','account','start','new'].some(key=>parsed.searchParams.has(key))&&publicPages.has(path)?{page_location:parsed.origin+path,page_title:publicPages.get(path)}:null;}
export function installAnalytics({window:win,document:doc,storage}={}){
 let choice;try{storage=storage||win.localStorage;choice=storage.getItem(ANALYTICS_CHOICE)||(storage.getItem('knowyourmind-analytics-v1')==='no'?'no':null);}catch{}
 let active=!doc.body.classList.contains('mh-home-page'),loaded=false,lastPage=null,banner;
 const disabled='ga-disable-'+MEASUREMENT_ID;
 win[disabled]=true;
 function send(){win.dataLayer=win.dataLayer||[];win.dataLayer.push(arguments);}
 function sync(){
  const page=publicPage(win.location.href),allowed=choice==='yes'&&active&&!!page;
  win[disabled]=!allowed;
  if(!allowed){lastPage=null;return;}
  if(!loaded){
   send('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   send('js',new Date());
   send('config',MEASUREMENT_ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:60*60*24*60,cookie_update:false,...page,page_referrer:''});
   const script=doc.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+MEASUREMENT_ID;doc.head.append(script);loaded=true;
  }
  if(lastPage!==page.page_location){let referrer='';try{const u=new URL(doc.referrer);if(u.origin!==win.location.origin)referrer=u.origin+'/';}catch{}
   send('event','page_view',{send_to:MEASUREMENT_ID,...page,page_referrer:referrer});lastPage=page.page_location;
  }
 }
 function choose(next,persist=true){choice=next;if(persist)try{storage.setItem(ANALYTICS_CHOICE,next);}catch{}banner?.remove();banner=null;if(loaded)send('consent','update',{analytics_storage:next==='yes'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});sync();
  if(next==='no')for(const part of doc.cookie.split(';')){const name=part.trim().split('=')[0];if(/^_ga(?:_|$)/.test(name))for(const domain of ['',`; Domain=${win.location.hostname}`,`; Domain=.${win.location.hostname}`])doc.cookie=`${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax; Secure`;}
 }
 function preferences(){
  banner?.remove();banner=doc.createElement('section');banner.className='analytics-choice';banner.setAttribute('aria-label','Analytics preferences');
  banner.innerHTML='<div><strong>Help us understand site visits?</strong><p>Optional analytics counts public visits and total check-in starts and completions. Your answers, reports and identity stay private.</p></div><div class="analytics-choice-actions"><button data-analytics="no">No thanks</button><button data-analytics="yes">Allow analytics</button></div>';
  banner.addEventListener('click',event=>{const value=event.target.closest('[data-analytics]')?.dataset.analytics;if(value)choose(value);});doc.body.append(banner);
 }
 doc.addEventListener('click',event=>{if(event.target.closest('[data-analytics-preferences]'))preferences();});
 win.addEventListener('storage',event=>{if(event.key===ANALYTICS_CHOICE){choose(event.newValue,false);}});
 if(!choice&&active&&publicPage(win.location.href))preferences();sync();
 return {setPublicView(value){active=!!value;if(!active){banner?.remove();banner=null;}else if(!choice&&!banner&&publicPage(win.location.href))preferences();sync();},preferences};
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
 const analytics=installAnalytics({window,document});
 window.addEventListener('knowyourmind:view',event=>analytics.setPublicView(event.detail==='home'));
 // Private routes may be requested before the application consumes its URL marker.
 const params=new URL(window.location.href).searchParams;
 if(params.has('view')||params.has('account')||params.has('start')||params.has('new'))analytics.setPublicView(false);
}
