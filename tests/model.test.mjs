import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,questions,traits,scoreAnswers,band,profileFor,validDraft} from '../dist/model.mjs';
test('45 original prompts cover all five traits equally, with reverse items',()=>{
 assert.equal(questions.length,45);assert.equal(new Set(questions.map(q=>q.text)).size,45);
 traits.forEach((_,i)=>{const items=questions.filter(q=>q.dim===i);assert.equal(items.length,9);assert.equal(items.filter(q=>q.reverse).length,4);assert.equal(items.filter(q=>q.options).length,1)});
 questions.filter(q=>q.options).forEach(q=>assert.equal(q.options.length,5));
});
test('neutral answers produce a midpoint; polarity-aware endpoints score 0 and 100',()=>{
 assert.deepEqual(scoreAnswers(Array(45).fill(2)),[50,50,50,50,50]);
 assert.deepEqual(scoreAnswers(questions.map(q=>q.reverse?0:4)),[100,100,100,100,100]);
 assert.deepEqual(scoreAnswers(questions.map(q=>q.reverse?4:0)),[0,0,0,0,0]);
});
test('one trait does not change the other four',()=>{
 const a=questions.map(q=>q.dim===2?(q.reverse?0:4):2);
 assert.deepEqual(scoreAnswers(a),[50,50,100,50,50]);
});
test('unfinished, out-of-range and sparse answers are rejected',()=>{
 for(const a of [[],Array(44).fill(2),Array(45).fill(null),Array(45).fill(-1),Array(45).fill(5),Array(45).fill(1.5),new Array(45)])assert.throws(()=>scoreAnswers(a));
});
test('interpretation bands include both boundaries in the middle',()=>{
 assert.equal(band(39),0);assert.equal(band(40),1);assert.equal(band(60),1);assert.equal(band(61),2);
 assert.match(profileFor([50,50,50,50,50]).title,/balanced/i);
 assert.equal(profileFor([50,100,50,50,50]).title,traits[1].profiles[2].title);
 assert.equal(profileFor([0,50,50,50,50]).title,traits[0].profiles[0].title);
 assert.throws(()=>profileFor([1,2]));
});
test('drafts are resumable only for the correct questionnaire and valid positions',()=>{
 const d={version:VERSION,answers:Array(45).fill(null),index:0};assert.ok(validDraft(d));
 assert.ok(validDraft({...d,answers:Array(45).fill(4),index:44}));
 for(const invalid of [null,{...d,version:'old'},{...d,index:45},{...d,index:-1},{...d,answers:new Array(45)},{...d,answers:Array(44).fill(0)}])assert.equal(validDraft(invalid),false);
});
