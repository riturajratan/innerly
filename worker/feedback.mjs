import {appOrigin,fail,jsonBody,objectFields,id,rateLimit,digest} from './security.mjs';
export const TESTIMONIAL_CONSENT='testimonial-name-message-v1';
export async function submitFeedback(request,env,now){
 if(request.headers.get('origin')!==appOrigin(env))fail(403,'origin_not_allowed');
 const value=await jsonBody(request);
 objectFields(value,['id','name','email','message','kind','testimonialConsent']);
 if(!id(value.id)||!['idea','problem','love'].includes(value.kind)||['name','email','message'].some(k=>typeof value[k]!=='string')||typeof value.testimonialConsent!=='boolean')fail(400,'invalid_feedback');
 const name=value.name.trim(),email=value.email.trim(),message=value.message.trim();
 if(!name||name.length>80||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<10||message.length>1500||value.testimonialConsent&&value.kind!=='love')fail(400,'invalid_feedback');
 const fingerprint=await digest(`feedback:${request.headers.get('cf-connecting-ip')||'local'}`);
 await rateLimit(env.DB,`feedback:${fingerprint}`,now,5);
 const hash=await digest(JSON.stringify([name,email,message,value.kind,value.testimonialConsent]));
 await env.DB.prepare(`INSERT OR IGNORE INTO feedback(id,name,email,message,kind,content_hash,testimonial_consent,consent_version,consented_at,created_at,slack_next_attempt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(value.id,name,email,message,value.kind,hash,value.testimonialConsent?1:0,value.testimonialConsent?TESTIMONIAL_CONSENT:null,value.testimonialConsent?now:null,now,now).run();
 const saved=await env.DB.prepare('SELECT content_hash FROM feedback WHERE id=?').bind(value.id).first();
 if(saved?.content_hash!==hash)fail(409,'feedback_id_reused');
 return {saved:true,id:value.id};
}
