const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

// A count of the existing supportive-answer group, never a new wellbeing score.
export function responseGaugeMarkup(counts,language='en',{sample=false}={}){
 const {support,focus,varies}=counts;
 if(![support,focus,varies].every(value=>Number.isInteger(value)&&value>=0)||support+focus+varies!==36)throw new Error('The gauge needs all 36 classified answers.');
 const t=(en,hi)=>language==='hi'?hi:en,angle=180+support/36*180;
 // Interpolate along the same count scale as the needle; these are visual
 // colour stops, not clinical thresholds or additional response categories.
 const stops=[[217,137,123],[237,178,123],[230,205,131],[143,190,155],[81,154,118]];
 const offsets=stops.map((_,i)=>(1-Math.cos(Math.PI*i/4))/2);
 const position=(1-Math.cos(Math.PI*support/36))/2,segment=Math.min(Math.floor(support/9),3),blend=(position-offsets[segment])/(offsets[segment+1]-offsets[segment]);
 const channels=stops[segment].map((channel,i)=>Math.round(channel+(stops[segment+1][i]-channel)*blend));
 const color=`rgb(${channels.join(',')})`,ink=`rgb(${channels.map(channel=>Math.round(channel*.62)).join(',')})`;
 const gradientId=`rg-spectrum-${sample?'sample':'personal'}-${language==='hi'?'hi':'en'}-${support}`;
 const point=(degrees,radius)=>`${(160+radius*Math.cos(degrees*Math.PI/180)).toFixed(2)},${(150+radius*Math.sin(degrees*Math.PI/180)).toFixed(2)}`;
 const label=t(`${support} of 36 answers show strengths. ${focus} show room to grow; ${varies} are Sometimes.`,`${36} में से ${support} जवाब मजबूतियाँ दिखाते हैं। ${focus} में बेहतरी की गुंजाइश; ${varies} कभी-कभी हैं।`);
 return `<figure class="response-gauge" data-strength-count="${support}" style="--gauge-color:${color};--gauge-ink:${ink}" role="img" aria-label="${escapeHTML((sample?t('Fictional sample. ','काल्पनिक उदाहरण। '):'')+label)}">
  <div class="rg-kicker">${t('STRENGTHS IN YOUR ANSWERS','आपके जवाबों में मजबूतियाँ')}</div>
  <svg viewBox="0 0 320 180" aria-hidden="true" focusable="false">
   <defs><linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="40" y1="150" x2="280" y2="150">${stops.map((channels,i)=>`<stop offset="${offsets[i]}" stop-color="rgb(${channels.join(',')})"/>`).join('')}</linearGradient></defs>
   <path class="rg-track" d="M40 150 A120 120 0 0 1 280 150"/>
   <path class="rg-fill" style="stroke:url(#${gradientId})" d="M40 150 A120 120 0 0 1 280 150"/>
   <g class="rg-ticks">${Array.from({length:37},(_,i)=>`<path d="M${point(180+i*5,138)} L${point(180+i*5,i%9===0?147:142)}"/>`).join('')}</g>
   <g class="rg-axis"><text x="18" y="174">0</text><text x="160" y="14" text-anchor="middle">18</text><text x="302" y="174" text-anchor="end">36</text></g>
   <g class="rg-needle" transform="rotate(${angle} 160 150)"><path d="M148 144 L252 150 L148 156 Z"/></g>
   <circle class="rg-hub" cx="160" cy="150" r="11"/><circle class="rg-hub-center" cx="160" cy="150" r="4"/>
  </svg>
  <figcaption><strong>${support}<span> / 36</span></strong><span>${t('answers show strengths','जवाब मजबूतियाँ दिखाते हैं')}</span></figcaption>
 </figure>`;
}
