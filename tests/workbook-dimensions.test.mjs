import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dimensionProfile,workbookTimeline,itemReflections} from '../dist/innerly-v1-insights.mjs';
import {workbookDimensions,makeWorkbookReport} from '../dist/innerly-v1-model.mjs';
import {workbookReportMarkup} from '../dist/innerly-v1-views.mjs';
import {workbookTimelineDetail} from '../dist/innerly-v1-charts.mjs';
import {workbookDimensionExplorer,workbookFocusStatus} from '../dist/innerly-v1-charts.mjs';
import {reportMarkup} from '../dist/mental-views.mjs';
import {FREE_DIMENSIONS} from '../dist/innerly-v1-preview.mjs';
import {workbookAreaGuidance} from '../dist/innerly-v1-guidance.mjs';
const make=(id,date,value=2,language='en')=>makeWorkbookReport(Array(36).fill(value),{id,createdAt:date,language});
const current=make('current','2026-11-10T12:00:00Z',4);

test('guidance reads each original answer in its own context without treating skips or midpoints as difficulties',()=>{
 const answers=Array(36).fill('skip');
 answers.splice(6,6,4,4,2,0,0,4);
 const area=workbookAreaGuidance(answers,'dimension-2');
 assert.deepEqual(area.supports.map(item=>item.id),['Q08','Q11','Q12']);
 assert.deepEqual(area.focuses.map(item=>item.id),['Q07','Q10']);
 assert.deepEqual(area.varies.map(item=>item.id),['Q09']);
 assert.equal(area.next.id,'Q07');
 assert.match(area.next.benefit,/thought that keeps repeating/);
 const missing=workbookAreaGuidance(answers,'dimension-1','hi');
 assert.equal(missing.next,undefined);
 assert.ok(missing.items.every(item=>item.category==='unanswered'&&item.step===null&&item.benefit===null));
});

test('the live report renders all six summaries and gives a step and possible benefit for each answered item in print',()=>{
 for(const language of ['en','hi']){
  const html=reportMarkup(current,[],language,'snapshot',{unlocked:true});
  assert.equal((html.match(/class="wb-guidance-card" style=/g)||[]).length,6);
  assert.equal((html.match(/class="wb-guidance-next"/g)||[]).length,6);
  assert.equal((html.match(/<strong>(Possible benefit|संभावित लाभ)<\/strong>/g)||[]).length,36);
 }
});

test('all six dimension profiles map every source question exactly once and retain Never separately from missing',()=>{
 const answers=Array.from({length:36},(_,i)=>i%6===5?'skip':i%6);
 const profiles=workbookDimensions.map(d=>dimensionProfile(answers,d.id));
 assert.deepEqual(profiles.flatMap(d=>d.rows.map(r=>r.index)),Array.from({length:36},(_,i)=>i));
 for(const d of profiles){
  assert.deepEqual(d.rows.map(r=>r.value),[0,1,2,3,4,null]);
  assert.equal(d.answered,5);assert.equal(d.skipped,1);assert.equal(d.rows[0].skipped,false);
 }
 assert.equal(itemReflections.length,36);assert.ok(itemReflections.every(row=>row.length===4&&row.every(s=>typeof s==='string'&&s.length>5)));
});

test('timeline uses actual matching reports, rejects duplicates/future/foreign versions and preserves missing values',()=>{
 const old=make('old','2026-11-01T12:00:00Z',0),missing=make('missing','2026-11-05T12:00:00Z');missing.answers[0]='skip';
 const rows=workbookTimeline(current,[current,{...current,answers:Array(36).fill(0)},old,old,missing,
  make('future','2026-12-01T12:00:00Z'),make('hindi','2026-11-02T12:00:00Z',2,'hi'),
  {...old,id:'different-version',version:'innerly-reflections-60-v1'}, {...old,id:'invalid',createdAt:'invalid'}],0);
 assert.deepEqual(rows.map(r=>[r.id,r.value]),[['old',0],['missing',null],['current',4]]);
 assert.equal(rows.at(-1).current,true);
 assert.deepEqual(workbookTimeline(current,[],37),[]);
 const html=workbookTimelineDetail(current,[old,missing],0);
 // Two valid points separated by a missing response must not be joined.
 assert.doesNotMatch(html,/stroke="#436eb5" stroke-width="3"/);
 assert.match(html,/Not answered/);assert.match(html,/Never/);
});

