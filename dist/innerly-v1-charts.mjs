import {dimensionGraphic,dimensionTitles} from './dimension-infographics.mjs?v=explorer-2';
import {workbookDimensions,workbookQuestions,workbookChoices,questionnaireLocale} from './innerly-v1-model.mjs?v=mh-14';
import {dimensionProfile,workbookTimeline,itemReflections} from './innerly-v1-insights.mjs?v=dimensions-1';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=(l,en,hi)=>l==='hi'?hi:en;
const label=(index,l)=>itemReflections[index][l==='hi'?1:0];
const question=(index,l)=>workbookQuestions[index].texts[l]||workbookQuestions[index].texts.en;
const answer=(value,l)=>value===null?say(l,'Not answered','जवाब नहीं दिया'):workbookChoices(l)[value];

export function workbookQuestionReading(answers,index,l='en') {
 const row=dimensionProfile(answers,`dimension-${Math.floor(index/6)+1}`).rows.find(r=>r.index===index);
 if(!row)return '';
 return `<div class="wb-question-reading"><span class="wb-eyebrow">${esc(row.id)} · ${say(l,'YOUR RESPONSE','आपका जवाब')}</span><h4>${esc(question(index,l))}</h4><span class="wb-answer-pill">${esc(answer(row.value,l))}</span>${row.value===null?`<p>${say(l,'This earlier report has no answer for this statement. It is not counted as Never.','इस पुरानी report में इस सवाल का जवाब नहीं है। इसे “कभी नहीं” नहीं गिना जाता।')}</p>`:`<p class="wb-reflection-label">${say(l,'A moment to reflect','थोड़ा सोचने के लिए')}</p><p>${esc(itemReflections[index][l==='hi'?3:2])}</p>`}</div>`;
}

export function workbookFocusStatus(answers,index,l='en'){
 const profile=dimensionProfile(answers,`dimension-${Math.floor(index/6)+1}`),row=profile.rows.find(r=>r.index===index);
 return row?`<span><small>${row.id}</small> ${esc(label(index,l))}</span><strong>${esc(answer(row.value,l))}</strong>`:'';
}
export function workbookDimensionExplorer(answers,id,l='en',selectedQuestion) {
 const profile=dimensionProfile(answers,id),names=questionnaireLocale(l).dimensions;
 const selected=profile.items.includes(selectedQuestion)?selectedQuestion:profile.items[0],position=profile.items.indexOf(selected);
 const nav=[['Self-awareness','खुद की समझ'],['Thoughts','सोच'],['Emotions','भावनाएँ'],['Decisions','निर्णय'],['Relationships','रिश्ते'],['Resilience','मुश्किलों से उबरना']];
 return `<nav class="wb-area-nav" aria-label="${say(l,'Explore the six areas','छह पहलुओं को देखें')}">${workbookDimensions.map(d=>`<button data-explore-area="${d.id}" aria-pressed="${d.id===profile.id}"><small>${String(d.index+1).padStart(2,'0')}</small>${nav[d.index][l==='hi'?1:0]}</button>`).join('')}</nav><div class="wb-dimension-heading"><div><span class="wb-eyebrow">${say(l,'YOUR ANSWERS, UP CLOSE','आपके जवाब, करीब से')}</span><h3>${esc(names[profile.index])}</h3></div><span class="wb-coverage">${profile.answered} / ${profile.total} ${say(l,'answered','जवाब')}</span></div>
 <p class="wb-help">${say(l,'Select a point or a question below. The visual and explanation follow your selection.','कोई बिंदु या नीचे का सवाल चुनें। Visual और विवरण आपके चुनाव के साथ बदलेंगे।')}</p><div class="wb-explorer-stage"><div class="wb-expanded-chart-area"><div class="wb-chart-heading"><strong>${esc(dimensionTitles[profile.index][l==='hi'?1:0])}</strong><span>${say(l,'6 question responses','6 सवालों के जवाब')}</span></div><div class="wb-expanded-graphic" data-infographic data-detail-graphic data-dimension-id="${profile.id}">${dimensionGraphic(answers,profile.id,l,false,selected,true)}</div><div class="wb-frequency-key">${workbookChoices(l).map((text,i)=>`<span><i>${['○','◔','◑','◕','●'][i]}</i>${esc(text)}</span>`).join('')}</div><div class="wb-focus-status" id="wb-focus-status" aria-live="polite">${workbookFocusStatus(answers,selected,l)}</div><div class="wb-answer-navigation"><button data-response-step="-1" ${position===0?'disabled':''} aria-label="${say(l,'Previous response','पिछला जवाब')}">←</button><span id="wb-focus-position">${position+1} / 6</span><button data-response-step="1" ${position===5?'disabled':''} aria-label="${say(l,'Next response','अगला जवाब')}">→</button></div></div><div id="wb-question-detail" aria-live="polite">${workbookQuestionReading(answers,selected,l)}</div><div class="wb-linked-questions" role="group" aria-label="${say(l,'Select a question','सवाल चुनें')}">${profile.rows.map(row=>`<button class="wb-question-choice" data-workbook-question="${row.index}" aria-pressed="${row.index===selected}" aria-controls="wb-question-detail"><span><small>${row.id}</small><strong>${esc(label(row.index,l))}</strong></span><b>${esc(answer(row.value,l))}</b></button>`).join('')}</div></div>`;
}

