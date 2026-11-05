import {QUESTION_COUNT} from './model.mjs';
export function assessmentStatus(answers,total=QUESTION_COUNT){
 const values=Array.from({length:total},(_,i)=>answers?.[i]);
 const isAnswer=value=>Number.isInteger(value)&&value>=0&&value<=4;
 const answered=values.filter(isAnswer).length;
 return {answered,remaining:total-answered,complete:Array.isArray(answers)&&answers.length===total&&answered===total,firstUnanswered:values.findIndex(value=>!isAnswer(value))};
}
