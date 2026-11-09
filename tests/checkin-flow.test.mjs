import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {source} from '../dist/innerly-v1-questions.mjs';
import {INNERLY_V1_VERSION,workbookDimensions,frequencyCounts,readWorkbookReports,skipChoice,questionnaireLocale} from '../dist/innerly-v1-model.mjs';
import {QUESTION_TOTAL,FLOW_VERSION,questionBank,questionChoices,completeFlow,makeFlowReport,growthState,nextFlowQuestion} from '../dist/checkin-flow.mjs';
import {makeReflectionReport,readReflectionReports} from '../dist/reflection60-model.mjs';
import {makeCheckin,readSavedCheckins} from '../dist/mental-model.mjs';
import {readDraft,DRAFT_STORAGE} from '../dist/checkin-draft.mjs';
import {quizMarkup,mentalHomeMarkup,reportMarkup} from '../dist/mental-views.mjs';
const full=(n=2)=>Array(36).fill(n),meta={id:'workbook-test',createdAt:'2026-11-09T12:00:00Z',language:'en'};
test('active bank preserves the workbook IDs, exact English order, six dimensions and frequency scale',()=>{
 assert.deepEqual(source,JSON.parse(fs.readFileSync(new URL('../dist/innerly-v1-source.json',import.meta.url),'utf8')));
 assert.equal(QUESTION_TOTAL,36);assert.equal(FLOW_VERSION,INNERLY_V1_VERSION);
 assert.deepEqual(questionBank.map(q=>[q.id,q.texts.en]),source.questions.map(q=>[q.id,q.en]));
 assert.equal(new Set(questionBank.map(q=>q.id)).size,36);assert.ok(questionBank.every(q=>q.optional));
 assert.deepEqual(questionChoices(0),['Never','Rarely','Sometimes','Often','Almost Always']);
 assert.equal(skipChoice('en'),'Not Applicable / Prefer to Skip');
 assert.deepEqual(workbookDimensions.map(d=>d.en),[...new Set(source.questions.map(q=>q.dimension))]);
 assert.deepEqual(workbookDimensions.flatMap(d=>d.items),Array.from({length:36},(_,i)=>i));
 assert.ok(workbookDimensions.every(d=>d.items.length===6));
});
test('every question can be explicitly skipped; omissions and invalid frequencies cannot finish',()=>{
 for(let i=0;i<36;i++){
  for(const v of [0,1,2,3,4,'skip']){const a=full();a[i]=v;assert.equal(completeFlow(a),true);}
  for(const v of [null,undefined,-1,5,6,'1',1.5]){const a=full();a[i]=v;assert.equal(completeFlow(a),false);assert.equal(nextFlowQuestion(a),i);assert.throws(()=>makeFlowReport(a,meta));}
 }
 for(const a of [new Array(36),Array(35).fill(0),Array(60).fill(0),null])assert.equal(completeFlow(a),false);
});
test('frequency summaries preserve actual responses and exclude skips without reverse-scoring',()=>{
 const a=Array.from({length:36},(_,i)=>i%6===5?'skip':i%6);
 assert.deepEqual(frequencyCounts(a),{counts:[6,6,6,6,6],skipped:6,answered:30,total:36});
 for(const d of workbookDimensions)assert.deepEqual(frequencyCounts(a,d.items),{counts:[1,1,1,1,1],skipped:1,answered:5,total:6});
 assert.deepEqual(frequencyCounts(full('skip')),{counts:[0,0,0,0,0],skipped:36,answered:0,total:36});
 for(const v of [0,4])assert.equal(frequencyCounts(full(v)).counts[v],36);
});
test('workbook reports and drafts cannot reinterpret earlier 60-item or PHQ responses',()=>{
 const current=makeFlowReport(full(),meta),old60=makeReflectionReport(Array(60).fill(2),{...meta,id:'sixty'}),phq=makeCheckin(Array(10).fill(1),{...meta,id:'phq'});
 assert.deepEqual(readWorkbookReports(JSON.stringify([old60,phq])),[]);
 assert.deepEqual(readReflectionReports(JSON.stringify([current])),[]);assert.deepEqual(readSavedCheckins(JSON.stringify([current])),[]);
 assert.deepEqual(readWorkbookReports(JSON.stringify([{...current,scores:{total:99}},current])),[current]);
 assert.notEqual(DRAFT_STORAGE,'innerly-reflections-60-draft-v1');
 assert.equal(readDraft(JSON.stringify({version:old60.version,language:'en',savedAt:meta.createdAt,answers:old60.answers})),null);
 assert.match(reportMarkup(old60,[]),/59 statements/);assert.match(reportMarkup(phq,[]),/PHQ-4/);
 assert.equal(current.scores,undefined);
});
test('tree counts completion independently of response meaning, including skipped questions',()=>{
 for(let n=0;n<=36;n++){
  const arrays=[0,4,'skip'].map(value=>Array.from({length:36},(_,i)=>i<n?value:null));
  assert.deepEqual(growthState(arrays[0]),growthState(arrays[1]));assert.deepEqual(growthState(arrays[0]),growthState(arrays[2]));
  assert.equal(growthState(arrays[0]).percent,Math.floor(n/36*100));
 }
});
test('active UI exposes frequency choices, universal skip, correct counts and safe empty-category reports',()=>{
 const quiz=quizMarkup(full(null));assert.equal((quiz.match(/<fieldset/g)||[]).length,36);assert.equal((quiz.match(/type="radio"/g)||[]).length,180);assert.equal((quiz.match(/data-skip=/g)||[]).length,36);
 assert.doesNotMatch(quiz,/Disagree|Agree|Neutral|data-action="next"|data-action="previous"|PHQ-4/);assert.match(quiz,/Almost Always/);
 assert.match(mentalHomeMarkup(),/36 questions · Around 8–12 minutes/);assert.doesNotMatch(mentalHomeMarkup(),/60 statements|self-harm statement/);
 for(const value of [0,4,'skip'])for(const view of ['snapshot','days','journey']){
  const html=reportMarkup(makeFlowReport(full(value),meta),[],'en',view);
  assert.doesNotMatch(html,/undefined|NaN|Infinity|59 statements|reported distress|PHQ-4/);
  if(view==='snapshot')assert.equal((html.match(/data-workbook-dimension=/g)||[]).length,6);
  if(value==='skip')assert.match(html,/no responses to interpret/);
 }
 assert.equal(questionnaireLocale('hi').choices.length,6);
});