export function workbookDimensionPicker(selected,l='en') {
 return `<label class="wb-dimension-select">${say(l,'Choose an area','एक पहलू चुनें')}<select id="wb-dimension-select" data-workbook-area>${workbookDimensions.map(d=>`<option value="${d.id}" ${d.id===selected?'selected':''}>${esc(questionnaireLocale(l).dimensions[d.index])}</option>`).join('')}</select></label>`;
}

export function workbookAnswerMap(answers,l='en',selected=0) {
 const fills=['#f1eee8','#e8e3d8','#dce5ec','#a7c4db','#537fa9'];
 return `<p class="wb-help">${say(l,'All 36 responses, grouped by your six areas. Select any answer to read its question.','छह पहलुओं में आपके सभी 36 जवाब। सवाल पढ़ने के लिए कोई जवाब चुनें।')}</p><div class="wb-answer-map">${workbookDimensions.map(d=>`<div class="wb-map-area"><h3>${esc(questionnaireLocale(l).dimensions[d.index])}</h3><div>${dimensionProfile(answers,d.id).rows.map(row=>`<button data-workbook-map="${row.index}" aria-pressed="${row.index===selected}" aria-controls="wb-question-detail" style="--answer-fill:${row.value===null?'#fff':fills[row.value]}" aria-label="${esc(`${row.id}: ${answer(row.value,l)}. ${question(row.index,l)}`)}"><span>${row.id}</span><i aria-hidden="true"></i><small>${esc(answer(row.value,l))}</small></button>`).join('')}</div></div>`).join('')}</div>`;
}

