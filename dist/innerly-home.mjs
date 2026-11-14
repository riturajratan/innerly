import {thoughtWavesMarkup} from './thought-waves-view.mjs?v=5';
import {sampleReportData} from './sample-report.mjs';
import {questionGuidance} from './innerly-v1-guidance.mjs';
import {questionnaireLocale,workbookDimensions,workbookQuestions} from './innerly-v1-model.mjs?v=mh-14';
const say=(l,en,hi)=>l==='hi'?hi:en;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true">→</span>';
const start=l=>`<button class="mh-primary" data-action="begin">${say(l,'Start My Test','अपना टेस्ट शुरू करें')} ${arrow}</button>`;
export function homeIcon(kind){const paths={loop:'M7 10c-4 0-5 6-1 8 3 2 6-2 9-6 2-3 5-4 7-1 3 5-3 9-6 5M9 5v5H4',sun:'M12 4V2m0 20v-2M4 12H2m20 0h-2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',connection:'M11 7C7 1 0 7 4 12l8 8 8-8c4-5-3-11-7-5M8 12h8',leaf:'M5 20C4 12 7 5 20 3c1 12-5 18-15 17ZM5 20l10-10',shield:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6ZM8 12l3 3 5-6',clock:'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',chart:'M4 21V11m8 10V4m8 17v-7',book:'M3 3h7l2 2 2-2h7v17h-7l-2 2-2-2H3ZM12 5v17',check:'m5 12 4 4L20 5',spark:'m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[kind]||paths.leaf}"/></svg>`;}
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
 support:['Strengths','ताकतें'],
 focus:['Areas to work on','सुधार की गुंजाइश'],
 varies:['Patterns to notice','ध्यान देने लायक पैटर्न']
};
const previewAreas=[
 ['Self-awareness','खुद की समझ'],
 ['Thinking patterns','सोचने के तरीके'],
 ['Emotional balance','भावनाओं का संतुलन'],
 ['Decisions','निर्णय'],
 ['Relationships','रिश्ते'],
 ['Stress & resilience','तनाव और उससे उबरना']
];