test('history is sorted, capped at eight, and changes only with that question',()=>{
 const saved=Array.from({length:10},(_,i)=>make(`prior-${i}`,`2026-10-${String(i+1).padStart(2,'0')}T12:00:00Z`,i%5));
 const rows=workbookTimeline(current,saved.reverse(),7);assert.equal(rows.length,8);
 assert.equal(rows[0].id,'prior-3');assert.equal(rows.at(-1).id,'current');
 const changed={...current,answers:[...current.answers]};changed.answers[8]=0;
 assert.deepEqual(workbookTimeline(current,saved,7),workbookTimeline(changed,saved,7));
});

test('a first report never invents a trend and all 36 original questions are included in print',()=>{
 const timeline=workbookTimelineDetail(current,[],0);
 assert.match(timeline,/first point/);assert.doesNotMatch(timeline,/stroke="#436eb5" stroke-width="3"/);
 for(const language of ['en','hi'])for(const view of ['snapshot','days','timeline','journey']){
  const html=workbookReportMarkup(current,language,view,'dimension-5',false,[],26);
  assert.doesNotMatch(html,/undefined|NaN|Infinity/);
  assert.equal((html.match(/class="wb-print-question"/g)||[]).length,36);
  if(view==='snapshot'){assert.equal((html.match(/data-workbook-question=/g)||[]).length,6);assert.match(html,/Q27/);}
  if(view==='days')assert.equal((html.match(/data-workbook-map=/g)||[]).length,36);
  if(view==='timeline')assert.match(html,/<option value="dimension-5" selected>/);
 }
});

test('report opens with two real previews, four decorative locked cards and an explicit free bypass',()=>{
 assert.deepEqual(FREE_DIMENSIONS,['dimension-1','dimension-5']);
 for(const l of ['en','hi']){
  const preview=reportMarkup(current,[],l);
  assert.equal((preview.match(/class="wb-story-card wb-free-card"/g)||[]).length,2);
  assert.equal((preview.match(/class="wb-locked-card"/g)||[]).length,4);
  assert.match(preview,/data-action="report-offer"/);assert.match(preview,/data-action="unlock-preview"/);
  assert.doesNotMatch(preview,/wb-print-question|data-report-view|data-action="print"|data-workbook-question|undefined|NaN/);
  const full=reportMarkup(current,[],l,'snapshot',{unlocked:true});
  assert.match(full,/data-action="print"/);assert.doesNotMatch(full,/data-action="report-offer"/);
 }
 assert.match(reportMarkup(current,[]),/One-time payment/);
 assert.match(reportMarkup(current,[]),/Payments coming soon/);
});

test('all expanded graphs expose six keyboard-accessible marks and linked questions with correct navigation limits',()=>{
 for(const l of ['en','hi'])for(const d of workbookDimensions){
  for(const selected of [d.items[0],d.items[5]]){
   const html=workbookDimensionExplorer(current.answers,d.id,l,selected);
   assert.equal((html.match(/class="rp-row" data-response-question=/g)||[]).length,6);
   assert.equal((html.match(/data-workbook-question=/g)||[]).length,6);
   assert.equal((html.match(/data-explore-area=/g)||[]).length,6);
   assert.match(html,new RegExp(`data-workbook-question="${selected}" aria-pressed="true"`));
   assert.match(html,selected===d.items[0]?/data-response-step="-1" disabled/:/data-response-step="1" disabled/);
   assert.doesNotMatch(html,/undefined|NaN|Infinity/);
  }
 }
 assert.match(workbookFocusStatus(current.answers,26),/Q27/);
 assert.match(workbookFocusStatus(current.answers,26),/Almost Always/);
 const skipped=[...current.answers];skipped[26]='skip';assert.match(workbookFocusStatus(skipped,26),/Not answered/);
});
