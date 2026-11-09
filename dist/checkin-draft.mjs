import {supportedLanguage} from './mental-language.mjs?v=mh-13';
import {FLOW_VERSION,QUESTION_TOTAL,validQuestionResponse,completedCount,nextFlowQuestion} from './checkin-flow.mjs?v=mh-13';

export const DRAFT_STORAGE='innerly-workbook-v1-draft';

// A draft is only persisted after explicit on-device saving consent.
// Never reinterpret responses from a different question/scale version.
export function readDraft(raw){
 try{
  const d=JSON.parse(raw);
  if(!d||d.version!==FLOW_VERSION||!supportedLanguage(d.language)||!Number.isFinite(Date.parse(d.savedAt))||!Array.isArray(d.answers)||d.answers.length!==QUESTION_TOTAL)return null;
  if(!d.answers.every((v,i)=>v===null||validQuestionResponse(v,i))||completedCount(d.answers)===0)return null;
  return {version:FLOW_VERSION,language:d.language,savedAt:d.savedAt,answers:[...d.answers]};
 }catch{return null;}
}

export function makeDraft(answers,language,savedAt=new Date().toISOString()){
 const draft=readDraft(JSON.stringify({version:FLOW_VERSION,answers,language,savedAt}));
 if(!draft)throw new Error('Cannot save an invalid or empty check-in.');
 return draft;
}

export function resumeQuestion(answers){return nextFlowQuestion(answers)??QUESTION_TOTAL-1;}

// Continue forward after the response, then wrap to any skipped required item.
export function nextContinuousQuestion(answers,current){
 return nextFlowQuestion(answers,current+1)??nextFlowQuestion(answers,0,current);
}
