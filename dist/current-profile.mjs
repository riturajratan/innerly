import {answerInterpretation} from './answer-interpretations.mjs?v=1';

// Cross-question editorial synthesis, not a validated personality instrument.
// Every item participates once, across original questionnaire areas.
export const profileSignals=[
 {key:'reflective',questions:[1,2,3,4,6,10,11,28,32],label:['Reflective','विचारशील'],support:['You look for context and reconsider your first interpretation.','आप संदर्भ समझने और पहली धारणा पर फिर सोचने की कोशिश करते हैं।'],focus:['Finding clarity may take more effort when thoughts or uncertainty build up.','विचार या अनिश्चितता बढ़ने पर स्पष्टता पाना मुश्किल हो सकता है।']},
 {key:'measured',questions:[7,9,13,14,15,16,17,18,20],label:['Measured in your responses','जवाब देने में ठहराव'],support:['You describe ways to pause, settle and express what you feel.','आप रुकने, सँभलने और अपनी भावना व्यक्त करने के तरीके बताते हैं।'],focus:['Pausing or letting a difficult moment go may take more effort.','मुश्किल पल में रुकना या उससे आगे बढ़ना अधिक मेहनत माँग सकता है।']},
 {key:'considerate',questions:[5,19,25,26,27,29,30,35],label:['Considerate and connected','संवेदनशील और जुड़ाव रखने वाले'],support:['You make room for other people while communicating needs and seeking support.','आप दूसरों की जगह समझने के साथ अपनी ज़रूरत कहने और सहारा लेने की कोशिश करते हैं।'],focus:['Balancing connection, feedback and your own needs may need more space.','जुड़ाव, प्रतिक्रिया और अपनी ज़रूरतों में तालमेल को और जगह चाहिए हो सकती है।']},
 {key:'adaptive',questions:[8,12,21,22,23,24,31,33,34,36],label:['Adaptable and forward-looking','बदलाव के साथ आगे बढ़ने वाले'],support:['You look for another way forward and take useful steps when plans change.','योजना बदलने पर आप दूसरा रास्ता और उपयोगी कदम खोजते हैं।'],focus:['Moving forward or caring for yourself when plans change may feel less straightforward.','योजना बदलने पर आगे बढ़ना या अपना खयाल रखना कम सहज हो सकता है।']}
];
export function currentProfile(snapshot){
 const signals=profileSignals.map((signal,index)=>{
  const items=signal.questions.map(q=>snapshot.items[q-1]);
  const counts={support:0,focus:0,varies:0};items.forEach(item=>counts[item.category]++);
  // Proportions prevent the ten-item cluster outweighing the eight-item cluster.
  return {...signal,index,items,counts,supportRate:counts.support/items.length,focusRate:counts.focus/items.length};
 });
 const anchors=signals.filter(s=>s.supportRate>=.6).sort((a,b)=>b.supportRate-a.supportRate||a.index-b.index);
 const pressures=signals.filter(s=>s.focusRate>=.4).sort((a,b)=>b.focusRate-a.focusRate||a.index-b.index);
 const primary=anchors[0]||null,secondary=anchors[1]||null,pressure=pressures[0]||null;
 const mode=snapshot.counts.varies===36?'exploring':primary?(pressure?'contrast':'supported'):pressure?'building':'mixed';
 const candidateItems=pressure?pressure.items.filter(i=>i.category==='focus'):snapshot.items.filter(i=>i.category==='focus');
 const priority=(candidateItems.length?candidateItems:snapshot.items.filter(i=>i.category==='varies').length?snapshot.items.filter(i=>i.category==='varies'):snapshot.items).slice().sort((a,b)=>Math.abs(b.value-2)-Math.abs(a.value-2)||a.index-b.index)[0];
 const evidence=[...(primary?primary.items.filter(i=>i.category==='support').slice(0,secondary?1:2):[]),...(secondary?secondary.items.filter(i=>i.category==='support').slice(0,1):[]),...(pressure?pressure.items.filter(i=>i.category==='focus').slice(0,2):[])];
 if(!evidence.length)evidence.push(...snapshot.items.filter(i=>i.category==='varies').slice(0,3));
 return {signals,primary,secondary,pressure,mode,priority,evidence,counts:snapshot.counts};
}
export function profileReading(profile,language='en'){
 const hi=language==='hi',n=hi?1:0,t=(en,hin)=>hi?hin:en,{primary,secondary,pressure,mode}=profile;
 let title,reading;
 if(primary){
  title=primary.label[n]+(secondary?t(' · ',' · ')+secondary.label[n]:t(' in this check-in','—इस check-in में'));
  reading=primary.support[n]+' '+(pressure?t('At the same time, ','साथ ही, ')+pressure.focus[n]:secondary?secondary.support[n]:t('Other answers add a mix of strengths and moments worth exploring.','दूसरे जवाबों में मजबूतियाँ और समझने योग्य पल साथ दिखते हैं।'));
 }else if(mode==='exploring'){
  title=t('Your style changes with the situation.','स्थिति के साथ आपका तरीका बदलता है।');reading=t('You chose “Sometimes” throughout. Your answers do not point to one dominant style yet; the situations behind them will add the missing context.','आपने हर जगह “कभी-कभी” चुना। अभी एक प्रमुख तरीका नहीं उभरता; इन जवाबों के पीछे की स्थितियाँ और संदर्भ देंगी।');
 }else if(pressure){
  title=t('A picture with more room for support.','और सहारे की गुंजाइश वाली तस्वीर।');reading=pressure.focus[n]+' '+t('Your answers do not establish one dominant strength pattern. That does not mean those strengths are absent from your life.','जवाबों में एक प्रमुख मजबूती-पैटर्न नहीं उभरता। इसका मतलब यह नहीं कि आपके जीवन में वे मजबूतियाँ नहीं हैं।');
 }else{title=t('More than one way of responding.','जवाब देने का एक से अधिक तरीका।');reading=t('Your answers combine helpful habits, changing responses and some friction. No single style clearly dominates this check-in.','आपके जवाबों में मददगार आदतें, बदलती प्रतिक्रियाएँ और कुछ मुश्किलें साथ हैं। इस check-in में एक तरीका स्पष्ट रूप से प्रमुख नहीं है।');}
 return {title,reading};
}
export function currentProfileMarkup(snapshot,{language='en',icon,escapeHTML:esc,dataMarkup=''}){
 const t=(en,hi)=>language==='hi'?hi:en,p=currentProfile(snapshot),copy=profileReading(p,language),step=answerInterpretation(p.priority,language);
 const visualLabels={reflective:[t('Reflective','विचारशील'),'eye'],measured:[t('Measured','ठहराव रखने वाले'),'pause'],considerate:[t('Considerate','संवेदनशील'),'heart'],adaptive:[t('Adaptable','बदलाव में ढलने वाले'),'branch']};
 const signals=[p.primary,p.secondary].filter(Boolean);
 return `<div class="cp-profile cp-combined cp-visual-profile" data-profile-mode="${p.mode}"><div class="cp-intro"><div><p class="small-label">${t('YOUR PATTERNS TODAY','आज के आपके पैटर्न')}</p>${signals.length?`<div class="cp-traits">${signals.map(signal=>`<span>${icon(visualLabels[signal.key][1])}<strong>${visualLabels[signal.key][0]}</strong></span>`).join('')}</div>`:`<h3>${esc(copy.title)}</h3>`}<p class="cp-identity-note">${t('A snapshot, not a fixed personality type.','आज की झलक, स्थायी personality type नहीं।')}</p></div></div>${dataMarkup}<details class="cp-reading"><summary>${icon('eye')}${t('Why this picture?','यह तस्वीर क्यों?')}</summary><div class="cp-reading-content"><p class="cs-overall-copy cp-synthesis">${esc(copy.reading)}</p><div class="cp-evidence"><span class="small-label">${t('WHAT LED TO THIS PICTURE','यह तस्वीर क्यों उभरी')}</span><div>${p.evidence.map(item=>`<button class="${item.category}" data-question="${item.index}">${icon(item.category==='support'?'spark':'wave')}<span>${esc(answerInterpretation(item,language).title)}</span><b aria-hidden="true">↗</b></button>`).join('')}</div></div><div class="cp-next"><span class="cp-next-icon">${icon('leaf')}</span><div><span class="small-label">${p.counts.focus?t('YOUR SMALL NEXT STEP','आपका छोटा अगला कदम'):t('ONE THING TO KEEP EXPLORING','एक बात जिसे और समझें')}</span><p>${esc(step.practice)}</p></div><button data-question="${p.priority.index}" aria-label="${t('See the answer behind this step','इस कदम का आधार देखें')}">${icon('arrow')}</button></div><details class="cp-method"><summary>${t('How all 36 answers shape this profile','सभी 36 जवाब यह profile कैसे बनाते हैं')}</summary><p>${t('We combine individual answers across the original six areas. Each answer contributes to one of four cross-question signals: reflection, responses, connection and adaptation. A supportive pattern needs at least 60% supportive answers in its signal; a pressure pattern needs at least 40% growth answers. These editorial thresholds describe your responses, not validated personality scores. Ties retain a fixed order; mixed answers stay mixed.','मूल छह पहलुओं के जवाबों को जोड़कर चार संकेत देखते हैं: समझ, प्रतिक्रिया, जुड़ाव और बदलाव। हर जवाब एक संकेत में शामिल है। मददगार पैटर्न के लिए उस संकेत में कम-से-कम 60% मददगार जवाब, और दबाव के पैटर्न के लिए 40% बेहतरी वाले जवाब चाहिए। ये संपादकीय नियम हैं, validated personality score नहीं। बराबरी में तय क्रम रहता है; मिले-जुले जवाब मिले-जुले ही रहते हैं।')}</p><p>${t('Highlighted answers are examples. All 36 contribute; higher frequency is not always more supportive.','Highlight किए जवाब उदाहरण हैं। सभी 36 योगदान देते हैं; अधिक आवृत्ति हमेशा अधिक मददगार नहीं।')}</p></details></div></details></div>`;
}
