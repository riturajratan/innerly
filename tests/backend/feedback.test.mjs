import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../../worker/app.mjs';
import {environment,request,timestamp} from './helpers.mjs';
const body={id:'feedback_test_123',name:'Example Reader',email:'reader@example.com',message:'I love the clear reflection report.',kind:'love',testimonialConsent:true};
test('guest feedback is saved once, records explicit consent and remains unpublished',async()=>{
 const env=environment(),app=createApp({now:()=>timestamp});
 const call=value=>app.fetch(request('/api/feedback','POST',value),env);
 assert.equal((await call(body)).status,201);assert.equal((await call(body)).status,201);
 const rows=env.DB.sqlite.prepare('SELECT * FROM feedback').all();assert.equal(rows.length,1);assert.equal(rows[0].message,body.message);assert.equal(rows[0].review_status,'new');assert.equal(rows[0].testimonial_consent,1);assert.equal(rows[0].consented_at,timestamp);
 assert.equal((await call({...body,message:'Changed content must not replace consent.'})).status,409);
 assert.equal((await app.fetch(request('/api/feedback','GET'),env)).status,401);
});
test('feedback rejects invalid consent, origin and excessive requests',async()=>{
 const env=environment(),app=createApp({now:()=>timestamp});
 assert.equal((await app.fetch(request('/api/feedback','POST',{...body,kind:'problem'}),env)).status,400);
 const cross=request('/api/feedback','POST',body);cross.headers.set('origin','https://other.example');assert.equal((await app.fetch(cross,env)).status,403);
 for(let i=0;i<5;i++)assert.equal((await app.fetch(request('/api/feedback','POST',{...body,id:`feedback_${i}_123`,testimonialConsent:false}),env)).status,201);
 assert.equal((await app.fetch(request('/api/feedback','POST',body),env)).status,429);
 const row=env.DB.sqlite.prepare('SELECT * FROM feedback LIMIT 1').get();assert.equal(row.testimonial_consent,0);assert.equal(row.consent_version,null);
 assert.throws(()=>env.DB.sqlite.prepare("UPDATE feedback SET review_status='approved'").run());
});