export function homeReportPreview(view='patterns',l='en',{question=defaultQuestion,answers=previewAnswers,change}={}){
 const i=l==='hi'?1:0;
 const locale=questionnaireLocale(l),labels=locale.choices.slice(0,5);
 const entries=workbookQuestions.map(({id},index)=>questionGuidance({index,id,value:answers[index]},l));
 const selected=entries[question],areaIndex=workbookQuestions[question].dimension;
 const areaEntries=workbookDimensions[areaIndex].items.map(index=>entries[index]);
 const next=areaEntries.find(entry=>entry.category==='focus')??areaEntries.find(entry=>entry.category==='varies')??selected;
 const tabs=[
  ['patterns','Insights','पैटर्न'],
  ['responses','Sample answers','उदाहरण जवाब'],
  ['steps','Next step','अगला कदम']
 ];

 let detail;
 if(view==='responses'){
  detail=`<label class="in-preview-question-label"><span>${say(l,'Choose a question','एक सवाल चुनें')}</span>
   <select data-preview-question>${areaEntries.map(entry=>`<option value="${entry.index}" ${entry.index===question?'selected':''}>${esc(entry.label)}</option>`).join('')}</select>
  </label>
  <p class="in-preview-question">“${esc(locale.questions[question])}”</p>
  <div class="in-preview-options" role="group" aria-label="${say(l,'Try a sample answer','एक उदाहरण जवाब आज़माएँ')}">
   ${labels.map((label,value)=>`<button type="button" data-preview-answer="${value}" aria-pressed="${value===selected.value}">${esc(label)}</button>`).join('')}
  </div>
  <p class="in-preview-result" data-result="${selected.category}">${say(l,'Shown under','रिपोर्ट में')} <strong>${previewCategories[selected.category][i]}</strong></p>`;
 }else if(view==='steps'){
  detail=`<div class="in-preview-practice">
   <strong>${esc(next.label)}</strong><p>${esc(next.step)}</p>
   <strong>${say(l,'How it can help','इससे क्या मदद मिल सकती है')}</strong><p>${esc(next.benefit)}</p>
  </div>`;
 }else{
  detail=`<dl class="in-preview-insights">${Object.entries(previewCategories).map(([category,names])=>{
   const matches=areaEntries.filter(entry=>entry.category===category);
   if(!matches.length)return '';
   return `<div data-result="${category}"><dt>${names[i]}</dt><dd>${matches.map(entry=>esc(entry.label)).join(' · ')}</dd></div>`;
  }).join('')}</dl>`;
 }

 return `<div class="in-preview-dashboard">
  <div class="in-preview-chart">
   <h3>${say(l,'Patterns across six areas','छह पहलुओं के पैटर्न')}</h3>
   <p>${say(l,'Choose an area to explore its results.','नतीजे देखने के लिए कोई पहलू चुनें।')}</p>
   <div class="in-preview-chart-rows" role="group" aria-label="${say(l,'Sample report areas','उदाहरण रिपोर्ट के पहलू')}">
    ${workbookDimensions.map(({index,items})=>{
     const counts=Object.keys(previewCategories).map(category=>items.filter(item=>entries[item].category===category).length);
     const summary=Object.values(previewCategories).map((names,j)=>`${names[i]} ${counts[j]}`).join(', ');
     return `<button type="button" data-preview-area="${index}" ${change&&index===areaIndex?'data-preview-changed':''} aria-pressed="${index===areaIndex}" aria-controls="in-preview-area-detail" aria-label="${esc(`${previewAreas[index][i]}, ${summary}`)}">
      <span>${previewAreas[index][i]}</span><span class="in-preview-track" aria-hidden="true">${Object.keys(previewCategories).map((category,j)=>`<span data-result="${category}" data-segment="${index}-${category}" style="flex-grow:${counts[j]}"></span>`).join('')}</span>
     </button>`;
    }).join('')}
   </div>
   <ul class="in-preview-legend">${Object.entries(previewCategories).map(([category,names])=>`<li data-result="${category}">${names[i]}</li>`).join('')}</ul>
  </div>
  <div id="in-preview-area-detail" class="in-preview-area-detail">
   <h3>${previewAreas[areaIndex][i]}</h3>
   <div class="in-preview-views" role="group" aria-label="${say(l,'Explore this area','इस पहलू को समझें')}">
    ${tabs.map(([key,en,hi])=>`<button type="button" data-preview-view="${key}" aria-pressed="${view===key}" aria-controls="in-preview-detail-body">${say(l,en,hi)}</button>`).join('')}
   </div>
   <div id="in-preview-detail-body">${detail}</div>
   ${change?`<div class="in-preview-demo" data-result="${selected.category}">
    <strong>${esc(selected.label)}</strong>
    <p>${esc(labels[change.value])} → ${esc(labels[selected.value])}</p>
    <p>${previewCategories[change.category][i]} → <b>${previewCategories[selected.category][i]}</b></p>
   </div>`:view==='patterns'&&question===defaultQuestion?`<div class="in-preview-demo" data-result="${selected.category}">
    <strong>${esc(selected.label)}</strong>
    <p>${say(l,'Sample answer','उदाहरण जवाब')} · ${esc(labels[selected.value])}</p>
    <p>${previewCategories[selected.category][i]}</p>
   </div>`:''}
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
   <div id="in-report-sample">${homeReportPreview('patterns',l)}</div>
   <div class="in-preview-footer"><a class="in-sample-report-link" href="report-demo.html?lang=${l}">${say(l,'Explore the full sample report','पूरी उदाहरण रिपोर्ट देखें')} ↗</a>${start(l)}</div>
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
 let view='patterns',question=defaultQuestion;
 const answers=[...previewAnswers];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const announcement=document.createElement('div');
 announcement.className='mh-sr';
 announcement.setAttribute('role','status');
 panel.after(announcement);

 let demoTimer;
 const animationAllowed=()=>!motion.matches&&document.getElementById('mh-motion')?.getAttribute('aria-pressed')!=='true';
 const observer=typeof IntersectionObserver==='function' ? new IntersectionObserver(([entry])=>{
  clearTimeout(demoTimer);
  if(entry.intersectionRatio<.45)return;
  demoTimer=setTimeout(()=>{
   observer.disconnect();
   if(panel.isConnected)changeAnswer(3);
  },1300);
 },{threshold:.45}) : null;
 observer?.observe(panel.querySelector('.in-preview-chart'));

 function cancelDemo(){
  observer?.disconnect();
  clearTimeout(demoTimer);
 }

 function render(focusSelector,change){
  panel.innerHTML=homeReportPreview(view,l,{question,answers,change});
  if(focusSelector)panel.querySelector(focusSelector)?.focus({preventScroll:true});
 }

 function changeAnswer(value,focusSelector){
  const previous=new Map([...panel.querySelectorAll('[data-segment]')]
   .map(segment=>[segment.dataset.segment,getComputedStyle(segment).flexGrow]));
  const id=workbookQuestions[question].id;
  const before=questionGuidance({index:question,id,value:answers[question]},l);
  const after=questionGuidance({index:question,id,value},l);
  answers[question]=value;
  const change=before.category===after.category?undefined:before;
  render(focusSelector,change);
  announcement.textContent=panel.querySelector('.in-preview-demo, .in-preview-result')?.textContent??'';
  if(!change||!animationAllowed())return;
  for(const segment of panel.querySelectorAll('[data-segment]')){
   const from=previous.get(segment.dataset.segment),to=segment.style.flexGrow;
   if(from!==to)segment.animate([{flexGrow:from},{flexGrow:to}],{duration:1050,easing:'ease-in-out'});
  }
  panel.querySelector('[data-preview-changed]').animate([
   {boxShadow:'0 0 0 3px #819ed0'},
   {boxShadow:'0 0 0 0 transparent'}
  ],{duration:1500,easing:'ease-out'});
 }

 panel.addEventListener('focusin',cancelDemo,{once:true});
 panel.onchange=event=>{
  if(!event.target.matches('[data-preview-question]'))return;
  cancelDemo();
  question=Number(event.target.value);
  render('[data-preview-question]');
 };
 panel.onclick=event=>{
  const button=event.target.closest('button');
  if(!button)return;
  cancelDemo();
  const data=button.dataset;
  if(data.previewArea!==undefined){
   const area=workbookDimensions[Number(data.previewArea)];
   if(!area.items.includes(question)){
    question=area.items.find(index=>questionGuidance({
     index,id:workbookQuestions[index].id,value:answers[index]
    },l).category==='focus')??area.items[0];
   }
   render(`[data-preview-area="${data.previewArea}"]`);
  }else if(data.previewView!==undefined){
   view=data.previewView;
   render(`[data-preview-view="${view}"]`);
  }else if(data.previewAnswer!==undefined){
   changeAnswer(Number(data.previewAnswer),`[data-preview-answer="${data.previewAnswer}"]`);
  }
 };
}
