import { storyHomeMarkup } from './story-home.mjs?v=story-3';
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
export function discoveryHomeMarkup(options = {}) {
  return storyHomeMarkup(options);
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
