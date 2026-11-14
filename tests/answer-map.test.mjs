import {test} from 'node:test';
import assert from 'node:assert/strict';
import {answerMapPreview,answerMapPreviewMarkup} from '../dist/answer-map.mjs';
import {reportSnapshot,sampleProfiles,consolidatedSummaryMarkup} from '../dist/report-concept-view.mjs';
import {workbookQuestions} from '../dist/innerly-v1-model.mjs';

test('map previews interpret every category without repeating the questionnaire in either language',()=>{
 for(const language of ['en','hi']){
  for(const value of [0,2,4]){
   const snapshot=reportSnapshot(Array(36).fill(value),language);
   for(const item of snapshot.items){
    const preview=answerMapPreview(item,language),html=answerMapPreviewMarkup(item,language);
    assert.equal(preview.category,item.category);assert.equal(preview.response,item.response);
    assert.ok(preview.title&&preview.meaning&&preview.heading);
    assert.ok(!html.includes(workbookQuestions[item.index].texts[language]));
    assert.doesNotMatch(html,/NaN|undefined/);
    assert.match(html,/data-map-close/);assert.match(html,/data-map-detail/);
    if(language==='hi')assert.match(preview.meaning,/[\u0900-\u097F]/);
   }
  }
 }
});
test('why-strength and why-growth explanations respect reverse-worded answers',()=>{
 const low=reportSnapshot(Array(36).fill(0)),high=reportSnapshot(Array(36).fill(4)),sometimes=reportSnapshot(Array(36).fill(2));
 const strength=answerMapPreview(low.items[31]),growth=answerMapPreview(high.items[31]),neutral=answerMapPreview(sometimes.items[31]);
 assert.equal(strength.heading,'Why this is a strength');assert.match(strength.meaning,/less ongoing worry/);
 assert.equal(growth.heading,'Why this needs attention');assert.match(growth.meaning,/continue to draw attention/);
 assert.equal(neutral.heading,'Why this is worth exploring');assert.match(neutral.meaning,/sometimes/);
 assert.equal(answerMapPreview(high.items[0]).heading,'Why this is a strength');
 assert.equal(answerMapPreview(low.items[0]).heading,'Why this needs attention');
});
test('map tiles disclose a short insight instead of opening the full question directly',()=>{
 const html=consolidatedSummaryMarkup(reportSnapshot(sampleProfiles.everyday.answers));
 const cells=[...html.matchAll(/<button class="cs-answer-cell[^>]*>/g)].map(match=>match[0]);
 assert.equal(cells.length,36);
 for(const [index,cell] of cells.entries()){
  assert.ok(cell.includes(`data-map-answer="${index}"`));
  assert.match(cell,/aria-expanded="false"/);assert.match(cell,/aria-haspopup="dialog"/);
  assert.doesNotMatch(cell,/data-question=| title=/);
 }
});
