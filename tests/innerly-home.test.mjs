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
test('home report unfolds one exact sample answer into matching guidance',()=>{
 for(const l of ['en','hi']){
  const html=homeReportPreview(l);
  assert.doesNotMatch(html,/undefined|NaN|data-preview-area|data-preview-view|data-segment/);
  assert.equal((html.match(/data-preview-answer=/g)||[]).length,5);
  assert.doesNotMatch(html,/data-preview-open/);assert.match(html,/data-preview-replay/);
  assert.match(html,/fictional example|काल्पनिक उदाहरण/);
  for(const [question,text] of questionnaireLocale(l).questions.entries()){
   assert.ok(homeReportPreview(l,{question}).includes(esc(text)));
  }
  const answers=sampleReportData(l).report.answers;
  for(const [value,category] of [[4,'support'],[2,'varies'],[0,'focus']]){
   answers[12]=value;
   const report=homeReportPreview(l,{answers});
   assert.match(report,new RegExp(`class="in-preview-result" data-result="${category}"`));
   assert.ok(report.includes(`style="width:${value*25}%"`));
   assert.match(report,/ONE SMALL STEP|एक छोटा कदम/);
   assert.match(report,/What it could help with|इससे क्या मदद/);
  }
 }
});
test('mental wellbeing homepage has a clear start path, honest scope and independent controls',()=>{
 for(const language of ['en','hi']){
  const html=innerlyHome({language,mission:'Innerly mission'});
  assert.equal((html.match(/data-action="begin"/g)||[]).length,6);
  assert.match(html,/id="thought-waves"[\s\S]+data-thought-waves/);
  assert.equal((html.match(/data-home-topic=/g)||[]).length,4);
  assert.equal((html.match(/data-preview-answer=/g)||[]).length,5);
  assert.match(html,/href="report-preview.html"/);
  assert.match(html,/mh-report-preview/);assert.match(html,/SAMPLE REPORT|उदाहरण रिपोर्ट/);
  assert.match(html,/20/);assert.match(html,/English and Hindi|English और हिन्दी/);
  assert.doesNotMatch(html,/country-select|data-country|accuracy rate|million|testimonials|data-skip=/);
 }
});
