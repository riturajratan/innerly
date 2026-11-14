import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {feedbackMarkup,validateFeedback,saveFeedback,FEEDBACK_STORAGE} from '../dist/feedback.mjs';
test('feedback validates required name, email and message without rejecting international names',()=>{
 for(const l of ['en','hi']){
  assert.deepEqual(Object.keys(validateFeedback({name:' ',email:' ',message:' '},l)),['name','email','message']);
  assert.ok(validateFeedback({name:'Reader',email:'not-an-email',message:'A helpful idea for the website.'},l).email);
  assert.ok(validateFeedback({name:'Reader',email:'reader@example.com',message:'short'},l).message);
  assert.deepEqual(validateFeedback({name:'ऋतुराज',email:'reader+ideas@example.com',message:'एक उपयोगी सुझाव वेबसाइट के लिए।'},l),{});
  assert.ok(validateFeedback({name:'a'.repeat(81),email:'a@b.com',message:'a'.repeat(1501)},l).name);
  assert.ok(validateFeedback({name:'Reader',email:'a@b.com',message:'a'.repeat(1501)},l).message);
 }
});
test('local feedback submission preserves reports and earlier notes and is idempotent',()=>{
 const data=new Map([['reports','keep these reports'],[FEEDBACK_STORAGE,JSON.stringify([{id:'older',message:'Keep this note'}])]]);
 const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
 const entry={id:'new',name:'Example Reader',email:'reader@example.com',message:'Make the buttons clearer.',status:'pending'};
 saveFeedback(storage,entry);saveFeedback(storage,entry);
 assert.deepEqual(JSON.parse(data.get(FEEDBACK_STORAGE)),[{id:'older',message:'Keep this note'},entry]);
 assert.equal(data.get('reports'),'keep these reports');
 data.set(FEEDBACK_STORAGE,'invalid');assert.throws(()=>saveFeedback(storage,{id:'later'}));assert.equal(data.get(FEEDBACK_STORAGE),'invalid');
 assert.throws(()=>saveFeedback({getItem:()=>null,setItem:()=>{throw new Error('Quota');}},entry));
});
test('every public html entry includes the shared feedback widget exactly once',()=>{
 for(const file of readdirSync(new URL('../dist/',import.meta.url)).filter(f=>f.endsWith('.html'))){
  const html=readFileSync(new URL(`../dist/${file}`,import.meta.url),'utf8');
  assert.equal((html.match(/src="feedback.mjs\?v=3"/g)||[]).length,1,file);
 }
});
test('feedback has a mind trigger, labelled fields and an honest local submission state',()=>{
 for(const l of ['en','hi']){
  const html=feedbackMarkup(l);
  assert.match(html,/aria-haspopup="dialog"/);assert.match(html,/aria-labelledby="ifb-title"/);
  assert.match(html,/class="ifb-mind"/);assert.match(html,/class="ifb-energy"/);
  for(const name of ['name','email','message'])assert.match(html,new RegExp(`name="${name}"[^>]*required`));
  assert.match(html,/Submit feedback|Feedback जमा करें/);assert.match(html,/has not been sent|टीम को भेजा नहीं/);
  assert.doesNotMatch(html,/mailto:|Open email draft|ifb-fold/);
 }
});
