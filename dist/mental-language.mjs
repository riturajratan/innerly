import {languages,canonicalLanguage,questionLocales,batchCopy} from './languages.mjs';
import europe from './wellbeing-locales/europe.mjs';
import asia from './wellbeing-locales/asia.mjs';
import southWestAsia from './wellbeing-locales/south-west-asia.mjs';
export {languages,canonicalLanguage,questionLocales,batchCopy};
export const wellbeingLocales={...europe,...asia,...southWestAsia};
export const LANGUAGE_STORAGE='innerly-language';
export const supportedLanguage=code=>languages.some(l=>l.code===code);
export const languageName=code=>languages.find(l=>l.code===code)?.name||'English';
export const languageDirection=code=>languages.find(l=>l.code===code)?.dir||'ltr';
// Report guidance has only been authored in English and Hindi.
export const displayLanguage=code=>code==='hi'?'hi':'en';
export function resolveQuestionLanguage({url='',saved='',browserLanguages=[],deviceLanguage=''}={}){
 return [url,saved,...browserLanguages,deviceLanguage].map(canonicalLanguage).find(Boolean)||'en';
}
export function questionUI(code,key,en=key,hi=en){
 if(code==='hi')return hi;
 if(code==='en')return en;
 const extra=['complete','skip','skipped','saved','saveFailed','keepLanguage','saveHere','removeDraft','completed','journey'];
 const i=extra.indexOf(key);
 if(i>=0)return wellbeingLocales[code]?.ui[i]||en;
 return questionLocales[code]?.ui[key]||en;
}
export function responseState(code,answered){return questionLocales[code]?.states?.[answered?0:1]||(code==='hi'?(answered?'जवाब दिया':'जवाब बाकी'):(answered?'answered':'not answered'));}
export function coverageNotice(code){return (wellbeingLocales[code]?.coverage||(code==='hi'?'सभी 46 सवाल और विकल्प 20 भाषाओं में। होमपेज और पूरी रिपोर्ट अभी English और हिन्दी में हैं।':'All 46 questions and answer options in 20 languages. Homepage and full reports currently in English and Hindi.')).replaceAll('46','60');}
export function translationNotice(code){return wellbeingLocales[code]?.note||(code==='hi'?'इन symptom-frequency सवालों का हिन्दी अनुवाद संपादकीय है; इस app में उसका स्वतंत्र validation नहीं हुआ है। यह diagnosis नहीं है।':'');}
export function timeframe(code){return wellbeingLocales[code]?.timeframe||(code==='hi'?'पिछले दो सप्ताह में यह समस्या आपको कितनी बार परेशान करती रही है?':'Over the last two weeks, how often have you been bothered by the following problem?');}
export function contextNote(code){return wellbeingLocales[code]?.context||(code==='hi'?'पिछले दो सप्ताह · सिर्फ़ संदर्भ, screening score का हिस्सा नहीं':'Over the last two weeks · Context only, not part of the screening score');}
export function growthCaption(code,count,total){return ['en','hi'].includes(code)?(code==='hi'?(count?`${count} छोटे कदम पूरे।`:'हर जवाब के साथ एक कदम।'):(count?`${count} small ${count===1?'step':'steps'} taken.`:'One answer. One small step.')):`${questionUI(code,'completed')}: ${count} / ${total}`;}
