import {traits,questions,agreement} from './model.mjs';
import {questionLocales} from './languages.mjs';
import {hindiTraits} from './hi-report.mjs';
const original={traits:structuredClone(traits),questions:structuredClone(questions),agreement:[...agreement]};
export function localizeModel(locale){
 traits.forEach((trait,i)=>{Object.assign(trait,structuredClone(original.traits[i]));if(locale==='hi')Object.assign(trait,structuredClone(hindiTraits[i]),{intro:`${hindiTraits[i].low} — ${hindiTraits[i].high}`})});
 const pack=questionLocales[locale];
 questions.forEach((question,i)=>{Object.assign(question,structuredClone(original.questions[i]));if(pack)question.text=pack.questions[i]});
 agreement.splice(0,5,...(pack?.agreement||original.agreement));
}
