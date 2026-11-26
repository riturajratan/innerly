import {createClerkAuth} from './clerk-auth.mjs';
import {clerkPublishableKey} from './auth-config.mjs';
import {createCloudApi} from './cloud-api.mjs';
import {readWorkbookReports,INNERLY_V1_STORAGE,completeWorkbook} from './innerly-v1-model.mjs';
import {source} from './innerly-v1-questions.mjs';

const $=id=>document.getElementById(id);
let config,me,cursor=null,currentUser=null,generation=0,checkoutScript;
const status=(message,error=false)=>{$('status').textContent=message;$('status').classList.toggle('error',error);};
const auth=createClerkAuth({publishableKey:clerkPublishableKey,window,document,onChange(state){
  const signed=state.status==='signed-in';$('sign-in').hidden=signed||!config?.loginEnabled;$('profile').hidden=$('sign-out').hidden=!signed;
  if(!signed){generation++;currentUser=null;$('account').hidden=true;$('report-view').hidden=true;$('consent').checked=false;for(const key of ['cloud-reports','local-reports','answers','subscriptions'])$(key).replaceChildren();}
  if(signed&&state.user?.id!==currentUser){currentUser=state.user.id;generation++;run(refresh);}
}});
const api=createCloudApi({getToken:()=>auth.getToken()});
async function run(task,button){if(button)button.disabled=true;try{await task();}catch(e){status(e.message,true);}finally{if(button?.isConnected)button.disabled=false;}}
function element(tag,text,className){const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;}
function button(text,action,secondary=false){const node=element('button',text,secondary?'secondary':'');node.addEventListener('click',()=>run(()=>action(node),node));return node;}
const date=value=>new Date(value).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
function localReports(){try{return readWorkbookReports(localStorage.getItem(INNERLY_V1_STORAGE)).filter(r=>completeWorkbook(r.answers));}catch{return [];}}
async function refresh(){
  const version=generation;const result=await api('/me');if(version!==generation)return;me=result;
  $('account').hidden=false;renderBilling();renderLocal();$('cloud-reports').replaceChildren();cursor=null;await loadReports();
  if(version===generation)status('Signed in. Your cloud reports are private to this account.');
}
function renderBilling(){
  $('billing-status').textContent=me.billing.active?`Cloud saves are active through ${date(me.billing.validUntil*1000)}.`:'You do not have an active cloud subscription.';
  $('plans').replaceChildren();
  if(!config.billingEnabled)$('plans').append(element('p','Subscriptions are not open yet. Your on-device reports still work.'));
  for(const plan of config.plans){
    const card=element('article');card.append(element('h3',plan.label),element('p',`${new Intl.NumberFormat(undefined,{style:'currency',currency:plan.currency}).format(plan.amount/100)} · ${plan.period}`),element('p',`Renews automatically for up to ${plan.totalCount} billing cycles unless cancelled.`));
    if(!me.billing.active)card.append(button('Choose subscription',()=>subscribe(plan)));$('plans').append(card);
  }
  $('subscriptions').replaceChildren();
  for(const sub of me.billing.subscriptions){
    const card=element('article');card.append(element('p',`${sub.plan} · ${sub.status}${sub.cancelScheduled?' · cancellation requested':''}`));
    const actions=element('div',null,'actions');
    actions.append(button('Refresh payment status',async()=>{await api(`/billing/subscriptions/${sub.id}/refresh`,'POST',{});await refresh();},true));
    if(['creating','created','authenticated','active','pending','halted','paused'].includes(sub.status)&&!sub.cancelScheduled){actions.append(button('Cancel renewal',async()=>{
      if(!confirm('Cancel future renewals? Access already paid for remains available until its billing period ends.'))return;
      await api(`/billing/subscriptions/${sub.id}/cancel`,'POST',{});sessionStorage.removeItem(`checkout:${currentUser}:${sub.plan}`);await refresh();status('Cancellation requested. Your paid access remains available through its billing period.');
    },true));}
    card.append(actions);$('subscriptions').append(card);
  }
}
function renderLocal(){
  $('local-reports').replaceChildren();const reports=localReports();
  if(!reports.length)$('local-reports').append(element('p','No completed 36-question reports are saved in this browser.'));
  for(const report of reports){const card=element('article');card.append(element('h3',date(report.createdAt)),element('p',`36 answers · ${report.language.toUpperCase()}`),button('Save to my account',async()=>{
    if(!$('consent').checked){$('consent').focus();throw new Error('Please agree to cloud storage before saving.');}
    await api('/reports','POST',{clientId:report.id,version:report.version,language:report.language,answers:report.answers,assessedAt:report.createdAt,consent:config.consentVersion});await refresh();status('Your selected report is saved to your account.');
  }));$('local-reports').append(card);}
}
async function loadReports(){
  const version=generation,result=await api(`/reports${cursor?`?cursor=${encodeURIComponent(cursor)}`:''}`);if(version!==generation)return;
  for(const report of result.reports){const card=element('article');card.append(element('h3',date(report.assessedAt)),element('p',`36 answers · ${report.language.toUpperCase()}`));const actions=element('div',null,'actions');
    actions.append(button('View answers',async()=>{const v=generation,r=await api(`/reports/${report.id}`);if(v!==generation)return;$('answers').replaceChildren();r.answers.forEach((answer,i)=>{const li=element('li');li.append(element('p',source.questions[i].en),element('strong',source.choices[answer]));$('answers').append(li);});$('report-view').hidden=false;$('report-view').scrollIntoView({behavior:'auto'});},true));
    actions.append(button('Export',async()=>{const v=generation,r=await api(`/reports/${report.id}/export`);if(v!==generation)return;const url=URL.createObjectURL(new Blob([JSON.stringify(r,null,2)],{type:'application/json'}));const a=element('a');a.href=url;a.download=`knowyourmind-${report.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},true));
    actions.append(button('Delete',async()=>{if(!confirm('Permanently delete this cloud report? Your on-device copy will stay unchanged.'))return;await api(`/reports/${report.id}`,'DELETE');await refresh();status('Cloud report deleted.');},true));
    card.append(actions);$('cloud-reports').append(card);
  }
  if(!result.reports.length&&!cursor)$('cloud-reports').append(element('p','Reports you choose to save will appear here.'));
  cursor=result.nextCursor;$('load-more').hidden=!cursor;
}
async function loadCheckout(){
  if(window.Razorpay)return;
  if(!checkoutScript)checkoutScript=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=resolve;s.onerror=()=>{checkoutScript=null;s.remove();reject(new Error('Payment checkout could not load.'));};document.head.append(s);});
  await checkoutScript;
}
async function subscribe(plan){
  await loadCheckout();const version=generation,key=`checkout:${currentUser}:${plan.key}`;
  let requestId=sessionStorage.getItem(key);if(!requestId){requestId=crypto.randomUUID();sessionStorage.setItem(key,requestId);}
  const checkout=await api('/billing/subscriptions','POST',{plan:plan.key,requestId});if(version!==generation)return;
  const widget=new window.Razorpay({key:checkout.keyId,subscription_id:checkout.subscriptionId,name:'KnowYourMind',description:plan.label,
    handler:()=>run(async()=>{const result=await api(`/billing/subscriptions/${checkout.id}/refresh`,'POST',{});await refresh();status(result.active?'Payment verified. Cloud saves are active.':'Your payment is being verified. Use Refresh payment status shortly.');}),
    modal:{ondismiss:()=>run(refresh)},theme:{color:'#2858b8'},
  });widget.open();
}
$('sign-in').addEventListener('click',()=>run(async()=>{
  const client=await auth.ready();
  const returnUrl=new URL('cloud-account.html',location.href).href;
  client?.openSignIn({withSignUp:true,forceRedirectUrl:returnUrl,signUpForceRedirectUrl:returnUrl});
}));
$('profile').addEventListener('click',()=>run(()=>auth.profile()));
$('sign-out').addEventListener('click',()=>run(()=>auth.signOut('en')));
$('load-more').addEventListener('click',()=>run(loadReports,$('load-more')));
$('close-report').addEventListener('click',()=>{$('report-view').hidden=true;$('answers').replaceChildren();});
try{
  const response=await fetch('/api/config',{cache:'no-store'});if(!response.ok)throw new Error();config=await response.json();
  if(!config.loginEnabled)status('Cloud accounts are being prepared. You can continue using your on-device reports.');
  else{await auth.ready();if(!currentUser)status('Sign in to see your cloud reports and subscription.');}
}catch{status('Cloud accounts are not available on this site yet. Your on-device reports still work.');}
