import {test} from 'node:test';
import assert from 'node:assert/strict';
import {innerlyHome,homeTopics,homeTopicPanel,homeReportPreview} from '../dist/innerly-home.mjs';
import {questionnaireLocale} from '../dist/innerly-v1-model.mjs';
import {sampleReportData} from '../dist/sample-report.mjs';
import {esc} from '../dist/mental-views.mjs';
test('homepage connects every everyday topic to an exact active workbook question',()=>{
 for(const l of ['en','hi'])for(const key of Object.keys(homeTopics)){
  const html=homeTopicPanel(key,l),q=questionnaireLocale(l).questions[homeTopics[key].question];
  assert.ok(html.includes(esc(q)));assert.match(html,/Example only|सिर्फ़ उदाहरण/);
  assert.doesNotMatch(html,/data-answer=|type="radio"|data-skip=/);
 }
});
test('home sample views are distinct, labelled examples and never clinical scores',()=>{
 for(const l of ['en','hi']){
  const views=['patterns','responses','steps'].map(v=>homeReportPreview(v,l));
  assert.equal(new Set(views).size,3);assert.ok(views.every(v=>!v.includes('undefined')&&!v.includes('NaN')));
  assert.equal((views[0].match(/data-preview-area=/g)||[]).length,6);
  assert.equal((views[0].match(/data-segment=/g)||[]).length,18);
  assert.equal((views[1].match(/data-preview-answer=/g)||[]).length,5);
  assert.match(views[2],/How it can help|इससे क्या मदद/);
  for(const [question,text] of questionnaireLocale(l).questions.entries()){
   const detail=homeReportPreview('responses',l,{question});
   assert.ok(detail.includes(esc(text)));
  }
  const answers=sampleReportData(l).report.answers;
  answers[12]=4;
  assert.match(homeReportPreview('responses',l,{answers}),/class="in-preview-result" data-result="support"/);
  answers[12]=0;
  assert.match(homeReportPreview('responses',l,{answers}),/class="in-preview-result" data-result="focus"/);
 }
});
test('mental wellbeing homepage has a clear start path, honest scope and independent controls',()=>{
 for(const language of ['en','hi']){
  const html=innerlyHome({language,mission:'Innerly mission'});
  assert.equal((html.match(/data-action="begin"/g)||[]).length,6);
  assert.match(html,/id="thought-waves"[\s\S]+data-thought-waves/);
  assert.equal((html.match(/data-home-topic=/g)||[]).length,4);
  assert.equal((html.match(/data-preview-view=/g)||[]).length,3);
  assert.match(html,/mh-report-preview/);assert.match(html,/SAMPLE REPORT|उदाहरण रिपोर्ट/);
  assert.match(html,/20/);assert.match(html,/English and Hindi|English और हिन्दी/);
  assert.doesNotMatch(html,/country-select|data-country|accuracy rate|million|testimonials|data-skip=/);
 }
});
