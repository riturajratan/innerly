import test from 'node:test';
import assert from 'node:assert/strict';
import {ANALYTICS_CHOICE,MEASUREMENT_ID,publicPage,installAnalytics} from '../dist/analytics.mjs';

function fixture({choice=null,app=false,url='https://knowyourmind.ai/faq?email=private@example.com#answer'}={}){
 const listeners={},banners=[],scripts=[],cookies=[],values=new Map(choice?[[ANALYTICS_CHOICE,choice]]:[]);
 const storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
 const win={location:new URL(url),addEventListener:(key,fn)=>listeners[key]=fn};
 const doc={referrer:'https://example.com/private/path?token=secret',body:{classList:{contains:()=>app},append:el=>banners.push(el)},head:{append:el=>scripts.push(el)},addEventListener(){},createElement(){return {setAttribute(){},addEventListener(key,fn){this[key]=fn;},remove(){this.removed=true;}};},get cookie(){return '_ga=old; _ga_RCRXJ28CSM=old; session=keep';},set cookie(value){cookies.push(value);}};
 const analytics=installAnalytics({window:win,document:doc,storage});
 const choose=value=>banners.at(-1).click({target:{closest:()=>({dataset:{analytics:value}})}});
 return {win,doc,analytics,choose,scripts,banners,cookies,listeners};
}
test('public analytics strips queries and excludes private routes and other hosts',()=>{
 assert.deepEqual(publicPage('https://knowyourmind.ai/faq.html?email=private#report'),{page_location:'https://knowyourmind.ai/faq',page_title:'Frequently asked questions'});
 for(const url of ['https://knowyourmind.ai/?view=history','https://knowyourmind.ai/?account=1','https://knowyourmind.ai/?start=1','https://knowyourmind.ai/cloud-account','http://localhost:8790/'])assert.equal(publicPage(url),null);
});
test('no Google script or events before consent; opt-in uses only sanitized public metadata',()=>{
 const f=fixture();assert.equal(f.scripts.length,0);assert.equal(f.win.dataLayer,undefined);f.choose('yes');assert.equal(f.scripts.length,1);
 const calls=f.win.dataLayer.map(args=>Array.from(args)),event=calls.find(row=>row[0]==='event')[2];
 assert.equal(event.page_location,'https://knowyourmind.ai/faq');assert.equal(event.page_referrer,'https://example.com/');
 assert.doesNotMatch(JSON.stringify(calls),/private@example|token=|private\/path|user_id|user_properties/);
 assert.equal(calls.find(row=>row[0]==='config')[2].send_page_view,false);
});
test('private app views never initialize analytics even with an existing consent choice',()=>{
 const f=fixture({choice:'yes',app:true,url:'https://knowyourmind.ai/'});assert.equal(f.scripts.length,0);
 f.analytics.setPublicView(false);assert.equal(f.scripts.length,0);f.analytics.setPublicView(true);assert.equal(f.scripts.length,1);
 f.analytics.setPublicView(false);assert.equal(f.win['ga-disable-'+MEASUREMENT_ID],true);
 const count=f.win.dataLayer.length;f.analytics.setPublicView(false);assert.equal(f.win.dataLayer.length,count);
});
test('withdrawal disables measurement and clears analytics cookies without touching sign-in cookies',()=>{
 const f=fixture({choice:'yes'});f.analytics.preferences();f.choose('no');assert.equal(f.win['ga-disable-'+MEASUREMENT_ID],true);
 assert.ok(f.cookies.some(c=>c.startsWith('_ga=')));assert.ok(f.cookies.every(c=>!c.startsWith('session=')));
 const another=fixture({choice:'yes'});another.listeners.storage({key:ANALYTICS_CHOICE,newValue:'no'});assert.equal(another.win['ga-disable-'+MEASUREMENT_ID],true);assert.ok(another.cookies.length);
});
test('analytics stays off on local development and direct private app links',()=>{
 for(const url of ['http://localhost:8790/faq','https://knowyourmind.ai/?view=report'])assert.equal(fixture({choice:'yes',url}).scripts.length,0);
});
