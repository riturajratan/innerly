import {consolidatedAnalyticsMarkup} from './consolidated-analytics.mjs?v=1';
import {answerInterpretation} from './answer-interpretations.mjs?v=1';
import {simulatedComparison} from './report-benchmark.mjs?v=1';

// Editorial selections, not a severity scale: use reported groups, prefer area
// variety, then retain questionnaire order for otherwise equivalent responses.
function acrossAreas(items,limit){
 const chosen=[],seen=new Set();
 for(const item of items){const area=Math.floor(item.index/6);if(!seen.has(area)){chosen.push(item);seen.add(area);}if(chosen.length===limit)return chosen;}
 for(const item of items){if(!chosen.includes(item))chosen.push(item);if(chosen.length===limit)break;}
 return chosen;
}
export function consolidatedDetails(snapshot){
 const strengths=snapshot.items.filter(i=>i.category==='support');
 const growth=snapshot.items.filter(i=>i.category==='focus');
 const sometimes=snapshot.items.filter(i=>i.category==='varies');
 const byClarity=items=>[...items].sort((a,b)=>Math.abs(b.value-2)-Math.abs(a.value-2)||a.index-b.index);
 const priorities=acrossAreas(byClarity(growth.length?growth:sometimes.length?sometimes:strengths),3);
 const comparison=acrossAreas([strengths[0],growth[0],sometimes[0],...snapshot.items].filter(Boolean).filter((item,i,all)=>all.findIndex(other=>other.index===item.index)===i),3);
 return {strengths:acrossAreas(byClarity(strengths),4),attention:acrossAreas(byClarity(growth.length?growth:sometimes),4),priorities,comparison,mode:growth.length?'growth':sometimes.length?'explore':'maintain'};
}

// A short synthesis of all six areas. These are editorial selections by answer
// count, not scored traits or a severity ranking. Never infer an absent group.
export function overallReportSummary(snapshot,language='en'){
 const hi=language==='hi',t=(en,hin)=>hi?hin:en,{support,focus,varies}=snapshot.counts;
 const themes=hi?['खुद की समझ','विचारों के पैटर्न','भावनाएँ सँभालना','फैसले लेना','रिश्ते','तनाव से उबरना']:['self-awareness','thinking patterns','emotional balance','decision-making','relationships','resilience'];
 const areas=snapshot.areas.map((area,index)=>({index,support:area.items.filter(i=>i.category==='support').length,focus:area.items.filter(i=>i.category==='focus').length}));
 const leading=(category,predicate)=>areas.filter(predicate).sort((a,b)=>b[category]-a[category]||a.index-b.index).slice(0,1).map(a=>themes[a.index]).join(t(' and ',' और '));
 if(support===36)return t('Helpful habits appear across all six areas in this check-in.','इस check-in में सभी छह पहलुओं में मददगार आदतें दिखती हैं।');
 if(varies===36)return t('Your answers show occasional patterns across all six areas; explore when they appear.','सभी छह पहलुओं के पैटर्न कभी-कभी दिखते हैं; ध्यान दें कि ये कब आते हैं।');
 const growth=leading('focus',a=>a.focus>0);
 if(!support)return t(`Your answers point to growth opportunities, especially in ${growth}; this snapshot cannot capture every strength.`,`आपके जवाबों में खासकर ${growth} में बेहतरी की गुंजाइश है; यह झलक आपकी हर मजबूती नहीं दिखा सकती।`);
 const strength=leading('support',a=>a.support>=4);
 if(strength&&focus)return t(`Your answers highlight ${strength} as a support, with ${growth} worth more attention.`,`आपके जवाबों में ${strength} मददगार दिखती है; ${growth} पर और ध्यान देने की गुंजाइश है।`);
 if(strength)return t(`Your answers highlight ${strength} as a support, with a few patterns to explore further.`,`आपके जवाबों में ${strength} मददगार दिखती है; कुछ पैटर्न और समझ सकते हैं।`);
 return focus?t(`Your answers show a mixed picture, with ${growth} worth more attention.`,`आपके जवाबों में मिली-जुली तस्वीर है; ${growth} पर और ध्यान दे सकते हैं।`):t('Helpful and occasional patterns sit side by side in your answers.','आपके जवाबों में मददगार और कभी-कभी दिखने वाले पैटर्न साथ मौजूद हैं।');
}

