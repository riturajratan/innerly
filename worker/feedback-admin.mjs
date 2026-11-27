import {fail,jsonBody,objectFields} from './security.mjs';
export function isFeedbackAdmin(env,userId){return (env.FEEDBACK_ADMIN_USER_IDS||'').split(',').map(s=>s.trim()).filter(Boolean).includes(userId);}
export async function publicTestimonials(env){
 const rows=await env.DB.prepare("SELECT name,message FROM feedback WHERE kind='love' AND testimonial_consent=1 AND consent_version='testimonial-name-message-v1' AND review_status='approved' ORDER BY reviewed_at DESC,id DESC LIMIT 3").all();
 return {testimonials:rows.results.map(({name,message})=>({name,message}))};
}
export async function feedbackAdmin(request,env,userId,now){
 if(!isFeedbackAdmin(env,userId))fail(403,'admin_required');
 const url=new URL(request.url);
 if(request.method==='GET'){
  const status=url.searchParams.get('status')||'new',offset=Number(url.searchParams.get('offset')||0);
  if(!['new','reviewed','approved','rejected','all'].includes(status)||!Number.isSafeInteger(offset)||offset<0)fail(400,'invalid_filter');
  const rows=await env.DB.prepare("SELECT id,name,email,message,kind,testimonial_consent,consent_version,consented_at,created_at,review_status,review_revision,reviewed_at,slack_sent_at FROM feedback WHERE (?='all' OR review_status=?) ORDER BY created_at DESC,id DESC LIMIT 26 OFFSET ?").bind(status,status,offset).all();
  return {feedback:rows.results.slice(0,25),hasMore:rows.results.length>25};
 }
 if(request.method!=='POST')fail(405,'method_not_allowed');
 const input=await jsonBody(request);objectFields(input,['id','action','revision']);
 if(typeof input.id!=='string'||!['approve','review','reject','withdraw'].includes(input.action)||!Number.isSafeInteger(input.revision)||input.revision<0)fail(400,'invalid_review');
 const status={approve:'approved',review:'reviewed',reject:'rejected',withdraw:'rejected'}[input.action];
 const row=await env.DB.prepare('SELECT * FROM feedback WHERE id=?').bind(input.id).first();
 if(!row)fail(404,'feedback_not_found');
 if(input.action==='approve'&&(row.kind!=='love'||row.testimonial_consent!==1||row.consent_version!=='testimonial-name-message-v1'))fail(400,'testimonial_permission_required');
 const auditId=crypto.randomUUID();
 const results=await env.DB.batch([
  env.DB.prepare(`UPDATE feedback SET review_status=?,reviewed_by=?,reviewed_at=?,review_revision=review_revision+1,
   testimonial_consent=CASE WHEN ?='withdraw' THEN 0 ELSE testimonial_consent END,
   consent_version=CASE WHEN ?='withdraw' THEN NULL ELSE consent_version END,
   consented_at=CASE WHEN ?='withdraw' THEN NULL ELSE consented_at END
   WHERE id=? AND review_revision=? AND (?!='approve' OR (kind='love' AND testimonial_consent=1 AND consent_version='testimonial-name-message-v1'))`).bind(status,userId,now,input.action,input.action,input.action,input.id,input.revision,input.action),
  env.DB.prepare('INSERT INTO feedback_review_audit(id,feedback_id,actor_id,action,created_at) SELECT ?,?,?,?,? WHERE changes()=1').bind(auditId,input.id,userId,input.action,now)
 ]);
 if(results[0].meta.changes!==1)fail(409,'feedback_changed');
 return {saved:true};
}
