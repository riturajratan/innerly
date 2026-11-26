// Exercise real workerd fetch semantics; no provider credentials or network calls.
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
const bundled = await build({ stdin: { contents: `
import {signupWebhook} from './worker/signup-notifications.mjs';
import {razorpay} from './worker/billing.mjs';
export default {async fetch(request,env){try{
const result=new URL(request.url).pathname==='/signup'
?await signupWebhook(request,env,fetch,Math.floor(Date.now()/1000))
:await razorpay(env)('plans/plan_Test');
return Response.json(result);
}catch(error){return Response.json({error:error.code||'unexpected_runtime_error'}, {status:error.status||500});}}};`, resolveDir: process.cwd() },
  bundle: true, write: false, format: 'esm', platform: 'browser', target: 'es2022', conditions: ['workerd','worker','browser'], external: ['node:*'] });
const secret = Buffer.alloc(32, 21);
let redirect = true;
const calls = [];
const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: bundled.outputFiles[0].text,
  compatibilityDate: '2026-11-26', compatibilityFlags: ['nodejs_compat'],
  d1Databases: ['DB'], bindings: {CLERK_WEBHOOK_INSTANCE_ID:'ins_Test',CLERK_WEBHOOK_SIGNING_SECRET:`whsec_${secret.toString('base64')}`,
    SLACK_SIGNUP_WEBHOOK_URL:'https://hooks.slack.com/services/TTEST/BTEST/testonly', RAZORPAY_KEY_ID:'test-only',RAZORPAY_KEY_SECRET:'test-only'},
  outboundService: async request => {
    calls.push(request.url);
    if(redirect) return new Response(null,{status:302,headers:{Location:'https://redirect.invalid/'}});
    if(request.url.startsWith('https://hooks.slack.com/')) return new Response('ok');
    return Response.json({id:'plan_Test'});
  },
}));
try {
  const db=await mf.getD1Database('DB'); await db.exec((await readFile('migrations/0002_signup_notifications.sql','utf8')).replace(/^--.*$/gm,'').replace(/\n/g,' '));
  const body=JSON.stringify({instance_id:'ins_Test',type:'user.created',data:{id:'user_Test',created_at:Date.now(),email_addresses:[],external_accounts:[]}});
  const id='msg_RuntimeSignup'; const ts=String(Math.floor(Date.now()/1000));
  const headers={'svix-id':id,'svix-timestamp':ts,'svix-signature':'v1,'+createHmac('sha256',secret).update(`${id}.${ts}.${body}`).digest('base64')};
  const signup=()=>mf.dispatchFetch('https://local.test/signup',{method:'POST',headers,body});
  assert.equal((await signup()).status,503); assert.equal(calls.length,1);
  assert.equal((await mf.dispatchFetch('https://local.test/payment')).status,502); assert.equal(calls.length,2);
  assert.ok(calls.every(url=>!url.includes('redirect.invalid')),'Credentials must never follow redirects');
  redirect=false;
  assert.deepEqual(await (await signup()).json(),{notified:true});
  assert.deepEqual(await (await signup()).json(),{duplicate:true});
  assert.equal(calls.length,3);
  assert.deepEqual(await (await mf.dispatchFetch('https://local.test/payment')).json(),{id:'plan_Test'});
  console.log('PASS: workerd Slack/Razorpay outbound requests succeed, reject redirects and deduplicate delivery.');
} finally {await mf.dispose();}
