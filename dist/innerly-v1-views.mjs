import {dimensionInfographicGrid} from './dimension-infographics.mjs?v=report-3';
import {workbookDimensionExplorer,workbookQuestionReading,workbookAnswerMap,workbookTimelineView,workbookPrintDimensions} from './innerly-v1-charts.mjs?v=report-4';
import {workbookDimensions,workbookQuestions,workbookChoices,skipChoice,questionnaireLocale,frequencyCounts,QUESTION_COUNT} from './innerly-v1-model.mjs?v=mh-14';
import {displayLanguage,languageName} from './mental-language.mjs?v=mh-14';
import {workbookAreaGuidance, guidanceLabel} from './innerly-v1-guidance.mjs';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=(l,en,hi)=>l==='hi'?hi:en;
const colors=['#c1a166','#d9bd87','#a9b8bd','#77a6b3','#438397'];
const prompts=[
 ['Recall a recent change in your mood. What happened just before it, and what did you notice?','मन के हाल में कोई हालिया बदलाव याद करें। ठीक पहले क्या हुआ और आपने क्या महसूस किया?'],
 ['Choose a thought you keep returning to. Write down one other way to look at the situation.','बार-बार लौटने वाला एक विचार चुनें। स्थिति को देखने का एक और तरीका लिखें।'],
 ['Think of a recent strong reaction. What could give you a moment to pause next time?','अपनी एक हाल की तीव्र प्रतिक्रिया याद करें। अगली बार रुककर सोचने में क्या मदद कर सकता है?'],
 ['Choose one decision ahead of you. What matters to you, and what information would help?','सामने आने वाला एक निर्णय चुनें। आपके लिए क्या ज़रूरी है और कौन-सी जानकारी मदद करेगी?'],
 ['Think of one relationship. Is there a need or boundary you would like to express clearly?','एक रिश्ते के बारे में सोचें। क्या कोई ज़रूरत या सीमा है जिसे आप साफ़ बताना चाहते हैं?'],
 ['Choose one challenge you are facing. What is one manageable next step, and who could help?','सामने की एक चुनौती चुनें। कौन-सा छोटा अगला कदम संभव है और कौन मदद कर सकता है?']
];
function answerList(answers,items,l){const labels=workbookChoices(l);return `<ol class="mh-workbook-answers">${items.map(i=>`<li value="${i+1}"><p>${esc(workbookQuestions[i].texts[l])}</p><strong>${esc(answers[i]==='skip'?skipChoice(l):labels[answers[i]])}</strong></li>`).join('')}</ol>`;}
function dimensionBars(answers,l,interactive=false,selected='dimension-1'){
 const labels=workbookChoices(l),names=questionnaireLocale(l).dimensions;
 return `<div class="mh-frequency-legend">${labels.map((label,i)=>`<span><i style="background:${colors[i]}"></i>${esc(label)}</span>`).join('')}</div><div class="mh-topic-bars">${workbookDimensions.map(d=>{const s=frequencyCounts(answers,d.items);return `<${interactive?'button':'div'} class="mh-topic-row" ${interactive?`data-workbook-dimension="${d.id}" aria-pressed="${selected===d.id}" aria-controls="mh-topic-reading"`:''}><span><strong>${esc(names[d.index])}</strong><b>${s.answered}<small> / 6 ${say(l,'answered','जवाब')}</small></b></span><span class="mh-topic-track" aria-hidden="true">${s.counts.map((n,i)=>`<i style="width:${n/6*100}%;background:${colors[i]}"></i>`).join('')}</span><small>${s.answered?s.counts.map((n,i)=>`${esc(labels[i])}: ${n}`).join(' · '):say(l,'No frequency responses in this category','इस विषय में कोई frequency जवाब नहीं')}${s.skipped?` · ${say(l,'Skipped','छोड़े गए')}: ${s.skipped}`:''}</small></${interactive?'button':'div'}>`;}).join('')}</div>`;
}
function distribution(answers,l){const s=frequencyCounts(answers),labels=[...workbookChoices(l),...(s.skipped?[skipChoice(l)]:[])],counts=[...s.counts,...(s.skipped?[s.skipped]:[])];return `<div class="mh-answer-distribution">${counts.map((n,i)=>`<div><span>${esc(labels[i])}</span><span class="mh-distribution-track"><i style="width:${n/QUESTION_COUNT*100}%;background:${colors[i]||'#adb5b7'}"></i></span><b>${n}</b></div>`).join('')}</div>`;}
const areaColors=['#3466ab','#7354ab','#a13c63','#855827','#25746a','#366d3a'];
const areaTitles=[
 ['Self-awareness','खुद की समझ'], ['Thinking patterns','सोच के तरीके'],
 ['Emotions','भावनाएँ'], ['Decisions','निर्णय'], ['Relationships','रिश्ते'], ['Stress & resilience','तनाव और उससे उबरना']
];

