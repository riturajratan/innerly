import {bodyText} from './security.mjs';
import {slackDestination} from './signup-notifications.mjs';
export function feedbackMessage(row){
 const field=(label,value)=>({type:'plain_text',text:`${label}\n${value}`,emoji:false});
 const date=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'}).format(new Date(row.created_at*1000));
 return {text:'New Know Your Mind feedback',unfurl_links:false,unfurl_media:false,blocks:[
  {type:'header',text:{type:'plain_text',text:'💬 New Know Your Mind feedback',emoji:true}},
  {type:'section',fields:[field('Type',({idea:'An idea',problem:'An issue',love:'Some love'})[row.kind]),field('Name',row.name),field('Received · IST',date),field('Testimonial permission',row.testimonial_consent?'Yes · review before publishing':'No · private feedback')]},
  {type:'section',text:field('Message',row.message)},
  {type:'context',elements:[field('Feedback ID',row.id),{type:'plain_text',text:'Saved in D1 · Email available privately in the feedback table',emoji:false}]}
 ]};
}
export async function deliverFeedback(env,fetcher=fetch,now=Math.floor(Date.now()/1000),feedbackId=null){
 if(!env.SLACK_SIGNUP_WEBHOOK_URL)return;
 const destination=slackDestination(env.SLACK_SIGNUP_WEBHOOK_URL);
 const rows=await env.DB.prepare(`SELECT * FROM feedback WHERE slack_sent_at IS NULL AND slack_next_attempt<=? AND (? IS NULL OR id=?) ORDER BY slack_next_attempt LIMIT 20`).bind(now,feedbackId,feedbackId).all();
 for(const row of rows.results){
  const claim=crypto.randomUUID();
  const result=await env.DB.prepare(`UPDATE feedback SET slack_claim=?,slack_next_attempt=?,slack_attempts=slack_attempts+1 WHERE id=? AND slack_sent_at IS NULL AND slack_next_attempt<=?`).bind(claim,now+60,row.id,now).run();
  if(result.meta.changes!==1)continue;
  try{
   const response=await fetcher(destination,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(feedbackMessage(row)),redirect:'manual',signal:AbortSignal.timeout(8000)});
   if(!response.ok||(await bodyText(response,1024)).trim()!=='ok')throw new Error('delivery_failed');
   await env.DB.prepare('UPDATE feedback SET slack_sent_at=?,slack_next_attempt=NULL WHERE id=? AND slack_claim=?').bind(now,row.id,claim).run();
  }catch{
   await env.DB.prepare('UPDATE feedback SET slack_next_attempt=? WHERE id=? AND slack_claim=? AND slack_sent_at IS NULL').bind(now+Math.min(3600,60*2**Math.min(row.slack_attempts,6)),row.id,claim).run();
  }
 }
}
