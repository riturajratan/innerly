import { wellbeingData } from './data/world-wellbeing.mjs';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const countryNames = Object.keys(wellbeingData);
export function countrySeries(name) { return Object.hasOwn(wellbeingData, name) ? wellbeingData[name] : []; }
export function latestEvaluation(name) { return countrySeries(name).find(row => row[0] === 2025) ?? null; }
export function trendSegments(series) {
  const segments = [];
  for (const row of series) {
    const last = segments.at(-1);
    if (last && last.at(-1)[0] + 1 === row[0]) last.push(row);
    else segments.push([row]);
  }
  return segments;
}
export function worldCharts(a = 'India', b = 'United States', language = 'en') {
  const hi = language === 'hi', names = [...new Set([a,b])].filter(name => latestEvaluation(name));
  if (!names.length) return `<p>${hi ? 'इस चुनाव के लिए आँकड़े उपलब्ध नहीं हैं।' : 'No published data for this selection.'}</p>`;
  const colors = ['#237b99','#9b633f'];
  const labels = ['0','2','4','6','8','10'];
  const rows = names.map((name,i) => {
    const [,mean,low,high] = latestEvaluation(name);
    return `<div class="world-country"><div><span><i style="background:${colors[i]}"></i>${esc(name)}</span><strong>${mean.toFixed(2)}<small> / 10</small></strong></div><div class="world-scale"><span class="world-fill" style="width:${mean*10}%;background:${colors[i]}"></span><span class="world-confidence" style="left:${low*10}%;width:${(high-low)*10}%"></span><span class="world-dot" style="left:${mean*10}%;border-color:${colors[i]}"></span></div><p>${hi ? 'विश्वास अंतराल' : '95% confidence interval'} ${low.toFixed(2)}–${high.toFixed(2)}</p></div>`;
  }).join('');
  const x = year => 44 + (year - 2020) * 64, y = score => 220 - score * 18;
  const lines = names.map((name,i) => trendSegments(countrySeries(name)).map(segment => `<polyline points="${segment.map(r=>`${x(r[0])},${y(r[1])}`).join(' ')}" stroke="${colors[i]}" fill="none" stroke-width="3"/>${segment.map(r => `<circle cx="${x(r[0])}" cy="${y(r[1])}" r="4.5" fill="${colors[i]}" stroke="white" stroke-width="2"><title>${esc(name)} · ${r[0]-2}–${r[0]}: ${r[1].toFixed(2)}</title></circle>`).join('')}`).join('')).join('');
  const trend = `<svg viewBox="0 0 404 265" role="img" aria-label="${hi ? 'चुने हुए देशों के तीन साल के औसत, अंतिम सर्वे वर्ष 2020 से 2025। नीचे तालिका में सभी मान हैं।' : 'Selected countries’ three-year life evaluation averages, final survey years 2020 to 2025. All values in the table below.'}">${[0,2,4,6,8,10].map(n=>`<path d="M44 ${y(n)}H364" stroke="#d6e2e5" stroke-dasharray="3 5"/><text x="26" y="${y(n)+5}" text-anchor="end">${n}</text>`).join('')}${lines}${[2020,2021,2022,2023,2024,2025].map(n=>`<text x="${x(n)}" y="246" text-anchor="middle">${String(n).slice(2)}</text>`).join('')}</svg>`;
  return `<div class="world-chart-grid"><article class="world-chart"><p class="story-kicker">${hi ? '2023–2025 का औसत' : 'THE LATEST PICTURE · 2023–2025'}</p><h3>${hi ? 'लोग अपनी ज़िंदगी को कैसे देखते हैं?' : 'How do people rate their lives?'}</h3><div class="world-current">${rows}<div class="world-axis" aria-hidden="true">${labels.map(n=>`<span>${n}</span>`).join('')}</div></div><p class="world-caption">${hi ? '0 = सबसे खराब संभव जीवन · 10 = सबसे अच्छा संभव जीवन' : '0 = worst possible life · 10 = best possible life'}</p></article><article class="world-chart"><p class="story-kicker">${hi ? 'समय के साथ' : 'A VIEW OVER TIME'}</p><h3>${hi ? 'अनुभव बदलते हैं।' : 'Life changes. So does perspective.'}</h3>${trend}<div class="world-trend-legend">${names.map((name,i)=>`<span><i style="background:${colors[i]}"></i>${esc(name)}</span>`).join('')}</div><p class="world-caption">${hi ? 'तीन वर्ष के औसत · अक्ष पर अंतिम सर्वे वर्ष (2020–2025)' : 'Three-year averages · axis shows final survey year (2020–2025)'}</p></article></div><details class="world-data"><summary>${hi ? 'डेटा और उसका मतलब देखें' : 'See the data & what it means'}</summary><p>${hi ? 'राष्ट्रीय औसत हर व्यक्ति का अनुभव नहीं बताता। ये life evaluation के आँकड़े हैं, personality scores नहीं। पास-पास के औसत में अंतर sampling uncertainty के भीतर हो सकता है। लगातार अवधियों में सर्वे वर्ष साझा होते हैं।' : 'National averages do not describe every individual. These are life evaluation ratings, not personality scores. Small differences can fall within sampling uncertainty. Consecutive averages share survey years.'}</p><div class="world-table-wrap"><table><caption>${hi ? 'तीन-वर्षीय अवधि : औसत (95% विश्वास अंतराल)' : 'Three-year period: mean (95% confidence interval)'}</caption><thead><tr><th>${hi ? 'अवधि' : 'Period'}</th>${names.map(n=>`<th>${esc(n)}</th>`).join('')}</tr></thead><tbody>${[2020,2021,2022,2023,2024,2025].map(year=>`<tr><th>${year-2}–${year}</th>${names.map(name=>{const row=countrySeries(name).find(r=>r[0]===year);return `<td>${row ? `${row[1].toFixed(2)} (${row[2].toFixed(2)}–${row[3].toFixed(2)})` : (hi?'उपलब्ध नहीं':'Not available')}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div><p>World Happiness Report 2026, Figure 2.1 · Gallup World Poll. <a href="https://www.worldhappiness.report/data-sharing/" target="_blank" rel="noopener">${hi ? 'स्रोत और पद्धति' : 'Source & methodology'} ↗</a></p></details>`;
}
export function worldSection(language='en') {
  const hi=language==='hi';
  const select=(id,name,label)=>`<label for="${id}">${label}<select id="${id}" data-world-country>${countryNames.map(c=>`<option value="${esc(c)}"${c===name?' selected':''}>${esc(c)}</option>`).join('')}</select></label>`;
  return `<section class="story-world" id="world-perspective"><div class="story-section-heading"><div><p class="story-kicker">${hi ? 'दुनिया से एक नज़रिया' : 'A LITTLE GLOBAL PERSPECTIVE'}</p><h2>${hi ? 'अलग देश।<br>अलग अनुभव।' : 'Different places.<br>Different experiences.'}</h2></div><p>${hi ? 'दुनिया में लोग अपनी ज़िंदगी को कैसे देखते हैं? दो देश चुनकर देखें।' : 'How do people around the world feel about their lives? Choose two places to explore.'}</p></div><div class="world-selects">${select('world-country-a','India',hi?'पहला देश / क्षेत्र':'First country / territory')}${select('world-country-b','United States',hi?'दूसरा देश / क्षेत्र':'Compare with')}<span class="world-source-badge">${hi ? 'प्रकाशित डेटा · WHR 2026' : 'PUBLISHED DATA · WHR 2026'}</span></div><div id="world-chart-content">${worldCharts('India','United States',language)}</div><p class="world-limit">${hi ? 'देश के औसत आपकी personality तय नहीं करते। आपकी Innerly रिपोर्ट सिर्फ़ आपके जवाबों से बनती है।' : 'A country average does not define you. Your Innerly report comes only from your answers.'}</p><span class="sr-only" id="world-update" aria-live="polite"></span></section>`;
}
export function bindWorld(root,language='en') {
  const controls=[...root.querySelectorAll('[data-world-country]')];
  for(const control of controls) control.addEventListener('change',()=>{
    root.querySelector('#world-chart-content').innerHTML=worldCharts(controls[0].value,controls[1].value,language);
    root.querySelector('#world-update').textContent=language==='hi'?`${controls[0].value} और ${controls[1].value} का डेटा दिख रहा है।`:`Showing published life evaluations for ${controls[0].value} and ${controls[1].value}.`;
  });
}
