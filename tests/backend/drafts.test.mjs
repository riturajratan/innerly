import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../../worker/app.mjs';
import {environment,request,timestamp} from './helpers.mjs';
test('encrypted partial drafts are owner scoped, validated and revision protected after deletion',async()=>{
 const env=environment(),app=createApp({authenticateUser:async r=>r.headers.get('authorization').slice(7),now:()=>timestamp});
 const call=(method,body,user)=>app.fetch(request('/api/draft',method,body,user),env);
 const body={id:'draft_test_123',revision:0,language:'en',answers:[2,...Array(35).fill(null)]};
 assert.equal((await call('PUT',body)).status,200);
 const row=env.DB.sqlite.prepare('SELECT * FROM checkin_drafts').get();assert.ok(!row.responses_ciphertext.includes(JSON.stringify(body.answers)));
 const read=await (await call('GET')).json();assert.deepEqual(read.draft.answers,body.answers);assert.equal(read.revision,1);
 assert.equal((await (await call('GET',undefined,'user_Bob')).json()).draft,null);
 assert.equal((await call('PUT',body)).status,409);
 assert.equal((await call('PUT',{...body,revision:1,answers:[9,...Array(35).fill(null)]})).status,400);
 assert.equal((await call('DELETE',{id:body.id,revision:1})).status,200);
 assert.equal((await call('PUT',{...body,revision:1})).status,409);
 assert.deepEqual(await (await call('GET')).json(),{revision:2,draft:null});
});
