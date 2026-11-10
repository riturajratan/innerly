import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clerkConfig,authReturnUrl} from '../dist/clerk-config.mjs';
import {createClerkAuth,loadClerkScript} from '../dist/clerk-auth.mjs';
import {rememberAuthReturn,takeAuthReturn,AUTH_RETURN_STORAGE} from '../dist/auth-continuation.mjs';

const key = domain => `pk_test_${Buffer.from(`${domain}$`).toString('base64')}`;
const validKey = key('example.clerk.accounts.dev');
const storage = () => {
  const values = new Map();
  return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
};
function harness(overrides={}) {
  const calls=[],states=[];
  let listener;
  const client={isSignedIn:false,user:null,
    load:async options=>calls.push(['load',options]),
    addListener:fn=>{listener=fn;return()=>calls.push(['unsubscribe']);},
    openSignIn:options=>calls.push(['signIn',options]),
    openUserProfile:()=>calls.push(['profile']),
    signOut:async options=>{calls.push(['signOut',options]);client.isSignedIn=false;client.user=null;listener?.();}
  };
  const win={location:{href:'https://example.com/innerly/?redirect_url=https://evil.example/'}};
  const loader=async(_doc,url,key)=>{
    calls.push(['script',url,key]);
    if(url.includes('/ui@'))win.__internal_ClerkUICtor={};else win.Clerk=client;
  };
  const auth=createClerkAuth({publishableKey:validKey,window:win,document:{},onChange:s=>states.push(s),loadScript:loader,...overrides});
  return {auth,client,win,calls,states,emit:()=>listener?.()};
}
test('public config rejects secrets, malformed keys and URL/path injection',()=>{
  assert.equal(clerkConfig().enabled,false);
  assert.equal(clerkConfig(validKey).domain,'example.clerk.accounts.dev');
  assert.equal(clerkConfig(validKey.replace('pk_test_','pk_live_')).enabled,true);
  for(const value of ['sk_test_PRIVATE','pk_test_!',key('bad.com/path'),key('user@bad.com'),key('bad.com:443'),key('localhost'),key('127.0.0.1'),key('-bad.com')]) {
    assert.throws(()=>clerkConfig(value));
  }
});
test('auth returns stay inside the installed site path and preserve supported language syntax',()=>{
  assert.equal(authReturnUrl('https://example.com/innerly/index.html?redirect_url=https://evil.test/#a','hi'),'https://example.com/innerly/?lang=hi');
  assert.equal(authReturnUrl('http://localhost:4298/','zh-CN'),'http://localhost:4298/?lang=zh-CN');
  assert.equal(new URL(authReturnUrl('https://example.com/innerly/','//evil')).searchParams.get('lang'),'en');
  assert.throws(()=>authReturnUrl('file:///innerly/index.html'));
});
test('missing key makes no provider requests and keeps guest mode available',async()=>{
  const h=harness({publishableKey:''});
  assert.equal(h.auth.state.status,'disabled');
  assert.equal(await h.auth.ready(),null);await h.auth.signIn('en');
  assert.equal(h.calls.length,0);
});
test('concurrent initialization loads Core 3 once; sign-in and sign-up use same safe return path',async()=>{
  const h=harness();await Promise.all([h.auth.ready(),h.auth.ready()]);
  assert.equal(h.calls.filter(c=>c[0]==='script').length,2);
  assert.equal(h.calls.filter(c=>c[0]==='load').length,1);
  assert.match(h.calls.find(c=>c[0]==='script')[1],/ui@1/);
  assert.match(h.calls.filter(c=>c[0]==='script')[1][1],/clerk-js@6/);
  assert.equal(h.calls.find(c=>c[0]==='load')[1].telemetry,false);
  await h.auth.signIn('hi');
  assert.deepEqual(h.calls.find(c=>c[0]==='signIn')[1],{withSignUp:true,forceRedirectUrl:'https://example.com/innerly/?lang=hi',signUpForceRedirectUrl:'https://example.com/innerly/?lang=hi'});
});
test('session changes update account state; sign-out returns to the same site',async()=>{
  const h=harness();await h.auth.ready();
  assert.equal(h.auth.state.status,'signed-out');
  h.client.isSignedIn=true;h.client.user={id:'account-test'};h.emit();
  assert.equal(h.auth.state.status,'signed-in');
  await h.auth.signIn('en');assert.equal(h.calls.filter(c=>c[0]==='signIn').length,0);
  await h.auth.profile();assert.ok(h.calls.some(c=>c[0]==='profile'));
  await h.auth.signOut('hi');assert.equal(h.auth.state.status,'signed-out');
  assert.deepEqual(h.calls.find(c=>c[0]==='signOut')[1],{redirectUrl:'https://example.com/innerly/?lang=hi'});
  h.auth.dispose();assert.ok(h.calls.some(c=>c[0]==='unsubscribe'));
});
test('provider load failure can retry without blocking guest data or caching a rejection',async()=>{
  const h=harness();let attempt=0;
  h.client.load=async()=>{if(!attempt++)throw new Error('Offline');};
  await assert.rejects(h.auth.ready());assert.equal(h.auth.state.status,'error');
  await h.auth.ready();assert.equal(h.auth.state.status,'signed-out');
});
test('a hung provider times out and does not leave the account control permanently loading',async()=>{
  const h=harness({timeoutMs:5});h.client.load=()=>new Promise(()=>{});
  await assert.rejects(h.auth.ready(),/too long/);assert.equal(h.auth.state.status,'error');
});
test('script errors remove the failed script and allow a subsequent retry',async()=>{
  const elements=[];
  const document={createElement:()=>({setAttribute(){},remove(){this.removed=true;}}),head:{appendChild:el=>{elements.push(el);queueMicrotask(()=>el.onerror());}}};
  await assert.rejects(loadClerkScript(document,'https://example.clerk.accounts.dev/sdk.js'),/unavailable/);
  assert.equal(elements[0].removed,true);
  document.head.appendChild=el=>{elements.push(el);queueMicrotask(()=>el.onload());};
  await loadClerkScript(document,'https://example.clerk.accounts.dev/sdk.js');assert.equal(elements.length,2);
});
test('auth continuation stores navigation only, expires and is consumed exactly once',()=>{
  const s=storage();rememberAuthReturn(s,{view:'quiz',language:'hi',answers:['private']},1000);
  assert.equal(s.getItem(AUTH_RETURN_STORAGE).includes('answers'),false);
  assert.deepEqual(takeAuthReturn(s,2000),{view:'quiz',reportId:null,language:'hi'});
  assert.equal(takeAuthReturn(s,2000),null);
  rememberAuthReturn(s,{view:'report',reportId:'saved-report',language:'en'},1000);
  assert.equal(takeAuthReturn(s,1000+31*60*1000),null);
  for(const value of ['bad',JSON.stringify({view:'https://evil.test',language:'en',createdAt:1000,reportId:null})]){
    s.setItem(AUTH_RETURN_STORAGE,value);assert.equal(takeAuthReturn(s,2000),null);
  }
});
test('blocked storage is tolerated when reading continuation',()=>{
  assert.equal(takeAuthReturn({getItem(){throw new Error('Blocked');}}),null);
});
