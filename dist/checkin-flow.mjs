import {questionUI,growthCaption} from './mental-language.mjs';
import {REFLECTION60_VERSION,reflectionQuestions,reflectionChoices,validReflectionResponse,completeReflection,makeReflectionReport} from './reflection60-model.mjs';
export const REFLECTION_COUNT=60;
export const QUESTION_TOTAL=60;
export const FLOW_VERSION=REFLECTION60_VERSION;
export const questionBank=reflectionQuestions;
export const questionChoices=(index,language='en')=>reflectionChoices(language);
export const validQuestionResponse=validReflectionResponse;
export const completeFlow=completeReflection;
export const makeFlowReport=makeReflectionReport;
export function completedCount(answers){return Array.from(answers).filter((v,i)=>validQuestionResponse(v,i)).length;}
export function nextFlowQuestion(answers,start=0,end=QUESTION_TOTAL){for(let i=start;i<Math.min(end,QUESTION_TOTAL);i++)if(!validQuestionResponse(answers[i],i))return i;return null;}
export function growthState(answers){const count=completedCount(answers),progress=count/QUESTION_TOTAL;return {count,progress,percent:Math.floor(progress*100),stage:count===0?0:progress<.25?1:progress<.5?2:progress<1?3:4,leaves:count===0?0:Math.max(1,Math.floor(progress*10)),stem:count===0?0:.2+progress*.8};}
export function growthMarkup(answers,lang='en'){
 const s=growthState(answers),label=questionUI(lang,'journey','Your little journey','आपकी छोटी-सी यात्रा'),caption=growthCaption(lang,s.count,QUESTION_TOTAL);
 const leaves=[[69,78,-28],[98,68,30],[66,56,-34],[105,48,27],[75,36,-30],[92,25,25],[52,44,-45],[121,41,42],[64,19,-25],[108,15,25]];
 return `<div class="mh-growth" id="mh-growth" style="--tree-stem:${s.stem}" data-stage="${s.stage}"><svg viewBox="0 0 170 130" role="img" id="mh-growth-art" aria-label="${questionUI(lang,'completed','Completed questions','पूरे हुए सवाल')}: ${s.count} / ${QUESTION_TOTAL}"><circle cx="85" cy="66" r="58" fill="#eff5ec"/><ellipse cx="85" cy="117" rx="39" ry="4" fill="#dce6d2"/><ellipse cx="85" cy="111" rx="7" ry="5" fill="#a99165"/><g class="mh-tree-trunk"><path d="M85 112C84 87 87 57 84 25M85 85L65 70M85 68L105 56M85 52L68 40M85 39L100 27" fill="none" stroke="#7e9467" stroke-width="4" stroke-linecap="round"/></g>${leaves.map(([x,y,angle],i)=>`<g class="mh-tree-leaf${i<s.leaves?' revealed':''}" data-leaf="${i}" style="--leaf-x:${x}px;--leaf-y:${y}px"><path d="M${x} ${y}C${x-19} ${y-1} ${x-20} ${y-17} ${x-16} ${y-22}C${x} ${y-22} ${x+6} ${y-10} ${x} ${y}Z" transform="rotate(${angle} ${x} ${y})" fill="${['#a7bd8c','#7e9f76','#c0cf9d'][i%3]}"/></g>`).join('')}</svg><div><p class="mh-growth-title">${label}</p><p id="mh-growth-caption">${caption}</p><span class="mh-growth-stages"><i class="${s.count>0?'done':''}"></i><i class="${s.progress>=.25?'done':''}"></i><i class="${s.progress>=.5?'done':''}"></i><i class="${s.progress===1?'done':''}"></i></span></div></div>`;
}
