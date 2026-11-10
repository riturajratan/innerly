import {workbookDimensions,workbookQuestions,frequencyCounts,validWorkbookResponse,validWorkbookReport} from './innerly-v1-model.mjs?v=mh-14';

// Descriptive views only: retain the original ordinal response for every item.
// Do not add, average or reverse-score mixed positive/negative statements.
export function dimensionProfile(answers,id='dimension-1') {
 const dimension=workbookDimensions.find(d=>d.id===id)||workbookDimensions[0];
 return {...dimension,...frequencyCounts(answers,dimension.items),rows:dimension.items.map(index=>({
  index,id:workbookQuestions[index].id,
  value:validWorkbookResponse(answers[index],index)?answers[index]:null,
  skipped:answers[index]==='skip'
 }))};
}

export function workbookTimeline(report,saved=[],questionIndex=0) {
 if(!validWorkbookReport(report)||!Number.isInteger(questionIndex)||questionIndex<0||questionIndex>=workbookQuestions.length)return [];
 const seen=new Set(),cutoff=Date.parse(report.createdAt);
 return [report,...saved].filter(r=>{
  if(!validWorkbookReport(r)||r.language!==report.language||Date.parse(r.createdAt)>cutoff||seen.has(r.id))return false;
  seen.add(r.id);return true;
 }).sort((a,b)=>Date.parse(a.createdAt)-Date.parse(b.createdAt)||a.id.localeCompare(b.id))
 .slice(-8).map(r=>({id:r.id,createdAt:r.createdAt,value:validWorkbookResponse(r.answers[questionIndex],questionIndex)?r.answers[questionIndex]:null,current:r.id===report.id}));
}