function areaResponseChart(area,l) {
 const choices=workbookChoices(l);
 const description=area.items.map(item=>`${item.id}: ${item.response}`).join(' · ');
 return `<div class="wb-mini-chart" role="img" aria-label="${esc(description)}">
  <div class="wb-mini-labels" aria-hidden="true">${[...choices].reverse().map(choice=>`<span>${esc(choice)}</span>`).join('')}</div>
  <div class="wb-mini-plot" aria-hidden="true">${area.items.map(item=>`
   <div class="wb-mini-column">
    ${[4,3,2,1,0].map(value=>`<span class="${item.value===value?'wb-mini-dot is-selected':'wb-mini-dot'}"></span>`).join('')}
    <small>${item.id}${item.value===null?' —':''}</small>
   </div>`).join('')}</div>
 </div>`;
}

function workbookReportSummary(answers,l) {
 const areas=workbookDimensions.map(d=>workbookAreaGuidance(answers,d.id,l));
 const supports=areas.flatMap(area=>area.supports);
 const focuses=areas.flatMap(area=>area.focuses);
 const varies=areas.flatMap(area=>area.varies);
 // Lead with the strongest frequency signals. Ties retain questionnaire order.
 const byFrequency=(a,b)=>Math.abs(b.value-2)-Math.abs(a.value-2);
 const strengths=[...supports].sort(byFrequency).slice(0,3);
 const priorities=[...focuses].sort(byFrequency);
 const next=(priorities.length?priorities:varies.length?varies:strengths).slice(0,2);
 const examples=(items,empty)=>items.length
  ? `<ul>${items.map(item=>`<li><strong>${esc(item.label)}</strong><span>${item.id} · ${esc(item.response)}</span></li>`).join('')}</ul>`
  : `<p>${empty}</p>`;

 return `<section class="wb-summary" aria-labelledby="wb-summary-title">
  <h2 id="wb-summary-title">${say(l,'Your results at a glance','आपके नतीजे, एक नज़र में')}</h2>
  <div class="wb-summary-context">
   <h3>${say(l,'Comparison with the general population','सामान्य आबादी से तुलना')}</h3>
   <p>${say(l,'Population comparison is unavailable. This questionnaire has no validated scoring key or reference sample. The counts below describe the answers you gave.','सामान्य आबादी से तुलना उपलब्ध नहीं है। इस प्रश्नावली के लिए मान्य स्कोरिंग पद्धति या तुलना का डेटा उपलब्ध नहीं है। नीचे की गिनती आपके जवाबों पर आधारित है।')}</p>
  </div>
  <div class="wb-summary-counts">
   <div><strong>${supports.length}</strong><span>${say(l,'Possible strengths','संभावित ताकतें')}</span></div>
   <div><strong>${focuses.length}</strong><span>${say(l,'Areas to work on','सुधार की गुंजाइश')}</span></div>
   <div><strong>${varies.length}</strong><span>${say(l,'Patterns to notice','ध्यान देने लायक पैटर्न')}</span></div>
  </div>
  <div class="wb-summary-grid">
   <article><h3>${say(l,'What seems to help you','आपके लिए क्या मददगार दिखता है')}</h3>
    ${examples(strengths,say(l,'Your answers did not show a clear supporting habit.','इन जवाबों में कोई साफ़ मददगार आदत नहीं दिखी।'))}
   </article>
   <article><h3>${say(l,'Where to start improving','सुधार की शुरुआत कहाँ से करें')}</h3>
    ${examples(priorities.slice(0,3),say(l,'Your answers did not point to a clear improvement priority.','इन जवाबों में सुधार की कोई साफ़ प्राथमिकता नहीं दिखी।'))}
   </article>
  </div>
  <h3 class="wb-summary-next">${say(l,'What you can try next','अब आप क्या आज़मा सकते हैं')}</h3>
  <div class="wb-summary-grid">${next.map(item=>`<article>
   <h4>${esc(item.label)} <small>${item.id}</small></h4>
   <p><strong>${say(l,'Try this','इसे आज़माएँ')}</strong> ${say(l,'Write a short answer to this prompt.','इस सवाल का एक छोटा जवाब लिखें।')} ${esc(item.step)}</p>
   <p><strong>${say(l,'How it may help','इससे क्या मदद मिल सकती है')}</strong> ${esc(item.benefit)}</p>
  </article>`).join('')}</div>
 </section>`;
}

