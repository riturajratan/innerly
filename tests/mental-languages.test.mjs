import {test} from 'node:test';import assert from 'node:assert/strict';
import {languages,resolveQuestionLanguage,languageDirection,displayLanguage,coverageNotice} from '../dist/mental-language.mjs';
import {questionnaireLocales,readWorkbookReports as readReflectionReports,frequencyCounts as responseCounts} from '../dist/innerly-v1-model.mjs';
import {questionBank,questionChoices,makeFlowReport} from '../dist/checkin-flow.mjs';
import {makeDraft,readDraft} from '../dist/checkin-draft.mjs';
import {quizMarkup,reportMarkup,sampleReport,esc} from '../dist/mental-views.mjs';
const meta={id:'languages-test',createdAt:'2026-11-08T10:00:00Z'},answers=Array.from({length:36},(_,i)=>i%5);
test('all 20 languages cover all 36 questions and six response choices',()=>{
 assert.equal(languages.length,20);assert.equal(Object.keys(questionnaireLocales).length,20);
 for(const {code} of languages){assert.equal(questionnaireLocales[code].questions.length,36);assert.equal(new Set(questionnaireLocales[code].questions).size,36);for(const [i,q] of questionBank.entries()){assert.ok(q.texts[code]?.trim(),`${code} Q${i+1}`);assert.equal(q.texts[code],questionnaireLocales[code].questions[i]);const choices=questionChoices(i,code);assert.equal(choices.length,5);assert.equal(new Set(choices).size,5);assert.ok(choices.every(s=>s.trim()));}assert.equal(questionnaireLocales[code].choices.length,6);assert.equal(questionnaireLocales[code].dimensions.length,6);assert.ok(questionnaireLocales[code].notice.trim());if(code!=='en')assert.ok(questionnaireLocales[code].questions.every((q,i)=>q!==questionnaireLocales.en.questions[i]));}
});
test('URL, manual preference and browser languages resolve in order, including regions and RTL',()=>{
 assert.equal(resolveQuestionLanguage({url:'es-MX',saved:'hi',browserLanguages:['ar']}),'es');assert.equal(resolveQuestionLanguage({url:'xx',saved:'pt_BR',browserLanguages:['de']}),'pt');assert.equal(resolveQuestionLanguage({browserLanguages:['xx','ar-SA','en']}),'ar');assert.equal(resolveQuestionLanguage({browserLanguages:['en-US','hi-IN']}),'en');assert.equal(resolveQuestionLanguage({deviceLanguage:'zh-TW'}),'zh');assert.equal(resolveQuestionLanguage({browserLanguages:['xx']}),'en');assert.equal(languageDirection('ar'),'rtl');assert.equal(languageDirection('ur'),'rtl');assert.equal(languageDirection('hi'),'ltr');
});
test('changing the record language never changes descriptive counts or translates old answers into a new version',()=>{
 const reports=languages.map(({code})=>makeFlowReport(answers,{...meta,id:code,language:code}));const restored=readReflectionReports(JSON.stringify(reports));assert.equal(restored.length,20);for(const {code} of languages){const r=restored.find(r=>r.id===code);assert.equal(r.language,code);assert.deepEqual(responseCounts(r.answers),responseCounts(answers));assert.equal(r.scores,undefined);}
});
test('all 20 languages survive partial draft save and restore including an optional skip',()=>{
 for(const {code} of languages){const partial=Array(36).fill(null);partial[0]=4;partial[1]='skip';partial[35]=3;const d=makeDraft(partial,code,meta.createdAt);assert.deepEqual(readDraft(JSON.stringify(d)),d);}
 const d=makeDraft(answers,'en');assert.equal(readDraft(JSON.stringify({...d,language:'xx'})),null);assert.equal(readDraft(JSON.stringify({...d,language:'es-MX'})),null);
});
test('question UI and EN/HI report fallback render safely for every language',()=>{
 for(const {code,name} of languages){const html=quizMarkup(Array(36).fill(null),code);assert.equal((html.match(/<fieldset/g)||[]).length,36);assert.doesNotMatch(html,/undefined|NaN/);assert.ok(html.includes(esc(coverageNotice(code))));assert.doesNotMatch(html,/reflection-support|mh-support/);
 const report=makeFlowReport(answers,{...meta,language:code});for(const view of ['snapshot','days','journey']){const text=reportMarkup(report,[report],code,view);assert.doesNotMatch(text,/undefined|NaN|PHQ-4|mh-support|Tele MANAS/);if(code!=='en')assert.ok(text.includes(name));}assert.doesNotMatch(sampleReport('days',code),/undefined|NaN/);assert.equal(displayLanguage(code),code==='hi'?'hi':'en');}
});
