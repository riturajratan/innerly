import {wellbeingLocales,canonicalLanguage,supportedLanguage} from './mental-language.mjs';
import {VERSION as REFLECTION_VERSION,QUESTION_COUNT as REFLECTION_COUNT,scoreAnswers as reflectionScores} from './model.mjs';
// PHQ-4: original English wording/timeframe/response scale retained.
// Public-domain instrument; attribution and reference links are in docs/mental-health-plan.html.
// Context items are original reflection prompts and never enter a clinical screening score.
export const MENTAL_VERSION='mental-checkin-phq4-v1';
export const MENTAL_STORAGE='innerly-mental-checkin-v1';
export const PHQ_SOURCE='https://www.phqscreeners.com/images/sites/g/files/g10016261/f/201412/instructions.pdf';
export const frequency={en:['Not at all','Several days','More than half the days','Nearly every day'],hi:['बिल्कुल नहीं','कई दिन','आधे से अधिक दिन','लगभग हर दिन'],...Object.fromEntries(Object.entries(wellbeingLocales).map(([code,pack])=>[code,pack.frequency]))};
export const checkinQuestions=[
 {id:'nervous',scale:'phq4',en:'Feeling nervous, anxious or on edge',hi:'घबराहट, चिंता या तनाव महसूस करना'},
 {id:'worry',scale:'phq4',en:'Not being able to stop or control worrying',hi:'चिंता करना रोक न पाना या उस पर काबू न रख पाना'},
 {id:'low-mood',scale:'phq4',en:'Feeling down, depressed or hopeless',hi:'उदास, मायूस या निराश महसूस करना'},
 {id:'interest',scale:'phq4',en:'Little interest or pleasure in doing things',hi:'काम करने में कम रुचि या आनंद महसूस होना'},
 {id:'stress',scale:'context',en:'How often have everyday demands felt hard to manage?',hi:'रोज़मर्रा की ज़िम्मेदारियाँ सँभालना कितनी बार मुश्किल लगा?'},
 {id:'sleep',scale:'context',en:'How often has poor sleep made your day harder?',hi:'नींद ठीक न होने से आपका दिन कितनी बार मुश्किल हुआ?'},
 {id:'anger',scale:'context',en:'When you felt angry, which response fitted you most often?',hi:'गुस्सा आने पर आप सबसे ज़्यादा किस तरह पेश आए?',options:{en:['I paused before responding','I went quiet or stepped away','I raised my voice or reacted quickly','It varied / I did not feel angry'],hi:['जवाब देने से पहले रुका/रुकी','चुप हो गया/गई या दूर हट गया/गई','आवाज़ ऊँची हुई या तुरंत प्रतिक्रिया दी','अलग-अलग रहा / गुस्सा नहीं आया']}},
 {id:'impact',scale:'context',en:'How much have these difficulties affected work, home or relationships?',hi:'इन मुश्किलों का काम, घर या रिश्तों पर कितना असर पड़ा?',options:{en:['Not at all','A little','Quite a bit','A lot'],hi:['बिल्कुल नहीं','थोड़ा','काफ़ी','बहुत ज़्यादा']}},
 {id:'area',scale:'context',en:'Which part of life has felt heaviest lately?',hi:'हाल में ज़िंदगी का कौन-सा हिस्सा सबसे भारी लगा?',options:{en:['Work or business','Home or family','Relationships','Several areas / none in particular'],hi:['काम या business','घर या परिवार','रिश्ते','कई हिस्से / कोई खास नहीं']}},
 {id:'need',scale:'context',en:'What would you most like support with?',hi:'आप सबसे ज़्यादा किस बात में मदद चाहेंगे?',options:{en:['Calmer reactions','Rest and routine','Talking things through','I am not sure yet'],hi:['शांत प्रतिक्रिया देना','आराम और दिनचर्या','खुलकर बात करना','अभी तय नहीं']}}
];
for(const [code,pack] of Object.entries(wellbeingLocales)){checkinQuestions.forEach((q,i)=>{q[code]=pack.questions[i];if(q.options)q.options[code]=pack.options[i-6];});}
export function answerOptions(index,lang='en'){const l=canonicalLanguage(lang)||'en';return checkinQuestions[index].options?.[l]??frequency[l];}
export function validResponse(value,index){return Number.isInteger(value)&&value>=0&&value<=3||(index>=4&&value==='skip');}
export function isComplete(answers){return Array.isArray(answers)&&answers.length===10&&Array.from(answers).every((v,i)=>validResponse(v,i));}
export function screenScores(answers){
 if(!Array.isArray(answers)||answers.length<4||Array.from(answers.slice(0,4)).length!==4||Array.from(answers.slice(0,4)).some((v,i)=>!validResponse(v,i)))throw new Error('All four screening responses are required.');
 const anxiety=answers[0]+answers[1],mood=answers[2]+answers[3],total=anxiety+mood;
 return {anxiety,mood,total,band:total<=2?'minimal':total<=5?'mild':total<=8?'moderate':'severe',anxietyFollowup:anxiety>=3,moodFollowup:mood>=3};
}
export function makeCheckin(answers,{id,createdAt,language='en'}={}){
 if(!isComplete(answers))throw new Error('Complete or skip each context question before continuing.');
 if(typeof id!=='string'||!id||id.length>100||typeof createdAt!=='string'||!Number.isFinite(Date.parse(createdAt)))throw new Error('A valid record ID and date are required.');
 return {id,createdAt,language:canonicalLanguage(language)||'en',version:MENTAL_VERSION,answers:[...answers],scores:screenScores(answers)};
}
export function validCheckin(value){return value&&value.version===MENTAL_VERSION&&supportedLanguage(value.language)&&typeof value.id==='string'&&value.id.length>0&&value.id.length<=100&&typeof value.createdAt==='string'&&Number.isFinite(Date.parse(value.createdAt))&&isComplete(value.answers);}
export function readSavedCheckins(raw){
 try{const parsed=JSON.parse(raw);if(!Array.isArray(parsed))return [];const seen=new Set();return parsed.filter(r=>validCheckin(r)&&!seen.has(r.id)&&seen.add(r.id)).slice(0,50).map(r=>{const clean=makeCheckin(r.answers,r);if(r.reflection?.version===REFLECTION_VERSION&&Array.isArray(r.reflection.answers)&&r.reflection.answers.length===REFLECTION_COUNT){try{clean.reflection={version:REFLECTION_VERSION,answers:[...r.reflection.answers],scores:reflectionScores(r.reflection.answers)};clean.flowVersion='reflection-36-plus-mental-10-v1';}catch{}}return clean;});}catch{return [];}
}
export function compatibleHistory(records,language='en'){
 // Same questionnaire and language only. One most recent check-in per local calendar day.
 const byDay=new Map();
 for(const r of records.filter(validCheckin).filter(r=>r.language===language).toSorted((a,b)=>Date.parse(a.createdAt)-Date.parse(b.createdAt))){const d=new Date(r.createdAt),day=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;byDay.set(day,{...r,scores:screenScores(r.answers)});}
 return [...byDay.values()].slice(-8);
}
export function nextUnanswered(answers,start,end){for(let i=start;i<end;i++)if(!validResponse(answers[i],i))return i;return null;}
export function supportLevel(report){const s=screenScores(report.answers);return s.total>=9||report.answers[7]===3?'soon':s.anxietyFollowup||s.moodFollowup||report.answers[7]===2?'discuss':'reflect';}
export function suggestedSteps(report){
 const a=report.answers,steps=[];
 if(supportLevel(report)!=='reflect')steps.push('professional');
 if(a[9]===0||a[6]===2)steps.push('pause');
 if(a[9]===1||a[5]>=2)steps.push('rest');
 if(a[9]===2)steps.push('connect');
 if(a[4]>=2)steps.push('ground');
 for(const fallback of ['connect','ground','rest'])if(!steps.includes(fallback))steps.push(fallback);
 return [...new Set(steps)].slice(0,3);
}
export const stepContent={
 professional:{en:['Talk it through with a professional','Arrange a conversation with a qualified mental-health professional or primary-care clinician. Your answers can help start that conversation.'],hi:['किसी पेशेवर से बात करें','योग्य mental-health professional या डॉक्टर से बातचीत का समय लें। आपके जवाब बातचीत शुरू करने में मदद कर सकते हैं।'],source:'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health'},
 pause:{en:['Make room before reacting','Notice the first signs of anger. If it is safe, pause, count slowly to ten and return to the conversation when you feel ready.'],hi:['प्रतिक्रिया से पहले थोड़ा रुकें','गुस्से के शुरुआती संकेत पहचानें। सुरक्षित हो तो रुकें, धीरे-धीरे दस तक गिनें और तैयार होने पर बातचीत पर लौटें।'],source:'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/'},
 rest:{en:['Give rest a regular place','Try a consistent wake-up time and a quieter wind-down before bed. If sleep problems persist or affect daily life, speak with a clinician.'],hi:['आराम के लिए नियमित समय रखें','उठने का समय नियमित रखें और सोने से पहले माहौल शांत करें। नींद की परेशानी बनी रहे या रोज़मर्रा पर असर हो तो डॉक्टर से बात करें।'],source:'https://www.who.int/news-room/questions-and-answers/item/stress'},
 connect:{en:['Choose one safe conversation','Reach out to someone you trust. You can start with: “I have been finding things difficult. Could we talk?”'],hi:['किसी भरोसेमंद व्यक्ति से बात करें','किसी अपने से कह सकते हैं: “कुछ चीज़ें मुश्किल लग रही हैं। क्या हम बात कर सकते हैं?”'],source:'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health'},
 ground:{en:['Come back to the present','Feel your feet on the ground. Notice a few things you can see and hear, then choose one manageable task.'],hi:['इस पल से जुड़ें','ज़मीन पर अपने पैरों को महसूस करें। आसपास की कुछ चीज़ों और आवाज़ों पर ध्यान दें, फिर एक आसान काम चुनें।'],source:'https://www.who.int/publications/i/item/9789240003927'}
};
