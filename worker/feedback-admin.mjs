import {fail,jsonBody,objectFields,id} from './security.mjs';
export function isFeedbackAdmin(env,userId){return (env.FEEDBACK_ADMIN_USER_IDS||'').split(',').map(s=>s.trim()).filter(Boolean).includes(userId);}
const TESTIMONIAL_VERSIONS="'testimonial-name-message-v1','testimonial-name-message-v2'";
export async function publicTestimonials(env){
 const rows=await env.DB.prepare(`SELECT id,name,message,photo_key,testimonial_photo_consent FROM feedback WHERE kind='love' AND testimonial_consent=1 AND consent_version IN (${TESTIMONIAL_VERSIONS}) AND review_status='approved' ORDER BY reviewed_at DESC,id DESC LIMIT 3`).all();
 return {testimonials:rows.results.map(({id,name,message,photo_key,testimonial_photo_consent})=>({name,message,...(photo_key&&testimonial_photo_consent===1?{photoUrl:`/api/testimonial-photo/${id}`}:{})}))};
}
export async function publicTestimonialPhoto(env,feedbackId){
 const row=await env.DB.prepare(`SELECT photo_key,photo_content_type FROM feedback WHERE id=? AND kind='love' AND testimonial_consent=1 AND testimonial_photo_consent=1 AND consent_version IN (${TESTIMONIAL_VERSIONS}) AND review_status='approved'`).bind(feedbackId).first();
 if(!row?.photo_key||!env.FEEDBACK_MEDIA)fail(404,'photo_not_found');
 const object=await env.FEEDBACK_MEDIA.get(row.photo_key);if(!object)fail(404,'photo_not_found');
 return new Response(object.body,{headers:{'Content-Type':row.photo_content_type||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Cross-Origin-Resource-Policy':'same-origin'}});
}
export async function adminFeedbackPhoto(env,userId,feedbackId){
 if(!isFeedbackAdmin(env,userId))fail(403,'admin_required');
 if(!id(feedbackId)||!env.FEEDBACK_MEDIA)fail(404,'photo_not_found');
 const row=await env.DB.prepare('SELECT photo_key,photo_content_type FROM feedback WHERE id=?').bind(feedbackId).first();
 if(!row?.photo_key)fail(404,'photo_not_found');
 const object=await env.FEEDBACK_MEDIA.get(row.photo_key);if(!object)fail(404,'photo_not_found');
 return new Response(object.body,{headers:{'Content-Type':row.photo_content_type||'application/octet-stream','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin'}});
}
export async function feedbackAdmin(request,env,userId,now){
 if(!isFeedbackAdmin(env,userId))fail(403,'admin_required');
 const url=new URL(request.url);
 if(request.method==='GET'){
  const status=url.searchParams.get('status')||'new',offset=Number(url.searchParams.get('offset')||0);
  if(!['new','reviewed','approved','rejected','all'].includes(status)||!Number.isSafeInteger(offset)||offset<0)fail(400,'invalid_filter');
  const rows=await env.DB.prepare("SELECT id,name,email,message,kind,testimonial_consent,testimonial_photo_consent,photo_key IS NOT NULL AS photo_available,consent_version,consented_at,created_at,review_status,review_revision,reviewed_at,slack_sent_at FROM feedback WHERE (?='all' OR review_status=?) ORDER BY created_at DESC,id DESC LIMIT 26 OFFSET ?").bind(status,status,offset).all();
  return {feedback:rows.results.slice(0,25),hasMore:rows.results.length>25};
 }
 if(request.method!=='POST')fail(405,'method_not_allowed');
 const input=await jsonBody(request);objectFields(input,['id','action','revision']);
 if(typeof input.id!=='string'||!['approve','review','reject','withdraw'].includes(input.action)||!Number.isSafeInteger(input.revision)||input.revision<0)fail(400,'invalid_review');
 const status={approve:'approved',review:'reviewed',reject:'rejected',withdraw:'rejected'}[input.action];
 const row=await env.DB.prepare('SELECT * FROM feedback WHERE id=?').bind(input.id).first();
 if(!row)fail(404,'feedback_not_found');
 if(input.action==='approve'&&(row.kind!=='love'||row.testimonial_consent!==1||!['testimonial-name-message-v1','testimonial-name-message-v2'].includes(row.consent_version)))fail(400,'testimonial_permission_required');
 const auditId=crypto.randomUUID();
 const results=await env.DB.batch([
  env.DB.prepare(`UPDATE feedback SET review_status=?,reviewed_by=?,reviewed_at=?,review_revision=review_revision+1,
   testimonial_consent=CASE WHEN ?='withdraw' THEN 0 ELSE testimonial_consent END,
   consent_version=CASE WHEN ?='withdraw' THEN NULL ELSE consent_version END,
   consented_at=CASE WHEN ?='withdraw' THEN NULL ELSE consented_at END,
   testimonial_photo_consent=CASE WHEN ?='withdraw' THEN 0 ELSE testimonial_photo_consent END
   WHERE id=? AND review_revision=? AND (?!='approve' OR (kind='love' AND testimonial_consent=1 AND consent_version IN (${TESTIMONIAL_VERSIONS})))`).bind(status,userId,now,input.action,input.action,input.action,input.action,input.id,input.revision,input.action),
  env.DB.prepare('INSERT INTO feedback_review_audit(id,feedback_id,actor_id,action,created_at) SELECT ?,?,?,?,? WHERE changes()=1').bind(auditId,input.id,userId,input.action,now)
 ]);
 if(results[0].meta.changes!==1)fail(409,'feedback_changed');
 return {saved:true};
}
