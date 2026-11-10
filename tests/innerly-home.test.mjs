import {test} from 'node:test';
import assert from 'node:assert/strict';
import {innerlyHome,homeTopics,homeTopicPanel,homeReportPreview} from '../dist/innerly-home.mjs';
import {questionnaireLocale} from '../dist/innerly-v1-model.mjs';
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
  assert.equal((views[0].match(/role="img"/g)||[]).length,6);
  assert.match(views[1],/Fictional answers|काल्पनिक जवाब/);
  assert.match(views[2],/not a treatment plan|इलाज की योजना नहीं/);
 }
});
test('mental wellbeing homepage has a clear start path, honest scope and independent controls',()=>{
 for(const language of ['en','hi']){
  const html=innerlyHome({language,mission:'Innerly mission'});
  assert.equal((html.match(/data-action="begin"/g)||[]).length,5);
  assert.equal((html.match(/data-home-topic=/g)||[]).length,4);
  assert.equal((html.match(/data-home-report=/g)||[]).length,3);
  assert.match(html,/mh-report-preview/);assert.match(html,/SAMPLE REPORT|उदाहरण रिपोर्ट/);
  assert.match(html,/20/);assert.match(html,/English and Hindi|English और हिन्दी/);
  assert.doesNotMatch(html,/country-select|data-country|accuracy rate|million|testimonials|data-skip=/);
 }
});
