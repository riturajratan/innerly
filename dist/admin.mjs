import {createClerkAuth} from './clerk-auth.mjs';
import {clerkPublishableKey} from '/auth-config.mjs';
const $=id=>document.getElementById(id),status=$('status'),workspace=$('workspace');
let owner=null,offset=0,generation=0;
const auth=createClerkAuth({publishableKey:clerkPublishableKey,window,document,onChange:state=>{
 const next=state.user?.id||null;$('auth').textContent=next?'Sign out':'Sign in';
 if(next!==owner){owner=next;generation++;$('list').replaceChildren();workspace.hidden=true;offset=0;if(owner)load();}
 if(state.status==='signed-out')status.textContent='Sign in with your administrator account to review feedback.';
}});
async function api(method='GET',data){
 const user=owner,token=await auth.getToken();if(user!==owner||!token)throw Error('Please sign in.');
 const r=await fetch('/api/admin/feedback'+(method==='GET'?`?status=${$('filter').value}&offset=${offset}`:''),{method,cache:'no-store',headers:{Authorization:`Bearer ${token}`,...(data?{'Content-Type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});
 const result=await r.json();if(user!==owner)throw Error('Account changed.');
 if(!r.ok)throw Error(({admin_required:'This account does not have admin access. Your Clerk User ID: '+user,feedback_changed:'This feedback changed elsewhere. Refresh and review it again.',testimonial_permission_required:'This feedback does not have permission to publish.'})[result.error]||'Could not complete the request. Please retry.');return result;
}
async function loadCheckinTotals(current){
 const target=$('checkin-totals');
 target.textContent='Loading totals…';
 try{
  const token=await auth.getToken();
  if(current!==generation||!token)return;
  const response=await fetch('/api/admin/checkin-metrics',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});
  if(!response.ok)throw Error();
  const {starts,completions}=await response.json();
  if(current===generation)target.textContent=`${starts.toLocaleString()} starts · ${completions.toLocaleString()} completions`;
 }catch{
  if(current===generation)target.textContent='Totals are temporarily unavailable.';
 }
}
async function loadPhoto(feedbackId,container){const token=await auth.getToken();if(!token)throw Error('Please sign in.');const response=await fetch('/api/admin/feedback-photo/'+encodeURIComponent(feedbackId),{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});if(!response.ok)throw Error('Could not load this photo.');const url=URL.createObjectURL(await response.blob()),image=document.createElement('img');image.src=url;image.alt='Feedback attachment';image.className='feedback-photo';container.replaceChildren(image);}
function el(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
async function load(){const current=++generation;status.textContent='Loading feedback…';try{const data=await api();if(current!==generation)return;workspace.hidden=false;loadCheckinTotals(current);$('list').replaceChildren();status.textContent=data.feedback.length?'':'No feedback in this view yet.';for(const row of data.feedback){const card=el('article','','card');card.append(el('span',`${row.kind} · ${row.review_status}`,'badge'),el('h2',row.name),el('p',row.email+' (visitor supplied)','email'),el('p',new Date(row.created_at*1000).toLocaleString()+' · '+row.id,'meta'),el('blockquote',row.message,'quote'),el('p',row.testimonial_consent?'Testimonial permission granted · '+new Date(row.consented_at*1000).toLocaleString():'No permission to publish','meta'));if(row.photo_available){const photo=el('div','','photo-box'),button=el('button','View uploaded photo');button.onclick=()=>loadPhoto(row.id,photo).catch(e=>status.textContent=e.message);photo.append(button,el('p',row.testimonial_photo_consent?'Photo permission granted':'No photo permission · kept private','meta'));card.append(photo);}const actions=el('div','','actions');for(const [action,label] of [['review','Mark reviewed'],['approve','Approve & publish'],['reject',row.review_status==='approved'?'Unpublish':'Reject'],['withdraw','Withdraw permission']]){if(action==='approve'&&(!row.testimonial_consent||row.kind!=='love'||row.review_status==='approved'))continue;if(action==='withdraw'&&!row.testimonial_consent)continue;const button=el('button',label,action==='approve'?'primary':'');button.onclick=async()=>{if(['approve','withdraw'].includes(action)&&!confirm(action==='approve'?'Publish this original name and message on the homepage?':'Withdraw testimonial permission and remove this feedback from the homepage?'))return;actions.querySelectorAll('button').forEach(b=>b.disabled=true);try{await api('POST',{id:row.id,revision:row.review_revision,action});await load();}catch(e){status.textContent=e.message;actions.querySelectorAll('button').forEach(b=>b.disabled=false);}};actions.append(button);}card.append(actions);$('list').append(card);}$('prev').disabled=offset===0;$('next').disabled=!data.hasMore;$('page').textContent='Page '+(offset/25+1);}catch(e){if(current===generation){status.textContent=e.message;workspace.hidden=true;}}}
$('auth').onclick=()=> (owner?auth.signOut():auth.signIn()).catch(e=>status.textContent=e.message);
$('refresh').onclick=load;$('filter').onchange=()=>{offset=0;load();};$('prev').onclick=()=>{offset=Math.max(0,offset-25);load();};$('next').onclick=()=>{offset+=25;load();};
auth.ready().catch(e=>status.textContent=e.message);
