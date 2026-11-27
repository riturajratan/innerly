import {appOrigin,fail,jsonBody,objectFields,id,rateLimit,digest} from './security.mjs';
export const TESTIMONIAL_CONSENT='testimonial-name-message-v2';
const MAX_PHOTO_BYTES=3*1024*1024;
const MAX_FORM_BYTES=3.2*1024*1024;
async function readForm(request){
 if(Number(request.headers.get('content-length'))>MAX_FORM_BYTES)fail(413,'request_too_large');
 const reader=request.body?.getReader();if(!reader)fail(400,'invalid_feedback');
 const chunks=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_FORM_BYTES){await reader.cancel();fail(413,'request_too_large');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 const bounded=new Response(bytes,{headers:{'Content-Type':request.headers.get('content-type')}});return bounded.formData();
}
function photoType(file){
 if(!file||file.size<12||file.size>MAX_PHOTO_BYTES)return null;
 return file.slice(0,12).arrayBuffer().then(buffer=>{
  const b=new Uint8Array(buffer),ascii=(start,end)=>String.fromCharCode(...b.slice(start,end));
  if(b[0]===0x89&&ascii(1,4)==='PNG')return ['image/png','png'];
  if(b[0]===0xff&&b[1]===0xd8&&b[2]===0xff)return ['image/jpeg','jpg'];
  if(ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP')return ['image/webp','webp'];
  return null;
 });
}
export async function submitFeedback(request,env,now){
 if(request.headers.get('origin')!==appOrigin(env))fail(403,'origin_not_allowed');
 let value,photo=null;
 if(request.headers.get('content-type')?.toLowerCase().startsWith('multipart/form-data')){
  const fingerprint=await digest(`feedback:${request.headers.get('cf-connecting-ip')||'local'}`);
  await rateLimit(env.DB,`feedback:${fingerprint}`,now,5);
  const form=await readForm(request);value=Object.fromEntries(['id','name','email','message','kind','testimonialConsent','testimonialPhotoConsent'].map(key=>[key,form.get(key)]));
  const upload=form.get('photo');if(upload instanceof File&&upload.size){photo=upload;}
  value.testimonialConsent=value.testimonialConsent==='true';value.testimonialPhotoConsent=value.testimonialPhotoConsent==='true';
 }else{value=await jsonBody(request);objectFields(value,['id','name','email','message','kind','testimonialConsent']);value.testimonialPhotoConsent=false;}
 if(!id(value.id)||!['idea','problem','love'].includes(value.kind)||['name','email','message'].some(k=>typeof value[k]!=='string')||typeof value.testimonialConsent!=='boolean'||typeof value.testimonialPhotoConsent!=='boolean')fail(400,'invalid_feedback');
 const name=value.name.trim(),email=value.email.trim(),message=value.message.trim();
 if(!name||name.length>80||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<10||message.length>1500||value.testimonialConsent&&value.kind!=='love'||value.testimonialPhotoConsent&&(!photo||!value.testimonialConsent||value.kind!=='love'))fail(400,'invalid_feedback');
 let photoKey=null,photoContentType=null,photoHash='';
 if(photo){
  if(!env.FEEDBACK_MEDIA)fail(503,'feedback_photo_storage_unavailable');
  const type=await photoType(photo);if(!type)fail(400,'unsupported_feedback_photo');
  const bytes=await photo.arrayBuffer();photoHash=await digest(bytes);photoContentType=type[0];photoKey=`feedback/${value.id}.${type[1]}`;
 }
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('multipart/form-data')){
  const fingerprint=await digest(`feedback:${request.headers.get('cf-connecting-ip')||'local'}`);
  await rateLimit(env.DB,`feedback:${fingerprint}`,now,5);
 }
 const hash=await digest(JSON.stringify([name,email,message,value.kind,value.testimonialConsent,value.testimonialPhotoConsent,photoHash]));
 const prior=await env.DB.prepare('SELECT content_hash FROM feedback WHERE id=?').bind(value.id).first();
 if(prior){if(prior.content_hash!==hash)fail(409,'feedback_id_reused');return {saved:true,id:value.id};}
 if(photo)await env.FEEDBACK_MEDIA.put(photoKey,photo.stream(),{httpMetadata:{contentType:photoContentType,cacheControl:'private, no-store'}});
 try{
  await env.DB.prepare(`INSERT OR IGNORE INTO feedback(id,name,email,message,kind,content_hash,testimonial_consent,consent_version,consented_at,created_at,slack_next_attempt,photo_key,photo_content_type,testimonial_photo_consent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(value.id,name,email,message,value.kind,hash,value.testimonialConsent?1:0,value.testimonialConsent?TESTIMONIAL_CONSENT:null,value.testimonialConsent?now:null,now,now,photoKey,photoContentType,value.testimonialPhotoConsent?1:0).run();
  const saved=await env.DB.prepare('SELECT content_hash FROM feedback WHERE id=?').bind(value.id).first();
  if(saved?.content_hash!==hash){if(photoKey)await env.FEEDBACK_MEDIA.delete(photoKey);fail(409,'feedback_id_reused');}
 }catch(error){if(photoKey)await env.FEEDBACK_MEDIA.delete(photoKey);throw error;}
 return {saved:true,id:value.id};
}
