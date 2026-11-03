import {traits,band} from './model.mjs';
export function categoryInsight(scores,index){
 if(!Array.isArray(scores)||scores.length!==traits.length||scores.some(n=>!Number.isFinite(n)||n<0||n>100)||!Number.isInteger(index)||index<0||index>=traits.length)throw new Error('Invalid category.');
 const trait=traits[index],score=scores[index];
 return {index,trait,score,...trait.profiles[band(score)]};
}
export function selectedActions(report){
 const items=Array.isArray(report.categoryPlan)?report.categoryPlan:[];
 return [...new Set(items)].filter(i=>Number.isInteger(i)&&i>=0&&i<traits.length).map(i=>({...categoryInsight(report.scores,i),done:report.categoryDone?.[i]===true}));
}
export function planProgress(report){const actions=selectedActions(report),done=actions.filter(a=>a.done).length;return{total:actions.length,done,percent:actions.length?Math.round(done/actions.length*100):0};}
