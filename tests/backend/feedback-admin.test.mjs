import test from 'node:test';import assert from 'node:assert/strict';
import {createApp} from '../../worker/app.mjs';import {environment,request,timestamp} from './helpers.mjs';
function setup(){const env=environment();env.FEEDBACK_ADMIN_USER_IDS='user_Admin';const app=createApp({authenticateUser:async r=>r.headers.get('authorization')?.slice(7)||'',now:()=>timestamp});return {env,app,call:(path,method='GET',body,user='user_Admin')=>app.fetch(request(path,method,body,user),env)};}
const sample={id:'feedback_review_123',name:'Example User',email:'private@example.com',message:'This fictional test must never be published on the real site.',kind:'love',testimonialConsent:true};
test('only designated admin can review, only opted-in approved content is public, withdrawal removes it',async()=>{
 const {env,call}=setup();await call('/api/feedback','POST',sample);
 assert.equal((await call('/api/admin/feedback','GET',undefined,'user_Other')).status,403);
 assert.deepEqual(await (await call('/api/testimonials')).json(),{testimonials:[]});
 assert.equal((await call('/api/admin/feedback','POST',{id:sample.id,action:'approve',revision:0})).status,200);
 assert.deepEqual(await (await call('/api/testimonials')).json(),{testimonials:[{name:sample.name,message:sample.message}]});
 assert.equal((await call('/api/admin/feedback','POST',{id:sample.id,action:'reject',revision:0})).status,409);
 assert.equal(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM feedback_review_audit').get().n,1);
 await call('/api/admin/feedback','POST',{id:sample.id,action:'withdraw',revision:1});
 assert.deepEqual(await (await call('/api/testimonials')).json(),{testimonials:[]});
 assert.equal((await call('/api/admin/feedback','POST',{id:sample.id,action:'approve',revision:2})).status,400);
});
test('admin access fails closed, feedback without permission cannot be published',async()=>{
 const {env,call}=setup();await call('/api/feedback','POST',{...sample,testimonialConsent:false});
 assert.equal((await call('/api/admin/feedback','POST',{id:sample.id,action:'approve',revision:0})).status,400);
 env.FEEDBACK_ADMIN_USER_IDS='';assert.equal((await call('/api/admin/feedback')).status,403);
});
