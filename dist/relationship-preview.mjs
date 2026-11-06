const topics = {
  communication: {
    en: ['Talking things through', 'Think first', 'Talk it through', 'Leave a little thinking time before returning to the conversation.', 'Try asking what each person needs before assuming you want the same thing.'],
    hi: ['बातचीत का अपना तरीका', 'पहले सोचना', 'बात करके समझना', 'बातचीत पर लौटने से पहले सोचने का थोड़ा समय दें।', 'एक जैसी पसंद मानने से पहले पूछें कि दोनों को क्या चाहिए।'],
    values: [28, 76], icon: '↔',
  },
  planning: {
    en: ['Making plans together', 'Keep it open', 'Plan ahead', 'Agree on one fixed plan and leave a little room for something spontaneous.', 'A shared starting point can help. Check how much flexibility each of you wants.'],
    hi: ['मिलकर योजना बनाना', 'विकल्प खुले रखना', 'पहले से तय करना', 'एक बात पहले तय करें और थोड़ी जगह अचानक बनी योजना के लिए छोड़ें।', 'शुरुआत एक जैसी हो सकती है। पूछें कि दोनों कितनी flexibility चाहते हैं।'],
    values: [72, 32], icon: '▦',
  },
  energy: {
    en: ['Finding time to recharge', 'Quiet time', 'Time with people', 'Make space for time together and time apart, without taking either personally.', 'Even similar preferences can change from day to day. Ask what feels right today.'],
    hi: ['नई ऊर्जा के लिए समय', 'शांत समय', 'लोगों के साथ', 'साथ बिताने और अकेले रहने, दोनों के लिए जगह बनाएँ।', 'एक जैसी पसंद भी हर दिन बदल सकती है। पूछें कि आज क्या अच्छा लगेगा।'],
    values: [25, 74], icon: '☀',
  },
};

export function relationshipExample(topic = 'communication', a, b, language = 'en') {
  const key = Object.hasOwn(topics, topic) ? topic : 'communication';
  const entry = topics[key], copy = entry[language === 'hi' ? 'hi' : 'en'];
  const position = (value, fallback) => Number.isFinite(value) ? Math.round(Math.max(0, Math.min(100, value))) : fallback;
  const values = [position(a, entry.values[0]), position(b, entry.values[1])];
  return { key, title: copy[0], low: copy[1], high: copy[2], values,
    insight: copy[Math.abs(values[0] - values[1]) >= 35 ? 3 : 4] };
}

function panelMarkup(topic, language) {
  const example = relationshipExample(topic, undefined, undefined, language), hi = language === 'hi';
  return `<div class="relationship-plot" dir="ltr" role="img" aria-label="${hi ? 'दो काल्पनिक लोगों की पसंद का उदाहरण' : 'Illustrative preferences of two fictional people'}"><div class="rel-endpoints"><span>${example.low}</span><span>${example.high}</span></div>${example.values.map((value, i) => `<div class="rel-person rel-person-${i}"><span>${hi ? 'व्यक्ति' : 'Person'} ${i ? 'B' : 'A'}</span><div class="rel-track"><i data-rel-marker="${i}" style="left:${value}%"></i></div></div>`).join('')}</div><div class="relationship-sliders" dir="ltr">${example.values.map((value, i) => `<label>${hi ? 'व्यक्ति' : 'Person'} ${i ? 'B' : 'A'}<input type="range" min="0" max="100" value="${value}" data-rel-range="${i}" aria-label="${hi ? 'व्यक्ति' : 'Person'} ${i ? 'B' : 'A'}: ${example.low} — ${example.high}"></label>`).join('')}</div><div class="relationship-insight"><span aria-hidden="true">✧</span><p data-rel-insight role="status">${example.insight}</p></div>`;
}

export function relationshipSectionMarkup(language = 'en') {
  const hi = language === 'hi';
  return `<section class="home-relationships" id="relationship-explorer"><div class="relationship-story"><p class="eyebrow">${hi ? 'एक-दूसरे को थोड़ा बेहतर समझें' : 'A LITTLE MORE UNDERSTANDING. A LITTLE MORE CONNECTION.'}</p><h2>${hi ? 'अलग पसंद।<br>समझने का एक नया तरीका।' : 'Different ways of being.<br>More ways to connect.'}</h2><p>${hi ? 'कभी एक को शांत समय चाहिए, दूसरे को बातचीत। अपनी पसंद समझना, एक-दूसरे की ज़रूरतें समझने की शुरुआत हो सकती है।' : 'One person wants a quiet evening. Another wants to talk it all through. Understanding your preferences can open a better conversation.'}</p><img src="assets/innerly-relationship-conversation.webp" width="1536" height="1024" alt="" loading="lazy" decoding="async"><button class="text-button" data-start-intent="relationships">${hi ? 'रिश्तों के नज़रिए से खुद को समझें' : 'Explore your relationship patterns'} <span aria-hidden="true">→</span></button></div><div class="relationship-lab"><div class="relationship-lab-heading"><span class="example-badge">${hi ? 'काल्पनिक उदाहरण' : 'INTERACTIVE EXAMPLE'}</span><h3>${hi ? 'दो पसंदों को साथ देखें' : 'Two perspectives. One conversation.'}</h3><p>${hi ? 'एक विषय चुनें, फिर sliders बदलकर देखें।' : 'Pick a moment. Move the sliders. See another perspective.'}</p></div><div class="relationship-topics" role="group" aria-label="${hi ? 'रिश्तों का एक उदाहरण चुनें' : 'Choose a relationship example'}">${Object.entries(topics).map(([key, entry]) => `<button data-rel-topic="${key}" aria-pressed="${key === 'communication'}"><span aria-hidden="true">${entry.icon}</span>${entry[hi ? 'hi' : 'en'][0]}</button>`).join('')}</div><div data-rel-panel>${panelMarkup('communication', language)}</div><p class="relationship-disclaimer">${hi ? 'ये काल्पनिक पसंद हैं, आपके नतीजे या compatibility score नहीं। किसी की पसंद बेहतर या खराब नहीं है।' : 'Fictional preferences, not your results or a compatibility score. Neither end is better.'}</p></div></section>`;
}

export function bindRelationshipDemo(root, language = 'en') {
  if (!root) return;
  let topic = 'communication';
  const bindSliders = () => {
    const sliders = [...root.querySelectorAll('[data-rel-range]')];
    const update = () => {
      const example = relationshipExample(topic, ...sliders.map(input => Number(input.value)), language);
      example.values.forEach((value, i) => { root.querySelector(`[data-rel-marker="${i}"]`).style.left = `${value}%`; });
      root.querySelector('[data-rel-insight]').textContent = example.insight;
    };
    sliders.forEach(slider => slider.addEventListener('input', update));
  };
  root.querySelectorAll('[data-rel-topic]').forEach(button => button.addEventListener('click', () => {
    topic = button.dataset.relTopic;
    root.querySelectorAll('[data-rel-topic]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    root.querySelector('[data-rel-panel]').innerHTML = panelMarkup(topic, language);
    bindSliders();
  }));
  bindSliders();
}