function workbookGuidanceOverview(answers,l) {
 const names=questionnaireLocale(l).dimensions;
 const groups=[
  ['support','supports','No clear supporting pattern in these answers.','इन जवाबों में कोई साफ़ मददगार पैटर्न नहीं दिखा।'],
  ['focus','focuses','No clear focus area in these answers.','इन जवाबों में ध्यान देने का कोई साफ़ पहलू नहीं दिखा।'],
  ['varies','varies','No “Sometimes” responses in this area.','इस पहलू में “कभी-कभी” वाला कोई जवाब नहीं है।']
 ];
 return `<section class="wb-guidance" aria-labelledby="wb-guidance-title">
  <h2 id="wb-guidance-title">${say(l,'Your six areas at a glance','आपके छह पहलू, एक नज़र में')}</h2>
  <p>${say(l,'Each filled dot shows one answer. Open any area for insights and a next step.','हर भरा बिंदु एक जवाब दिखाता है। अपने पैटर्न और अगले कदम के लिए कोई पहलू खोलें।')}</p>
  <div class="wb-guidance-grid">${workbookDimensions.map(d=>{
   const area=workbookAreaGuidance(answers,d.id,l);
   const next=area.next;
   return `<article class="wb-guidance-card" style="--wb-area-color:${areaColors[d.index]}">
    <div class="wb-guidance-card-head">
     <h3 title="${esc(names[d.index])}">${esc(areaTitles[d.index][l==='hi'?1:0])}</h3>
     <span class="wb-guidance-count" aria-label="${say(l,`${area.answered} of ${area.total} answered`,`${area.total} में से ${area.answered} जवाब`)}">${area.answered}/${area.total}</span>
    </div>
    ${areaResponseChart(area,l)}
    <details class="wb-guidance-details"><summary>${say(l,'Insights & next step','आपके पैटर्न और अगला कदम')}</summary>
    <div class="wb-guidance-content">${area.answered ? `${groups.filter(([category])=>category!=='varies'||area.varies.length).map(([category,key,en,hi])=>`
     <div class="wb-guidance-group"><h4>${guidanceLabel(category,l)}</h4>
     ${area[key].length ? `<ul>${area[key].map(item=>`<li><span>${esc(item.label)}</span> <small>${item.id} · ${esc(item.response)}</small></li>`).join('')}</ul>` : `<p>${say(l,en,hi)}</p>`}</div>`).join('')}
     ${next ? `<div class="wb-guidance-next"><h4>${next.category==='support'?say(l,'Build on what helps','जो मदद करता है, उसे जारी रखें'):say(l,'One thing to try','एक कदम आज़माएँ')} <small>${next.id}</small></h4>
      <p>${say(l,'Write a short answer to this prompt.','इस सवाल का एक छोटा जवाब लिखें।')} ${esc(next.step)}</p>
      <h4>${say(l,'How it might help','इससे क्या मदद मिल सकती है')}</h4><p>${esc(next.benefit)}</p></div>` : ''}
     <button class="mh-link" data-workbook-open="${d.id}">${say(l,'Explore these six questions','इन छह सवालों को देखें')} →</button>`
     : `<p>${say(l,'No answers were recorded in this area.','इस पहलू में कोई जवाब दर्ज नहीं हुआ।')}</p>`}</div></details>
   </article>`;
  }).join('')}</div>
 </section>`;
}

