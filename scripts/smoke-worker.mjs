// Integration smoke test against actual workerd + D1. Only synthetic identities,
// a throwaway RSA key and isolated local database are used. No provider account.
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { jwtKey, token, timestamp } from '../tests/backend/helpers.mjs';

const dir = await mkdtemp(join(tmpdir(), 'knowyourmind-smoke-'));
const origin = 'http://127.0.0.1:8788';
const envFile = join(dir, 'test.env'), state = join(dir, 'state');
const cli = join(process.cwd(), 'node_modules/wrangler/bin/wrangler.js');
const childEnv = { ...process.env, XDG_CONFIG_HOME: join(dir, 'config'), WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_PATH: join(dir, 'wrangler.log') };
const config = {
  APP_ORIGIN: origin, CLERK_ISSUER: 'https://clerk.knowyourmind.ai',
  CLERK_PUBLISHABLE_KEY: `pk_test_${Buffer.from('clerk.knowyourmind.ai$').toString('base64')}`,
  CLERK_SECRET_KEY: 'sk_test_synthetic_only', CLERK_JWT_KEY: jwtKey,
  REPORT_ENCRYPTION_KEY: Buffer.alloc(32, 9).toString('base64'), BILLING_ENABLED: 'false', BILLING_PLANS: '[]',
};
await writeFile(envFile, Object.entries(config).map(([key,value]) => `${key}=${JSON.stringify(value)}`).join('\n'), { mode: 0o600 });
const common = ['--env-file', envFile];
async function command(args) {
  const child = spawn(process.execPath, [cli, ...args, ...common], { env: childEnv, stdio: ['ignore','pipe','pipe'] });
  let output = ''; child.stdout.on('data', b => { output += b; }); child.stderr.on('data', b => { output += b; });
  const [code] = await once(child, 'exit');
  if (code !== 0) throw new Error(`Wrangler command failed: ${args.join(' ')}\n${output}`);
}
let server;
try {
  await command(['d1','migrations','apply','DB','--local','--persist-to',state]);
  const seed = join(dir, 'seed.sql');
  await writeFile(seed, `INSERT INTO users VALUES ('user_Alice',${timestamp});
INSERT INTO subscriptions(id,user_id,request_id,plan_key,provider_plan_id,provider_id,amount,currency,status,created_at,updated_at) VALUES ('smoke_subscription','user_Alice','smoke_request','fixture','plan_fixture','sub_fixture',100,'INR','active',${timestamp},${timestamp});
INSERT INTO payments VALUES ('pay_fixture','smoke_subscription','inv_fixture',100,'INR',0,${timestamp-60},${timestamp+3600},${timestamp});`);
  await command(['d1','execute','DB','--local','--persist-to',state,'--file',seed]);
  server = spawn(process.execPath,[cli,'dev','--ip','127.0.0.1','--port','8788','--persist-to',state,...common],{env:childEnv,stdio:['ignore','pipe','pipe']});
  let serverLog='';server.stdout.on('data',b=>{serverLog+=b;});server.stderr.on('data',b=>{serverLog+=b;});
  let ready=false;
  for(let i=0;i<60;i++){
    try{if((await fetch(`${origin}/api/health`)).ok){ready=true;break;}}catch{}
    if(server.exitCode!==null)break;
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  assert.ok(ready,`Local Worker did not start: ${serverLog}`);
  const api=(path,method='GET',body,user='user_Alice')=>fetch(`${origin}/api${path}`,{
    method,headers:{Origin:origin,Authorization:`Bearer ${token({sub:user,azp:origin})}`,'Content-Type':'application/json'},
    ...(body!==undefined?{body:JSON.stringify(body)}:{}),
  });
  const me=await api('/me');assert.equal(me.status,200);assert.equal((await me.json()).billing.active,true);
  const body={clientId:'runtime_report_ABC',version:'innerly-workbook-v1',language:'en',answers:Array(36).fill(2),assessedAt:new Date().toISOString(),consent:'cloud-reports-v1'};
  const saved=await api('/reports','POST',body);assert.equal(saved.status,201);const {id}=await saved.json();
  const read=await api(`/reports/${id}`);assert.equal(read.status,200);assert.equal(read.headers.get('cache-control'),'private, no-store');assert.deepEqual((await read.json()).answers,body.answers);
  assert.equal((await api(`/reports/${id}`,'GET',undefined,'user_Bob')).status,404);
  assert.equal((await api(`/reports/${id}`,'DELETE',undefined,'user_Bob')).status,404);
  assert.equal((await fetch(`${origin}/api/me`)).status,401);
  assert.equal((await api('/billing/subscriptions','POST',{plan:'fixture',requestId:'runtime_checkout'})).status,503);
  assert.equal((await api(`/reports/${id}`,'DELETE')).status,200);
  assert.equal((await api(`/reports/${id}`)).status,404);
  console.log('PASS: actual workerd + D1 migration, Clerk JWT verification, encrypted report round-trip, owner isolation, deletion, cache headers and disabled checkout.');
} finally {
  if(server&&server.exitCode===null){server.kill('SIGTERM');await once(server,'exit');}
  await rm(dir,{recursive:true,force:true});
}
