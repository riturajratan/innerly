import {icon} from './report-concept-view.mjs?v=9';
import {mountThoughtWaves} from './planning.mjs?v=14';
import {previewResponseDetail} from './response-graphs.mjs?v=report-3';
import {sampleReportMarkup} from './sample-report-view.mjs?v=report-summary-1';
import {sampleReportData} from './sample-report.mjs?v=report-3';
import {personalReportMarkup,usesPersonalReport} from './personal-report-view.mjs?v=9';
import {mountPersonalReport} from './personal-report.mjs?v=9';
import {INNERLY_V1_VERSION,INNERLY_V1_STORAGE,readWorkbookReports,workbookQuestions,workbookChoices} from './innerly-v1-model.mjs?v=storage-1';
import {saveLocalReport,removeLocalReport} from './report-storage.mjs?v=1';
import {workbookDimensionReading} from './innerly-v1-views.mjs?v=report-summary-1';
import {workbookQuestionReading,workbookTimelineDetail,workbookFocusStatus} from './innerly-v1-charts.mjs?v=report-4';
import {dimensionProfile} from './innerly-v1-insights.mjs?v=report-3';
import {REFLECTION60_VERSION,REFLECTION60_STORAGE,readReflectionReports} from './reflection60-model.mjs';
import {topicReading} from './reflection60-views.mjs?v=mh-14';
import {LANGUAGE_STORAGE,resolveQuestionLanguage,languageDirection,languageName,displayLanguage,questionUI,wellbeingLocales,coverageNotice,responseState,growthCaption} from './mental-language.mjs?v=mh-14';
import {DRAFT_STORAGE,readDraft,makeDraft,resumeQuestion,nextContinuousQuestion} from './checkin-draft.mjs?v=mh-14';
import {feelingReading} from './feeling-explorer.mjs?v=mh-14';
import {bindHomeInteractions} from './innerly-home.mjs?v=home-preview-8';
import {MENTAL_STORAGE,readSavedCheckins} from './mental-model.mjs?v=mh-14';
import {QUESTION_TOTAL,completedCount,completeFlow as isComplete,validQuestionResponse as validResponse,makeFlowReport as makeCheckin,nextFlowQuestion as nextUnanswered,growthState} from './checkin-flow.mjs?v=mh-14';
import {esc,say,mentalHomeMarkup,themeMarkup,sampleReport,quizMarkup,reportMarkup,screeningDetail,screenBars,responseBars,historyChart} from './mental-views.mjs?v=home-preview-8';
import {clerkPublishableKey} from './auth-config.mjs?v=auth-1';
import {createClerkAuth} from './clerk-auth.mjs?v=auth-1';
import {rememberAuthReturn,takeAuthReturn,AUTH_RETURN_STORAGE} from './auth-continuation.mjs?v=auth-1';
const app=document.querySelector('#app'),dialog=document.querySelector('#mh-dialog');
const reportDemo=document.body.dataset.reportDemo==='true';
let samplePreset='mixed';
let preferredLanguage='';try{preferredLanguage=localStorage.getItem(LANGUAGE_STORAGE)||'';}catch{}
let language=resolveQuestionLanguage({url:new URL(location.href).searchParams.get('lang'),saved:preferredLanguage,browserLanguages:navigator.languages||[],deviceLanguage:navigator.language});
const qt=(key,en,hi)=>questionUI(language,key,en,hi);
let saved=[],answers=Array(QUESTION_TOTAL).fill(null),view='home',report=null,reportView='snapshot',guideTimer=null,pointerInput=false,lastFocus=null;
let reportSelection={dimension:'dimension-1',question:0};
let previewSelection={};
const previewUnlockedReports=new Set(); // Preview access only. Never use this as a paid entitlement.
let draftEnabled=false,draftSynced=false;
if(!reportDemo)try{saved=[...readWorkbookReports(localStorage.getItem(INNERLY_V1_STORAGE)),...readReflectionReports(localStorage.getItem(REFLECTION60_STORAGE)),...readSavedCheckins(localStorage.getItem(MENTAL_STORAGE))];const draft=readDraft(localStorage.getItem(DRAFT_STORAGE));if(draft){answers=draft.answers;language=draft.language;draftEnabled=true;draftSynced=true;}}catch{}
let answerLanguage=language;
const auth=createClerkAuth({publishableKey:reportDemo?'':clerkPublishableKey,window,document,onChange:updateAuthHeader});
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let thoughtWaves=null;
let personalReport=null;
let paused=false;const motion=()=>paused||reduce.matches?'instant':'smooth';
function cancelGuide(){clearTimeout(guideTimer);guideTimer=null;}
function focusHeading(){const heading=app.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}window.scrollTo({top:0,behavior:'instant'});}
function localizeStartButtons(){
 const reporting=view==='report'||view==='history';
 for(const button of app.querySelectorAll('[data-action="begin"],[data-action="new-test"]')){
  if(reporting)button.dataset.action='new-test';
  button.innerHTML=`${esc(reporting?say(language,'Start a new test','नया टेस्ट शुरू करें'):qt('Start test','Start My Test','अपना टेस्ट शुरू करें'))} <span aria-hidden="true">→</span>`;button.lang=language;button.dir=languageDirection(language);
 }
}
function goHistory(){if(reportDemo){location.assign('./?view=history');return;}view='history';render();}
function newTest(){
 if(reportDemo){location.assign('./?new=1');return;}
 const fresh=()=>{try{localStorage.removeItem(DRAFT_STORAGE);}catch{showDialog(`<h2>${say(language,'Could not start a new test','नया टेस्ट शुरू नहीं हो सका')}</h2><p>${say(language,'Your saved draft could not be cleared. Please try again.','सेव draft हट नहीं सका। कृपया फिर कोशिश करें।')}</p>`);return;}closeDialog();startFresh();};
 if(!report&&answers.some(v=>v!==null)){
  showDialog(`<h2>${say(language,'Start a new test?','नया टेस्ट शुरू करें?')}</h2><p>${say(language,'This replaces your unfinished answers. Your completed saved reports stay in My reports.','इससे अधूरे जवाब बदल जाएँगे। पूरी की गई सेव reports मेरी रिपोर्ट में रहेंगी।')}</p><div class="mh-account-actions"><button class="mh-secondary" data-close>${say(language,'Keep my current test','मौजूदा टेस्ट रखें')}</button><button class="mh-primary" id="mh-new-test-confirm">${say(language,'Start a new test','नया टेस्ट शुरू करें')}</button></div>`);
  dialog.querySelector('#mh-new-test-confirm').onclick=fresh;return;
 }
 if(report&&!saved.some(r=>r.id===report.id)){begin();return;}
 fresh();
}