export function consolidatedDetailsMarkup(snapshot,{language='en',areas,categories,icon,escapeHTML:esc}){
 const t=(en,hi)=>language==='hi'?hi:en,details=consolidatedDetails(snapshot);
 const heading=(number,title,copy)=>`<div class="cs-detail-heading"><span>${number}</span><div><h3>${title}</h3><p>${copy}</p></div></div>`;
 const card=item=>{const insight=answerInterpretation(item,language);return `<button class="cs-insight-card ${item.category}" data-question="${item.index}" aria-description="${esc(insight.meaning)}"><span class="cs-card-icon"><span class="cs-icon-tile">${icon(insight.icon)}</span><span>${esc(categories[item.category].short)}</span></span><strong>${esc(insight.title)}</strong><span class="cs-detail-link" aria-hidden="true">${icon('arrow')}</span></button>`;};
 const emptyStrength=t('No strength responses in this check-in. It cannot capture every strength you have.','इस check-in में मजबूती वाले जवाब नहीं हैं। यह आपकी हर मजबूती नहीं दिखा सकता।');
 const emptyAttention=t('No growth or sometimes responses here. Keep building on what helps.','यहाँ बेहतरी या कभी-कभी वाले जवाब नहीं हैं। मददगार आदतें बनाए रखें।');
 const title=details.mode==='growth'?t('Three places you could begin.','शुरुआत करने के तीन अवसर।'):details.mode==='explore'?t('Three patterns to understand better.','तीन पैटर्न जिन्हें और समझ सकते हैं।'):t('Three strengths to keep practising.','तीन मजबूतियाँ जिन्हें बनाए रख सकते हैं।');

 const stages=[[t('DAYS 1–4','दिन 1–4'),t('Notice','ध्यान दें')],[t('DAYS 5–8','दिन 5–8'),t('Try','आज़माएँ')],[t('DAYS 9–11','दिन 9–11'),t('Build','आगे बढ़ें')]];
 return `<div class="cs-expanded">

 <section class="cs-detail-section" id="cs-patterns"><div class="cs-sides"><div class="cs-side cs-side-support"><div class="cs-side-title">${icon('spark')}<h4>${t('Strengths to lean on','आपकी मजबूतियाँ')}</h4><span>${snapshot.counts.support} / 36</span></div><div class="cs-insight-grid">${details.strengths.length?details.strengths.slice(0,2).map(card).join(''):`<p class="cs-empty">${emptyStrength}</p>`}</div></div><div class="cs-side cs-side-growth"><div class="cs-side-title">${icon('branch')}<h4>${details.mode==='growth'?t('Room to grow','जहाँ ध्यान दे सकते हैं'):t('Keep exploring','समझते रहें')}</h4><span>${details.mode==='growth'?snapshot.counts.focus:snapshot.counts.varies} / 36</span></div><div class="cs-insight-grid">${details.attention.length?details.attention.slice(0,2).map(card).join(''):`<p class="cs-empty">${emptyAttention}</p>`}</div></div></div></section>

 ${consolidatedAnalyticsMarkup(snapshot,{language,areas,categories,icon,escapeHTML:esc})}
 <details class="cs-deeper cs-mock-details"><summary><span>${icon('orbit')}${t('Comparison preview','तुलना की झलक')}</span><span class="cs-fold-meta">${t('Mock data','काल्पनिक डेटा')}<b aria-hidden="true">+</b></span></summary>
 <section class="cs-detail-section cs-comparison-section" id="cs-comparison">${heading('02',t('A little comparison context.','तुलना का थोड़ा संदर्भ।'),t('100 fictional responses per question. Answer frequency, not a health ranking.','हर सवाल के 100 काल्पनिक जवाब। यह जवाब की आवृत्ति है, स्वास्थ्य की रैंकिंग नहीं।'))}<span class="cs-mock-tag">${t('MOCK DATA · NOT A WORLD RANK','MOCK डेटा · दुनिया की रैंक नहीं')}</span><div class="cs-comparison-grid">${details.comparison.map(item=>{const comparison=simulatedComparison(item.index,item.value);return `<button class="cs-compare-card" data-question="${item.index}"><span>${esc(item.label)}</span><strong>${comparison.same}<small>%</small></strong><p>${t('of the fictional responses chose','काल्पनिक जवाबों में चुना गया')} <b>“${esc(item.response)}”</b></p><div class="cs-compare-meter" aria-hidden="true"><i style="width:${comparison.below}%;background:#b3c3db"></i><i style="width:${comparison.same}%;background:#8473a7"></i><i style="width:${comparison.above}%;background:#e3dcec"></i></div><div class="cs-compare-key"><span>${comparison.below}% ${t('less often','कम बार')}</span><b>${comparison.same}% ${t('same','वही')}</b><span>${comparison.above}% ${t('more often','ज़्यादा बार')}</span></div><span class="cs-source">${item.id} · ${t('100 fictional responses','100 काल्पनिक जवाब')}</span></button>`;}).join('')}</div></section>
 </details><details class="cs-deeper cs-guidance-details"><summary><span>${icon('leaf')}${t('Next steps & possible benefits','अगले कदम और संभावित लाभ')}</span><span class="cs-fold-meta">${t('3 steps · 14 days','3 कदम · 14 दिन')}<b aria-hidden="true">+</b></span></summary>
 <section class="cs-detail-section" id="cs-priorities">${heading('03',title,t('Choose one starting point. These are suggestions, not a clinical ranking.','एक शुरुआत चुनें। ये सुझाव हैं, चिकित्सकीय रैंकिंग नहीं।'))}<div class="cs-priority-list">${details.priorities.map((item,i)=>{const insight=answerInterpretation(item,language);return `<article class="cs-priority"><span class="cs-priority-number">0${i+1}</span><div><span class="cs-priority-area">${esc(areas[Math.floor(item.index/6)].name)} · ${esc(categories[item.category].short)}</span><h4>${esc(insight.title)}</h4><div class="cs-action-tip"><span>${icon(insight.icon)}</span><div><strong>${t('One small step','एक छोटा कदम')}</strong><p>${esc(insight.practice)}</p></div></div></div><button data-question="${item.index}" aria-label="${t('Explore','देखें')} ${esc(insight.title)}">${icon('arrow')}</button></article>`;}).join('')}</div></section>
 <section class="cs-detail-section cs-journey-section" id="cs-journey">${heading('04',t('A gentle 14-day reflection plan.','14 दिनों की एक सरल reflection योजना।'),t('A few minutes at a time. Repeat or adjust the pace to suit you.','एक बार में कुछ मिनट दें। गति अपनी ज़रूरत के अनुसार बदलें या दोहराएँ।'))}<div class="cs-journey-grid">${details.priorities.map((item,i)=>{const insight=answerInterpretation(item,language);return `<article class="cs-journey-card"><span class="cs-day">${stages[i][0]}</span><span class="cs-journey-icon">${icon(insight.icon)}</span><span class="cs-stage">${stages[i][1]}</span><h4>${esc(insight.title)}</h4><p class="cs-practice-prompt">${esc(insight.practice)}</p></article>`;}).join('')}<article class="cs-journey-card cs-review-card"><span class="cs-day">${t('DAYS 12–14','दिन 12–14')}</span><span class="cs-journey-icon">${icon('leaf')}</span><span class="cs-stage">${t('Reflect','विचार करें')}</span><h4>${t('Keep what felt useful.','जो उपयोगी लगा उसे साथ रखें।')}</h4><p>${t('Recall one moment when you tried a small step. What helped, what was difficult, and what would you like to repeat?','कोई एक पल याद करें जब आपने सुझाव आज़माया। क्या मददगार था, क्या मुश्किल था और क्या दोहराना चाहेंगे?')}</p><span class="cs-source">${t('Your experience sets the pace','गति अपने अनुभव के अनुसार रखें')}</span></article></div></section>
 <section class="cs-detail-section" id="cs-benefits">${heading('05',t('What these small shifts could help with.','ये छोटे बदलाव किसमें मदद कर सकते हैं।'),t('Possible benefits to notice over time; no 14-day targets.','समय के साथ संभावित लाभ; 14 दिनों में हासिल करने का दबाव नहीं।'))}<div class="cs-benefit-grid">${details.priorities.map(item=>`<article class="cs-benefit-card"><span>${icon(areas[Math.floor(item.index/6)].icon)}</span><h4>${esc(areas[Math.floor(item.index/6)].name)}</h4><p>${esc(item.benefit)}</p><small>${t('Connected to','संबंधित सवाल')} ${item.id}</small></article>`).join('')}</div><div class="cs-reflection-prompt">${icon('orbit')}<div><strong>${t('One thought to take with you','एक सवाल अपने साथ रखें')}</strong><p>${t('In the next two weeks, which everyday moment would you like to handle a little differently?','अगले दो हफ़्तों में किस रोज़मर्रा के पल को थोड़ा अलग तरीके से सँभालना चाहेंगे?')}</p></div></div><p class="cs-section-note">${t('This is a reflection on your submitted answers, not a diagnosis. Suggested activities and benefits are possibilities, not guaranteed outcomes.','यह आपके दिए जवाबों पर reflection है, निदान नहीं। गतिविधियाँ और लाभ संभावनाएँ हैं, गारंटी नहीं।')}</p></section>
 </details>
 <div class="cs-details-end"><span>${t('6 areas · 36 detailed graphs','6 पहलू · 36 विस्तृत ग्राफ')}</span><a href="#six-areas">${t('Explore all graphs','सभी ग्राफ देखें')}${icon('arrow')}</a></div>
 </div>`;
}
