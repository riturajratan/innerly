import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeDraft,readDraft,resumeQuestion,nextContinuousQuestion} from '../dist/checkin-draft.mjs';
import {FLOW_VERSION} from '../dist/checkin-flow.mjs';
import {feelingExamples,feelingVisual,feelingReading} from '../dist/feeling-explorer.mjs';
import {mentalHomeMarkup} from '../dist/mental-views.mjs';

test('an explicit draft round-trip keeps partial answers, scales, skips and language',()=>{
 const a=Array(60).fill(null);a[0]=4;a[5]=0;a[36]=3;a[1]='skip';
 const draft=makeDraft(a,'hi','2026-11-08T10:00:00.000Z');
 const restored=readDraft(JSON.stringify(draft));assert.deepEqual(restored.answers,a);assert.equal(restored.language,'hi');assert.equal(restored.version,FLOW_VERSION);assert.equal(resumeQuestion(restored.answers),2);
 a[0]=1;assert.equal(draft.answers[0],4);
});
test('corrupt, outdated and empty drafts cannot silently become a new check-in',()=>{
 const answers=Array(60).fill(null);answers[0]=0;const d=makeDraft(answers,'en');
 for(const bad of [{...d,version:'old-question-bank'},{...d,language:'xx'},{...d,savedAt:'invalid'}, {...d,answers:d.answers.slice(1)}, {...d,answers:Array(60).fill(null)}])assert.equal(readDraft(JSON.stringify(bad)),null);
 for(const [i,value] of [[0,'skip'],[0,5],[36,5],[36,'skip'],[40,9],[0,'0']]){const bad={...d,answers:[...d.answers]};bad.answers[i]=value;assert.equal(readDraft(JSON.stringify(bad)),null);}
 assert.equal(readDraft('{broken'),null);assert.equal(readDraft(null),null);assert.throws(()=>makeDraft(Array(60).fill(null),'en'));
});
test('continuous guidance crosses the old five-question boundary and wraps to missing answers',()=>{
 const a=Array(60).fill(null);a.fill(1,0,5);assert.equal(nextContinuousQuestion(a,4),5);
 a[7]=1;assert.equal(nextContinuousQuestion(a,7),8);a.fill(1);a[2]=null;assert.equal(nextContinuousQuestion(a,59),2);a[2]=1;assert.equal(nextContinuousQuestion(a,59),null);assert.equal(resumeQuestion(a),59);
});
test('feeling examples remain visibly fictional, interactive and distinct from personal results',()=>{
 for(const [key,example] of Object.entries(feelingExamples)){
  assert.ok(example.rows.every(row=>row[0]>=0&&row[0]<=7));assert.equal(example.rows.length,3);
  for(const l of ['en','hi']){const markup=feelingVisual(key,l);assert.match(markup,/data-feeling-bar="2"/);assert.match(markup,/Fictional diary|काल्पनिक diary/);assert.match(markup,/Not your results|आपके नतीजे नहीं/);assert.ok(feelingReading(key,2,l));}
 }
 const home=mentalHomeMarkup();assert.match(home,/data-theme="relationships"/);assert.ok((home.match(/class="mh-primary" data-action="begin"/g)||[]).length>=3);
 assert.notEqual(feelingReading('relationships',0),feelingReading('sleep',0));
});
