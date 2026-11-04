import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveLocale,setLocale,t} from '../dist/i18n.mjs';
import {localizeModel} from '../dist/locale-model.mjs';
import {questions,traits,agreement,scoreAnswers} from '../dist/model.mjs';
import {emailDraft} from '../dist/experience.mjs';
test('language priority is supported URL, saved preference, browser order, then English',()=>{
 assert.equal(resolveLocale({url:'https://example.test/?lang=hi',saved:'en',languages:['en-US']}),'hi');
 assert.equal(resolveLocale({url:'https://example.test/?lang=fr',saved:'hi',languages:['en-US']}),'hi');
 assert.equal(resolveLocale({languages:['fr','hi-IN','en-US']}),'hi');
 assert.equal(resolveLocale({languages:['en-GB','hi-IN']}),'en');
 assert.equal(resolveLocale({languages:['fr','ar']}),'en');
});
test('all questions, scenarios and profile content localize without changing scoring or saved answer positions',()=>{
 const english=structuredClone(questions),names=traits.map(t=>t.name),responses=questions.map((_,i)=>i%5),scores=scoreAnswers(responses);
 localizeModel('hi');
 assert.equal(questions.length,45);
 questions.forEach((q,i)=>{assert.match(q.text,/[\u0900-\u097f]/);assert.equal(q.dim,english[i].dim);assert.equal(q.reverse,english[i].reverse);if(q.options){assert.match(q.scene,/[\u0900-\u097f]/);assert.equal(q.options.length,5);q.options.forEach(option=>assert.match(option,/[\u0900-\u097f]/))}});
 traits.forEach(trait=>trait.profiles.forEach(profile=>Object.values(profile).forEach(text=>assert.match(text,/[\u0900-\u097f]/))));
 assert.deepEqual(scoreAnswers(responses),scores);assert.match(agreement[2],/न सहमत/);
 localizeModel('en');assert.deepEqual(questions,english);assert.deepEqual(traits.map(t=>t.name),names);
});
test('dynamic progress, report status and chart labels translate with values intact',()=>{
 setLocale('hi');assert.equal(t('12 of 45 answered. Continue where you left off.'),'12 / 45 जवाब दिए। जहाँ छोड़ा था, वहीं से जारी रखें।');assert.equal(t('Your journey · Settle in'),'आपकी यात्रा · सहज हों');assert.equal(t('Leans right'),'दाएँ की ओर');setLocale('en');assert.equal(t('Your personality'),'Your personality');
});
test('email draft encodes a user-reviewed summary without transmitting or storing an address',()=>{
 const link=emailDraft({email:'reader+test@example.com',profile:{title:'My profile',summary:'A & B'},scores:[0,25,50,75,100],traits,language:'hi',url:'https://www.riturajratan.com/innerly/'});
 const url=new URL(link);assert.match(url.searchParams.get('subject'),/Innerly/);assert.match(url.searchParams.get('body'),/0 \/ 100/);assert.match(url.searchParams.get('body'),/100 \/ 100/);assert.match(url.searchParams.get('body'),/A & B/);assert.throws(()=>emailDraft({email:'bad\naddress'}));
});
