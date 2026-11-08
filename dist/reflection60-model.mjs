import {englishStatements} from './reflection60-questions.mjs';
import europe,{guidance as europeGuidance} from './reflection60-locales/europe.mjs';
import asia,{guidance as asiaGuidance} from './reflection60-locales/east-asia.mjs';
import southWest,{guidance as southWestGuidance} from './reflection60-locales/south-west-asia.mjs';
import {supportedLanguage,canonicalLanguage,questionLocales} from './mental-language.mjs';
import {agreement} from './model.mjs';

export const REFLECTION60_VERSION='user-reflections-60-v1';
export const REFLECTION60_STORAGE='innerly-reflections-60-v1';
export const SENSITIVE_INDEX=1;
export const statementLocales={en:englishStatements,...europe,...asia,...southWest};
export const guidanceLocales={en:{notice:'These statements are for reflection, not a clinical test or diagnosis.',sensitive:'You can skip this statement. Support is available whatever you answer.',help:'If you have hurt yourself or think you might act on thoughts of self-harm now, contact local emergency services or go to the nearest emergency department. Ask someone you trust to stay with you. You do not need to finish this questionnaire to seek help.',unmonitored:'This site is not monitored and cannot provide emergency help.',support:'Find support',continue:'Continue when ready'},...europeGuidance,...asiaGuidance,...southWestGuidance};
export const reflectionGuidance=language=>guidanceLocales[canonicalLanguage(language)]||guidanceLocales.en;
export const reflectionQuestions=englishStatements.map((en,i)=>({id:`reflection60-${i+1}`,kind:'reflection',optional:i===SENSITIVE_INDEX,...Object.fromEntries(Object.entries(statementLocales).map(([l,rows])=>[l,rows[i]]))}));
const hindiAgreement=['पूरी तरह असहमत','थोड़ा असहमत','तटस्थ','थोड़ा सहमत','पूरी तरह सहमत'];
export const reflectionChoices=(l='en')=>l==='hi'?hindiAgreement:questionLocales[l]?.agreement||agreement;
export const validReflectionResponse=(v,i)=>Number.isInteger(i)&&i>=0&&i<60&&((Number.isInteger(v)&&v>=0&&v<=4)||(i===SENSITIVE_INDEX&&v==='skip'));
export const completeReflection=answers=>Array.isArray(answers)&&answers.length===60&&Array.from(answers).every(validReflectionResponse);
// These are editorial navigation groups, not scales, diagnoses, or severity bands.
// The self-harm statement is deliberately excluded from every chart/aggregate.
export const reflectionTopics=[
 {id:'structure',en:'Structure & control',hi:'व्यवस्था और नियंत्रण',items:[1,5,14,32,36,45,46,54],enStep:'Notice one situation where a plan helps you, and one where flexibility might help. Write down what felt different.',hiStep:'एक स्थिति लिखें जहाँ योजना मदद करती है और एक जहाँ थोड़ा लचीलापन मदद कर सकता है। दोनों में क्या अलग लगा?'},
 {id:'feelings',en:'Feelings & reactions',hi:'भावनाएँ और प्रतिक्रियाएँ',items:[3,9,17,25,31,34,40,48,58,59],enStep:'Write down one recent feeling, what happened just before it, and what you needed in that moment.',hiStep:'एक हाल की भावना, उससे ठीक पहले क्या हुआ और उस पल आपको क्या चाहिए था—यह लिखें।'},
 {id:'connection',en:'Closeness & social comfort',hi:'नज़दीकी और सामाजिक सहजता',items:[6,10,24,35,37,39,42,43,53,56,60],enStep:'Notice when time alone feels restoring and when you want connection. Choose one relationship where you feel safe to express a preference.',hiStep:'देखें अकेले समय से कब आराम मिलता है और कब साथ की इच्छा होती है। किसी सुरक्षित रिश्ते में अपनी एक पसंद साझा करें।'},
 {id:'trust',en:'Trust & reassurance',hi:'भरोसा और आश्वासन',items:[8,11,16,19,20,21,22,27,30,44,47,52,57],enStep:'Choose one situation you want to understand better. Separate what happened from what you feared might happen, and discuss it with someone you trust.',hiStep:'एक स्थिति चुनें जिसे समझना चाहते हैं। जो हुआ और जिसके होने का डर था, उन्हें अलग लिखें और किसी भरोसेमंद व्यक्ति से बात करें।'},
 {id:'selfview',en:'Self-view & recognition',hi:'खुद की छवि और पहचान',items:[4,12,18,23,28,33,49],enStep:'Think of one moment when recognition mattered to you. What did you hope another person would understand?',hiStep:'एक पल याद करें जब पहचान मिलना आपके लिए ज़रूरी था। आप चाहते थे कि दूसरा व्यक्ति क्या समझे?'},
 {id:'actions',en:'Actions & their impact',hi:'व्यवहार और उसका असर',items:[7,13,15,26,38,41,51],enStep:'Reflect on one recent choice and its effect on you and someone else. What would you want to do the same or differently?',hiStep:'एक हाल के निर्णय और अपने व दूसरे व्यक्ति पर उसके असर पर विचार करें। आगे क्या वैसा ही या अलग करना चाहेंगे?'},
 {id:'perspectives',en:'Thoughts & meaning',hi:'विचार और मायने',items:[29,50,55],enStep:'Note a thought you would like to understand. If thoughts feel confusing, distressing or disrupt everyday life, discuss them with a qualified professional.',hiStep:'एक विचार लिखें जिसे समझना चाहेंगे। विचार उलझन, परेशानी या रोज़मर्रा में बाधा पैदा करें तो योग्य पेशेवर से बात करें।'}
];
export function responseCounts(answers,indices=reflectionTopics.flatMap(t=>t.items).map(n=>n-1)){
 const counts=[0,0,0,0,0];for(const i of indices){if(i!==SENSITIVE_INDEX&&Number.isInteger(answers[i])&&answers[i]>=0&&answers[i]<=4)counts[answers[i]]++;}return counts;
}
export function topicResponses(answers,topic){const counts=responseCounts(answers,topic.items.map(n=>n-1));return {counts,agreed:counts[3]+counts[4],neutral:counts[2],disagreed:counts[0]+counts[1],total:counts.reduce((a,b)=>a+b,0)};}
export function makeReflectionReport(answers,{id,createdAt,language='en'}={}){
 if(!completeReflection(answers))throw new Error('Complete the statements, or skip the optional statement.');
 if(typeof id!=='string'||!id||id.length>100||typeof createdAt!=='string'||!Number.isFinite(Date.parse(createdAt))||!supportedLanguage(canonicalLanguage(language)))throw new Error('Invalid report metadata.');
 return {id,version:REFLECTION60_VERSION,createdAt,language:canonicalLanguage(language),answers:[...answers]};
}
export function validReflectionReport(r){return !!r&&r.version===REFLECTION60_VERSION&&supportedLanguage(r.language)&&typeof r.id==='string'&&!!r.id&&r.id.length<=100&&typeof r.createdAt==='string'&&Number.isFinite(Date.parse(r.createdAt))&&completeReflection(r.answers);}
export function readReflectionReports(raw){try{const rows=JSON.parse(raw);if(!Array.isArray(rows))return [];const seen=new Set();return rows.filter(r=>validReflectionReport(r)&&!seen.has(r.id)&&seen.add(r.id)).slice(0,50).map(r=>makeReflectionReport(r.answers,r));}catch{return [];}}
