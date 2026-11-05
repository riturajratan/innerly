import {QUESTION_COUNT} from './model.mjs';
export function assessmentStatus(answers,total=QUESTION_COUNT){
 const values=Array.from({length:total},(_,i)=>answers?.[i]);
 const isAnswer=value=>Number.isInteger(value)&&value>=0&&value<=4;
 const answered=values.filter(isAnswer).length;
 return {answered,remaining:total-answered,complete:Array.isArray(answers)&&answers.length===total&&answered===total,firstUnanswered:values.findIndex(value=>!isAnswer(value))};
}
export const PAGE_SIZE=5;
export function questionPage(index,total=QUESTION_COUNT,size=PAGE_SIZE){if(!Number.isInteger(index)||!Number.isInteger(total)||!Number.isInteger(size)||total<1||size<1||index<0||index>=total)throw new Error('Invalid question page.');const start=Math.floor(index/size)*size,end=Math.min(start+size,total);return{start,end,indices:Array.from({length:end-start},(_,i)=>start+i),number:Math.floor(start/size)+1,total:Math.ceil(total/size),previous:start>0?Math.max(0,start-size):null,next:end<total?end:null}}
export function pageStatus(answers,index){const page=questionPage(index),isAnswer=value=>Number.isInteger(value)&&value>=0&&value<=4,answered=page.indices.filter(i=>isAnswer(answers?.[i])).length;return{...page,answered,remaining:page.indices.length-answered,complete:answered===page.indices.length}}
