import {test} from 'node:test';
import assert from 'node:assert/strict';
import {consolidatedAnalytics} from '../dist/consolidated-analytics.mjs';
import {answerInterpretation} from '../dist/answer-interpretations.mjs';
import {workbookQuestions} from '../dist/innerly-v1-model.mjs';
import {consolidatedDetails,overallReportSummary} from '../dist/consolidated-insights.mjs';
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
   for(const item of [...consolidatedDetails(snapshot).strengths.slice(0,2),...consolidatedDetails(snapshot).attention.slice(0,2)]){
    assert.ok(html.includes(`data-question="${item.index}"`));
    assert.ok(html.includes(answerInterpretation(item,l).title));
   }
   assert.match(html,/cs-icon-tile/);
  }
 }
});


test('overall summary follows dominant answer patterns without changing the snapshot',()=>{
 const snapshot=reportSnapshot(sampleProfiles.everyday.answers),before=structuredClone(snapshot);
 const summary=overallReportSummary(snapshot);
 assert.match(summary,/self-awareness as a support/);
 assert.match(summary,/thinking patterns worth more attention/);
 assert.ok(summary.split(/\s+/).length<=45);
 assert.deepEqual(snapshot,before);
 for(const areaIndex of [1,4]){
  const answers=supportive.map((v,index)=>Math.floor(index/6)===areaIndex?4-v:v);
  const result=overallReportSummary(reportSnapshot(answers));
  assert.match(result,areaIndex===1?/thinking patterns worth more attention\./:/relationships worth more attention\./);
 }
});
test('overall summary handles uniformly supportive, challenging and sometimes answers honestly in both languages',()=>{
 for(const l of ['en','hi']){
  const allSupport=overallReportSummary(reportSnapshot(supportive,l),l);
  const allFocus=overallReportSummary(reportSnapshot(supportive.map(v=>4-v),l),l);
  const allSometimes=overallReportSummary(reportSnapshot(Array(36).fill(2),l),l);
  assert.equal(new Set([allSupport,allFocus,allSometimes]).size,3);
  for(const summary of [allSupport,allFocus,allSometimes]){
   assert.doesNotMatch(summary,/undefined|NaN|Infinity/);
   if(l==='hi')assert.match(summary,/[\u0900-\u097F]/);
  }
  if(l==='en'){
   assert.match(allSupport,/Helpful habits appear across all six areas/);
   assert.doesNotMatch(allSupport,/room to grow/);
   assert.match(allFocus,/cannot capture every strength/);
   assert.match(allSometimes,/occasional patterns across all six areas/);
   assert.doesNotMatch(allSometimes,/room to grow|helpful habits/);
  }
 }
});
test('brief summary and exact answer metrics precede compact strength and growth cards',()=>{
 const snapshot=reportSnapshot(sampleProfiles.everyday.answers);
 for(const sample of [false,true]){
  const html=consolidatedSummaryMarkup(snapshot,'en',{sample});
  assert.ok(html.indexOf('cs-overall-copy')<html.indexOf('cs-metrics'));
  assert.ok(html.indexOf('cs-metrics')<html.indexOf('id="cs-patterns"'));
  assert.ok(html.indexOf('id="cs-patterns"')<html.indexOf('id="cs-analytics"'));
  assert.ok(html.indexOf('id="cs-analytics"')<html.indexOf('cs-guidance-details'));
  assert.doesNotMatch(html,/cs-highlights|donut-wrap/);
  for(const category of ['support','focus','varies']){
   const count=snapshot.counts[category],percent=Math.round(count/36*100);
   assert.ok(html.includes(`${sample?'data-filter':'data-personal-group'}="${category}"`));
   assert.ok(html.includes(`${count} / 36 · ${percent}%`));
  }
  const cards=[...html.matchAll(/<button class="cs-insight-card[\s\S]*?<\/button>/g)];
  assert.equal(cards.length,4);
  for(const [card] of cards){assert.doesNotMatch(card,/<p>/);assert.match(card,/aria-description=/);}
 }
});


test('analytics preserve every answer, per-area interpretation and raw response frequency',()=>{
 for(const profile of Object.values(sampleProfiles)){
  const snapshot=reportSnapshot(profile.answers),before=structuredClone(snapshot),data=consolidatedAnalytics(snapshot);
  assert.equal(data.total,36);
  assert.equal(data.frequencies.reduce((a,b)=>a+b,0),36);
  assert.deepEqual(data.frequencies,Array.from({length:5},(_,value)=>profile.answers.filter(a=>a===value).length));
  assert.deepEqual(data.rows.flatMap(row=>row.items.map(item=>item.index)),Array.from({length:36},(_,i)=>i));
  for(const category of ['support','focus','varies'])assert.equal(data.rows.reduce((n,row)=>n+row.counts[category],0),snapshot.counts[category]);
  assert.ok(data.rows.every(row=>Object.values(row.counts).reduce((a,b)=>a+b,0)===6));
  assert.deepEqual(snapshot,before);
 }
 const tied=consolidatedAnalytics(reportSnapshot(Array.from({length:36},(_,i)=>i%2?4:0)));
 assert.deepEqual(tied.mostCommon,[0,4]);
});
test('editing one reverse-worded answer updates its map colour and the raw frequency independently',()=>{
 const answers=[...sampleProfiles.everyday.answers],before=consolidatedAnalytics(reportSnapshot(answers));
 answers[31]=0;
 const after=consolidatedAnalytics(reportSnapshot(answers));
 assert.equal(before.rows[5].items[1].category,'focus');assert.equal(after.rows[5].items[1].category,'support');
 assert.equal(after.frequencies[4],before.frequencies[4]-1);assert.equal(after.frequencies[0],before.frequencies[0]+1);
 for(const i of [1,2,3])assert.equal(after.frequencies[i],before.frequencies[i]);
});
test('the default consolidated view prioritises real data and keeps detailed guidance behind disclosures',()=>{
 for(const l of ['en','hi']){
  const html=consolidatedSummaryMarkup(reportSnapshot(sampleProfiles.everyday.answers,l),l);
  assert.equal((html.match(/class="cs-answer-cell /g)||[]).length,36);
  assert.equal((html.match(/class="cs-frequency-row"/g)||[]).length,5);
  assert.match(html,/<details class="cs-deeper cs-guidance-details"><summary>/);
  assert.match(html,/<details class="cs-deeper cs-mock-details"><summary>/);
  assert.doesNotMatch(html,/<details[^>]+open/);
  const visible=html.replace(/<details class="cs-deeper[\s\S]*?<\/details>/g,'');
  assert.doesNotMatch(visible,/cs-journey-card|cs-benefit-card|cs-priority-list/);
  if(l==='en'){
   const words=visible.replace(/<[^>]+>/g,' ').match(/[A-Za-z]+/g)||[];
   assert.ok(words.length<250,`${words.length} default-view words`);
  }
 }
});