export function workbookTimelineDetail(report,saved,index,l='en') {
 const points=workbookTimeline(report,saved,index),labels=workbookChoices(l),valid=points.filter(p=>p.value!==null);
 const date=p=>new Date(p.createdAt).toLocaleDateString(l,{day:'numeric',month:'short',year:'numeric'});
 const fullDate=p=>new Date(p.createdAt).toLocaleString(l,{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
 const first=points[0],last=points.at(-1),span=first&&last?Date.parse(last.createdAt)-Date.parse(first.createdAt):0;
 const x=p=>span?170+(Date.parse(p.createdAt)-Date.parse(first.createdAt))/span*490:415;
 const y=p=>244-p.value*48;
 const lines=points.slice(1).flatMap((p,i)=>p.value===null||points[i].value===null?[]:[`<line x1="${x(points[i])}" y1="${y(points[i])}" x2="${x(p)}" y2="${y(p)}" stroke="#436eb5" stroke-width="3"/>`]).join('');
 const summary=valid.length===0?say(l,'No answer was recorded for this question in these check-ins.','इन check-ins में इस सवाल का जवाब दर्ज नहीं है।'):valid.length>=2?say(l,'Your selected response across saved check-ins.','सेव check-ins में आपके चुने हुए जवाब।'):say(l,'Your first point is here. A line appears after another answered check-in is saved.','आपका पहला बिंदु यहाँ है। इसी सवाल का जवाब एक और check-in में सेव होने पर रेखा दिखेगी।');
 return `<div class="wb-timeline-heading"><span class="wb-eyebrow">${esc(workbookQuestions[index].id)} · ${say(l,'ONE QUESTION OVER TIME','समय के साथ एक सवाल')}</span><h3>${esc(question(index,l))}</h3><p>${summary}</p></div><div class="wb-timeline-scroll"><svg class="wb-timeline" viewBox="0 0 720 310" role="img" aria-label="${esc(say(l,'Responses over time. Exact dates and answers are in the table below.','समय के साथ जवाब। नीचे तालिका में सभी तारीखें और जवाब हैं।'))}">${labels.map((text,i)=>`<text x="155" y="${249-i*48}" text-anchor="end">${esc(text)}</text><line x1="170" x2="660" y1="${244-i*48}" y2="${244-i*48}" stroke="#e2e8ef"/>`).join('')}${lines}${points.filter(p=>p.value!==null).map(p=>`<circle cx="${x(p)}" cy="${y(p)}" r="7" fill="${p.current?'#765caa':'#436eb5'}" stroke="white" stroke-width="2"><title>${esc(`${fullDate(p)}: ${answer(p.value,l)}`)}</title></circle>`).join('')}${first?`<text x="170" y="284">${esc(date(first))}</text>${points.length>1?`<text x="660" y="284" text-anchor="end">${esc(date(last))}</text>`:''}`:''}</svg></div><p class="wb-help">${say(l,'Up means you chose a more frequent response to this statement, not better or worse health. Only this questionnaire and the same question language are compared.','ऊपर जाने का मतलब इस बात की ज़्यादा frequency चुनना है, बेहतर या खराब स्वास्थ्य नहीं। तुलना इसी questionnaire और सवालों की उसी भाषा में होती है।')}</p><details class="mh-response-details"><summary>${say(l,'See dates & exact answers','तारीखें और सही जवाब देखें')} (${points.length})</summary><table class="wb-history-table"><thead><tr><th scope="col">${say(l,'Check-in','Check-in')}</th><th scope="col">${say(l,'Your response','आपका जवाब')}</th></tr></thead><tbody>${points.map(p=>`<tr><td>${esc(fullDate(p))}${p.current?` <small>(${say(l,'this report','यह report')})</small>`:''}</td><td>${esc(answer(p.value,l))}</td></tr>`).join('')}</tbody></table></details><p class="wb-help">${say(l,'Up to 8 check-ins, ending at this report. Missing answers stay as gaps. Only reports saved in this browser are available.','इस report तक के अधिकतम 8 check-ins। छोड़े गए जवाबों की जगह खाली रहती है। केवल इसी browser में सेव reports उपलब्ध हैं।')}</p>`;
}

export function workbookTimelineView(report,saved,id,l='en',selectedQuestion) {
 const profile=dimensionProfile(report.answers,id),selected=profile.items.includes(selectedQuestion)?selectedQuestion:profile.items[0];
 return `${workbookDimensionPicker(profile.id,l)}<div class="wb-question-tabs" role="group" aria-label="${say(l,'Choose a question to compare','तुलना के लिए सवाल चुनें')}">${profile.rows.map(row=>`<button data-workbook-question="${row.index}" aria-pressed="${row.index===selected}" aria-controls="wb-timeline-detail"><small>${row.id}</small>${esc(label(row.index,l))}</button>`).join('')}</div><div id="wb-timeline-detail" aria-live="polite">${workbookTimelineDetail(report,saved,selected,l)}</div>`;
}

export function workbookPrintDimensions(answers,l='en') {
 const names=questionnaireLocale(l).dimensions,labels=workbookChoices(l);
 return `<div class="wb-print-dimensions">${workbookDimensions.map(d=>`<section class="wb-print-area"><h2>${esc(names[d.index])}</h2>${dimensionProfile(answers,d.id).rows.map(row=>`<div class="wb-print-question"><p><b>${row.id}</b> ${esc(question(row.index,l))}</p><div class="wb-print-scale">${labels.map((text,i)=>`<span class="${row.value===i?'chosen':''}">${row.value===i?'● ':''}${esc(text)}</span>`).join('')}</div>${row.value===null?`<strong>${say(l,'Not answered','जवाब नहीं दिया')}</strong>`:''}</div>`).join('')}</section>`).join('')}</div>`;
}