function render(focus=true){
 thoughtWaves?.destroy();thoughtWaves=null;
 personalReport?.destroy();personalReport=null;
 const showPersonalReport=view==='report'&&!reportDemo&&usesPersonalReport(report);
 document.body.classList.toggle('mh-personal-report',showPersonalReport);
 for(const id of ['personal-report-base-style','personal-report-style']){const stylesheet=document.getElementById(id);if(stylesheet)stylesheet.disabled=!showPersonalReport;}
 clearAuthReturn();hideGraphTooltip();updateAuthHeader(auth.state);
 cancelGuide();document.documentElement.lang=view==='quiz'?language:displayLanguage(language);document.documentElement.dir=view==='quiz'?languageDirection(language):'ltr';document.querySelector('.mh-header').lang=displayLanguage(language);document.querySelector('.mh-header').dir='ltr';document.querySelector('.mh-footer').lang=displayLanguage(language);document.querySelector('.mh-footer').dir='ltr';document.querySelector('#mh-language-note').textContent=coverageNotice(language);document.querySelector('#mh-language-note').lang=language;document.querySelector('#mh-language-note').dir=languageDirection(language);document.title=say(language,'Innerly — A mental-health check-in','Innerly — अपने मन का हाल जानें');document.querySelector('#mh-language').value=language;
 document.querySelector('#mh-home').textContent=say(language,'Home','होम');document.querySelector('#mh-history').textContent=say(language,'My reports','मेरी रिपोर्ट');document.querySelector('.mh-footer>span').textContent=say(language,'A moment for your mind.','कुछ पल, अपने मन के लिए।');document.querySelector('#mh-motion').textContent=say(language,paused?'Resume motion':'Pause motion',paused?'Motion चालू करें':'Motion रोकें');
 document.body.classList.toggle('mh-in-checkin',view==='quiz');document.body.classList.toggle('mh-home-page',view==='home');
 document.querySelector('#mh-home').setAttribute('aria-current',view==='home'?'page':'false');document.querySelector('#mh-history').setAttribute('aria-current',view==='history'||view==='report'?'page':'false');
 if(view==='home'){app.innerHTML=mentalHomeMarkup({language});bindHomeInteractions(app,language,localizeStartButtons);thoughtWaves=mountThoughtWaves(app.querySelector('[data-thought-waves]'),{pagePaused:paused,strongerStrokes:true});if(answers.some(v=>v!==null)&&!report)app.insertAdjacentHTML('afterbegin',`<div class="mh-resume-banner"><span><strong>${completedCount(answers)} / ${QUESTION_TOTAL}</strong> · ${say(language,draftSynced?'Saved in this browser. Ready when you are.':'Your answers are still here in this open page.',draftSynced?'इसी browser में सेव है। जब चाहें जारी रखें।':'इस खुले पेज में आपके जवाब अभी भी हैं।')}</span><div><button class="mh-secondary" data-action="resume" lang="${language}" dir="${languageDirection(language)}">${qt('Continue test','Continue my check-in','अपना check-in जारी रखें')} →</button><button class="mh-link" data-action="discard" lang="${language}" dir="${languageDirection(language)}">${qt('removeDraft','Remove draft','Draft हटाएँ')}</button></div></div>`);}
 if(view==='quiz'){app.innerHTML=quizMarkup(answers,language,draftSynced);setActiveQuestion(resumeQuestion(answers)??0);}
 if(view==='report'){
  app.innerHTML=showPersonalReport?personalReportMarkup(report,saved,displayLanguage(language)):reportDemo?sampleReportMarkup({report,history:saved,language,preset:samplePreset,view:reportView,selection:reportSelection}):reportMarkup(report,saved,language,reportView,{...reportSelection,unlocked:previewUnlockedReports.has(report.id),preview:previewSelection});
  if(showPersonalReport){personalReport=mountPersonalReport(app,report,saved,displayLanguage(language));document.title=say(language,'Innerly — Your personal reflection','Innerly — आपकी व्यक्तिगत रिपोर्ट');}
 }
 if(view==='history')app.innerHTML=`<section class="mh-history"><p class="mh-kicker">${say(language,'SAVED ON THIS DEVICE','इस DEVICE पर सेव')}</p><h1>${say(language,'Your check-ins. Your pace.','आपके check-ins। आपकी गति।')}</h1><p>${say(language,'Reports saved in this browser appear here. They do not sync to your account. Anyone using this browser can open them.','इस browser में सेव reports यहाँ दिखती हैं। ये खाते से sync नहीं होतीं। इस browser का इस्तेमाल करने वाला कोई भी इन्हें खोल सकता है।')}</p>${saved.length?`<div class="mh-saved-list">${saved.toSorted((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)).map(r=>`<article><div class="mh-saved-copy"><span>${new Date(r.createdAt).toLocaleDateString(language,{day:'numeric',month:'long',year:'numeric'})}</span><strong>${r.version===INNERLY_V1_VERSION?say(language,'Innerly V1 · 36 questions','Innerly V1 · 36 सवाल'):r.version===REFLECTION60_VERSION?say(language,'60-statement reflection','60 statements की reflection'):`Earlier PHQ-4 ${r.scores.total}/12`}</strong><small><bdi>${languageName(r.language)}</bdi> </small></div><div class="mh-saved-actions"><button class="mh-saved-open" data-open="${esc(r.id)}">${icon('eye')}<span>${say(language,'View report','रिपोर्ट देखें')}</span></button><button class="report-delete-button" data-delete="${esc(r.id)}" aria-label="${say(language,'Delete this saved check-in','यह सेव check-in हटाएँ')}">${icon('trash')}<span>${say(language,'Delete report','रिपोर्ट हटाएँ')}</span></button></div></article>`).join('')}</div>`:`<div class="mh-empty">${say(language,'Your first saved report will appear here.','आपकी पहली सेव report यहाँ दिखेगी।')}</div>`}<button class="mh-primary" data-action="begin">${qt('Start test','Start My Test','अपना टेस्ट शुरू करें')} →</button></section>`;
 if(reportDemo&&view==='report')document.title=say(language,'Innerly — Interactive sample report','Innerly — Interactive उदाहरण report');
 document.querySelector('#mh-history').hidden=false;
 localizeStartButtons();
 if(focus)focusHeading();
}
function loadSampleReport(){
 const data=sampleReportData(language,samplePreset);samplePreset=data.preset;report=data.report;saved=data.history;
 previewUnlockedReports.add(report.id);view='report';
}
let graphTooltipIndex=null;
function hideGraphTooltip(){const tip=document.querySelector('#wb-graphic-tooltip');if(tip)tip.hidden=true;graphTooltipIndex=null;}
function highlightGraphic(index){
 for(const button of app.querySelectorAll('[data-response-question]:not([data-preview-response])'))button.setAttribute('aria-pressed',String(Number(button.dataset.responseQuestion)===index));
 for(const mark of app.querySelectorAll('[data-infographic] [data-graphic-question]'))mark.classList.toggle('is-focused',Number(mark.dataset.graphicQuestion)===index);
}
function selectReportQuestion(index,scroll=false){
 if(!Number.isInteger(index)||index<0||index>=QUESTION_TOTAL||report?.version!==INNERLY_V1_VERSION)return;
 reportSelection={dimension:`dimension-${Math.floor(index/6)+1}`,question:index};highlightGraphic(index);hideGraphTooltip();
 for(const b of app.querySelectorAll('[data-workbook-question],[data-workbook-map]'))b.setAttribute('aria-pressed',String(Number(b.dataset.workbookQuestion??b.dataset.workbookMap)===index));
 if(reportView==='timeline'){
  app.querySelector('#wb-timeline-detail').innerHTML=workbookTimelineDetail(report,saved,index,displayLanguage(language));
  if(reportDemo){const notes=app.querySelectorAll('#wb-timeline-detail>.wb-help');if(notes.length)notes[notes.length-1].textContent=say(language,'These example dates and check-ins are fictional.','ये उदाहरण की तारीखें और check-ins काल्पनिक हैं।');}
 }else app.querySelector('#wb-question-detail').innerHTML=workbookQuestionReading(report.answers,index,displayLanguage(language));
 const status=app.querySelector('#wb-focus-status');
 if(status){const profile=dimensionProfile(report.answers,reportSelection.dimension),position=profile.items.indexOf(index);status.innerHTML=workbookFocusStatus(report.answers,index,displayLanguage(language));app.querySelector('#wb-focus-position').textContent=`${position+1} / 6`;app.querySelector('[data-response-step="-1"]').disabled=position===0;app.querySelector('[data-response-step="1"]').disabled=position===5;}
 if(scroll&&pointerInput)app.querySelector(reportView==='timeline'?'#wb-timeline-detail':'#wb-question-detail').scrollIntoView({behavior:motion(),block:window.matchMedia('(max-width:760px)').matches?'start':'nearest'});
}
function graphTooltip(event){
 if(event.pointerType==='touch'){hideGraphTooltip();return;}
 const mark=event.target.closest?.('[data-graphic-question]'),card=mark?.closest('[data-infographic]'),tip=app.querySelector('#wb-graphic-tooltip');
 if(!mark||!card||!tip||view!=='report'){hideGraphTooltip();return;}
 const index=Number(mark.dataset.graphicQuestion),profile=dimensionProfile(report.answers,(card.dataset.workbookDimension||card.dataset.dimensionId)),row=profile.rows.find(r=>r.index===index);if(!row)return;
 if(graphTooltipIndex!==index){const source=questionBankForTooltip(index);tip.innerHTML=`<strong>${esc(row.id)} · ${esc(source.text)}</strong><span>${esc(row.value===null?say(language,'Not answered','जवाब नहीं दिया'):source.choices[row.value])}</span><small>${say(language,'Select to explore this answer','इस जवाब को समझने के लिए चुनें')}</small>`;graphTooltipIndex=index;}
 tip.hidden=false;tip.style.left=`${Math.max(10,Math.min(event.clientX+16,window.innerWidth-tip.offsetWidth-12))}px`;tip.style.top=`${Math.max(10,Math.min(event.clientY+16,window.innerHeight-tip.offsetHeight-12))}px`;
}
function questionBankForTooltip(index){const l=displayLanguage(language);return {text:workbookQuestions[index].texts[l],choices:workbookChoices(l)};}
function reportStorage(r){return r.version===INNERLY_V1_VERSION?INNERLY_V1_STORAGE:r.version===REFLECTION60_VERSION?REFLECTION60_STORAGE:MENTAL_STORAGE;}
function updateSavedReports(key,rows){const reader=key===INNERLY_V1_STORAGE?readWorkbookReports:key===REFLECTION60_STORAGE?readReflectionReports:readSavedCheckins;saved=[...reader(JSON.stringify(rows)),...saved.filter(r=>reportStorage(r)!==key)];}
function showDialog(markup){lastFocus=document.activeElement;dialog.innerHTML=`<button class="mh-dialog-close" aria-label="${qt('Close dialog','Close','बंद करें')}" data-close>×</button>${markup}`;dialog.showModal();}
function closeDialog(){dialog.close();lastFocus?.focus?.();}
function startFresh(){answerLanguage=language;answers=Array(QUESTION_TOTAL).fill(null);report=null;draftEnabled=false;draftSynced=false;view='quiz';render();}
function resume(){language=answerLanguage;report=null;view='quiz';render();goToQuestion(resumeQuestion(answers),'instant');}
function begin(){
 if(reportDemo){const next=new URL('./',location.href);next.searchParams.set('lang',language);next.searchParams.set('start','1');location.assign(next.href);return;}
 cancelGuide();
 if(answers.some(v=>v!==null)&&!isComplete(answers)){resume();return;}
 if(report&&!saved.some(r=>r.id===report.id)){showDialog(`<h2>${say(language,'Start a new check-in?','नया check-in शुरू करें?')}</h2><p>${say(language,'This report is not saved. You can go back to save or print it first.','यह report सेव नहीं है। पहले वापस जाकर इसे सेव या print कर सकते हैं।')}</p><button class="mh-primary" id="mh-new-confirm">${qt('Start test','Start My Test','अपना टेस्ट शुरू करें')}</button>`);dialog.querySelector('#mh-new-confirm').onclick=()=>{closeDialog();startFresh();};return;}
 if(answers.some(v=>v!==null)&&!report){resume();}else startFresh();
}
function finish(){
 cancelGuide();
 if(!isComplete(answers)){const i=nextUnanswered(answers);if(view!=='quiz'){view='quiz';render();}app.querySelector('#mh-form-message').textContent=qt('A few answers are still missing.','A few answers are still missing. Let us finish those.','कुछ जवाब बाकी हैं। उन्हें पूरा करें।');goToQuestion(i);return;}
 report=makeCheckin(answers,{id:crypto.randomUUID(),createdAt:new Date().toISOString(),language});let removed=true;
 const stored=storeCurrentReport();
 if(stored&&draftEnabled){try{localStorage.removeItem(DRAFT_STORAGE);}catch{removed=false;}}
 draftEnabled=false;draftSynced=false;previewSelection={};reportView='snapshot';reportSelection={dimension:'dimension-1',question:0};view='report';render();
 if(!stored)app.querySelector('#mh-report-status').textContent=say(language,'Your report is ready, but it could not be saved in this browser. Keep this page open and retry Save or use Print / PDF. Existing reports have not been removed.','Report तैयार है, लेकिन इस browser में सेव नहीं हो सकी। पेज खुला रखें और Save फिर आज़माएँ या Print / PDF इस्तेमाल करें। पुरानी reports हटाई नहीं गई हैं।');
 else if(!removed)app.querySelector('#mh-report-status').textContent=say(language,'Your report is saved. The earlier draft also remains in this browser.','आपकी report सेव है। पिछला draft भी इस browser में मौजूद है।');
}
function setActiveQuestion(i){
 const list=app.querySelector('.mh-question-list'),target=list?.querySelector(`#mh-q-${i}`);if(!target)return;
 list.classList.add('has-question-focus');
 for(const question of list.querySelectorAll('.is-current'))if(question!==target)question.classList.remove('is-current');
 target.classList.add('is-current');
}
function activateQuestionFrom(target){const question=target.closest?.('.mh-question');if(question)setActiveQuestion(Number(question.id.slice(5)));}
function goToQuestion(i,scrollBehavior=motion()){const target=app.querySelector(`#mh-q-${i}`);if(target){setActiveQuestion(i);const legend=target.querySelector('legend');legend.tabIndex=-1;legend.focus({preventScroll:true});const offset=(app.querySelector('.mh-progress')?.getBoundingClientRect().height||0)+20;window.scrollTo({top:Math.max(0,window.scrollY+target.getBoundingClientRect().top-offset),behavior:scrollBehavior});}}
function persistDraft(){
 try{localStorage.setItem(DRAFT_STORAGE,JSON.stringify(makeDraft(answers,answerLanguage)));draftEnabled=true;draftSynced=true;return true;}catch{draftSynced=false;return false;}
}
function draftStatus(){const el=app.querySelector('#mh-draft-status');if(el)el.textContent=draftEnabled?qt(draftSynced?'saved':'saveFailed',draftSynced?'Saved in this browser':'Latest changes could not be saved. Keep this page open.',draftSynced?'इसी browser में सेव है':'नए बदलाव सेव नहीं हुए। यह पेज खुला रखें।'):'';}
function takeBreak(){
 cancelGuide();
 if(draftEnabled&&persistDraft()){view='home';render();return;}
 showDialog(`<h2>${qt('Save & take a break','Save & take a break','सेव करें और विराम लें')}</h2><p>${wellbeingLocales[language]?.privacy||say(language,'Your answers will stay in this browser so you can continue later. When you return, new answers will save here too. Anyone using this browser could read your saved answers. Use a private device. You can remove the draft from the homepage. This does not sync to another device.','बाद में जारी रखने के लिए आपके जवाब इसी browser में रहेंगे। वापस आने पर नए जवाब भी यहीं सेव होंगे। इस browser का इस्तेमाल करने वाला कोई भी व्यक्ति सेव जवाब देख सकता है। निजी device इस्तेमाल करें। होमपेज से draft हटा सकते हैं। यह दूसरे device से sync नहीं होता।')}</p><p id="mh-draft-error" role="status"></p><button class="mh-primary" id="mh-break-confirm">${qt('saveHere','Save here & take a break','यहीं सेव करें और विराम लें')}</button>`);
 dialog.querySelector('#mh-break-confirm').onclick=()=>{if(!persistDraft()){dialog.querySelector('#mh-draft-error').textContent=qt('saveFailed','Saving failed. Your answers are still in this open page. Please keep it open and try again.','सेव नहीं हुआ। जवाब अभी इस खुले पेज में हैं। पेज खुला रखें और फिर कोशिश करें।');return;}closeDialog();view='home';render();};
}
function discardDraft(){
 cancelGuide();showDialog(`<h2>${say(language,'Remove this unfinished check-in?','यह अधूरा check-in हटाएँ?')}</h2><p>${say(language,'This clears the draft from this page and this browser. Your completed saved reports stay as they are.','इस पेज और browser से अधूरा draft हटेगा। पूरी की गई सेव reports रहेंगी।')}</p><button class="mh-primary" id="mh-discard-confirm">${qt('removeDraft','Remove draft','Draft हटाएँ')}</button>`);
 dialog.querySelector('#mh-discard-confirm').onclick=()=>{try{localStorage.removeItem(DRAFT_STORAGE);}catch{dialog.querySelector('p').textContent=say(language,'The draft could not be removed. Please try again.','Draft हट नहीं सका। फिर कोशिश करें।');return;}answers=Array(QUESTION_TOTAL).fill(null);report=null;draftEnabled=false;draftSynced=false;closeDialog();view='home';render();};
}
function reviewAnswers(){
 cancelGuide();showDialog(`<h2>${qt('Questions','Your answers, at a glance','आपके जवाब, एक नज़र में')}</h2><p>${['en','hi'].includes(language)?say(language,'Choose any question to review it. A tick means answered.','किसी भी सवाल पर वापस जाएँ। टिक यानी जवाब दिया गया है।'):`✓ ${responseState(language,true)}`}</p><div class="mh-question-map">${answers.map((a,i)=>`<button data-jump="${i}" class="${validResponse(a,i)?'done':''}" aria-label="${qt('Question','Question','सवाल')} ${i+1}, ${responseState(language,validResponse(a,i))}">${i+1}${validResponse(a,i)?'<small aria-hidden="true">✓</small>':''}</button>`).join('')}</div>`);
}
function updateGrowth(){const s=growthState(answers),tree=app.querySelector('#mh-growth');if(!tree)return;app.querySelector('#mh-progress-percent').innerHTML=`${s.percent}<span>%</span>`;app.querySelector('#mh-progress').setAttribute('aria-valuetext',`${s.percent}% · ${s.count} / ${QUESTION_TOTAL}`);tree.style.setProperty('--tree-stem',String(s.stem));tree.dataset.stage=s.stage;tree.querySelector('#mh-growth-art').setAttribute('aria-label',`${qt('completed','Completed questions','पूरे हुए सवाल')}: ${s.count} / ${QUESTION_TOTAL}`);tree.querySelectorAll('[data-leaf]').forEach(el=>el.classList.toggle('revealed',Number(el.dataset.leaf)<s.leaves));tree.querySelectorAll('.mh-growth-stages i').forEach((el,i)=>el.classList.toggle('done',i===0?s.count>0:s.progress>=[0,.25,.5,1][i]));tree.querySelector('#mh-growth-caption').textContent=growthCaption(language,s.count,QUESTION_TOTAL);}
function recordAnswer(i,value){
 if(!validResponse(value,i))return;
 const wasAnswered=validResponse(answers[i],i);answers[i]=value;
 app.querySelector(`#mh-q-${i}`)?.classList.add('answered');
 const count=answers.filter((v,j)=>validResponse(v,j)).length;app.querySelector('#mh-progress').value=count;app.querySelector('#mh-progress-label').textContent=`${count} / ${QUESTION_TOTAL}`;app.querySelector('#mh-form-message').textContent='';app.querySelector('[data-action="break"]').disabled=false;updateGrowth();cancelGuide();if(draftEnabled)persistDraft();draftStatus();
 if(wasAnswered||!pointerInput)return;
 guideTimer=setTimeout(()=>{if(view!=='quiz')return;const next=nextContinuousQuestion(answers,i);if(next!==null)goToQuestion(next);else finish();},paused||reduce.matches?120:420);
}
function unlockReportPreview(){
 if(report?.version!==INNERLY_V1_VERSION)return;
 previewUnlockedReports.add(report.id);view='report';render();
}
function showReportOffer(){
 showDialog(`<h2>${say(language,'Your full report · $1','आपकी पूरी report · $1')}</h2><p>${say(language,'One-time payment for this report. No recurring subscription.','इस report के लिए एक बार भुगतान। कोई recurring subscription नहीं।')}</p><p>${say(language,'Payments are coming soon. You can explore and download your full report for free during this preview.','भुगतान जल्द शुरू होंगे। इस preview में आप पूरी report मुफ़्त देख और डाउनलोड कर सकते हैं।')}</p><div class="mh-account-actions"><button class="mh-primary" id="wb-free-preview">${say(language,'Open my free preview','मेरा मुफ़्त preview खोलें')}</button></div>`);
 dialog.querySelector('#wb-free-preview').onclick=()=>{closeDialog();unlockReportPreview();};
}
function saveReport(){
 if(reportDemo)return;
 if(saved.some(r=>r.id===report.id))return;
 showDialog(`<h2>${say(language,'Save on this device?','इस device पर सेव करें?')}</h2><p>${say(language,'This stores your answers and report in this browser. Other people using this browser may be able to read them. You can delete saved check-ins from My check-ins.','इससे आपके जवाब और report इसी browser में रहेंगे। इसी browser का इस्तेमाल करने वाले दूसरे लोग इन्हें देख सकते हैं। “मेरे check-ins” से इन्हें हटा सकते हैं।')}</p><button class="mh-primary" id="mh-save-confirm">${say(language,'Save my report here','मेरी report यहाँ सेव करें')}</button>`);
 dialog.querySelector('#mh-save-confirm').onclick=()=>{if(storeCurrentReport()){closeDialog();render(false);app.querySelector('#mh-report-status').textContent=say(language,'Saved on this device.','इस device पर सेव हो गई।');}else{closeDialog();app.querySelector('#mh-report-status').textContent=say(language,'This browser could not save your report. You can print or save a PDF instead.','इस browser में report सेव नहीं हुई। Print या PDF में सेव कर सकते हैं।');}};
}
function storeCurrentReport(){
 if(reportDemo)return false;
 try{const key=reportStorage(report);updateSavedReports(key,saveLocalReport(localStorage,key,report));return true;}catch{return false;}
}
function clearAuthReturn(){if(reportDemo)return;try{sessionStorage.removeItem(AUTH_RETURN_STORAGE);}catch{}}
function updateAuthHeader(state){
 const button=document.querySelector('#mh-auth');if(!button)return;
 if(reportDemo){button.hidden=false;button.disabled=false;button.textContent=say(language,'Account','खाता');return;}
 button.hidden=state.status==='disabled';button.disabled=state.status==='loading';
 button.textContent=say(language,state.status==='loading'?'Loading…':state.status==='signed-in'?'My account':'Sign in',state.status==='loading'?'लोड हो रहा है…':state.status==='signed-in'?'मेरा खाता':'साइन इन');
 button.setAttribute('aria-busy',String(state.status==='loading'));
}
function authError(){
 showDialog(`<h2>${say(language,'Sign-in is unavailable right now','अभी साइन इन नहीं हो पा रहा')}</h2><p>${say(language,'Your check-in is still here. You can continue without an account, or try sign-in again.','आपका check-in यहीं है। बिना खाते के जारी रखें या फिर साइन इन करके देखें।')}</p><div class="mh-account-actions"><button class="mh-secondary" data-close>${say(language,'Continue here','यहीं जारी रखें')}</button><button class="mh-primary" id="mh-auth-retry">${say(language,'Try again','फिर कोशिश करें')}</button></div>`);
 dialog.querySelector('#mh-auth-retry').onclick=()=>{closeDialog();requestAccount();};
}
async function openAccount(){
 try{
  await auth.ready();
  if(auth.state.status!=='signed-in'){await auth.signIn(language);return;}
  const user=auth.state.user;
  showDialog(`<h2>${say(language,'Your Innerly account','आपका Innerly खाता')}</h2><p class="mh-account-email">${esc(user?.primaryEmailAddress?.emailAddress||user?.fullName||'')}</p><p class="mh-footnote">${say(language,'Signing out does not remove saved reports. Anyone using this browser can open them. Remove them from My reports on a shared device.','साइन आउट करने से सेव reports नहीं हटतीं। इस browser का इस्तेमाल करने वाला कोई भी इन्हें खोल सकता है। साझा device पर “मेरी रिपोर्ट” से इन्हें हटाएँ।')}</p><div class="mh-account-actions"><button class="mh-secondary" id="mh-account-manage">${say(language,'Manage account','खाता मैनेज करें')}</button><button class="mh-secondary" id="mh-account-out">${say(language,'Sign out','साइन आउट')}</button></div>`);
  dialog.querySelector('#mh-account-manage').onclick=async()=>{closeDialog();try{await auth.profile();}catch{authError();}};
  dialog.querySelector('#mh-account-out').onclick=async()=>{closeDialog();try{await auth.signOut(language);}catch{authError();}};
 }catch{authError();}
}
function requestAccount(){
 if(reportDemo){location.assign('./?account=1');return;}
 cancelGuide();
 const unsavedReport=report&&!saved.some(r=>r.id===report.id);
 const unsavedAnswers=!report&&answers.some(v=>v!==null)&&!draftSynced;
 const proceed=()=>{
  try{rememberAuthReturn(sessionStorage,{view,reportId:report?.id||null,language});}
  catch{ /* Existing browser saves still remain available if session storage is blocked. */ }
  openAccount();
 };
 if(!unsavedReport&&!unsavedAnswers){proceed();return;}
 showDialog(`<h2>${say(language,'Keep your check-in before signing in','साइन इन से पहले अपना check-in रखें')}</h2><p>${say(language,'Sign-in or account settings can reload this page. Save your current answers here first so you can return to them. This saves only in this browser, where other people using this device could read them. It does not upload them to your account.','साइन इन या खाते की settings से पेज दोबारा खुल सकता है। पहले जवाब यहीं सेव करें ताकि वापस जारी रख सकें। यह केवल इसी browser में सेव होगा, जहाँ इस device का इस्तेमाल करने वाले दूसरे लोग इसे देख सकते हैं। जवाब खाते पर upload नहीं होंगे।')}</p><p id="mh-auth-save-error" role="status"></p><div class="mh-account-actions"><button class="mh-secondary" data-close>${say(language,'Stay in my check-in','check-in में रहें')}</button><button class="mh-primary" id="mh-auth-save">${say(language,'Save here & continue','यहीं सेव करें और आगे बढ़ें')}</button></div>`);
 dialog.querySelector('#mh-auth-save').onclick=()=>{
  if(!(unsavedReport?storeCurrentReport():persistDraft())){dialog.querySelector('#mh-auth-save-error').textContent=say(language,'Saving failed. Keep this page open; your answers are still here.','सेव नहीं हुआ। पेज खुला रखें; जवाब यहीं हैं।');return;}
  draftStatus();closeDialog();proceed();
 };
}
app.addEventListener('focusin',e=>activateQuestionFrom(e.target));
app.addEventListener('pointerdown',e=>{activateQuestionFrom(e.target);cancelGuide();pointerInput=true;if(view==='quiz')window.scrollTo({top:window.scrollY,behavior:'instant'});});app.addEventListener('keydown',()=>{pointerInput=false;cancelGuide();});
app.addEventListener('change',e=>{
 if(e.target.matches('[data-answer]'))recordAnswer(Number(e.target.dataset.answer),Number(e.target.value));
 if(e.target.matches('[data-workbook-area]')&&report?.version===INNERLY_V1_VERSION){
  const profile=dimensionProfile(report.answers,e.target.value);reportSelection={dimension:profile.id,question:profile.items[0]};
  const y=window.scrollY;render(false);app.querySelector('[data-workbook-area]')?.focus({preventScroll:true});window.scrollTo({top:y,behavior:'instant'});
 }
});
app.addEventListener('pointermove',graphTooltip);app.addEventListener('pointerleave',hideGraphTooltip);window.addEventListener('scroll',hideGraphTooltip,{passive:true});
app.addEventListener('keydown',e=>{
 const mark=e.target.closest('[data-detail-graphic] [data-graphic-question]');if(!mark)return;
 if(['Enter',' '].includes(e.key)){e.preventDefault();selectReportQuestion(Number(mark.dataset.graphicQuestion));}
 if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const profile=dimensionProfile(report.answers,reportSelection.dimension),at=profile.items.indexOf(Number(mark.dataset.graphicQuestion)),next=profile.items[Math.max(0,Math.min(5,at+(e.key==='ArrowRight'?1:-1)))];selectReportQuestion(next);app.querySelector(`[data-detail-graphic] [data-graphic-question="${next}"]`)?.focus({preventScroll:true});}
});
app.addEventListener('click',e=>{
 hideGraphTooltip();
 const detailMark=e.target.closest('[data-detail-graphic] [data-graphic-question]');if(detailMark){selectReportQuestion(Number(detailMark.dataset.graphicQuestion));return;}
 const button=e.target.closest('button');if(!button)return;
 if(button.dataset.responseQuestion!==undefined){
  const index=Number(button.dataset.responseQuestion);
  if(button.hasAttribute('data-preview-response')){
   const card=button.closest('[data-preview-card]');if(!card)return;
   previewSelection[button.dataset.responseDimension]=index;
   card.querySelectorAll('[data-response-question]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   card.querySelector('.rp-detail').innerHTML=previewResponseDetail(report.answers,index,displayLanguage(language));
  }else selectReportQuestion(index);
  return;
 }
 if(button.dataset.exploreArea){
  const profile=dimensionProfile(report.answers,button.dataset.exploreArea);reportSelection={dimension:profile.id,question:profile.items[0]};
  for(const card of app.querySelectorAll('[data-workbook-dimension]'))card.setAttribute('aria-pressed',String(card.dataset.workbookDimension===profile.id));
  app.querySelector('#mh-topic-reading').innerHTML=workbookDimensionReading(report.answers,profile.id,language,reportSelection.question);highlightGraphic(reportSelection.question);
  app.querySelector(`[data-explore-area="${profile.id}"]`)?.focus({preventScroll:true});return;
 }
 if(button.dataset.responseStep){const profile=dimensionProfile(report.answers,reportSelection.dimension),position=profile.items.indexOf(reportSelection.question),index=profile.items[position+Number(button.dataset.responseStep)];if(index!==undefined)selectReportQuestion(index);return;}
 if(button.dataset.samplePreset&&reportDemo){samplePreset=button.dataset.samplePreset;loadSampleReport();const y=window.scrollY;render(false);app.querySelector(`[data-sample-preset="${samplePreset}"]`)?.focus({preventScroll:true});window.scrollTo({top:y,behavior:'instant'});return;}
 if(button.dataset.feelingBar!==undefined){for(const b of app.querySelectorAll('[data-feeling-bar]'))b.setAttribute('aria-pressed',String(b===button));app.querySelector('#mh-feeling-reading').textContent=feelingReading(button.dataset.feelingKey,Number(button.dataset.feelingBar),language);return;}
 if(button.dataset.theme){for(const b of app.querySelectorAll('[data-theme]'))b.setAttribute('aria-pressed',String(b===button));app.querySelector('#mh-theme-content').innerHTML=themeMarkup(button.dataset.theme,displayLanguage(language));localizeStartButtons();return;}
 if(button.dataset.demoView){for(const b of app.querySelectorAll('[data-demo-view]'))b.setAttribute('aria-pressed',String(b===button));app.querySelector('#mh-demo-content').innerHTML=sampleReport(button.dataset.demoView,displayLanguage(language));return;}
 if(button.dataset.workbookDimension){
  const profile=dimensionProfile(report.answers,button.dataset.workbookDimension),mark=e.target.closest('[data-graphic-question]'),index=Number(mark?.dataset.graphicQuestion);reportSelection={dimension:profile.id,question:mark&&profile.items.includes(index)?index:profile.items[0]};
  for(const b of app.querySelectorAll('[data-workbook-dimension]'))b.setAttribute('aria-pressed',String(b===button));
  app.querySelector('#mh-topic-reading').innerHTML=workbookDimensionReading(report.answers,profile.id,language,reportSelection.question);highlightGraphic(reportSelection.question);
  if(pointerInput&&(button.hasAttribute('data-infographic')||window.matchMedia('(max-width:760px)').matches))app.querySelector('#mh-topic-reading').scrollIntoView({behavior:motion(),block:'start'});return;
 }
 if(button.dataset.workbookQuestion!==undefined||button.dataset.workbookMap!==undefined){
  selectReportQuestion(Number(button.dataset.workbookQuestion??button.dataset.workbookMap),true);return;
 }
 if(button.dataset.workbookOpen){
  const profile=dimensionProfile(report.answers,button.dataset.workbookOpen);reportSelection={dimension:profile.id,question:profile.items[0]};reportView='snapshot';render(false);
  const target=app.querySelector(`[data-workbook-dimension="${profile.id}"]`);target?.focus({preventScroll:true});target?.scrollIntoView({behavior:motion(),block:'center'});return;
 }
 if(button.dataset.reflectionTopic){for(const b of app.querySelectorAll('[data-reflection-topic]'))b.setAttribute('aria-pressed',String(b===button));app.querySelector('#mh-topic-reading').innerHTML=topicReading(report.answers,button.dataset.reflectionTopic,language);return;}
 if(button.dataset.reportView){reportView=button.dataset.reportView;const y=window.scrollY;render(false);app.querySelector(`[data-report-view="${reportView}"]`).focus({preventScroll:true});window.scrollTo({top:y,behavior:'instant'});return;}
 if(button.dataset.screenDetail){for(const b of app.querySelectorAll('[data-screen-detail]'))b.setAttribute('aria-pressed',String(b===button));app.querySelector('#mh-score-reading').innerHTML=screeningDetail(report,button.dataset.screenDetail,displayLanguage(language));return;}
 if(button.dataset.historyPoint){const r=button.dataset.historyPoint===report.id?report:saved.find(r=>r.id===button.dataset.historyPoint);if(r){showDialog(`<h2>${say(language,'A check-in snapshot','Check-in की झलक')}</h2><p>${new Date(r.createdAt).toLocaleDateString(language)} · PHQ-4 ${r.scores.total}/12</p>${screenBars(r.scores,displayLanguage(language))}<p>${say(language,'This describes that two-week period, not a prediction.','यह उस दो-सप्ताह की अवधि के बारे में है, आगे का अनुमान नहीं।')}</p>`);}return;}
 if(button.dataset.open){report=saved.find(r=>r.id===button.dataset.open);if(report){language=report.language;view='report';reportView='snapshot';reportSelection={dimension:'dimension-1',question:0};render();}return;}
 if(button.dataset.delete){const id=button.dataset.delete;showDialog(`<h2>${say(language,'Delete this saved check-in?','यह सेव check-in हटाएँ?')}</h2><p>${say(language,'This removes its answers and report from this browser. Downloaded copies are not affected.','इसके जवाब और report इस browser से हटेंगे। Download की गई copies नहीं हटेंगी।')}</p><button class="mh-primary" id="mh-delete-confirm">${say(language,'Delete this check-in','यह check-in हटाएँ')}</button>`);dialog.querySelector('#mh-delete-confirm').onclick=()=>{try{const key=reportStorage(saved.find(r=>r.id===id));updateSavedReports(key,removeLocalReport(localStorage,key,id));if(report?.id===id){report=null;answers=Array(QUESTION_TOTAL).fill(null);draftEnabled=false;draftSynced=false;}view='history';closeDialog();render();}catch{dialog.querySelector('p').textContent=say(language,'Deletion failed. Please try again.','हटाया नहीं जा सका। फिर कोशिश करें।');}};return;}
 switch(button.dataset.action){case'dimension-overview':{const target=app.querySelector(`[data-infographic][data-workbook-dimension="${reportSelection.dimension}"]`);target?.focus({preventScroll:true});target?.scrollIntoView({behavior:motion(),block:'center'});break;}case'report-offer':showReportOffer();break;case'unlock-preview':unlockReportPreview();break;case'begin':begin();break;case'new-test':newTest();break;case'history':goHistory();break;case'home':view='home';render();break;case'resume':resume();break;case'break':takeBreak();break;case'discard':discardDraft();break;case'review':reviewAnswers();break;case'unanswered':cancelGuide();goToQuestion(resumeQuestion(answers),'instant');break;case'finish':finish();break;case'preview':{const p=app.querySelector('#mh-report-preview');p.tabIndex=-1;p.focus({preventScroll:true});p.scrollIntoView({behavior:motion(),block:'start'});break;}case'save':saveReport();break;case'print':window.print();break;}
});
dialog.addEventListener('click',e=>{const jump=e.target.closest('[data-jump]');if(jump){closeDialog();goToQuestion(Number(jump.dataset.jump),'instant');return;}if(e.target.closest('[data-close]'))closeDialog();});dialog.addEventListener('cancel',()=>lastFocus?.focus?.());
function goHome(){if(reportDemo){const next=new URL('./',location.href);next.searchParams.set('lang',language);location.assign(next.href);return;}view='home';render();}
document.querySelector('#mh-home').onclick=goHome;document.querySelector('.mh-brand').onclick=e=>{e.preventDefault();goHome();};document.querySelector('#mh-history').onclick=goHistory;
document.querySelector('#mh-auth').onclick=requestAccount;
document.querySelector('#mh-language').onchange=e=>{if(!report&&answers.some(v=>v!==null)){e.target.value=language;showDialog(`<h2>${qt('keepLanguage','Keep one language for this check-in','इस check-in में एक ही भाषा रखें')}</h2>${['en','hi'].includes(language)?`<p>${say(language,'Finish this check-in in the language you started with. You can change languages for a new one.','यह check-in उसी भाषा में पूरा करें जिसमें शुरू किया था। नए check-in के लिए भाषा बदल सकते हैं।')}</p>`:''}`);return;}language=e.target.value;if(reportDemo)loadSampleReport();if(view==='quiz')answerLanguage=language;if(!reportDemo)try{localStorage.setItem(LANGUAGE_STORAGE,language);}catch{}const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);render();};
document.querySelector('#mh-large').onclick=e=>{const large=document.body.classList.toggle('mh-large');e.currentTarget.setAttribute('aria-pressed',String(large));};
document.querySelector('#mh-motion').onclick=e=>{paused=!paused;thoughtWaves?.setPagePaused(paused);document.body.classList.toggle('mh-paused',paused);e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.textContent=say(language,paused?'Resume motion':'Pause motion',paused?'Motion चालू करें':'Motion रोकें');};
let printDetails=[];
window.addEventListener('beforeprint',()=>{if(view!=='report'||!report)return;printDetails=[...app.querySelectorAll('details')].map(d=>[d,d.open]);printDetails.forEach(([d])=>d.open=true);if([INNERLY_V1_VERSION,REFLECTION60_VERSION].includes(report.version))return;app.querySelector('.mh-report').insertAdjacentHTML('beforeend',`<section class="mh-print-graphs"><h2>${say(language,'Your screening snapshot','आपकी screening झलक')}</h2>${screenBars(report.scores,displayLanguage(language))}<h2>${say(language,'Your answers','आपके जवाब')}</h2>${responseBars(report.answers,displayLanguage(language))}<h2>${say(language,'Your saved timeline','आपकी सेव यात्रा')}</h2>${historyChart([...saved.filter(r=>r.id!==report.id),report],displayLanguage(language),false,report.language)}</section>`);});
window.addEventListener('afterprint',()=>{app.querySelector('.mh-print-graphs')?.remove();printDetails.forEach(([d,open])=>d.open=open);printDetails=[];});
window.addEventListener('beforeunload',e=>{if(!report&&!draftSynced&&answers.some(v=>v!==null)){e.preventDefault();e.returnValue='';}});
// Consume the navigation marker once. Health data is restored only from the
// same existing browser saves, never from Clerk or an account identity.
let authReturn=null;if(!reportDemo)try{authReturn=takeAuthReturn(sessionStorage);}catch{}
if(authReturn){
 language=resolveQuestionLanguage({url:authReturn.language});
 if(authReturn.view==='quiz'&&answers.some(v=>v!==null)){view='quiz';language=answerLanguage;}
 else if(authReturn.view==='report'){const found=saved.find(r=>r.id===authReturn.reportId);if(found){report=found;language=found.language;view='report';}}
 else if(authReturn.view==='history')view='history';
 const returnUrl=new URL(location.href);returnUrl.searchParams.set('lang',language);history.replaceState(null,'',returnUrl);
}
if(reportDemo)loadSampleReport();
render(false);
if(!reportDemo&&!authReturn&&new URL(location.href).searchParams.get('start')==='1'){const next=new URL(location.href);next.searchParams.delete('start');history.replaceState(null,'',next);begin();}
if(view==='quiz')goToQuestion(resumeQuestion(answers),'instant');
auth.ready().catch(()=>{}); // A provider outage must never block the guest check-in.

// Standalone pages use these public routes into the same report/account controls.
if(!reportDemo&&!authReturn){
 const route=new URL(location.href);
 if(route.searchParams.get('view')==='history'){route.searchParams.delete('view');history.replaceState(null,'',route);goHistory();}
 if(route.searchParams.get('new')==='1'){route.searchParams.delete('new');history.replaceState(null,'',route);newTest();}
 if(route.searchParams.get('account')==='1'){route.searchParams.delete('account');history.replaceState(null,'',route);requestAccount();}
}
