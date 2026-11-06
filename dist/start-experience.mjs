import { preferenceShowcaseMarkup, sampleTestimonialsMarkup } from "./home-showcase.mjs?v=faces-1";
import { relationshipSectionMarkup } from "./relationship-preview.mjs?v=conversation-1";
import { benefitIcon } from "./professional-art.mjs";
import { traits, band } from "./model.mjs";
import { thinkingViews } from "./thinking-views.mjs";
const esc = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const discoveryIntents = [
  "self",
  "relationships",
  "blindspots",
  "pressure",
  "growth",
];
export function validIntent(value) {
  return discoveryIntents.includes(value) ? value : "self";
}
export function intentContext(value) {
  return value === "relationships"
    ? "relationships"
    : value === "pressure"
      ? "pressure"
      : "daily";
}
export function intentDimensions(value) {
  return {
    self: [0, 1, 2],
    relationships: [0, 3, 4],
    blindspots: [3, 1, 0],
    pressure: [4, 2, 0],
    growth: [2, 3, 1],
  }[validIntent(value)];
}
export function intentOptions(language = "en") {
  return language === "hi"
    ? [
        {
          key: "self",
          icon: "◉",
          title: "खुद को बेहतर समझना है",
          question: "मैं ऐसे क्यों सोचता और जवाब देता हूँ?",
          description: "अपनी पसंद, खूबियों और ज़रूरतों को नाम दें।",
        },
        {
          key: "relationships",
          icon: "♡",
          title: "रिश्तों में बेहतर जुड़ना है",
          question: "बार-बार वही गलतफ़हमी क्यों होती है?",
          description: "बातचीत और फैसलों की अलग पसंद समझें।",
        },
        {
          key: "blindspots",
          icon: "✧",
          title: "कुछ छूट तो नहीं रहा?",
          question: "मेरी अच्छी नीयत का असर अलग क्यों होता है?",
          description: "अपने ढर्रे को एक नए नज़रिए से देखें।",
        },
        {
          key: "pressure",
          icon: "≈",
          title: "दबाव में खुद को समझना है",
          question: "मुश्किल परिस्थिति में मेरी गति क्यों बदलती है?",
          description: "देखें किस तरह का सहारा आपके लिए मददगार हो सकता है।",
        },
        {
          key: "growth",
          icon: "↗",
          title: "अपना अगला कदम खोजना है",
          question: "मैं कहाँ से सुधार की शुरुआत करूँ?",
          description: "छोटी, व्यावहारिक activities से शुरुआत करें।",
        },
      ]
    : [
        {
          key: "self",
          icon: "◉",
          title: "Understand myself",
          question: "Why do I think and respond this way?",
          description: "Put words to your preferences, strengths and needs.",
        },
        {
          key: "relationships",
          icon: "♡",
          title: "Connect better in relationships",
          question: "Why do we keep misunderstanding each other?",
          description: "Explore differences in communication and decisions.",
        },
        {
          key: "blindspots",
          icon: "✧",
          title: "Notice what I might miss",
          question: "Why do good intentions sometimes land differently?",
          description: "Look at familiar patterns from a new angle.",
        },
        {
          key: "pressure",
          icon: "≈",
          title: "Understand myself under pressure",
          question: "Why does my pace change when things get difficult?",
          description: "Explore what might help you feel supported.",
        },
        {
          key: "growth",
          icon: "↗",
          title: "Find my next step",
          question: "Where could I begin to improve?",
          description:
            "Turn a little self-understanding into a practical activity.",
        },
      ];
}
export function discoveryHomeMarkup({
  language = "en",
  draft = null,
  demoView = "map",
}) {
  const hi = language === "hi",
    done = draft?.answers.filter((a) => a !== null).length || 0;
  const startLabel = hi
    ? draft
      ? "टेस्ट जारी रखें"
      : "टेस्ट शुरू करें"
    : draft
      ? "Continue the test"
      : "Start the test";
  const start = `<button class="primary" data-action="${draft ? "resume" : "start"}">${startLabel}<span aria-hidden="true">→</span></button>`;
  const benefits = hi
    ? [
        [
          "खुद की गहरी समझ",
          "अपनी सोच, खूबियों और ज़रूरतों को एक नए नज़रिए से समझें।",
          [
            "आपकी पाँच पसंद का profile",
            "खूबियाँ और ध्यान देने योग्य बातें",
            "छोटे, व्यावहारिक अगले कदम",
          ],
          "self",
        ],
        [
          "रिश्तों में बेहतर समझ",
          "जानें कि बातचीत और फैसलों में आपकी पसंद किस तरह सामने आती है।",
          [
            "बातचीत के ढर्रे की झलक",
            "अलग ज़रूरतों को समझने के संकेत",
            "रिश्तों में आज़माने योग्य कदम",
          ],
          "relationships",
        ],
        [
          "काम में अपना तरीका पहचानें",
          "काम की योजना, फैसलों और अपनी गति के बारे में सोचने की शुरुआत करें।",
          [
            "योजना और लचीलेपन की पसंद",
            "फैसलों की प्राथमिकताएँ",
            "दबाव में अपनी गति की समझ",
          ],
          "growth",
        ],
      ]
    : [
        [
          "Deep self-awareness",
          "See the patterns behind your everyday choices—and the strengths and blind spots that come with them.",
          [
            "A detailed five-dimension profile",
            "Strengths and possible blind spots",
            "Practical steps for personal growth",
          ],
          "self",
        ],
        [
          "Better relationships",
          "Make space for different needs, communication styles and ways of seeing the world.",
          [
            "Insights into your communication style",
            "Different needs, explained simply",
            "Practical prompts for stronger connections",
          ],
          "relationships",
        ],
        [
          "Clarity for work and career",
          "Understand how you plan, decide and collaborate, so you can bring more intention to the way you work.",
          [
            "Structure and flexibility",
            "Your decision-making priorities",
            "Your pace under pressure",
          ],
          "growth",
        ],
      ];
  return `<div class="professional-home editorial-home" data-no-translate><section class="purpose-hero"><div class="purpose-copy"><p class="eyebrow">${hi ? "आपकी कहानी, आपके जवाबों से" : "A LITTLE SELF-KNOWLEDGE. A LITTLE MORE POSSIBILITY."}</p><h1>${hi ? "खुद को समझें।<br><span>अपनी संभावनाएँ पहचानें।</span>" : "Understand yourself.<br><span>Unlock your potential.</span>"}</h1><p class="purpose-lead">${hi ? "अपनी सोच, रिश्तों और काम करने के तरीके को बेहतर समझें।<br> 36 आसान सवाल। आपके जवाबों से बनी एक व्यक्तिगत रिपोर्ट।" : "Discover how you think, connect and work.<br> A personal reflection report, shaped by your 36 answers."}</p>${draft ? `<p class="purpose-resume">${hi ? `आपके 36 में से ${done} जवाब सेव हैं।` : `${done} of 36 answers saved. Pick up where you left off.`}</p>` : ""}<div class="purpose-cta-row">${start}</div><p class="purpose-reassurance">${hi ? "लगभग 6–9 मिनट · पूरी रिपोर्ट अभी मुफ़्त · कोई account ज़रूरी नहीं" : "About 6–9 minutes · Full report free for now · No account needed"}</p><button class="text-button" id="explore-preview">${hi ? "पहले रिपोर्ट की झलक देखें" : "See what you will discover"} <span aria-hidden="true">↓</span></button>${draft ? `<button class="text-button purpose-restart" data-action="new">${hi ? "फिर से शुरू करें" : "Start again"}</button>` : ""}</div><section class="discovery-feature-strip" aria-label="${hi ? "टेस्ट के बारे में" : "About the assessment"}"><div><strong>36</strong><span>${hi ? "आसान सवाल" : "thoughtful questions"}</span></div><div><strong>5</strong><span>${hi ? "पसंद के आयाम" : "personality dimensions"}</span></div><div><strong>6–9</strong><span>${hi ? "मिनट, अपनी गति से" : "minutes, at your own pace"}</span></div></section><div class="professional-landscape"><img class="editorial-people" src="assets/innerly-editorial-people.webp" alt="" width="2172" height="724" fetchpriority="high" decoding="async"></div></section>
 <div class="home-assurance"><span><i aria-hidden="true">✓</i>${hi ? "कोई सही या गलत जवाब नहीं" : "No right or wrong answers"}</span><span><i aria-hidden="true">✓</i>${hi ? "जवाब इस device में सेव होते हैं" : "Answers stay on your device"}</span><span><i aria-hidden="true">✓</i>${hi ? "सिर्फ़ एक label से बढ़कर" : "More than a personality label"}</span></div><section class="potential-section" id="benefits"><div class="home-section-heading"><p class="eyebrow">${hi ? "जानकारी जो ज़िंदगी से जुड़े" : "INSIGHT FOR EVERYDAY LIFE"}</p><h2>${hi ? "खुद को समझना, आगे बढ़ने की शुरुआत।" : "Unlock your potential, one insight at a time."}</h2><p>${hi ? "आपको क्या सहज लगता है, कहाँ मुश्किल होती है और आप क्या आज़मा सकते हैं—समझें आसान शब्दों में।" : "A clearer understanding of yourself. More thoughtful connections. A way of working that feels more like you."}</p></div><div class="potential-grid">${benefits.map((item, i) => `<article>${benefitIcon(i)}<h3>${item[0]}</h3><p>${item[1]}</p><ul>${item[2].map((text) => `<li>${text}</li>`).join("")}</ul><button class="text-button" data-start-intent="${item[3]}">${hi ? "यहाँ से शुरुआत करें" : "Explore this side of you"} <span aria-hidden="true">→</span></button></article>`).join("")}</div></section>
 ${relationshipSectionMarkup(language)}
 <section class="home-preview-stage" id="report-overview"><div class="home-preview-copy"><p class="eyebrow">${hi ? "आपकी रिपोर्ट में क्या मिलेगा" : "A LOOK INSIDE YOUR REPORT"}</p><h2>${hi ? "आपकी पसंद के पीछे<br>एक कहानी है।" : "A clearer picture.<br>A useful next step."}</h2><p>${hi ? "सिर्फ़ एक नाम या score नहीं। अपनी सोच की पूरी तस्वीर देखें और जानें कि आपके जवाब रोज़मर्रा की ज़िंदगी से कैसे जुड़ते हैं।" : "See your five dimensions together, explore each one and turn what resonates into a small, practical action."}</p><ul><li>${hi ? "हर score का स्पष्ट, आसान मतलब" : "Clear explanations for every score"}</li><li>${hi ? "चार इंटरैक्टिव नज़रिए और असली जवाबों का विवरण" : "Four interactive views and your actual answer breakdown"}</li><li>${hi ? "आपकी ज़रूरतों से जुड़ी छोटी activity plan" : "A small activity plan you can make your own"}</li></ul>${start}</div><section class="home-demo" id="home-report-preview" aria-label="${hi ? "उदाहरण रिपोर्ट की झलक" : "Example report preview"}"><div class="home-demo-heading"><span class="demo-brand">✳ innerly.</span><span class="example-badge">${hi ? "उदाहरण · आपके नतीजे नहीं" : "EXAMPLE · NOT YOUR RESULTS"}</span></div><div class="home-demo-tabs" role="group" aria-label="${hi ? "रिपोर्ट का एक नज़रिया चुनें" : "Explore an example view"}">${thinkingViews(
   language,
 )
   .map(
     (view) =>
       `<button data-home-view="${view.key}" aria-pressed="${view.key === demoView}"><span aria-hidden="true">${view.icon}</span>${{ map: hi ? "पूरी तस्वीर" : "Landscape", bar: hi ? "सहज पसंद" : "Preferences", pie: hi ? "पसंद का मेल" : "Connections", line: hi ? "आपकी यात्रा" : "Journey" }[view.key]}</button>`,
   )
   .join(
     "",
   )}</div><div id="home-demo-content">${homeDemoMarkup(demoView, language)}</div><p class="home-demo-note">${hi ? "यह उदाहरण है। आपके नतीजे आपके अपने 36 जवाबों से बनेंगे।" : "An illustrative preview. Your results will come from your own 36 answers."}</p></section></section>
 ${preferenceShowcaseMarkup(language)}
 <section class="social-discovery"><div class="home-section-heading"><p class="eyebrow">${hi ? "एक label से कहीं ज़्यादा" : "MORE THAN A PERSONALITY LABEL"}</p><h2>${hi ? "शांत पल या लोगों की रौनक?" : "Where do you find your energy?"}</h2><p>${hi ? "हर पसंद की अपनी खूबियाँ हैं। हमारी रिपोर्ट आपको पाँच निरंतर आयामों पर दिखाती है—किसी एक personality type में नहीं बाँधती।" : "Both can be part of who you are. Your report explores five continuous dimensions, rather than putting you into a fixed personality type."}</p></div><div class="social-example-controls" role="group" aria-label="${hi ? "सामाजिक ऊर्जा का उदाहरण देखें" : "Explore social energy examples"}"><button data-social-example="quiet" aria-pressed="true">${hi ? "अकेले रहकर ऊर्जा पाना" : "More introverted"}</button><button data-social-example="balanced" aria-pressed="false">${hi ? "दोनों का संतुलन" : "A little of both"}</button><button data-social-example="outgoing" aria-pressed="false">${hi ? "लोगों के साथ ऊर्जा पाना" : "More extraverted"}</button></div><div id="social-example-content" aria-live="polite">${socialExampleMarkup("quiet", language)}</div><p class="social-example-note">${hi ? "ये समझाने के लिए उदाहरण हैं, आपके results या लोगों की ranking नहीं।" : "Illustrative examples, not your results or a ranking of people."}</p></section>
 <section class="home-how" id="how-it-works"><div class="home-section-heading"><h2>${hi ? "कुछ आसान कदम, एक नई समझ।" : "A few simple steps. A fresh perspective."}</h2></div><ol><li><span>01</span><div><h3>${hi ? "खुलकर जवाब दें" : "Answer as yourself"}</h3><p>${hi ? "पाँच सवाल एक साथ। कोई सही या गलत जवाब नहीं।" : "Five questions at a time. No right or wrong answers."}</p></div></li><li><span>02</span><div><h3>${hi ? "अपनी तस्वीर देखें" : "Explore your pattern"}</h3><p>${hi ? "ग्राफ़, scores और रोज़मर्रा के संदर्भ समझें।" : "Discover your scores, interactive views and everyday insights."}</p></div></li><li><span>03</span><div><h3>${hi ? "अपना अगला कदम चुनें" : "Choose your next step"}</h3><p>${hi ? "छोटी activity plan बनाएँ और report PDF में सेव करें।" : "Build a small activity plan and save your report as a PDF."}</p></div></li></ol></section>
 <section class="home-faq"><h2>${hi ? "थोड़ा और जानना चाहते हैं?" : "A little more to know before you begin"}</h2><details><summary>${hi ? "यह टेस्ट कितना सटीक है?" : "How accurate is this test?"}</summary><p>${hi ? "यह खुद को समझने का अभ्यास है, clinically validated assessment नहीं। अभी accuracy percentage का दावा करने के लिए स्वतंत्र validation data उपलब्ध नहीं है। आपके scores आपके जवाबों का सार हैं; रिपोर्ट में देखें कि कौन-सी बात आपके अनुभव से मेल खाती है।" : "This is a self-reflection exercise, not a clinically validated assessment. We do not yet have independent validation data to claim an accuracy percentage. Scores summarise your answers; use the report to reflect on what fits your experience."}</p></details><details><summary>${hi ? "क्या यह मेरे रिश्ते या career का फैसला करेगा?" : "Will this decide my relationship or career path?"}</summary><p>${hi ? "रिपोर्ट बातचीत, फैसलों और काम की पसंद समझने के संकेत देती है। यह partner की compatibility, रिश्ते की परेशानी का पक्का कारण या career suitability का फैसला नहीं करती।" : "The report offers reflection prompts about communication, decisions and work preferences. It does not determine partner compatibility, a relationship’s cause of difficulty or career suitability."}</p></details><details><summary>${hi ? "क्या मैं बीच में रुक सकता हूँ?" : "Can I pause and return later?"}</summary><p>${hi ? "हाँ। जवाब इसी browser में सेव होते हैं। पाँच सवालों का group पूरा होने पर अगला group अपने आप खुलता है। पुराने जवाब भी बदल सकते हैं।" : "Yes. Answers are saved in this browser. The next group opens automatically when you complete five questions, and you can revisit earlier answers."}</p></details><details><summary>${hi ? "क्या भुगतान या email ज़रूरी है?" : "Do I need to pay or share my email?"}</summary><p>${hi ? "अभी summary और पूरी report मुफ़्त हैं। Account या email ज़रूरी नहीं। आपके जवाब और reports इस browser में सेव होते हैं।" : "Your summary and full report are free for now. No account or email is required. Your answers and saved reports stay in this browser."}</p></details></section>
 <section class="home-final-cta illustrated-cta"><div class="illustrated-cta-copy"><p class="eyebrow">${hi ? "कुछ मिनट, सिर्फ़ आपके लिए" : "YOUR NEXT CHAPTER STARTS WITH YOU"}</p><h2>${hi ? "खुद के बारे में<br>कुछ नया जानने को तैयार?" : "What could a little<br>self-knowledge change?"}</h2><p>${hi ? "अपनी खूबियों को पहचानें। अपनी ज़रूरतों को समझें। आगे बढ़ने के लिए एक छोटा कदम चुनें।" : "Discover your strengths. Understand what you need. Find a small next step that feels right for you."}</p>${start}<small>${hi ? "36 सवाल · लगभग 6–9 मिनट · अभी मुफ़्त" : "36 questions · About 6–9 minutes · Free for now"}</small></div><img src="assets/innerly-editorial-people.webp" width="2172" height="724" alt="" loading="lazy" decoding="async"></section>${sampleTestimonialsMarkup(language)}</div>`;
}
export function socialExampleMarkup(key, language = "en") {
  const hi = language === "hi",
    out = key === "outgoing";
  if (key === "balanced")
    return `<div class="social-spectrum" aria-hidden="true"><span>${hi ? "शांत माहौल" : "Quiet reflection"}</span><div><i style="left:50%"></i></div><span>${hi ? "लोगों से जुड़ाव" : "Social connection"}</span></div><div class="social-example-story"><span class="social-story-icon" aria-hidden="true">◒</span><div><h3>${hi ? "अपने लिए सही संतुलन" : "Finding your own balance"}</h3><p>${hi ? "कभी लोगों के साथ बातचीत से ऊर्जा मिलती है, तो कभी अकेले समय से। परिस्थिति और ज़रूरत बदलने पर आपकी पसंद भी बदल सकती है। आपकी रिपोर्ट इन ढर्रों पर सोचने में मदद करती है।" : "Some days, conversation brings you energy. On others, a quiet evening feels right. Your preferences can shift with the situation and what you need. Your report helps you reflect on those patterns without forcing you into a box."}</p></div></div>`;
  return `<div class="social-spectrum" aria-hidden="true"><span>${hi ? "शांत माहौल" : "Quiet reflection"}</span><div><i style="left:${out ? 78 : 22}%"></i></div><span>${hi ? "लोगों से जुड़ाव" : "Social connection"}</span></div><div class="social-example-story"><span class="social-story-icon" aria-hidden="true">${out ? "☀" : "☽"}</span><div><h3>${out ? (hi ? "जुड़कर ऊर्जा महसूस करना" : "Finding energy through connection") : hi ? "सुकून में खुद से जुड़ना" : "Making space to recharge"}</h3><p>${out ? (hi ? "समूह में बातचीत से आपको नई ऊर्जा मिल सकती है। आपकी report समझने में मदद करेगी कि साथ में सोचना कहाँ उपयोगी है और कब दूसरों को सोचने का समय देना मददगार हो सकता है।" : "Conversation may help you feel energised and think things through. Your report can help you reflect on when to share ideas and when to leave space for others to process.") : hi ? "शांत माहौल या एक-दो लोगों से गहरी बातचीत आपको सहज लग सकती है। आपकी report समझने में मदद करेगी कि अपनी ऊर्जा का ख्याल रखते हुए दूसरों को अपनी ज़रूरतें कैसे बताएँ।" : "Quiet time or a deeper one-to-one conversation may feel more natural. Your report can help you reflect on how to respect that energy and communicate what you need."}</p></div></div>`;
}
export function homeDemoMarkup(key, language = "en") {
  const hi = language === "hi",
    view =
      thinkingViews(language).find((v) => v.key === key) ||
      thinkingViews(language)[0],
    scores = [32, 76, 68, 43, 61];
  let visual = "";
  if (view.key === "map") {
    const point = (i, n) => [
      180 + Math.cos(-Math.PI / 2 + (i * Math.PI * 2) / 5) * 80 * n,
      113 + Math.sin(-Math.PI / 2 + (i * Math.PI * 2) / 5) * 80 * n,
    ];
    visual = `<svg viewBox="0 0 360 230" role="img" aria-label="${hi ? "उदाहरण preference landscape" : "Example preference landscape"}">${[0.25, 0.5, 0.75, 1].map((n) => `<polygon points="${scores.map((_, i) => point(i, n).join(",")).join(" ")}" fill="none" stroke="#dce4f3"/>`).join("")}<polygon points="${scores.map((n, i) => point(i, n / 100).join(",")).join(" ")}" fill="#7e98d444" stroke="#6c88c3" stroke-width="2"/>${traits
      .map((t, i) => {
        const p = point(i, scores[i] / 100),
          label = point(i, 1.28);
        return `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${t.color}"/><text x="${label[0]}" y="${label[1]}" font-size="11" text-anchor="middle" dominant-baseline="middle" fill="#61718e">${esc(t.short)}</text>`;
      })
      .join("")}</svg>`;
  }
  if (view.key === "bar")
    visual = `<div class="home-sample-paths">${traits.map((t, i) => `<div><p><span>${esc(t.name)}</span><strong>${scores[i]}</strong></p><div><span style="left:${scores[i]}%;background:${t.color}"></span></div></div>`).join("")}</div>`;
  if (view.key === "pie")
    visual = `<div class="home-sample-connection"><svg viewBox="0 0 330 220" role="img" aria-label="${hi ? "दो scores के मेल का उदाहरण" : "Example pairing of two scores"}"><rect x="75" y="20" width="180" height="180" rx="12" fill="#f0f4fc"/>${[0, 50, 100].map((n) => `<path d="M${75 + n * 1.8} 20v180M75 ${200 - n * 1.8}h180" stroke="#d4dfee" stroke-dasharray="4 4"/>`).join("")}<path d="M75 77.6h57.6V200" fill="none" stroke="#8fa5cc" stroke-dasharray="4 4"/><circle cx="132.6" cy="77.6" r="17" fill="#617fc324"/><circle cx="132.6" cy="77.6" r="7" fill="#617fc3" stroke="white" stroke-width="3"/></svg><p>${esc(traits[0].name)} <strong>32</strong> · ${esc(traits[2].name)} <strong>68</strong></p></div>`;
  if (view.key === "line")
    visual = `<div class="home-sample-journey"><svg viewBox="0 0 360 220" role="img" aria-label="${hi ? "तीन saved reflections की यात्रा का उदाहरण" : "Illustration of three saved reflection snapshots"}"><path d="M25 50H335M25 110H335M25 170H335" stroke="#dce4f1" stroke-dasharray="4 4"/><path d="M45 135L180 94 315 112" fill="none" stroke="#8ba2d0" stroke-width="3"/>${[
      [45, 135],
      [180, 94],
      [315, 112],
    ]
      .map(
        ([x, y], i) =>
          `<circle cx="${x}" cy="${y}" r="8" fill="#647fc0" stroke="#fff" stroke-width="3"/><text x="${x}" y="202" text-anchor="middle" font-size="12" fill="#61718e">${hi ? "झलक" : "Snapshot"} ${i + 1}</text>`,
      )
      .join("")}</svg></div>`;
  return `<div class="home-sample-view" data-no-translate><h2>${view.title}</h2><p>${view.prompt}</p><div class="home-sample-visual">${visual}</div><div class="home-example-insight"><span aria-hidden="true">✧</span><p>${{ map: hi ? "आपकी पसंद की पूरी झलक—हर point के पीछे एक कहानी।" : "Your whole pattern, with a story behind every point.", bar: hi ? "हर score के दोनों सिरे समझें; कम या ज़्यादा होना बेहतर नहीं है।" : "Read both ends of each score. A lower or higher position is not better.", pie: hi ? "अलग पसंद एक साथ हो सकती हैं। अपने लिए कोई भी दो आयाम चुनें।" : "Different preferences can coexist. Explore any two dimensions together.", line: hi ? "उदाहरण में तीन झलक हैं। आपकी यात्रा में केवल आपके असली saved tests आएँगे।" : "This example shows three snapshots. Your own journey uses only your actual saved assessments." }[view.key]}</p></div></div>`;
}
export function intentReportMarkup(report, language = "en") {
  if (!discoveryIntents.includes(report.intent)) return "";
  const hi = language === "hi",
    intent = intentOptions(language).find((i) => i.key === report.intent);
  return `<section class="report-intent-focus report-panel" data-no-translate><p class="eyebrow">${hi ? "आपकी शुरुआत की वजह" : "WHAT BROUGHT YOU HERE"}</p><h2>${intent.title}</h2><p>${report.intent === "relationships" ? (hi ? "इन तीन पहलुओं से शुरुआत करें। ये अलग ज़रूरतों या गलतफ़हमी पर सोचने के possible संकेत हैं; किसी रिश्ते का पक्का कारण या partner का assessment नहीं।" : "Start with these three dimensions. They can offer possible conversation starters about different needs or misunderstandings; they do not identify a relationship’s cause or assess your partner.") : hi ? "अपनी वजह को ध्यान में रखते हुए इन पहलुओं को explore करें। आपकी चुनी वजह scores नहीं बदलती।" : "Explore these dimensions with your own question in mind. Your starting point does not change your scores."}</p><div>${intentDimensions(
    report.intent,
  )
    .map(
      (i) =>
        `<button data-category="${i}"><span>${esc(traits[i].name)} · ${report.scores[i]} / 100</span><strong>${esc(traits[i].profiles[band(report.scores[i])].title)}</strong><span aria-hidden="true">→</span></button>`,
    )
    .join("")}</div></section>`;
}
