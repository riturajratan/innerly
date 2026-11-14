import {thoughtWavesMarkup} from './thought-waves-view.mjs?v=5';
import {sampleReportData} from './sample-report.mjs';
import {questionGuidance} from './innerly-v1-guidance.mjs';
import {questionnaireLocale,workbookQuestions} from './innerly-v1-model.mjs?v=mh-14';
const say=(l,en,hi)=>l==='hi'?hi:en;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true">→</span>';
const start=l=>`<button class="mh-primary" data-action="begin">${say(l,'Start My Test','अपना टेस्ट शुरू करें')} ${arrow}</button>`;
export function homeIcon(kind){const paths={arrow:'M4 12h16m-6-6 6 6-6 6',loop:'M7 10c-4 0-5 6-1 8 3 2 6-2 9-6 2-3 5-4 7-1 3 5-3 9-6 5M9 5v5H4',sun:'M12 4V2m0 20v-2M4 12H2m20 0h-2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',connection:'M11 7C7 1 0 7 4 12l8 8 8-8c4-5-3-11-7-5M8 12h8',leaf:'M5 20C4 12 7 5 20 3c1 12-5 18-15 17ZM5 20l10-10',shield:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6ZM8 12l3 3 5-6',clock:'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',chart:'M4 21V11m8 10V4m8 17v-7',book:'M3 3h7l2 2 2-2h7v17h-7l-2 2-2-2H3ZM12 5v17',check:'m5 12 4 4L20 5',spark:'m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[kind]||paths.leaf}"/></svg>`;}
export const homeTopics={
 thoughts:{label:['Thoughts','आपके विचार'],title:['When your mind keeps going.','जब विचार चलते ही रहें।'],description:['Notice the thoughts you return to.','उन विचारों पर ध्यान दें जो बार-बार आते हैं।'],question:6,icon:'loop'},
 emotions:{label:['Emotions','भावनाएँ'],title:['A feeling. A pause. A response.','एक भावना। एक विराम। एक प्रतिक्रिया।'],description:['Explore what happens between feeling and reacting.','भावना आने और प्रतिक्रिया देने के बीच क्या होता है, समझें।'],question:12,icon:'sun'},
 relationships:{label:['Relationships','रिश्ते'],title:['Find the words for what you need.','अपनी ज़रूरतों को शब्द दें।'],description:['Reflect on communication and personal boundaries.','बातचीत और अपनी सीमाओं पर सोचें।'],question:26,icon:'connection'},
 pressure:{label:['Life’s pressures','जीवन के दबाव'],title:['When life asks a lot of you.','जब ज़िंदगी बहुत कुछ माँग रही हो।'],description:['Explore how you respond to everyday challenges.','रोज़मर्रा की चुनौतियों पर अपनी प्रतिक्रिया को समझें।'],question:33,icon:'leaf'}
};
export function homeTopicPanel(key='thoughts',l='en'){
 const c=homeTopics[key]||homeTopics.thoughts,i=l==='hi'?1:0,locale=questionnaireLocale(l);
 return `<div class="in-question-intro"><span class="in-topic-symbol">${homeIcon(c.icon)}</span><h3>${c.title[i]}</h3><p>${c.description[i]}</p>${start(l)}</div><div class="in-question-card"><p class="in-overline">${say(l,'A LITTLE LOOK INSIDE THE TEST','टेस्ट के एक सवाल की झलक')}</p><blockquote>“${esc(locale.questions[c.question])}”</blockquote><div class="in-example-scale" aria-hidden="true">${locale.choices.slice(0,5).map((label,j)=>`<div><i class="in-choice-${j}">${j===2?homeIcon('check'):''}</i><span>${esc(label)}</span></div>`).join('')}</div><p class="in-fine">${say(l,'Example only. Answer in your test, at your own pace.','सिर्फ़ उदाहरण। टेस्ट में अपनी गति से जवाब दें।')}</p></div>`;
}
const relationshipMoments={
 unheard:{label:['I don’t feel heard','मेरी बात अनसुनी लगती है'],quote:['“I wish they understood me.”','“काश वे मेरी बात समझ पाते।”'],notice:['What stays unsaid?','क्या अनकहा रह जाता है?'],reflect:['What do I need them to understand?','मैं उन्हें अपनी कौन-सी बात समझाना चाहता/चाहती हूँ?']},
 distant:{label:['We feel distant','हमारे बीच दूरी लगती है'],quote:['“We talk. But something feels missing.”','“बात होती है। फिर भी कुछ कमी लगती है।”'],notice:['What am I assuming?','मैं क्या मानकर चल रहा/रही हूँ?'],reflect:['What could I ask instead of guessing?','अंदाज़ा लगाने के बजाय मैं क्या पूछ सकता/सकती हूँ?']},
 argument:{label:['The same argument','वही बहस बार-बार'],quote:['“Why do we end up here again?”','“हम फिर उसी बात पर क्यों उलझ जाते हैं?”'],notice:['What happens before I react?','मेरी प्रतिक्रिया से पहले क्या होता है?'],reflect:['What feeling am I trying to express?','मैं कौन-सी भावना ज़ाहिर करने की कोशिश कर रहा/रही हूँ?']}
};
function relationshipMoment(key='unheard',l='en'){
 const c=relationshipMoments[key]||relationshipMoments.unheard,i=l==='hi'?1:0;
 return `<div class="in-conversation"><span class="in-person in-person-one" aria-hidden="true"><i></i></span><p>${c.quote[i]}</p><span class="in-person in-person-two" aria-hidden="true"><i></i></span></div><div class="in-reflection-path"><div><span>01</span><p><small>${say(l,'NOTICE','ध्यान दें')}</small>${c.notice[i]}</p></div><span class="in-path-arrow" aria-hidden="true">→</span><div><span>02</span><p><small>${say(l,'REFLECT','खुद से पूछें')}</small>${c.reflect[i]}</p></div></div>`;
}
const previewAnswers=sampleReportData().report.answers;
const defaultQuestion=12;
const previewCategories={
 support:['A strength to lean on','आपकी एक मददगार आदत'],
 focus:['Room to grow','बेहतरी की गुंजाइश'],
 varies:['A pattern to explore','समझने लायक पैटर्न']
};
function previewReading(question,answers,l,previous){
 const locale=questionnaireLocale(l),value=answers[question];
 const item=questionGuidance({index:question,id:workbookQuestions[question].id,value},l);
 return `<div class="in-preview-reading" data-result="${item.category}">
  <div class="in-book-page-head"><span>${say(l,'YOUR REPORT, UNFOLDED','आपकी रिपोर्ट की एक झलक')}</span>${homeIcon('spark')}</div>
  <h3>${esc(item.label)}</h3>
  <div class="in-answer-chart" role="img" aria-label="${esc(`${say(l,'Sample answer','उदाहरण जवाब')}: ${locale.choices[value]}`)}">
   <div class="in-answer-chart-caption"><span>${say(l,'Your answer','आपका जवाब')}</span><strong>${esc(locale.choices[value])}</strong></div>
   <div class="in-answer-track"><span class="in-answer-fill" style="width:${value*25}%"></span><span class="in-answer-marker" style="left:${value*25}%"></span>${[0,1,2,3,4].map(v=>`<i style="left:${v*25}%"></i>`).join('')}</div>
   <div class="in-answer-axis"><span>${esc(locale.choices[0])}</span><span>${esc(locale.choices[4])}</span></div>
  </div>
  <div class="in-preview-result" data-result="${item.category}">${homeIcon(item.category==='support'?'check':item.category==='focus'?'leaf':'loop')}<strong>${previewCategories[item.category][l==='hi'?1:0]}</strong></div>
  <p class="in-answer-change">${previous!==undefined?`${esc(locale.choices[previous])} → ${esc(locale.choices[value])}`:say(l,'One answer. One part of your picture.','एक जवाब। आपकी तस्वीर का एक हिस्सा।')}</p>
  <div class="in-preview-step"><span>${say(l,'ONE SMALL STEP','एक छोटा कदम')}</span><p>${esc(item.step)}</p></div>
  <div class="in-preview-benefit">${homeIcon('leaf')}<p><strong>${say(l,'What it could help with','इससे क्या मदद मिल सकती है')}</strong>${esc(item.benefit)}</p></div>
 </div>`;
}
export function homeReportPreview(l='en',{question=defaultQuestion,answers=previewAnswers}={}){
 const locale=questionnaireLocale(l);
 return `<div class="in-preview-unfold">
  <div class="in-preview-prompt">
   <p class="in-preview-kicker"><span>01</span> ${say(l,'A SMALL ANSWER','एक छोटा जवाब')}</p>
   <h3>${say(l,'Try an answer.<br>See what unfolds.','एक जवाब चुनें।<br>खुद को थोड़ा समझें।')}</h3>
   <blockquote>“${esc(locale.questions[question])}”</blockquote>
   <div class="in-preview-options" role="group" aria-label="${say(l,'Try a sample answer','एक उदाहरण जवाब आज़माएँ')}">${locale.choices.slice(0,5).map((label,value)=>`<button type="button" data-preview-answer="${value}" aria-pressed="${value===answers[question]}" aria-controls="in-book-reading"><span aria-hidden="true"></span>${esc(label)}</button>`).join('')}</div>
   <p class="in-preview-hint">${homeIcon('arrow')}${say(l,'Change your answer. Watch the insight change.','जवाब बदलें। उससे जुड़ी समझ बदलते देखें।')}</p>
   <p class="in-preview-disclaimer">${say(l,'A fictional example from our 36 questions. Your full report brings all your answers together.','हमारे 36 सवालों में से एक काल्पनिक उदाहरण। पूरी रिपोर्ट में आपके सभी जवाब एक साथ आते हैं।')}</p>
  </div>
  <div class="in-book-scene">
   <div class="in-report-book is-open">
    <div id="in-book-reading" class="in-book-page">${previewReading(question,answers,l)}</div>
   </div>
   <button class="in-preview-replay" data-preview-replay type="button">↻ ${say(l,'Replay the example','उदाहरण फिर देखें')}</button>
  </div>
 </div>`;
}
export function innerlyHome({language='en',mission=''}={}){
 const l=language==='hi'?'hi':'en',i=l==='hi'?1:0;
 return `<div class="in-home in-new-home">
 <section class="in-hero"><div class="in-hero-copy"><p class="in-eyebrow"><span></span>${say(l,'A LITTLE CHECK-IN. A LITTLE MORE CLARITY.','खुद से कुछ सवाल। थोड़ी और समझ।')}</p><h1>${say(l,'How is your mind,<br><span>really doing?</span>','आपका मन<br><span>कैसा है, सच में?</span>')}</h1><p class="in-lead">${say(l,'A private mental wellbeing check-in. <br>Understand your thoughts, emotions and relationships.','अपने मानसिक स्वास्थ्य को समझने का एक निजी पल। <br>अपने विचारों, भावनाओं और रिश्तों को करीब से जानें।')}</p><div class="in-hero-actions">${start(l)}<button class="in-secondary" data-action="preview">${say(l,'See what you’ll discover','देखें, क्या समझ पाएँगे')} <span aria-hidden="true">↗</span></button></div><p class="in-hero-meta"><span>${homeIcon('clock')}${say(l,'8–12 minutes','8–12 मिनट')}</span><span>${homeIcon('shield')}${say(l,'No sign-up needed','बिना account शुरुआत')}</span><span>${homeIcon('check')}${say(l,'Free full report','पूरी रिपोर्ट मुफ़्त')}</span></p></div><div class="in-hero-scene"><img src="assets/innerly-everyday-v2.webp" srcset="assets/innerly-everyday-v2-800.webp 800w, assets/innerly-everyday-v2.webp 1600w" sizes="(max-width:760px) 100vw, 1100px" width="1600" height="640" fetchpriority="high" alt="${say(l,'An illustration of adults of different ages taking time to reflect, listen and connect in a peaceful shared garden.','एक शांत बगीचे में अलग-अलग उम्र के वयस्क सोचने, सुनने और जुड़ने के लिए समय निकालते हुए।')}"><div class="in-scene-note in-note-mind">${homeIcon('spark')}<span>${say(l,'Your feelings. <br><strong>Worth understanding.</strong>','आपके एहसास। <br><strong>समझने के लायक।</strong>')}</span></div><div class="in-scene-note in-note-connection">${homeIcon('connection')}<span>${say(l,'A little closer<br><strong>to yourself.</strong>','खुद के<br><strong>थोड़ा और करीब।</strong>')}</span></div></div><div class="in-hero-facts"><div><b>36</b><span>${say(l,'thoughtful questions','सोचने-समझने के सवाल')}</span></div><div><b>6</b><span>${say(l,'areas of everyday life','रोज़मर्रा की ज़िंदगी के पहलू')}</span></div><div><b>20</b><span>${say(l,'question languages','सवालों की भाषाएँ')}</span></div></div></section>
 <section class="in-thought-section" id="thought-waves" aria-labelledby="thought-waves-title">
  <div class="in-thought-heading">
   <div><h2 id="thought-waves-title">${say(l,'What’s on your mind?','आपके मन में क्या चल रहा है?')}</h2>
    <p>${say(l,'Take a moment to notice what’s been on your mind.','कुछ पल लेकर देखें कि आपके मन में क्या चल रहा है।')}</p></div>
   ${start(l)}
  </div>
  ${thoughtWavesMarkup(l,'thought-waves-title')}
 </section>
 <section class="in-relationships" id="in-relationships" aria-labelledby="in-relationships-title"><div class="in-relationship-heading"><div><p class="in-eyebrow">${homeIcon('connection')}${say(l,'YOU, AND THE PEOPLE WHO MATTER','आप, और आपके अपने')}</p><h2 id="in-relationships-title">${say(l,'Relationships on<br><span>your mind?</span>','क्या रिश्ते<br><span>मन पर भारी हैं?</span>')}</h2></div><p>${say(l,'Feeling unheard. Growing apart. The same argument. <br>Start by understanding your own feelings and responses.','अनसुनी बातें। बढ़ती दूरियाँ। वही पुरानी बहस। <br>शुरुआत अपनी भावनाओं और प्रतिक्रियाओं को समझने से करें।')}</p></div><div class="in-relationship-board"><div class="in-relationship-side"><p>${say(l,'WHAT FEELS FAMILIAR?','क्या अपनी बात लगती है?')}</p><div class="in-relationship-tabs" role="group" aria-label="${say(l,'Explore relationship moments','रिश्तों से जुड़े अनुभव देखें')}">${Object.entries(relationshipMoments).map(([key,c],j)=>`<button data-home-relationship="${key}" aria-pressed="${j===0}" aria-controls="in-relationship-moment"><span>${c.label[i]}</span>${arrow}</button>`).join('')}</div><p class="in-relationship-context">${say(l,'With a partner, family or friends.','पार्टनर, परिवार या दोस्तों के साथ।')}</p></div><div class="in-relationship-content"><div id="in-relationship-moment" aria-live="polite" aria-atomic="true">${relationshipMoment('unheard',l)}</div><p class="in-fine">${say(l,'Examples to explore. These choices aren’t saved or scored.','समझने के लिए उदाहरण। ये चुनाव सेव नहीं होते, न इनका स्कोर बनता है।')}</p></div></div><div class="in-relationship-bottom"><p>${say(l,'A space to understand yourself. <br>No labels for you or your partner.','खुद को समझने के लिए एक जगह। <br>आप या आपके साथी पर कोई ठप्पा नहीं।')}</p>${start(l)}</div></section>
 <section class="in-report-section" id="mh-report-preview" aria-labelledby="in-report-heading">
  <div class="in-section-heading">
   <h2 id="in-report-heading">${say(l,'Your inner world. <br><span>A little easier to see.</span>','आपके मन की दुनिया। <br><span>अब थोड़ी और साफ़।</span>')}</h2>
   <p>${say(l,'See how 36 answers become a picture of your strengths, patterns and next steps.','देखें कि 36 जवाबों से आपकी ताकतों, आदतों और अगले कदमों की तस्वीर कैसे बनती है।')}</p>
  </div>
  <div class="in-report-workspace">
   <div class="in-paper-head"><strong>${homeIcon('chart')} ${say(l,'Wellbeing report','वेलबीइंग रिपोर्ट')}</strong><span>${say(l,'SAMPLE REPORT','उदाहरण रिपोर्ट')}</span></div>
   <div id="in-report-sample">${homeReportPreview(l)}</div>
   <div class="in-preview-footer"><a class="in-sample-report-link" href="report-preview.html">${say(l,'Explore the full sample report','पूरी उदाहरण रिपोर्ट देखें')} ↗</a>${start(l)}</div>
  </div>
 </section>
 <section class="in-explore" id="in-explore"><div class="in-section-heading"><p class="in-eyebrow">${say(l,'REAL LIFE. SIMPLE QUESTIONS.','आपकी ज़िंदगी। आसान सवाल।')}</p><h2>${say(l,'Let’s start with<br><span>what feels familiar.</span>','शुरुआत वहाँ से,<br><span>जो अपना लगे।</span>')}</h2></div><div class="in-topic-tabs" role="group" aria-label="${say(l,'Explore everyday experiences','रोज़मर्रा के अनुभव देखें')}">${Object.entries(homeTopics).map(([key,c],j)=>`<button data-home-topic="${key}" aria-pressed="${j===0}" aria-controls="in-topic-panel">${homeIcon(c.icon)}${c.label[i]}</button>`).join('')}</div><div id="in-topic-panel" class="in-topic-panel">${homeTopicPanel('thoughts',l)}</div></section>
 <section class="in-journey"><div><p class="in-eyebrow">${say(l,'JUST A FEW MINUTES FOR YOU','कुछ मिनट, सिर्फ़ आपके लिए')}</p><h2>${say(l,'Small steps. <br><span>Your own pace.</span>','छोटे कदम। <br><span>आपकी अपनी गति।</span>')}</h2><p>${say(l,'Save & take a break whenever you need.','जब चाहें, जवाब सेव करें और विराम लें।')}</p></div><ol class="in-journey-steps">${[['Answer honestly','Choose what feels true in everyday life.','सच्चे मन से जवाब दें','जो रोज़मर्रा की ज़िंदगी में आप पर लागू हो, चुनें।','book'],['Notice your patterns','See your responses across six areas.','अपने तरीकों को पहचानें','छह पहलुओं में अपने जवाब देखें।','chart'],['Take a reflection with you','Choose one thing you’d like to explore.','सोचने के लिए एक बात चुनें','जिस बात को समझना चाहें, उससे शुरू करें।','leaf']].map(([en,text,hi,htext,icon],j)=>`<li><span>${homeIcon(icon)}</span><div><small>0${j+1}</small><h3>${say(l,en,hi)}</h3><p>${say(l,text,htext)}</p></div></li>`).join('')}</ol></section>
 <section class="in-invitation"><span class="in-invite-spark" aria-hidden="true">✳</span><div><p class="in-eyebrow">${say(l,'YOU DON’T HAVE TO HAVE IT ALL FIGURED OUT','सब कुछ समझ लेना ज़रूरी नहीं')}</p><h2>${say(l,'A good place to start?<br><span>Right where you are.</span>','शुरुआत कहाँ से करें?<br><span>जहाँ आप अभी हैं।</span>')}</h2></div><div>${start(l)}<p>${say(l,'36 questions. One moment for you.','36 सवाल। कुछ पल आपके लिए।')}</p></div></section>
 <section class="in-faq"><div><p class="in-eyebrow">${say(l,'A FEW THINGS TO KNOW','कुछ ज़रूरी बातें')}</p><h2>${say(l,'Before you begin.','शुरू करने से पहले।')}</h2></div><div class="in-faq-items"><details><summary>${say(l,'What will my report tell me?','रिपोर्ट से क्या पता चलेगा?')}</summary><p>${say(l,'You’ll see your responses across self-awareness, thinking patterns, emotional balance, decisions, relationships and resilience. It is a space to reflect, not a diagnosis or a clinical mental-health score.','खुद की समझ, सोचने के तरीके, भावनाओं का संतुलन, निर्णय, रिश्ते और मुश्किलों का सामना—इन विषयों में आपके जवाब दिखेंगे। यह सोचने-समझने की शुरुआत है, किसी बीमारी का diagnosis या clinical mental-health score नहीं।')}</p></details><details><summary>${say(l,'Where are my answers saved?','मेरे जवाब कहाँ सेव होते हैं?')}</summary><p>${say(l,'Completed reports save automatically in this browser and stay in My reports until you remove them. Unfinished answers stay in this page unless you choose Save & take a break. Use a private device: others using the same browser could read saved reports.','पूरी report इस browser में अपने आप सेव होकर My reports में रहती है, जब तक आप उसे हटाएँ। अधूरे जवाब सेव करने के लिए Save & take a break चुनें। निजी device इस्तेमाल करें: उसी browser का इस्तेमाल करने वाले दूसरे लोग सेव reports पढ़ सकते हैं।')}</p></details><details><summary>${say(l,'Which languages are available?','कौन-कौन सी भाषाएँ हैं?')}</summary><p>${say(l,'All 36 questions and their answer options are available in 20 languages, including English and Hindi. Your browser language helps select the question language; you can also choose it above. The homepage and full report are currently in English and Hindi.','सभी 36 सवाल और विकल्प English और हिन्दी सहित 20 भाषाओं में हैं। Browser की भाषा के अनुसार सवालों की भाषा चुनी जाती है; ऊपर से बदल भी सकते हैं। होमपेज और पूरी report अभी English और हिन्दी में हैं।')}</p></details><details class="mh-core-mission"><summary>${say(l,'What is Innerly here for?','Innerly का उद्देश्य क्या है?')}</summary><p>${esc(mission)}</p></details></div></section><p class="in-home-limit">${say(l,'For adults. A self-reflection questionnaire, not a clinical assessment, diagnosis or treatment.','वयस्कों के आत्मचिंतन के लिए। यह clinical assessment, diagnosis या इलाज नहीं है।')}</p></div>`;
}
export function bindHomeInteractions(root,language,onUpdate=()=>{}){
 const l=language==='hi'?'hi':'en';
 for(const button of root.querySelectorAll('[data-home-relationship]'))button.onclick=()=>{for(const other of root.querySelectorAll('[data-home-relationship]'))other.setAttribute('aria-pressed',String(other===button));root.querySelector('#in-relationship-moment').innerHTML=relationshipMoment(button.dataset.homeRelationship,l);};
 for(const button of root.querySelectorAll('[data-home-topic]'))button.onclick=()=>{for(const other of root.querySelectorAll('[data-home-topic]'))other.setAttribute('aria-pressed',String(other===button));root.querySelector('#in-topic-panel').innerHTML=homeTopicPanel(button.dataset.homeTopic,l);onUpdate();};
 const panel=root.querySelector('#in-report-sample');
 if(!panel)return;
 const answers=[...previewAnswers],question=defaultQuestion;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const announcement=document.createElement('div');
 announcement.className='mh-sr';announcement.setAttribute('role','status');panel.after(announcement);
 const book=panel.querySelector('.in-report-book'),page=panel.querySelector('.in-book-page');
 const animationAllowed=()=>!motion.matches&&document.getElementById('mh-motion')?.getAttribute('aria-pressed')!=='true';
 let demoTimer,answerTimer;
 function changeAnswer(value){
  if(!panel.isConnected)return;
  const previous=answers[question];answers[question]=value;
  page.innerHTML=previewReading(question,answers,l,previous===value?undefined:previous);
  panel.querySelectorAll('[data-preview-answer]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.previewAnswer)===value)));
  announcement.textContent=`${questionnaireLocale(l).choices[value]}. ${panel.querySelector('.in-preview-result').textContent}`;
  if(previous===value||!animationAllowed())return;
  page.querySelector('.in-answer-fill').animate([{width:`${previous*25}%`},{width:`${value*25}%`}],{duration:950,easing:'cubic-bezier(.2,.7,.2,1)'});
  page.querySelector('.in-answer-marker').animate([{left:`${previous*25}%`},{left:`${value*25}%`}],{duration:950,easing:'cubic-bezier(.2,.7,.2,1)'});
  page.querySelector('.in-preview-result').animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:350,fill:'backwards'});
 }
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(([entry])=>{
  clearTimeout(demoTimer);
  if(entry.intersectionRatio<.35)return;
  observer.disconnect();
  if(!animationAllowed())return;
  demoTimer=setTimeout(()=>{if(animationAllowed())changeAnswer(3);},1300);
 },{threshold:.35}):null;
 observer?.observe(book);

 function cancelDemo(){observer?.disconnect();clearTimeout(demoTimer);clearTimeout(answerTimer);}
 panel.addEventListener('focusin',cancelDemo);
 panel.onclick=event=>{
  const button=event.target.closest('button');if(!button)return;
  cancelDemo();
  if(button.hasAttribute('data-preview-answer'))changeAnswer(Number(button.dataset.previewAnswer));
  else if(button.hasAttribute('data-preview-replay')){
   answers[question]=2;page.innerHTML=previewReading(question,answers,l);
   panel.querySelectorAll('[data-preview-answer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewAnswer==='2')));
   if(!animationAllowed())return;
   demoTimer=setTimeout(()=>{if(animationAllowed())changeAnswer(3);},1100);
  }
 };
}
