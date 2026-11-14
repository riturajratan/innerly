import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeWorkbookReport,workbookQuestions} from '../dist/innerly-v1-model.mjs';
import {usesPersonalReport,personalReportMarkup,personalQuestionMarkup} from '../dist/personal-report-view.mjs';
import {reportSnapshot,escapeHTML} from '../dist/report-concept-view.mjs';
import {questionViewMarkup,questionViews,benchmarkReading} from '../dist/question-explorer.mjs';
import {mockBenchmark,simulatedComparison} from '../dist/report-benchmark.mjs';

const values=Array.from({length:36},(_,i)=>i%5);
const make=(answers=values,extra={})=>makeWorkbookReport(answers,{id:'current',createdAt:'2026-11-14T10:00:00Z',language:'en',...extra});

test('only a complete, valid current report enters the new personal report; archives retain their own renderer',()=>{
 assert.ok(usesPersonalReport(make()));
 for(const report of [null,{}, {...make(),version:'old-version'},{...make(),answers:values.slice(1)},{...make(),answers:values.map((v,i)=>i===3?'skip':v)}])assert.ok(!usesPersonalReport(report));
 assert.throws(()=>personalReportMarkup({...make(),answers:Array(36).fill(null)}));
});

test('both report languages use every submitted response and include all six areas and question-level views',()=>{
 for(const l of ['en','hi']){
  const report=make(),before=structuredClone(report),snapshot=reportSnapshot(report.answers,l),html=personalReportMarkup(report,[],l);
  assert.equal((html.match(/class="area-card"/g)||[]).length,6);
  assert.equal((html.match(/class="chart-mark"/g)||[]).length,36);
  assert.equal((html.match(/class="qe-row"/g)||[]).length,36);
  assert.equal((html.match(/data-question-view=/g)||[]).length,6);
  for(const item of snapshot.items){assert.ok(html.includes(escapeHTML(workbookQuestions[item.index].texts[l])));assert.ok(html.includes(escapeHTML(item.step)));assert.ok(html.includes(escapeHTML(item.benefit)));}
  assert.equal((html.match(/<tr><td>Q/g)||[]).length,36);
  assert.doesNotMatch(html,/sample-profile|data-answer=|Everyday mix|INTERACTIVE SAMPLE REPORT|NaN|undefined/);
  assert.deepEqual(report,before);
 }
});

test('different actual answers produce different personal reports without changing the input or reusing a sample profile',()=>{
 const a=make(Array(36).fill(0)),b=make(Array(36).fill(4),{id:'other'});
 assert.notEqual(personalReportMarkup(a),personalReportMarkup(b));
 assert.equal(reportSnapshot(a.answers).items[0].category,'focus');
 assert.equal(reportSnapshot(b.answers).items[0].category,'support');
 assert.equal(reportSnapshot(a.answers).items[6].category,'support');
 assert.equal(reportSnapshot(b.answers).items[6].category,'focus');
 const detail=personalQuestionMarkup(reportSnapshot(a.answers),0);
 assert.match(detail,/YOUR RECORDED ANSWER/);assert.match(detail,/Never/);
 assert.doesNotMatch(detail,/data-answer=|Sample response|Try a different/);
});

test('all-answer, strengths, growth and frequency views reconcile with the actual response set',()=>{
 const report=make(),snapshot=reportSnapshot(report.answers);
 assert.equal(Object.values(snapshot.counts).reduce((n,v)=>n+v,0),36);
 for(const [view,key] of [['answers',null],['strengths','support'],['growth','focus']]){
  const html=questionViewMarkup(snapshot,report,[],view);
  assert.equal((html.match(/class="qe-row"/g)||[]).length,key?snapshot.counts[key]:36);
 }
 const freq=questionViewMarkup(snapshot,report,[],'frequency');
 assert.equal((freq.match(/data-frequency-filter=/g)||[]).length,5);
 assert.match(freq,/your 36 questions as the denominator, not other people/);
 for(const view of questionViews)for(const l of ['en','hi'])assert.doesNotMatch(questionViewMarkup(reportSnapshot(report.answers,l),report,[],view,l),/undefined|NaN|Infinity/);
});

test('history uses actual compatible reports; first reports have one point and no invented earlier responses',()=>{
 const current=make(),snapshot=reportSnapshot(current.answers);
 const empty=questionViewMarkup(snapshot,current,[],'history');
 assert.equal((empty.match(/<circle cx=/g)||[]).length,1);assert.match(empty,/Your first point is here/);
 const previous=make(Array(36).fill(3),{id:'earlier',createdAt:'2026-11-10T10:00:00Z'});
 const otherLanguage=make(Array(36).fill(4),{id:'other-language',createdAt:'2026-11-11T10:00:00Z',language:'hi'});
 const future=make(Array(36).fill(4),{id:'future',createdAt:'2026-11-20T10:00:00Z'});
 const timeline=questionViewMarkup(snapshot,current,[previous,otherLanguage,future,current],'history');
 assert.equal((timeline.match(/<circle cx=/g)||[]).length,2);assert.equal((timeline.match(/<polyline /g)||[]).length,1);
 assert.doesNotMatch(timeline,/Your first point is here/);
});

test('mock percentages use clearly synthetic frequency distributions and include ties; they are never a health ranking',()=>{
 assert.equal(mockBenchmark.synthetic,true);assert.equal(mockBenchmark.counts.length,36);
 for(let index=0;index<36;index++){
  assert.equal(mockBenchmark.counts[index].reduce((n,v)=>n+v,0),100);
  for(let value=0;value<5;value++){
   const result=simulatedComparison(index,value);
   assert.equal(result.total,result.below+result.same+result.above);
   assert.equal(result.atOrBelowPercent,result.below+result.same);
   assert.ok(result.synthetic);if(value===4)assert.equal(result.atOrBelowPercent,100);
  }
 }
 assert.equal(simulatedComparison(36,2),null);assert.equal(simulatedComparison(0,'skip'),null);
 const report=make(),world=questionViewMarkup(reportSnapshot(report.answers),report,[],'world');
 assert.equal((world.match(/class="qe-world-row"/g)||[]).length,36);
 assert.equal((world.match(/mock cumulative/g)||[]).length,36);
 assert.match(world,/100 FICTIONAL RESPONSES PER QUESTION/);assert.match(world,/do not tell you where you stand in the world/);
 assert.match(benchmarkReading(0,0),/NOT A WORLD RANK/);
});