// UI labels and reflection questions, not a scoring key or treatment advice.
export const itemReflections=[
 ['Noticing emotions','भावनाओं को पहचानना','What happened just before a recent change in how you felt?','हाल में मन बदलने से ठीक पहले क्या हुआ था?'],
 ['Feelings & facts','भावनाएँ और तथ्य','Think of one decision. Which feelings and facts influenced it?','एक निर्णय याद करें। किन भावनाओं और तथ्यों का उस पर असर था?'],
 ['Understanding reactions','प्रतिक्रिया को समझना','Recall a strong reaction. What might have been behind it?','एक तीव्र प्रतिक्रिया याद करें। उसके पीछे क्या हो सकता था?'],
 ['Past experiences','पुराने अनुभव','Did a past experience shape a recent response?','क्या किसी पुराने अनुभव ने आपकी हाल की प्रतिक्रिया पर असर डाला?'],
 ['Reflecting after conflict','असहमति के बाद सोचना','After a disagreement, what would you keep or change next time?','असहमति के बाद, अगली बार आप क्या वही रखेंगे और क्या बदलेंगे?'],
 ['Checking assumptions','अनुमान की जाँच','What could you ask before reaching a conclusion?','नतीजे पर पहुँचने से पहले आप क्या पूछ सकते हैं?'],
 ['Returning to the past','पुरानी बातों में उलझना','Which thought keeps returning? Is there something you can act on now?','कौन-सा विचार लौटता रहता है? क्या अभी कुछ किया जा सकता है?'],
 ['Seeing another angle','दूसरा नज़रिया','What is one other way to understand a recent disappointment?','हाल की निराशा को समझने का एक और तरीका क्या हो सकता है?'],
 ['Self-blame','खुद को दोष देना','What would you say to a friend who made the same mistake?','यही गलती किसी दोस्त से होती तो आप उससे क्या कहते?'],
 ['Revisiting an opinion','राय पर फिर सोचना','What new information might change your view?','कौन-सी नई जानकारी आपकी राय बदल सकती है?'],
 ['Expecting the worst','बुरे की आशंका','Which parts of an uncertain situation are facts, and which are predictions?','अनिश्चित स्थिति में कौन-सी बातें तथ्य हैं और कौन-सी आशंकाएँ?'],
 ['Trying another approach','दूसरा तरीका आज़माना','If your first approach does not work, what else could you try?','पहला तरीका काम न करे तो और क्या आज़मा सकते हैं?'],
 ['Pausing before reacting','प्रतिक्रिया से पहले रुकना','What could help you pause during a difficult conversation?','मुश्किल बातचीत में रुकने में क्या मदद कर सकता है?'],
 ['Regretting a reaction','प्रतिक्रिया पर पछतावा','What did you notice just before a reaction you later regretted?','जिस प्रतिक्रिया पर बाद में पछतावा हुआ, उससे ठीक पहले आपने क्या महसूस किया?'],
 ['Making room for feelings','भावनाओं को जगह देना','Can you name a feeling without deciding what to do about it yet?','क्या अभी कुछ करने का निर्णय लिए बिना अपनी भावना को नाम दे सकते हैं?'],
 ['Refocusing after upset','परेशानी के बाद ध्यान','What helps you return to one everyday task after feeling upset?','परेशान होने के बाद किसी एक रोज़मर्रा के काम पर लौटने में क्या मदद करता है?'],
 ['Finding calm','शांत होने का तरीका','What has helped you feel calmer in a difficult moment?','मुश्किल पल में थोड़ा शांत होने में पहले किस चीज़ ने मदद की है?'],
 ['Expressing feelings','भावनाएँ बताना','How would you describe a feeling using “I feel…”?','“मुझे ऐसा महसूस होता है…” से अपनी भावना कैसे बताएँगे?'],
 ['Considering the impact','असर पर सोचना','Who might be affected by a decision you are considering?','आप जिस निर्णय पर सोच रहे हैं, उसका असर किस पर पड़ सकता है?'],
 ['Deciding too quickly','जल्दी निर्णय लेना','What information would you want before a similar decision?','ऐसे ही किसी अगले निर्णय से पहले आप कौन-सी जानकारी चाहेंगे?'],
 ['Putting decisions off','निर्णय टालना','What is one small part of a delayed decision you could clarify?','टले हुए निर्णय के किस छोटे हिस्से को स्पष्ट कर सकते हैं?'],
 ['Acting with uncertainty','अनिश्चितता में कदम','What manageable step could you take without knowing every outcome?','हर नतीजा जाने बिना कौन-सा छोटा कदम संभव है?'],
 ['Changing course','रास्ता बदलना','What would help you reconsider a choice that no longer fits?','जो निर्णय अब सही नहीं लग रहा, उस पर फिर सोचने में क्या मदद करेगा?'],
 ['Following your values','अपनी अहमियत के अनुसार','What matters most to you in your next decision?','अगले निर्णय में आपके लिए सबसे ज़रूरी क्या है?'],
 ['Understanding differences','अलग राय को समझना','What question could help you understand the other person’s view?','कौन-सा सवाल सामने वाले का नज़रिया समझने में मदद कर सकता है?'],
 ['Listening to feedback','प्रतिक्रिया सुनना','What could you ask before responding to feedback?','किसी की प्रतिक्रिया का जवाब देने से पहले आप क्या पूछ सकते हैं?'],
 ['Expressing your needs','अपनी ज़रूरत बताना','What is one need you would like to put into words?','कौन-सी एक ज़रूरत आप शब्दों में बताना चाहेंगे?'],
 ['Checking intentions','इरादे समझना','Is there an assumption you could check by asking the person?','क्या कोई अनुमान है जिसकी जाँच सामने वाले से पूछकर कर सकते हैं?'],
 ['Acknowledging hurt','अपनी गलती स्वीकारना','What would taking responsibility sound like in a recent disagreement?','हाल की असहमति में अपनी ज़िम्मेदारी स्वीकार करते हुए आप क्या कहेंगे?'],
 ['Setting boundaries','अपनी सीमाएँ बताना','What is a respectful way to say no to something uncomfortable?','किसी असहज बात के लिए सम्मानपूर्वक मना कैसे कर सकते हैं?'],
 ['Finding a next step','अगला कदम खोजना','Which part of a current challenge feels manageable?','सामने की चुनौती का कौन-सा हिस्सा सँभालना संभव लगता है?'],
 ['Worry outside your control','काबू से बाहर की चिंता','What is within your control today, and what is outside it?','आज क्या आपके नियंत्रण में है और क्या बाहर है?'],
 ['Adapting to change','बदलाव के साथ ढलना','What alternative could you explore when a plan changes?','योजना बदल जाए तो कौन-सा दूसरा रास्ता देख सकते हैं?'],
 ['Caring for yourself','अपना खयाल रखना','Which everyday need would you like to make room for today?','आज अपनी किस रोज़मर्रा की ज़रूरत के लिए समय रखना चाहेंगे?'],
 ['Asking for help','मदद माँगना','Who could you ask for a specific kind of help?','किससे किसी खास तरह की मदद माँग सकते हैं?'],
 ['Learning from setbacks','मुश्किल से सीखना','What is one thing a difficult experience taught you?','किसी मुश्किल अनुभव ने आपको एक कौन-सी बात सिखाई?']
];
