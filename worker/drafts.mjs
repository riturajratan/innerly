import {fail,jsonBody,objectFields,id,encryptReport,decryptReport} from './security.mjs';
import {source} from '../dist/innerly-v1-questions.mjs';
const languages=new Set(['en','hi','zh','es','fr','ar','bn','pt','ru','ur','id','de','ja','mr','te','tr','ta','vi','ko','it']);
export async function draftRequest(request,env,userId,now){
 const db=env.DB;
 if(request.method==='GET'){
  const row=await db.prepare('SELECT * FROM checkin_drafts WHERE user_id=?').bind(userId).first();
  return {revision:row?.revision||0,draft:row?.draft_id?{id:row.draft_id,version:source.version,language:row.language,savedAt:new Date(row.updated_at*1000).toISOString(),answers:await decryptReport(row.responses_ciphertext,env,`${userId}:draft:${row.draft_id}`)}:null};
 }
 const input=await jsonBody(request);objectFields(input,request.method==='DELETE'?['id','revision']:['id','revision','language','answers']);
 if(!id(input.id)||!Number.isSafeInteger(input.revision)||input.revision<0)fail(400,'invalid_draft');
 if(request.method==='PUT'&&(!languages.has(input.language)||!Array.isArray(input.answers)||input.answers.length!==36||!input.answers.every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<=4))))fail(400,'invalid_draft');
 // Keep a revision tombstone when a draft finishes, so a stale tab cannot revive it.
 await db.prepare('INSERT OR IGNORE INTO checkin_drafts(user_id,revision,updated_at) VALUES (?,0,?)').bind(userId,now).run();
 let result;
 if(request.method==='DELETE')result=await db.prepare('UPDATE checkin_drafts SET draft_id=NULL,language=NULL,responses_ciphertext=NULL,revision=revision+1,updated_at=? WHERE user_id=? AND revision=? AND draft_id=?').bind(now,userId,input.revision,input.id).run();
 else{
  const ciphertext=await encryptReport(input.answers,env,`${userId}:draft:${input.id}`);
  result=await db.prepare('UPDATE checkin_drafts SET draft_id=?,language=?,responses_ciphertext=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=?').bind(input.id,input.language,ciphertext,now,userId,input.revision).run();
 }
 if(result.meta.changes!==1)fail(409,'draft_changed');
 return {saved:true,revision:input.revision+1};
}
