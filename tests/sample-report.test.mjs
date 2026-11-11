import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sampleReportData} from '../dist/sample-report.mjs';
import {validWorkbookReport,workbookDimensions} from '../dist/innerly-v1-model.mjs';
import {dimensionGraphic} from '../dist/dimension-infographics.mjs';
import {sampleReportMarkup} from '../dist/sample-report-view.mjs';

test('demo presets create valid, independent fictional reports and a matching-language history',()=>{
 for(const language of ['en','hi'])for(const key of ['mixed','sometimes','varied']){
  const data=sampleReportData(language,key);
  assert.equal(data.preset,key);assert.ok(validWorkbookReport(data.report));
  assert.equal(data.report.language,language);assert.equal(data.history.length,2);
  assert.ok(data.history.every(r=>validWorkbookReport(r)&&r.language===language&&Date.parse(r.createdAt)<Date.parse(data.report.createdAt)));
  data.report.answers[0]=99;
  assert.ok(validWorkbookReport(sampleReportData(language,key).report));
 }
 assert.equal(sampleReportData('en','__proto__').preset,'mixed');
 const a=sampleReportData('en','mixed'),b=sampleReportData('en','sometimes');assert.notDeepEqual(a.report.answers,b.report.answers);
});

test('direct sample clearly labels fictional data, exposes all graphs, and offers no save action',()=>{
 for(const language of ['en','hi'])for(const view of ['snapshot','timeline','days','journey']){
  const data=sampleReportData(language,'mixed');
  const html=sampleReportMarkup({...data,language,view});
  assert.doesNotMatch(html,/data-action="save"|undefined|NaN|Only reports saved in this browser are available/);
  assert.equal((html.match(/data-sample-preset=/g)||[]).length,3);
  assert.match(html,/wb-demo-banner/);assert.match(html,/data-action="begin"/);
  if(view==='snapshot')assert.equal((html.match(/data-workbook-dimension=/g)||[]).length,6);
  if(language==='en')assert.match(html,/FICTIONAL RESPONSES/);else assert.match(html,/काल्पनिक जवाब/);
 }
});

test('every plotted mark identifies its original question; focus follows the selected question only',()=>{
 const answers=sampleReportData().report.answers;
 for(const dimension of workbookDimensions){
  const svg=dimensionGraphic(answers,dimension.id,'en',false,dimension.items[2]);
  const indices=[...svg.matchAll(/data-graphic-question="(\d+)"/g)].map(m=>Number(m[1]));
  assert.deepEqual(indices,dimension.items);
  assert.equal((svg.match(/ig-question is-focused/g)||[]).length,1);
  assert.match(svg,new RegExp(`class="ig-question is-focused" data-graphic-question="${dimension.items[2]}"`));
 }
});
