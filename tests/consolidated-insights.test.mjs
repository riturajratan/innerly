import {test} from 'node:test';
import assert from 'node:assert/strict';
import {answerInterpretation} from '../dist/answer-interpretations.mjs';
import {workbookQuestions} from '../dist/innerly-v1-model.mjs';
import {consolidatedDetails} from '../dist/consolidated-insights.mjs';
import {reportSnapshot,sampleProfiles,consolidatedSummaryMarkup,reportConceptPage} from '../dist/report-concept-view.mjs';
import {makeWorkbookReport} from '../dist/innerly-v1-model.mjs';
import {personalReportMarkup} from '../dist/personal-report-view.mjs';

const supportive=reportSnapshot(Array(36).fill(0)).items.map(i=>i.category==='support'?0:4);
test('detailed priorities and highlights use the reported category, with no invented strengths or problems',()=>{
 for(const [answers,mode,category] of [[supportive,'maintain','support'],[supportive.map(v=>4-v),'growth','focus'],[Array(36).fill(2),'explore','varies']]){
  const snapshot=reportSnapshot(answers),before=structuredClone(snapshot),data=consolidatedDetails(snapshot);
  assert.equal(data.mode,mode);assert.equal(data.priorities.length,3);
  assert.equal(new Set(data.priorities.map(i=>i.index)).size,3);
  assert.ok(data.priorities.every(i=>i.category===category));
  assert.ok(data.strengths.every(i=>i.category==='support'));
  if(mode==='maintain')assert.equal(data.attention.length,0);
  if(mode!=='maintain')assert.equal(data.strengths.length,0);
  assert.deepEqual(snapshot,before);
 }
});
test('changing a focus answer updates the consolidated priorities and their evidence',()=>{
 const answers=[...sampleProfiles.everyday.answers],before=consolidatedDetails(reportSnapshot(answers)),selected=before.priorities[0];
 answers[selected.index]=supportive[selected.index];
 const after=consolidatedDetails(reportSnapshot(answers));
 assert.ok(!after.priorities.some(i=>i.index===selected.index));
 assert.ok(after.priorities.every(i=>i.value===answers[i.index]));
 assert.equal(new Set(before.priorities.map(i=>Math.floor(i.index/6))).size,3);
});
test('full consolidated guidance has question evidence and remains before every detailed graph in both languages',()=>{
 const report=makeWorkbookReport(sampleProfiles.everyday.answers,{id:'qa',createdAt:'2026-11-14T09:00:00Z',language:'en'});
 for(const l of ['en','hi']){
  const snapshot=reportSnapshot(report.answers,l),data=consolidatedDetails(snapshot),summary=consolidatedSummaryMarkup(snapshot,l),html=personalReportMarkup(report,[],l);
  for(const id of ['cs-patterns','cs-comparison','cs-priorities','cs-journey','cs-benefits'])assert.ok(summary.includes(`id="${id}"`));
  for(const item of data.priorities){assert.ok(summary.includes(item.id));assert.ok(summary.includes(answerInterpretation(item,l).practice));assert.ok(!summary.includes(item.step));assert.ok(summary.includes(item.benefit));}
  assert.ok(html.indexOf('id="cs-benefits"')<html.indexOf('id="six-areas"'));
  assert.ok(html.indexOf('id="question-insights"')<html.indexOf('id="next-steps"'));
  assert.equal((html.match(/class="area-card"/g)||[]).length,6);
  assert.equal((html.match(/class="qe-row"/g)||[]).length,36);
  assert.doesNotMatch(summary,/NaN|undefined|Infinity/);
 }
 const preview=reportConceptPage();assert.match(preview,/MOCK DATA · NOT A WORLD RANK/);assert.match(preview,/100 fictional responses/);
});


test('all 36 answers have distinct interpretations for supportive, growth and sometimes responses in both languages',()=>{
 for(const l of ['en','hi']){
  const snapshots=[0,2,4].map(value=>reportSnapshot(Array(36).fill(value),l));
  for(let index=0;index<36;index++){
   const readings=snapshots.map(snapshot=>answerInterpretation(snapshot.items[index],l));
   assert.equal(new Set(readings.map(r=>r.meaning)).size,3);
   for(const reading of readings){
    for(const field of ['icon','title','meaning','practice'])assert.ok(reading[field],`${l} Q${index+1} ${field}`);
    assert.notEqual(reading.meaning,workbookQuestions[index].texts[l]);
    assert.doesNotMatch(reading.meaning+reading.practice,/undefined|NaN/);
    if(l==='hi')assert.match(reading.meaning,/[\u0900-\u097F]/);
   }
  }
 }
});
test('reverse-worded worry and positive emotional awareness produce directionally correct insights',()=>{
 const low=reportSnapshot(Array(36).fill(0)),high=reportSnapshot(Array(36).fill(4)),middle=reportSnapshot(Array(36).fill(2));
 assert.equal(low.items[31].category,'support');
 assert.match(answerInterpretation(low.items[31]).meaning,/less ongoing worry/);
 assert.equal(high.items[31].category,'focus');
 assert.match(answerInterpretation(high.items[31]).title,/taking up headspace/);
 assert.match(answerInterpretation(middle.items[31]).meaning,/sometimes/);
 assert.equal(low.items[0].category,'focus');
 assert.match(answerInterpretation(low.items[0]).title,/Make sense of mood changes/);
 assert.equal(high.items[0].category,'support');
 assert.match(answerInterpretation(high.items[0]).title,/read your emotional signals/);
});
test('consolidated cards explain answers, preserve question links, and do not repeat questionnaire statements',()=>{
 for(const l of ['en','hi']){
  for(const profile of Object.values(sampleProfiles)){
   const snapshot=reportSnapshot(profile.answers,l),html=consolidatedSummaryMarkup(snapshot,l);
   for(const question of workbookQuestions)assert.ok(!html.includes(question.texts[l]));
   for(const item of [...consolidatedDetails(snapshot).strengths,...consolidatedDetails(snapshot).attention]){
    assert.ok(html.includes(`data-question="${item.index}"`));
    assert.ok(html.includes(answerInterpretation(item,l).title));
   }
   assert.match(html,/cs-icon-tile/);
  }
 }
});
