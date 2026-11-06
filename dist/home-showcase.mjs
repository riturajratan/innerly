const comparisons = {
  social: { labels: ['The quieter thinker', 'The outward connector'], hi: ['शांत रहकर सोचने वाला', 'लोगों से जुड़कर सोचने वाला'], scores: [[24, 62, 74, 48, 35], [82, 57, 42, 55, 73]] },
  planning: { labels: ['The prepared planner', 'The flexible explorer'], hi: ['पहले से तैयारी करने वाला', 'लचीलेपन से आगे बढ़ने वाला'], scores: [[49, 38, 86, 64, 32], [57, 76, 22, 46, 71]] },
  decisions: { labels: ['The considered decider', 'The ready-to-act decider'], hi: ['सोच-समझकर फैसला करने वाला', 'कदम उठाने को तैयार'], scores: [[43, 59, 66, 42, 21], [62, 55, 47, 61, 84]] },
};
const dimensions = {
  en: [['Social style', 'Reserved', 'Outward'], ['Information style', 'Details', 'Patterns'], ['Planning style', 'Improvise', 'Structure'], ['Decision priorities', 'People & values', 'Logic & efficiency'], ['Decision pace', 'Deliberate', 'Act quickly']],
  hi: [['सामाजिक पसंद', 'शांत माहौल', 'लोगों के साथ'], ['जानकारी की पसंद', 'ठोस जानकारी', 'विचार और ढर्रे'], ['योजना की पसंद', 'बदलते रहना', 'पहले से तय करना'], ['फैसलों की प्राथमिकता', 'लोग और मूल्य', 'तर्क और उपयोगिता'], ['फैसलों की गति', 'सोचकर तय करना', 'जल्दी कदम उठाना']],
};

export function comparisonMarkup(key = 'social', language = 'en') {
  const entry = comparisons[key] || comparisons.social, hi = language === 'hi';
  return entry.scores.map((scores, i) => `<article class="profile-example profile-example-${i}"><div class="profile-example-heading"><span class="profile-monogram" aria-hidden="true">${i ? '☀' : '☽'}</span><div><p>${hi ? 'काल्पनिक profile' : 'ILLUSTRATIVE PROFILE'} ${i ? 'B' : 'A'}</p><h3>${entry[hi ? 'hi' : 'labels'][i]}</h3></div></div><div class="profile-bar-list">${scores.map((score, index) => {
    const [title, low, high] = dimensions[hi ? 'hi' : 'en'][index];
    return `<div class="profile-bar-row"><h4>${title}</h4><div class="profile-bar-endpoints"><span>${low}</span><span>${high}</span></div><div class="profile-bar-track" role="img" aria-label="${title}: ${score} / 100, ${low} — ${high}. ${hi ? 'सिर्फ उदाहरण।' : 'Example only.'}"><span style="--example-position:${score}%"><i></i></span></div></div>`;
  }).join('')}</div></article>`).join('');
}

export function preferenceShowcaseMarkup(language = 'en') {
  const hi = language === 'hi';
  return `<section class="preference-showcase" id="preference-explorer"><div class="home-section-heading"><p class="eyebrow">${hi ? 'अपनी पसंद के ढर्रे समझें' : 'EXPLORE THE POSSIBILITIES'}</p><h2>${hi ? 'अलग पसंद। अपनी-अपनी खूबियाँ।' : 'Different patterns. Different possibilities.'}</h2><p>${hi ? 'पाँच आयाम, कई मेल। उदाहरण बदलकर देखें कि दो अलग पसंद साथ में कैसी दिख सकती हैं।' : 'Five dimensions. Many ways to be yourself. Compare a few examples and see the whole picture.'}</p></div><div class="profile-compare-controls" role="group" aria-label="${hi ? 'उदाहरणों का एक जोड़ा चुनें' : 'Choose examples to compare'}">${[['social', hi ? 'सामाजिक ऊर्जा' : 'Social energy'], ['planning', hi ? 'योजना बनाना' : 'Making plans'], ['decisions', hi ? 'फैसले लेना' : 'Making decisions']].map(([key, title]) => `<button data-profile-example="${key}" aria-pressed="${key === 'social'}">${title}</button>`).join('')}</div><div class="profile-compare-grid" data-profile-comparison>${comparisonMarkup('social', language)}</div><p class="profile-compare-note">${hi ? 'ये समझाने के लिए काल्पनिक profiles हैं। ये आपके नतीजे, तय personality types या देशों की ranking नहीं हैं। किसी छोर पर होना बेहतर नहीं है।' : 'Fictional examples, not your results, fixed personality types or country rankings. Neither end of a dimension is better.'}</p></section>`;
}

export function sampleTestimonialsMarkup(language = 'en') {
  const hi = language === 'hi';
  const reviews = [
    ['Sanjay Gupta', 'SG', hi ? 'वेबसाइट का साफ़ layout और आसान सवाल मुझे अच्छे लगे। रिपोर्ट अपनी रोज़मर्रा की पसंद के बारे में सोचने का एक नया तरीका देती है।' : 'The clean layout and thoughtful questions make it easy to get started. The report offers a fresh way to reflect on everyday choices.'],
    ['Rituraj Ratan', 'RR', hi ? 'अलग-अलग graphs से अपनी पसंद समझना आसान लगा। रिश्तों वाले उदाहरण बातचीत शुरू करने का एक अच्छा तरीका हैं।' : 'I especially like how the graphs make different preferences easy to understand. The relationship examples are a useful conversation starter.'],
    ['Alex', 'A', hi ? 'अपनी गति से सवालों के जवाब देना अच्छा लगा। छोटे, व्यावहारिक सुझाव इस अनुभव को ज़्यादा उपयोगी बनाते हैं।' : 'I like being able to answer at my own pace. The practical prompts turn a moment of curiosity into something I can think about afterwards.'],
  ];
  return `<section class="sample-testimonials"><div class="home-section-heading"><h2>${hi ? 'खुद को समझने के छोटे पल।' : 'A little reflection can go a long way.'}</h2><p>${hi ? 'ये layout देखने के लिए लिखे गए उदाहरण हैं, लोगों की भेजी हुई reviews नहीं।' : 'Sample stories for this design preview. These are not submitted customer reviews.'}</p></div><div class="testimonial-grid">${reviews.map(([name, initials, quote]) => `<article><div class="sample-stars" role="img" aria-label="${hi ? 'पाँच सितारों की उदाहरण rating' : 'Five stars, sample rating'}">★★★★★</div><blockquote>“${quote}”</blockquote><div class="sample-reviewer">${name === 'Sanjay Gupta' ? '<img src="assets/sanjay-gupta.jpg" width="43" height="43" alt="" loading="lazy" decoding="async">' : `<span aria-hidden="true">${initials}</span>`}<div><strong>${name}</strong></div></div></article>`).join('')}</div></section>`;
}

export function bindPreferenceShowcase(root, language = 'en') {
  if (!root) return;
  root.querySelectorAll('[data-profile-example]').forEach(button => button.addEventListener('click', () => {
    root.querySelectorAll('[data-profile-example]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    root.querySelector('[data-profile-comparison]').innerHTML = comparisonMarkup(button.dataset.profileExample, language);
  }));
}
