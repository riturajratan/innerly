import {test} from 'node:test';
import assert from 'node:assert/strict';
import {responseGaugeMarkup} from '../dist/response-gauge.mjs';
import {reportSnapshot,sampleProfiles,consolidatedSummaryMarkup} from '../dist/report-concept-view.mjs';
import {homeReportPreview} from '../dist/innerly-home.mjs';

test('gauge counts agree with the report for both statement directions and all response values',()=>{
 for(const answers of [Array(36).fill(0),Array(36).fill(2),Array(36).fill(4),...Object.values(sampleProfiles).map(p=>p.answers)]){
  for(const language of ['en','hi']){
   const snapshot=reportSnapshot(answers,language),gauge=responseGaugeMarkup(snapshot.counts,language);
   assert.ok(consolidatedSummaryMarkup(snapshot,language).includes(gauge));
   assert.ok(homeReportPreview(language,{answers}).includes(responseGaugeMarkup(snapshot.counts,language,{sample:true})));
   assert.doesNotMatch(gauge,/NaN|undefined|Infinity/);
  }
 }
});

test('gauge supports zero and all strengths, and rejects incomplete counts',()=>{
 const zero=responseGaugeMarkup({support:0,focus:36,varies:0}),all=responseGaugeMarkup({support:36,focus:0,varies:0});
 assert.match(zero,/rotate\(180 160 150\)/);
 assert.match(all,/rotate\(360 160 150\)/);
 for(const support of [0,7,18,24,33,36]){
  const gauge=responseGaugeMarkup({support,focus:36-support,varies:0});
  assert.match(gauge,/class="rg-fill"[^>]*d="M40 150 A120 120 0 0 1 280 150"/);
  assert.equal((gauge.match(/<stop /g)||[]).length,5);
  assert.doesNotMatch(gauge,/stroke-dasharray/);
  assert.ok(gauge.includes(`rotate(${180+support*5} 160 150)`));
 }
 for(const counts of [{support:1,focus:0,varies:0},{support:-1,focus:37,varies:0},{support:NaN,focus:0,varies:0}])assert.throws(()=>responseGaugeMarkup(counts));
});
