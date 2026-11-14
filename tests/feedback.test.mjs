import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {feedbackEmail,feedbackMarkup} from '../dist/feedback.mjs';
test('feedback email contains only the explicitly supplied message and optional name',()=>{
 const message='A useful idea & a question?\nसुझाव #1',name='Example + Reader';
 const url=new URL(feedbackEmail({kind:'problem',message,name}));
 assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'riturajratan@gmail.com');
 assert.equal(url.searchParams.get('subject'),'Innerly feedback · Something isn’t working');
 assert.equal(url.searchParams.get('body'),`${message}\n\nFrom: ${name}`);
 assert.equal([...url.searchParams.keys()].length,2);
 assert.equal(new URL(feedbackEmail({message:' Just an idea '})).searchParams.get('body'),'Just an idea');
});
test('every public html entry includes the shared feedback widget exactly once',()=>{
 for(const file of readdirSync(new URL('../dist/',import.meta.url)).filter(f=>f.endsWith('.html'))){
  const html=readFileSync(new URL(`../dist/${file}`,import.meta.url),'utf8');
  assert.equal((html.match(/src="feedback.mjs\?v=2"/g)||[]).length,1,file);
 }
});
test('feedback opens a clearly labelled email draft in both supported interface languages',()=>{
 for(const l of ['en','hi']){
  const html=feedbackMarkup(l);
  assert.match(html,/aria-haspopup="dialog"/);assert.match(html,/aria-labelledby="ifb-title"/);
  assert.match(html,/Open email draft|Email draft खोलें/);
  assert.doesNotMatch(html,/Feedback sent|Message sent|Thank you for submitting/);
  assert.equal((html.match(/type="radio"/g)||[]).length,3);
 }
});
