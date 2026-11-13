import {dimensionProfile, itemReflections} from './innerly-v1-insights.mjs?v=dimensions-1';
import {workbookChoices} from './innerly-v1-model.mjs?v=mh-14';

// Editorial guidance for individual statements. These directions do not create scores.
const challenges = new Set(['Q03', 'Q07', 'Q09', 'Q11', 'Q14', 'Q16', 'Q20', 'Q21', 'Q23', 'Q26', 'Q28', 'Q32', 'Q34']);
const challengeTopics = {
 Q03: ['Difficulty understanding strong reactions', 'तीव्र प्रतिक्रियाओं को समझने में मुश्किल'],
 Q16: ['Difficulty refocusing after an upset', 'परेशानी के बाद ध्यान लगाने में मुश्किल'],
 Q23: ['Difficulty changing course', 'निर्णय बदलने में मुश्किल'],
 Q26: ['Defending yourself before hearing feedback', 'प्रतिक्रिया सुनने से पहले अपना बचाव करना'],
 Q28: ['Assuming what someone meant', 'दूसरों के इरादे मान लेना'],
 Q34: ['Difficulty with self-care under stress', 'तनाव में अपना खयाल रखने में मुश्किल']
};
const labels = {
 support: ['What seems to support you', 'क्या आपके लिए मददगार दिखता है'],
 focus: ['What you could work on', 'किस पर काम कर सकते हैं'],
 varies: ['What you reported sometimes', 'क्या आपने कभी-कभी बताया'],
 unanswered: ['Not answered', 'जवाब नहीं दिया']
};
export const guidanceLabel = (category, language) => labels[category][language === 'hi' ? 1 : 0];

