import {answerInterpretation} from './answer-interpretations.mjs?v=1';

// Descriptive response patterns, never personality types or clinical scores.
export function currentProfile(snapshot){
 const areas=snapshot.areas.map((area,index)=>{
  const counts={support:0,focus:0,varies:0};area.items.forEach(item=>counts[item.category]++);
  const mode=counts.support>=4?'support':counts.focus>=4?'focus':counts.varies>=4?'varies':'mixed';
  const category=mode==='mixed'?(counts.focus?'focus':counts.varies?'varies':'support'):mode;
  const evidence=area.items.filter(item=>item.category===category).sort((a,b)=>Math.abs(b.value-2)-Math.abs(a.value-2)||a.index-b.index)[0];
  return {index,counts,mode,evidence};
 });
 const anchors=areas.filter(area=>area.mode==='support');
 const attention=areas.filter(area=>area.counts.focus>0).sort((a,b)=>b.counts.focus-a.counts.focus||a.index-b.index);
 const mode=snapshot.counts.varies===36?'exploring':anchors.length>=4?'supported':anchors.length?'balanced':snapshot.counts.focus>snapshot.counts.support?'building':'mixed';
 return {areas,anchors,attention,mode};
}

export function currentProfileMarkup(snapshot,{language='en',areas,icon,escapeHTML:esc}){
 const t=(en,hi)=>language==='hi'?hi:en,profile=currentProfile(snapshot);
 const titles={exploring:t('A picture still taking shape.','अभी उभरती हुई तस्वीर।'),supported:t('Several strengths to build on.','आगे बढ़ने के लिए कई मजबूतियाँ।'),balanced:t('Strengths to lean on. Space to grow.','मजबूतियों का सहारा। आगे बढ़ने की जगह।'),building:t('Make room for what supports you.','अपने सहारे के लिए जगह बनाएँ।'),mixed:t('Different moments. Different patterns.','अलग पल। अलग पैटर्न।')};
 const modes={support:t('A steady support','मददगार पैटर्न'),focus:t('Worth more attention','और ध्यान देने योग्य'),varies:t('Depends on the moment','पल के हिसाब से बदलता है'),mixed:t('A mixed picture','मिली-जुली तस्वीर')};
 return `<div class="cp-profile"><div class="cp-intro"><span class="cp-symbol" aria-hidden="true">${icon('orbit')}</span><div><p class="small-label">${t('YOUR CURRENT PATTERN','आपका मौजूदा पैटर्न')}</p><h3>${titles[profile.mode]}</h3><p>${t('A reflection of your 36 answers today—not a fixed identity.','आज के 36 जवाबों की झलक—आपकी स्थायी पहचान नहीं।')}</p></div></div><div class="cp-grid">${profile.areas.map(area=>{const item=area.evidence,insight=answerInterpretation(item,language);return `<article class="cp-area ${area.mode}"><div class="cp-area-title">${icon(areas[area.index].icon)}<h4>${esc(areas[area.index].name)}</h4></div><strong>${modes[area.mode]}</strong><div class="cp-track" aria-hidden="true">${['support','varies','focus'].map(key=>`<span class="${key}" style="flex:${area.counts[key]}" ${area.counts[key]?'':'hidden'}></span>`).join('')}</div><p class="cp-counts">${area.counts.support} ${t('strength','मजबूती')} · ${area.counts.varies} ${t('sometimes','कभी-कभी')} · ${area.counts.focus} ${t('growth','बेहतरी')}</p><button data-question="${item.index}"><span>${esc(insight.title)}</span>${icon('arrow')}</button></article>`;}).join('')}</div><details class="cp-method"><summary>${t('How this picture is formed','यह तस्वीर कैसे बनी')}</summary><p>${t('Each area contains six answers. Four or more in one response group creates its headline; otherwise it stays mixed. The highlighted insight is one example, not the whole area. Higher frequency is not always better: each question is interpreted in its own direction.','हर पहलू में छह जवाब हैं। एक समूह में चार या अधिक जवाब हों तो उसका शीर्षक दिखता है; नहीं तो तस्वीर मिली-जुली रहती है। Highlight किया insight एक उदाहरण है, पूरा पहलू नहीं। अधिक आवृत्ति हमेशा बेहतर नहीं: हर सवाल का अपना अर्थ है।')}</p></details></div>`;
}
