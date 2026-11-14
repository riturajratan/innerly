import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sampleProfiles,reportSnapshot,reportConceptPage} from '../dist/report-concept-view.mjs';

test('each fictional profile covers all 36 questions once and its six areas reconcile with the overview',()=>{
 for(const profile of Object.values(sampleProfiles)){
  const snapshot=reportSnapshot(profile.answers);
  assert.equal(snapshot.areas.length,6);
  assert.deepEqual(snapshot.items.map(item=>item.index),Array.from({length:36},(_,i)=>i));
  assert.equal(Object.values(snapshot.counts).reduce((sum,n)=>sum+n,0),36);
  for(const area of snapshot.areas){
   assert.equal(area.items.length,6);
   assert.equal(area.supports.length+area.focuses.length+area.varies.length,6);
   assert.ok(area.items.every(item=>item.step&&item.benefit));
  }
 }
});

test('editing a supportive statement moves exactly one response and preserves the other 35',()=>{
 const answers=[...sampleProfiles.everyday.answers],before=reportSnapshot(answers);
 answers[12]=3;const after=reportSnapshot(answers);
 assert.equal(before.items[12].category,'varies');assert.equal(after.items[12].category,'support');
 assert.equal(after.counts.support,before.counts.support+1);assert.equal(after.counts.varies,before.counts.varies-1);
 assert.deepEqual(before.items.filter(i=>i.index!==12),after.items.filter(i=>i.index!==12));
 assert.equal(sampleProfiles.everyday.answers[12],2);
});

test('challenge wording keeps its meaning when an answer changes, without treating high frequency as better',()=>{
 const answers=[...sampleProfiles.everyday.answers];
 answers[6]=4;assert.equal(reportSnapshot(answers).items[6].category,'focus');
 answers[6]=0;assert.equal(reportSnapshot(answers).items[6].category,'support');
 answers[6]=2;assert.equal(reportSnapshot(answers).items[6].category,'varies');
 assert.throws(()=>reportSnapshot(answers.slice(1)));
 answers[6]='skip';assert.throws(()=>reportSnapshot(answers));
});

test('the direct page includes every question, accessible graph controls and explicit fictional-data context',()=>{
 const html=reportConceptPage();
 assert.equal((html.match(/class="area-card"/g)||[]).length,6);
 assert.equal((html.match(/class="chart-mark"/g)||[]).length,36);
 assert.equal((html.match(/class="plan-item"/g)||[]).length,6);
 assert.equal((html.match(/role="button" tabindex="0"/g)||[]).length,36);
 assert.match(html,/fictional sample/i);assert.match(html,/no validated general-population benchmark/);
 assert.match(html,/id="dialog-graph"/);assert.match(html,/id="response-table"/);
 assert.doesNotMatch(html,/NaN|undefined|data-action="save"/);
});
