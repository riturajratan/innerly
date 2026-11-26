import test from 'node:test';
import assert from 'node:assert/strict';
import {createAccountReportStore} from '../dist/account-report-store.mjs';
import {createCloudApi} from '../dist/cloud-api.mjs';
import {comparisonData,comparisonMarkup,accountHistoryMarkup} from '../dist/report-history-view.mjs';
import {personalReportMarkup} from '../dist/personal-report-view.mjs';
import {consolidatedComparisonData,consolidatedComparisonMarkup} from '../dist/report-comparison-summary.mjs';
import {reportSnapshot} from '../dist/report-concept-view.mjs';
const report=(id,date='2026-11-25T10:00:00.000Z',language='en',value=2)=>({id,version:'innerly-workbook-v1',createdAt:date,language,answers:Array(36).fill(value)});
test('account report actions and storage labels refer to the account, never a browser copy',()=>{
 const row={...report('cloud_saved'),cloudId:'cloud_saved'},html=personalReportMarkup(row,[row]);
 assert.match(html,/data-cloud-delete="cloud_saved"/);assert.doesNotMatch(html,/data-delete="cloud_saved"|Saved automatically in this browser|Saved on this device|Not synced to an account/);
});
test('consolidated comparison preserves the report categories and handles reverse-worded questions',()=>{
 const before=report('before'),after={...report('after'),answers:[...before.answers]};
 // More awareness is supportive; more repetitive worry is a growth opportunity.
 after.answers[0]=4;after.answers[31]=4;
 const data=consolidatedComparisonData(before,after);
 assert.deepEqual(data.before,reportSnapshot(before.answers).counts);assert.deepEqual(data.after,reportSnapshot(after.answers).counts);
 assert.deepEqual(data.delta,{support:1,focus:1,varies:-2});assert.deepEqual(data.areas.map(a=>a.changed),[1,0,0,0,0,1]);
 for(const area of data.areas){assert.equal(Object.values(area.before).reduce((a,b)=>a+b),6);assert.equal(Object.values(area.after).reduce((a,b)=>a+b),6);}
 const html=comparisonMarkup([before,after]);assert.ok(html.indexOf('Your overall report, before')>html.indexOf('Compare all 36 answers'));assert.match(html,/not a health score/);assert.doesNotMatch(html,/Export JSON|data-cloud-export/);
});
test('overall comparison refuses incompatible or incomplete reports and keeps identical reports at zero change',()=>{
 const before=report('before');assert.equal(consolidatedComparisonData(before,{...before,language:'hi'}),null);assert.equal(consolidatedComparisonData(before,{...before,version:'other'}),null);assert.equal(consolidatedComparisonMarkup(before,{...before,answers:Array(36).fill(null)}),'');
 const same=consolidatedComparisonData(before,before);assert.deepEqual(same.delta,{support:0,focus:0,varies:0});assert.ok(same.areas.every(area=>area.changed===0));
});
test('comparison separates languages, removes duplicates and retains exact response frequencies',()=>{
 const before=report('before'),after=report('after','2026-11-26T10:00:00.000Z','en',4),other=report('other','2026-11-26T12:00:00.000Z','hi',0);
 const data=comparisonData([after,before,other,before],{language:'en',question:4});
 assert.deepEqual(data.rows.map(r=>r.id),['before','after']);assert.equal(data.changed,36);assert.equal(data.from.answers[4],2);assert.equal(data.to.answers[4],4);
 const html=comparisonMarkup([before,after],{question:0});assert.match(html,/36 of 36/);assert.match(html,/not a clinical progress score/);assert.doesNotMatch(html,/improved by|percentile/);
 const reversed=comparisonData([before,after],{fromId:'after',toId:'before'});assert.equal(reversed.from.id,'before');assert.equal(reversed.to.id,'after');
});
test('a stale history load cannot hide a report saved while the request was in flight',async()=>{
 let resolve,reads=0;const row=report('saved');const store=createAccountReportStore({api:async(path,method)=>{
  if(method==='POST')return {id:'saved'};
  if(++reads===1)return new Promise(r=>resolve=r);
  return {reports:[row],nextCursor:null};
 }});store.setUser('alice');const load=store.load();await store.save(row,'cloud-reports-v1');resolve({reports:[],nextCursor:null});await load;
 assert.equal(store.state.reports[0].id,'saved');assert.equal(reads,2);
});
test('account switch clears history immediately and ignores a stale response',async()=>{
 let resolve;const api=()=>new Promise(r=>resolve=r),store=createAccountReportStore({api});store.setUser('alice');const loading=store.load();
 store.setUser('bob');assert.deepEqual(store.state.reports,[]);resolve({reports:[report('alice-report')],nextCursor:null});await loading;
 assert.deepEqual(store.state.reports,[]);assert.equal(store.state.userId,'bob');assert.equal(store.state.loading,false);
});
test('stale save completion never adds another account report and consent is explicit',async()=>{
 let resolve,payload;const store=createAccountReportStore({api:(path,method,body)=>{payload=body;return new Promise(r=>resolve=r);}});store.setUser('alice');
 const saving=store.save(report('browser-report'),'cloud-reports-v1');store.setUser(null);resolve({id:'cloud-report'});
 assert.equal(await saving,null);assert.deepEqual(store.state.reports,[]);assert.equal(payload.consent,'cloud-reports-v1');assert.equal(payload.clientId,'browser-report');
});
test('cloud API refuses to send a report when the account changes while obtaining a token',async()=>{
 let subject='alice',resolve,fetches=0;const api=createCloudApi({getUserId:()=>subject,getToken:()=>new Promise(r=>resolve=r),fetcher:()=>{fetches++;}});
 const saving=api('/reports','POST',{});subject='bob';resolve('bob-token');await assert.rejects(saving,/account changed/);assert.equal(fetches,0);
});
test('paged account history is deduplicated and sorted while failures remain visible',async()=>{
 let page=0;const store=createAccountReportStore({api:async()=>{page++;if(page===1)return {reports:[report('later','2026-11-26T10:00:00.000Z')],nextCursor:'later'};if(page===2)return {reports:[report('earlier'),report('later','2026-11-26T10:00:00.000Z')],nextCursor:null};throw new Error('offline');}});
 store.setUser('alice');await store.load();await store.load(true);assert.deepEqual(store.state.reports.map(r=>r.id),['later','earlier']);await store.load();assert.equal(store.state.error,'offline');assert.equal(store.state.reports.length,2);
});
test('one report invites a return check-in; charts require two distinct compatible reports',()=>{
 const first=report('first');const invitation=comparisonMarkup([first,first]);assert.match(invitation,/Your first check-in is saved/);assert.doesNotMatch(invitation,/Notice what has changed|<svg|data-compare="fromId"/);
 const hi=report('hi','2026-11-26T10:00:00.000Z','hi');assert.doesNotMatch(comparisonMarkup([first,hi]),/<svg/);
 const second=report('second');assert.match(comparisonMarkup([hi,first,second]),/Notice what has changed/);
 assert.equal(comparisonMarkup([]),'');
});

test('account-first history hides storage choices and keeps unsynced legacy reports recoverable',()=>{
 const old=report('old_report'),synced=report('local_saved'),cloud={userId:'alice',reports:[{...synced,id:'cloud_saved',clientId:synced.id,cloudId:'cloud_saved'}],loading:false};
 const html=accountHistoryMarkup({localReports:[old,synced],cloud,config:{cloudEnabled:true}});
 assert.doesNotMatch(html,/This browser|Report location|Saved on this device|data-history-source/);
 assert.match(html,/Your check-ins save automatically to your account/);assert.match(html,/Earlier reports \(1\)/);assert.match(html,/data-cloud-open="cloud_saved"/);assert.match(html,/data-cloud-save="old_report"/);
 const guest=personalReportMarkup(old,[old]);assert.doesNotMatch(guest,/Saved on this device|Save on this device|Saved automatically in this browser|data-action="save"/);
});
