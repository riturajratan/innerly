import {test} from 'node:test';
import assert from 'node:assert/strict';
import {responsePositionGraph,responseDistribution,previewResponseDetail} from '../dist/response-graphs.mjs';
import {workbookDimensions,makeWorkbookReport} from '../dist/innerly-v1-model.mjs';
import {workbookReportPreview} from '../dist/innerly-v1-preview.mjs';
import {workbookPrintDimensions} from '../dist/innerly-v1-charts.mjs';
const answers=Array.from({length:36},(_,i)=>i%5);
test('each graph retains six exact response positions and a native keyboard target per question',()=>{
 for(const l of ['en','hi'])for(const d of workbookDimensions){
  const html=responsePositionGraph(answers,d.id,l,{selected:d.items[4]});
  assert.deepEqual([...html.matchAll(/data-response-question="(\d+)"/g)].map(m=>Number(m[1])),d.items);
  assert.equal((html.match(/class="chosen"/g)||[]).length,6);
  assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
  assert.match(html,new RegExp(`data-response-question="${d.items[4]}"[^>]+aria-pressed="true"`));
  assert.doesNotMatch(html,/undefined|NaN/);
 }
});
test('Never remains a plotted answer while a skipped response has no selected point',()=>{
 const data=Array(36).fill('skip');data[0]=0;
 const html=responsePositionGraph(data,'dimension-1');
 assert.equal((html.match(/class="chosen"/g)||[]).length,1);
 assert.match(html,/— Never/);assert.match(html,/— Not answered/);
 assert.match(responseDistribution(data,'dimension-1'),/5 not answered; shown separately/);
 assert.doesNotMatch(previewResponseDetail(data,1),/A moment to reflect/);
});
test('response count bars use actual counts out of six, including zero',()=>{
 const data=Array(36).fill(3);data[0]=0;
 const html=responseDistribution(data,'dimension-1');
 const widths=[...html.matchAll(/style="width:([\d.]+)%"/g)].map(m=>Number(m[1]));
 assert.equal(widths.length,5);
 widths.forEach((width,i)=>assert.ok(Math.abs(width-[100/6,0,0,5/6*100,0][i])<1e-10));
 assert.match(html,/<strong>5<small> \/ 6/);
});
test('preview selection is scoped to its two free categories and retained across renders',()=>{
 const report=makeWorkbookReport(answers,{id:'test',createdAt:'2026-11-12T12:00:00Z',language:'en'});
 const html=workbookReportPreview(report,'en',{'dimension-1':4,'dimension-5':26,'dimension-2':7});
 assert.deepEqual([...html.matchAll(/data-response-question="(\d+)"/g)].map(m=>Number(m[1])),[0,1,2,3,4,5,24,25,26,27,28,29]);
 assert.match(html,/Q05 · YOUR RESPONSE/);assert.match(html,/Q27 · YOUR RESPONSE/);
 assert.match(html,/Unlock full report — \$1/);assert.match(html,/No subscription/);
 assert.match(html,/Skip for now — view full report/);
 assert.equal((html.match(/class="wb-locked-card"/g)||[]).length,4);
 assert.doesNotMatch(html,/data-action="print"|wb-print-question|data-workbook-question/);
});
test('full print output includes all original answers and their reflection prompts',()=>{
 for(const l of ['en','hi']){
  const html=workbookPrintDimensions(answers,l);
  assert.equal((html.match(/class="wb-print-question"/g)||[]).length,36);
  assert.equal((html.match(/class="wb-print-reflection"/g)||[]).length,36);
  assert.doesNotMatch(html,/undefined|NaN/);
 }
});
