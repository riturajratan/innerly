import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reportExportDocument,reportExportChoices,exportTitle} from '../dist/report-export.mjs';
import {responseGaugeMarkup} from '../dist/response-gauge.mjs';

const sample={intro:'<h1>Sample report</h1>',overview:responseGaugeMarkup({support:24,focus:7,varies:5},'en',{sample:true}),summary:'<section>Consolidated insights</section>',detail:'<section>Full answer record: Q01–Q36</section>',styles:[{href:'https://example.test/report-export.css'}],scriptURL:'https://example.test/report-export-preview.mjs'};
test('both PDF formats start with the live meter and only full includes the detailed record',()=>{
 for(const mode of ['consolidated','full']){
  const html=reportExportDocument({...sample,mode});
  assert.ok(html.indexOf(sample.overview)<html.indexOf(sample.summary));
  assert.ok(html.includes('data-strength-count="24"'));
  assert.equal(html.includes(sample.detail),mode==='full');
  assert.match(html,/class="export-first-page"/);assert.match(html,/data-save-pdf/);
  assert.ok(html.includes(exportTitle(mode)));
 }
 const changed=reportExportDocument({...sample,mode:'full',overview:responseGaugeMarkup({support:25,focus:7,varies:4})});
 assert.match(changed,/data-strength-count="25"/);assert.doesNotMatch(changed,/data-strength-count="24"/);
 assert.throws(()=>reportExportDocument({...sample,mode:'unknown'}));
});

test('PDF choices default to consolidated and explain the detail scope in both languages',()=>{
 for(const language of ['en','hi']){
  const choices=reportExportChoices(language);
  assert.match(choices,/value="consolidated" checked/);
  assert.equal((choices.match(/type="radio"/g)||[]).length,2);
  assert.ok(choices.includes(exportTitle('full',language)));
  assert.match(choices,/all 36 answers|सभी 36 जवाब/);
  assert.match(reportExportDocument({...sample,mode:'full',language}),new RegExp(`<html lang="${language}"`));
 }
});
