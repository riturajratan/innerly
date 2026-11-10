import {source} from './innerly-v1-questions.mjs';
import europe from './innerly-v1-locales/europe.mjs';
import asia from './innerly-v1-locales/east-asia.mjs';
import southWest from './innerly-v1-locales/south-west-asia.mjs';
import {supportedLanguage,canonicalLanguage} from './mental-language.mjs?v=mh-14';

export const INNERLY_V1_VERSION='innerly-workbook-v1';
export const INNERLY_V1_STORAGE='innerly-workbook-v1-reports';
export const QUESTION_COUNT=source.questions.length;
export const questionnaireLocales={en:{questions:source.questions.map(q=>q.en),choices:source.choices,dimensions:[...new Set(source.questions.map(q=>q.dimension))],notice:'Answer every question to see your report. This reflection is not a diagnosis.'},...europe,...asia,...southWest};
export const questionnaireLocale=l=>questionnaireLocales[canonicalLanguage(l)]||questionnaireLocales.en;
export const workbookQuestions=source.questions.map((q,i)=>({id:q.id,kind:'frequency',optional:false,dimension:Math.floor(i/6),texts:Object.fromEntries(Object.entries(questionnaireLocales).map(([l,data])=>[l,data.questions[i]]))}));
export const workbookChoices=l=>questionnaireLocale(l).choices.slice(0,5);
export const skipChoice=l=>questionnaireLocale(l).choices[5];
// Numeric responses are zero-based frequency selections, not points or severity scores.
export const validWorkbookResponse=(v,i)=>Number.isInteger(i)&&i>=0&&i<QUESTION_COUNT&&Number.isInteger(v)&&v>=0&&v<=4;
// Read-only compatibility: reports created before answers became required retain their skips.
const validStoredResponse=(v,i)=>validWorkbookResponse(v,i)||(Number.isInteger(i)&&i>=0&&i<QUESTION_COUNT&&v==='skip');
const completeStoredWorkbook=a=>Array.isArray(a)&&a.length===QUESTION_COUNT&&Array.from(a).every(validStoredResponse);
export const completeWorkbook=answers=>Array.isArray(answers)&&answers.length===QUESTION_COUNT&&Array.from(answers).every(validWorkbookResponse);
export const workbookDimensions=questionnaireLocales.en.dimensions.map((name,i)=>({id:`dimension-${i+1}`,en:name,index:i,items:Array.from({length:6},(_,j)=>i*6+j)}));
export function frequencyCounts(answers,indices=workbookQuestions.map((_,i)=>i)){
 const counts=[0,0,0,0,0];let skipped=0;
 for(const i of indices){const v=answers[i];if(!validStoredResponse(v,i))continue;if(v==='skip')skipped++;else counts[v]++;}
 return {counts,skipped,answered:counts.reduce((a,b)=>a+b,0),total:indices.length};
}
export function makeWorkbookReport(answers,{id,createdAt,language='en'}={}){
 if(!completeWorkbook(answers))throw new Error('Answer every question to see your report.');
 const code=canonicalLanguage(language);
 if(typeof id!=='string'||!id||id.length>100||typeof createdAt!=='string'||!Number.isFinite(Date.parse(createdAt))||!supportedLanguage(code))throw new Error('Invalid report metadata.');
 return {id,version:INNERLY_V1_VERSION,createdAt,language:code,answers:[...answers]};
}
export const validWorkbookReport=r=>!!r&&r.version===INNERLY_V1_VERSION&&supportedLanguage(r.language)&&typeof r.id==='string'&&!!r.id&&r.id.length<=100&&typeof r.createdAt==='string'&&Number.isFinite(Date.parse(r.createdAt))&&completeStoredWorkbook(r.answers);
export function readWorkbookReports(raw){try{const rows=JSON.parse(raw);if(!Array.isArray(rows))return [];const seen=new Set();return rows.filter(r=>validWorkbookReport(r)&&!seen.has(r.id)&&seen.add(r.id)).slice(0,50).map(r=>({id:r.id,version:r.version,createdAt:r.createdAt,language:r.language,answers:[...r.answers]}));}catch{return [];}}
