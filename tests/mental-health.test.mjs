import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {MENTAL_VERSION,MENTAL_STORAGE,checkinQuestions,frequency,screenScores,isComplete,makeCheckin,readSavedCheckins,compatibleHistory,nextUnanswered,supportLevel,suggestedSteps} from '../dist/mental-model.mjs';
import {historyChart,reportMarkup,quizMarkup,sampleReport} from '../dist/mental-views.mjs';
const answers=(screen=[0,0,0,0],context=Array(6).fill('skip'))=>[...screen,...context];
const record=(screen=[0,0,0,0],extra={})=>makeCheckin(answers(screen),{id:'test-report',createdAt:'2026-11-01T12:00:00.000Z',language:'en',...extra});
test('English PHQ-4 wording, order and frequency scale retain the published instrument',()=>{
 assert.deepEqual(checkinQuestions.slice(0,4).map(q=>q.en),['Feeling nervous, anxious or on edge','Not being able to stop or control worrying','Feeling down, depressed or hopeless','Little interest or pleasure in doing things']);
 assert.deepEqual(frequency.en,['Not at all','Several days','More than half the days','Nearly every day']);
 assert.equal(checkinQuestions.length,10);assert.equal(new Set(checkinQuestions.map(q=>q.id)).size,10);
 assert.ok(checkinQuestions.every(q=>q.en&&q.hi));assert.notEqual(MENTAL_STORAGE,'innerly-personality');
});
test('all 256 complete screening response combinations have correct totals, bands and subscale thresholds',()=>{
 for(let a=0;a<=3;a++)for(let b=0;b<=3;b++)for(let c=0;c<=3;c++)for(let d=0;d<=3;d++){
  const s=screenScores([a,b,c,d]),total=a+b+c+d;
  assert.equal(s.anxiety,a+b);assert.equal(s.mood,c+d);assert.equal(s.total,total);
  assert.equal(s.band,total<=2?'minimal':total<=5?'mild':total<=8?'moderate':'severe');
  assert.equal(s.anxietyFollowup,a+b>=3);assert.equal(s.moodFollowup,c+d>=3);
 }
});
test('context never changes a clinical score and incomplete screening is not imputed',()=>{
 assert.deepEqual(screenScores(answers([2,1,0,1])),screenScores(answers([2,1,0,1],Array(6).fill(3))));
 for(const bad of [[],[0,0,0],[0,0,0,null],[0,0,0,'skip'],[0,0,0,4],[0,0,0,-1],[0,0,0,1.5],[0,0,0,'1'],new Array(4)])assert.throws(()=>screenScores(bad));
 assert.equal(isComplete(answers()),true);assert.equal(isComplete(Array(10).fill('skip')),false);assert.equal(isComplete(new Array(10)),false);assert.equal(isComplete(Array(10).fill(4)),false);
 assert.equal(nextUnanswered([0,1,null,3,'skip'],0,5),2);assert.equal(nextUnanswered([0,1,2,3,'skip'],0,5),null);
});
test('storage rejects old/malformed/incomplete records and recomputes untrusted cached totals',()=>{
 const r=record([1,1,2,2]);assert.deepEqual(readSavedCheckins('{bad'),[]);assert.deepEqual(readSavedCheckins('{}'),[]);
 const loaded=readSavedCheckins(JSON.stringify([null,{...r,id:''},{...r,version:'personality-v1'},{...r,language:'fr'},{...r,createdAt:null},{...r,answers:[0]},{...r,scores:{total:999}},r]));
 assert.equal(loaded.length,1);assert.equal(loaded[0].scores.total,6);assert.equal(loaded[0].version,MENTAL_VERSION);
 assert.throws(()=>makeCheckin(answers(),{id:'',createdAt:r.createdAt}));assert.throws(()=>makeCheckin(answers(),{id:'x',createdAt:null}));
});
test('history uses actual dates, same version/language and the latest entry on a calendar day',()=>{
 const a=record([0,0,0,0],{id:'a'}),b=record([1,1,1,1],{id:'b',createdAt:'2026-11-01T12:05:00.000Z'}),c=record([2,2,2,2],{id:'c',createdAt:'2026-11-04T12:00:00.000Z'}),hi=record([3,3,3,3],{id:'hi',language:'hi'});
 assert.deepEqual(compatibleHistory([c,a,hi,b,{...a,id:'old',version:'old'}]).map(r=>r.id),['b','c']);
 const single=historyChart([a]);assert.doesNotMatch(single,/<polyline/);assert.match(single,/starting point, not a trend/);
 const multiple=historyChart([a,c]);assert.match(multiple,/<polyline/);assert.match(multiple,/2026|1 Nov|Nov 1/);
 assert.match(historyChart([hi],'en',false,'hi'),/12\/12/);assert.doesNotMatch(historyChart([hi],'en'),/data-history-point/);
});
test('support reflects symptom thresholds and daily impact without grading anger as illness',()=>{
 const low=record();assert.equal(supportLevel(low),'reflect');assert.equal(supportLevel(record([1,2,0,0])),'discuss');assert.equal(supportLevel(record([3,3,2,1])),'soon');
 const impact={...low,answers:answers([0,0,0,0],[0,0,2,3,0,0])};assert.equal(supportLevel(impact),'soon');assert.equal(screenScores(impact.answers).total,0);
 assert.deepEqual(suggestedSteps(impact).slice(0,2),['professional','pause']);assert.equal(new Set(suggestedSteps(impact)).size,3);
});
test('reports distinguish translated screens, context, fictional examples and real history',()=>{
 const hindi=reportMarkup(record([1,1,1,1],{language:'hi'}),[],'en');assert.match(hindi,/editorial Hindi translation/);assert.match(hindi,/not a diagnosis/);assert.match(hindi,/not diagnostic scores/);
 assert.match(sampleReport('journey'),/EXAMPLE · NOT YOUR RESULTS/);assert.match(sampleReport('journey'),/Illustrative responses only/);
 const flow=quizMarkup(Array(36).fill(null));
 assert.equal((flow.match(/<fieldset/g)||[]).length,36);assert.equal((flow.match(/data-skip=/g)||[]).length,0);
 assert.doesNotMatch(flow,/Over the last two weeks/);assert.match(flow,/Never|Almost Always/);
 assert.match(quizMarkup(Array(36).fill(null),'hi'),/clinical|नैदानिक|निदान|चिकित्सकीय/);
});
test('public entry is mental-health focused, with legacy personality kept separate',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.match(html,/mental-app\.mjs/);assert.match(html,/36 questions/);assert.match(html,/personality\.html/);assert.doesNotMatch(html,/accuracy rate|testimonials|country-selector/);
 const app=await readFile(new URL('../dist/mental-app.mjs',import.meta.url),'utf8');assert.doesNotMatch(app,/fetch\(|XMLHttpRequest|sendBeacon/);
 assert.match(app,/mh-save-confirm/);assert.match(app,/if\(!report&&answers\.some/);
});