const benefits = {
 Q01: ['Spot what tends to shift your mood.', 'समझ पाएँ कि किन बातों से आपका मूड बदलता है।'],
 Q02: ['See what is driving a decision.', 'समझ पाएँ कि किसी निर्णय पर किस बात का असर है।'],
 Q03: ['Recognise what tends to set off a strong reaction.', 'पहचान पाएँ कि किन बातों पर आपकी प्रतिक्रिया तीव्र होती है।'],
 Q04: ['Notice when a past experience is shaping the present.', 'पहचान पाएँ कि कब पुराना अनुभव आज की प्रतिक्रिया पर असर डाल रहा है।'],
 Q05: ['Find one change to try in the next disagreement.', 'अगली असहमति में आज़माने के लिए एक बदलाव मिल सकता है।'],
 Q06: ['Reach conclusions with more context.', 'स्थिति को बेहतर समझकर नतीजे पर पहुँच पाएँ।'],
 Q07: ['Separate something you can act on from a thought that keeps repeating.', 'बार-बार लौटते विचार और उस पर किए जा सकने वाले काम में फर्क समझ पाएँ।'],
 Q08: ['See options you may have missed at first.', 'ऐसे विकल्प दिख सकते हैं जो पहले ध्यान में नहीं आए।'],
 Q09: ['Respond to a mistake with more kindness and perspective.', 'गलती होने पर खुद के प्रति थोड़ी नरमी रख पाएँ।'],
 Q10: ['Make room to update your view as you learn.', 'नई जानकारी मिलने पर अपनी राय बदलने की गुंजाइश रख पाएँ।'],
 Q11: ['Distinguish what you know from what you fear might happen.', 'जो जानते हैं और जिसकी आशंका है, उनमें फर्क कर पाएँ।'],
 Q12: ['Find another way forward when the first plan stalls.', 'पहला तरीका अटक जाए तो आगे बढ़ने का दूसरा रास्ता मिल सकता है।'],
 Q13: ['Create space to choose how you respond.', 'सोचकर जवाब देने के लिए थोड़ा समय मिल सकता है।'],
 Q14: ['Notice an early cue to pause before responding.', 'जवाब देने से पहले रुकने का संकेत पहचान पाएँ।'],
 Q15: ['Give yourself time before deciding what to do about a feeling.', 'किसी भावना पर क्या करना है, यह तय करने के लिए खुद को समय दे पाएँ।'],
 Q16: ['Identify one manageable way to return to your routine.', 'अपनी दिनचर्या में लौटने का एक आसान तरीका मिल सकता है।'],
 Q17: ['Have a familiar way to settle yourself when stressed.', 'तनाव के समय शांत होने का एक जाना-पहचाना तरीका याद रहेगा।'],
 Q18: ['Make it easier for someone to understand how you feel.', 'सामने वाले के लिए आपकी भावना समझना आसान हो सकता है।'],
 Q19: ['See who could be affected before you decide.', 'निर्णय से पहले समझ पाएँ कि उसका असर किस पर पड़ सकता है।'],
 Q20: ['Give yourself time to check a detail that matters.', 'ज़रूरी जानकारी जाँचने के लिए थोड़ा समय मिल सकता है।'],
 Q21: ['Make a delayed decision feel more manageable.', 'टला हुआ निर्णय थोड़ा आसान लग सकता है।'],
 Q22: ['Make a start when the outcome is uncertain.', 'नतीजा तय न होने पर भी शुरुआत कर पाएँ।'],
 Q23: ['Make it easier to adjust when a choice stops fitting.', 'जब कोई निर्णय ठीक न लगे, उसे बदलना आसान हो सकता है।'],
 Q24: ['Choose a next step that fits your priorities.', 'अपनी प्राथमिकताओं के मुताबिक अगला कदम चुन पाएँ।'],
 Q25: ['Understand more of what is behind a disagreement.', 'असहमति के पीछे की बात बेहतर समझ पाएँ।'],
 Q26: ['Hear the useful part of feedback before responding.', 'जवाब देने से पहले प्रतिक्रिया की काम की बात सुन पाएँ।'],
 Q27: ['Make it easier for others to respond to what you need.', 'दूसरों के लिए आपकी ज़रूरत समझकर मदद करना आसान हो सकता है।'],
 Q28: ['Clear up a misunderstanding before it grows.', 'गलतफहमी बढ़ने से पहले बात साफ़ हो सकती है।'],
 Q29: ['Start a conversation about repairing a hurt.', 'ठेस लगने के बाद रिश्ता सँभालने की बातचीत शुरू कर पाएँ।'],
 Q30: ['Communicate a limit clearly and respectfully.', 'अपनी सीमा साफ़ और सम्मान से बता पाएँ।'],
 Q31: ['Turn an overwhelming problem into one doable action.', 'भारी लग रही समस्या में एक छोटा, संभव काम ढूँढ पाएँ।'],
 Q32: ['Put attention on something you can influence today.', 'आज जिस बात पर आपका असर हो सकता है, उस पर ध्यान दे पाएँ।'],
 Q33: ['Have a fallback when plans change.', 'योजना बदलने पर एक दूसरा रास्ता तैयार रहेगा।'],
 Q34: ['Make space for a basic need on stressful days.', 'तनाव वाले दिन भी किसी बुनियादी ज़रूरत के लिए समय निकाल पाएँ।'],
 Q35: ['Make a request that someone can act on.', 'ऐसी मदद माँग पाएँ जो सामने वाला दे सके।'],
 Q36: ['Carry one useful lesson into a future challenge.', 'अगली मुश्किल में काम आने वाली एक सीख साथ रख पाएँ।']
};

export function questionGuidance(row, language = 'en') {
 const hindi = language === 'hi';
 const [enTopic, hiTopic, enStep, hiStep] = itemReflections[row.index];
 const topic = challengeTopics[row.id]?.[hindi ? 1 : 0] ?? (hindi ? hiTopic : enTopic);
 const category = row.value === null ? 'unanswered'
  : row.value === 2 ? 'varies'
  : (row.value >= 3) === challenges.has(row.id) ? 'focus' : 'support';
 return {
  ...row,
  category,
  label: topic,
  response: row.value === null ? (hindi ? 'जवाब नहीं दिया' : 'Not answered') : workbookChoices(language)[row.value],
  step: row.value === null ? null : (hindi ? hiStep : enStep),
  benefit: row.value === null ? null : benefits[row.id][hindi ? 1 : 0]
 };
}

export function workbookAreaGuidance(answers, id, language = 'en') {
 const profile = dimensionProfile(answers, id);
 const items = profile.rows.map(row => questionGuidance(row, language));
 return {
  ...profile,
  items,
  supports: items.filter(item => item.category === 'support'),
  focuses: items.filter(item => item.category === 'focus'),
  varies: items.filter(item => item.category === 'varies'),
  next: items.find(item => item.category === 'focus') ?? items.find(item => item.category === 'varies') ?? items.find(item => item.category === 'support')
 };
}