export function workbookDimensionReading(answers,id,l='en',selectedQuestion){
 l=displayLanguage(l);
 return `<button class="mh-link wb-back-overview" data-action="dimension-overview">↑ ${say(l,'Back to your six areas','अपने छह पहलुओं पर वापस जाएँ')}</button>${workbookDimensionExplorer(answers,id,l,selectedQuestion)}`;
}
export function workbookSample(view='snapshot',l='en'){
 l=displayLanguage(l);const sample=Array.from({length:QUESTION_COUNT},(_,i)=>i%5);sample[5]='skip';
 return `<div class="mh-sample-head"><span>✳ innerly.</span><span class="mh-badge">${say(l,'EXAMPLE · NOT YOUR RESULTS','उदाहरण · आपके नतीजे नहीं')}</span></div><h3>${say(l,view==='journey'?'A small next step.':view==='days'?'Your choices, at a glance.':'Six areas of everyday life.',view==='journey'?'एक छोटा अगला कदम।':view==='days'?'आपके जवाब, एक नज़र में।':'रोज़मर्रा की ज़िंदगी के छह पहलू।')}</h3>${view==='journey'?`<div class="mh-sample-reflection"><p>${esc(questionnaireLocale(l).dimensions[4])}</p><strong>${prompts[4][l==='hi'?1:0]}</strong></div>`:view==='days'?distribution(sample,l):dimensionBars(sample,l)}<p class="mh-demo-foot">${say(l,'Illustrative responses only. Frequency counts, not a mental-health score.','काल्पनिक जवाब। Frequency की गिनती, mental-health score नहीं।')}</p>`;
}
export function workbookReportMarkup(report,l='en',view='snapshot',selected='dimension-1',saved=false,history=[],selectedQuestion=0){
 l=displayLanguage(l);const date=new Date(report.createdAt).toLocaleDateString(l,{day:'numeric',month:'long',year:'numeric'}),s=frequencyCounts(report.answers);
 return `<section class="mh-report mh-reflection-report mh-workbook-report rp-full-report"><div class="mh-report-heading"><p class="mh-kicker">INNERLY V1 · ${date}</p><h1>${say(l,'Your wellbeing report','आपकी वेलबीइंग रिपोर्ट')}</h1><p>${say(l,'Your thoughts, reactions and relationships. A starting point for reflection.','आपके विचार, प्रतिक्रियाएँ और रिश्ते। खुद को समझने की एक शुरुआत।')}</p></div><div class="mh-reflection-summary"><strong>${s.answered}<small> / ${QUESTION_COUNT}</small></strong><div><h2>${say(l,'Questions answered','सवालों के जवाब दिए')}</h2><p>${say(l,`6 categories${s.skipped?` · ${s.skipped} skipped`:``}`,`6 विषय${s.skipped?` · ${s.skipped} सवाल छोड़े`:``}`)}</p></div></div>${s.answered===0?`<p class="mh-report-limit">${say(l,'You skipped every question. There are no responses to interpret yet. You can start again whenever you feel ready.','आपने सभी सवाल छोड़े हैं। अभी समझने के लिए कोई जवाब नहीं है। जब तैयार हों, फिर शुरू कर सकते हैं।')}</p>`:''}<p class="mh-report-limit">${say(l,'These charts show how often you selected each response. Higher frequency can mean different things for different questions; it is not a better or worse mental-health score.','ये charts आपके चुने जवाबों की frequency दिखाते हैं। ज़्यादा frequency का मतलब हर सवाल में अलग हो सकता है; यह बेहतर या खराब mental-health score नहीं है।')}</p>
 <div class="rp-report-toolbar"><span>${say(l,'FULL REPORT · ALL 6 AREAS','पूरी REPORT · सभी 6 पहलू')}</span><button class="mh-primary" data-action="print">${say(l,'Print / save PDF','Print / PDF सेव करें')} ↓</button></div>
 ${s.answered?workbookReportSummary(report.answers,l):''}
 ${workbookGuidanceOverview(report.answers,l)}
 <div class="mh-report-visual"><div class="mh-demo-tabs" role="group" aria-label="${say(l,'Your report views','Report के नज़रिए')}">${[['snapshot','Your six areas','आपके छह पहलू'],['days','All 36 answers','सभी 36 जवाब'],['timeline','Over time','समय के साथ'],['journey','A small next step','एक छोटा अगला कदम']].map(([v,en,hi])=>`<button data-report-view="${v}" aria-pressed="${v===view}">${say(l,en,hi)}</button>`).join('')}</div>${view==='snapshot'?`${dimensionInfographicGrid(report.answers,l,selected,true,selectedQuestion)}<div id="mh-topic-reading" class="mh-topic-reading" aria-live="polite">${workbookDimensionReading(report.answers,selected,l,selectedQuestion)}</div>`:view==='timeline'?workbookTimelineView(report,history,selected,l,selectedQuestion):view==='days'?`${workbookAnswerMap(report.answers,l,selectedQuestion)}<div id="wb-question-detail" aria-live="polite">${workbookQuestionReading(report.answers,selectedQuestion,l)}</div><details class="mh-response-details"><summary>${say(l,'Read all questions and responses','सभी सवाल और जवाब देखें')}</summary>${answerList(report.answers,workbookQuestions.map((_,i)=>i),l)}</details>`:`<div class="mh-next-steps"><p>${say(l,'Optional reflection prompts. Choose one that feels relevant to you.','सोचने के लिए वैकल्पिक सवाल। जो आपके लिए ज़रूरी लगे, उसे चुनें।')}</p><div>${workbookDimensions.map(d=>`<article><h3>${esc(questionnaireLocale(l).dimensions[d.index])}</h3><p>${prompts[d.index][l==='hi'?1:0]}</p><button class="mh-link" data-workbook-open="${d.id}">${say(l,'Explore my answers','मेरे जवाब देखें')} →</button></article>`).join('')}</div></div>`}<p class="mh-chart-note">${s.skipped?say(l,'Skipped answers in this earlier report stay separate and are never counted as “Never”.','इस पुरानी report में छोड़े गए जवाब अलग रहते हैं; उन्हें “कभी नहीं” नहीं गिना जाता।'):say(l,'All 36 answers are included. Your responses are not compared with other people.','सभी 36 जवाब शामिल हैं। आपकी दूसरों से तुलना नहीं होती।')}</p></div>
 <div class="wb-print-infographics"><h2>${say(l,'Your six areas','आपके छह पहलू')}</h2>${dimensionInfographicGrid(report.answers,l,selected,false)}</div>${workbookPrintDimensions(report.answers,l)}<details class="mh-method"><summary>${say(l,'About this reflection','इस reflection के बारे में')}</summary><p>${say(l,'Innerly V1 uses 36 questions in six categories. No scoring key or clinical thresholds were supplied with this questionnaire, so this report describes responses without calculating a total score or diagnosis. Earlier questionnaire reports keep their original questions and cannot be compared directly.','Innerly V1 में छह विषयों के 36 सवाल हैं। इस questionnaire के साथ scoring key या clinical सीमाएँ नहीं दी गई हैं, इसलिए यह report जवाब दिखाती है, कोई total score या diagnosis नहीं। पुरानी reports अपने मूल सवालों के साथ रहती हैं और उनकी सीधी तुलना नहीं होती।')}</p><p>${say(l,'Each dimension keeps its six original questions. The response map and detail views use your exact choices, without averaging or reverse-scoring. Over time shows one question across up to eight actual check-ins in the same questionnaire language. A change is not evidence of improvement, deterioration or a treatment effect.','हर पहलू में उसके मूल छह सवाल हैं। जवाबों के नक्शे और विवरण में आपके असली चुनाव हैं; उनका औसत या reverse-scoring नहीं होती। समय के साथ एक सवाल के अधिकतम आठ असली check-ins दिखते हैं, सवालों की उसी भाषा में। बदलाव बेहतर या खराब स्वास्थ्य, या इलाज के असर का प्रमाण नहीं है।')}</p><p>${say(l,`Question language: ${languageName(report.language)}. Translations are editorial and have not been independently validated.`,`सवालों की भाषा: ${languageName(report.language)}। अनुवाद संपादकीय हैं; उनका स्वतंत्र validation नहीं हुआ है।`)}</p></details><div class="mh-report-actions"><button class="mh-primary" data-action="save">${say(l,saved?'Saved on this device':'Save on this device',saved?'इस device पर सेव है':'इस device पर सेव करें')}</button><button class="mh-secondary" data-action="print">${say(l,'Print / save PDF','Print / PDF सेव करें')}</button><button class="mh-link" data-action="begin">${say(l,'Start My Test','अपना टेस्ट शुरू करें')}</button></div><p class="mh-footnote">${say(l,'Your full reflection report is free for now.','आपकी पूरी reflection report अभी मुफ़्त है।')}</p><div id="mh-report-status" class="mh-form-message" role="status"></div></section>`;
}
