import {test} from 'node:test';import assert from 'node:assert/strict';
import {QUESTION_TOTAL,FLOW_VERSION,questionBank,questionChoices,completeFlow,makeFlowReport,growthState,nextFlowQuestion} from '../dist/checkin-flow.mjs';
import {englishStatements} from '../dist/reflection60-questions.mjs';
import {REFLECTION60_VERSION,readReflectionReports,reflectionTopics,responseCounts,topicResponses} from '../dist/reflection60-model.mjs';
import {readSavedCheckins,makeCheckin} from '../dist/mental-model.mjs';
import {readDraft,DRAFT_STORAGE} from '../dist/checkin-draft.mjs';
import {quizMarkup,mentalHomeMarkup,reportMarkup} from '../dist/mental-views.mjs';
const full=(n=2)=>Array(60).fill(n),meta={id:'reflection-new',createdAt:'2026-11-08T12:00:00Z',language:'en'};

test('active questionnaire is exactly the 60 supplied statements in their requested order',()=>{
 assert.equal(QUESTION_TOTAL,60);assert.equal(FLOW_VERSION,REFLECTION60_VERSION);assert.deepEqual(questionBank.map(q=>q.en),englishStatements);assert.equal(new Set(questionBank.map(q=>q.id)).size,60);
 assert.equal(questionBank[0].en,'I spend a lot of time organizing or planning to make sure everything is perfect.');
 assert.equal(questionBank[1].en,'I sometimes harm myself or think about it when upset.');
 assert.equal(questionBank[59].en,'I avoid close relationships because I fear being hurt or betrayed.');
 assert.ok(questionBank.every((q,i)=>questionChoices(i).length===5));
 assert.deepEqual(questionBank.flatMap((q,i)=>q.optional?[i]:[]),[1]);
});
test('only statement two can be skipped; all other missing or malformed values block completion',()=>{
 for(const v of [0,1,2,3,4,'skip']){const a=full();a[1]=v;assert.equal(completeFlow(a),true);}
 for(let i=0;i<60;i++)for(const value of [null,undefined,-1,5,'1',1.5,...(i===1?[]:['skip'])]){const a=full();a[i]=value;assert.equal(completeFlow(a),false);assert.equal(nextFlowQuestion(a),i);assert.throws(()=>makeFlowReport(a,meta));}
 assert.equal(completeFlow(new Array(60)),false);assert.equal(completeFlow(Array(46).fill(1)),false);
});
test('response charts partition 59 non-sensitive statements exactly once and exclude self-harm responses',()=>{
 const items=reflectionTopics.flatMap(t=>t.items).sort((a,b)=>a-b);assert.deepEqual(items,Array.from({length:60},(_,i)=>i+1).filter(n=>n!==2));
 for(const v of [0,1,2,3,4,'skip']){const a=full(3);a[1]=v;assert.deepEqual(responseCounts(a),[0,0,0,59,0]);for(const t of reflectionTopics){const s=topicResponses(a,t);assert.equal(s.total,t.items.length);assert.equal(s.agreed,t.items.length);}}
});
test('new reports carry no clinical totals and cannot be reinterpreted as old PHQ-4 reports',()=>{
 const report=makeFlowReport(full(),meta);assert.equal(report.scores,undefined);assert.equal(report.reflection,undefined);assert.deepEqual(readSavedCheckins(JSON.stringify([report])),[]);
 const old=makeCheckin(Array(10).fill(1),{...meta,id:'old'});assert.deepEqual(readReflectionReports(JSON.stringify([old])),[]);assert.equal(readSavedCheckins(JSON.stringify([old]))[0].scores.total,4);
 const restored=readReflectionReports(JSON.stringify([{...report,scores:{total:99}},report]));assert.equal(restored.length,1);assert.equal(restored[0].scores,undefined);
 assert.notEqual(DRAFT_STORAGE,'innerly-checkin-draft-v1');assert.equal(readDraft(JSON.stringify({version:'reflection-36-plus-mental-10-v1',language:'en',savedAt:meta.createdAt,answers:Array(46).fill(1)})),null);
});
test('tree represents completion only, including an intentional optional skip',()=>{
 for(let n=0;n<=60;n++){const a=Array.from({length:60},(_,i)=>i<n?4:null),b=Array.from({length:60},(_,i)=>i<n?0:null);assert.deepEqual(growthState(a),growthState(b));assert.equal(growthState(a).count,n);assert.equal(growthState(a).percent,Math.floor(n/60*100));}
 const a=full();a[1]='skip';assert.equal(growthState(a).percent,100);assert.equal(growthState(a).stage,4);
});
test('new UI preserves circles and continuity, with an optional statement and no old screening claims',()=>{
 const quiz=quizMarkup(Array(60).fill(null));assert.equal((quiz.match(/<fieldset/g)||[]).length,60);assert.equal((quiz.match(/type="radio"/g)||[]).length,300);assert.match(quiz,/data-skip="1"/);assert.doesNotMatch(quiz,/data-action="reflection-support"|mh-sensitive-note/);assert.doesNotMatch(quiz,/data-action="next"|data-action="previous"|Over the last two weeks|PHQ-4/);
 const home=mentalHomeMarkup();assert.match(home,/60 statements/);assert.doesNotMatch(home,/PHQ-4|46 questions|36 reflection/);
 for(const view of ['snapshot','days','journey']){const html=reportMarkup(makeFlowReport(full(),meta),[],'en',view);assert.doesNotMatch(html,/undefined|NaN|PHQ-4|GAD-2|reported distress/);assert.match(html,/59 statements/);assert.doesNotMatch(html,/I sometimes harm myself/);}
});
