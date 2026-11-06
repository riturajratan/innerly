import {expressiveAvatarMarkup} from './expressive-avatars.mjs?v=conversation-1';

export function conversationMoment(value, language = 'en') {
  const position = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 50;
  const hi = language === 'hi', phase = position < 34 ? 'tense' : position > 66 ? 'warm' : 'neutral';
  const copy = hi ? {
    tense: ['थोड़ी नाराज़गी', 'एक पल रुकें। दोनों को अपनी बात कहने की जगह मिल सकती है।', 'मुझे थोड़ा समय चाहिए।'],
    neutral: ['सुनने की शुरुआत', 'अपनी बात रखने के साथ, दूसरे की ज़रूरत भी सुनें।', 'तुम्हारे लिए क्या ज़रूरी है?'],
    warm: ['एक-दूसरे को समझना', 'बात समझ आने पर, मिलकर एक छोटा अगला कदम चुन सकते हैं।', 'अब मैं तुम्हारी बात समझ रहा हूँ।'],
  } : {
    tense: ['A tense moment', 'A little pause can leave room for both people to be heard.', 'I need a moment.'],
    neutral: ['Making room to listen', 'Share what matters to you, and leave space for the other perspective.', 'What matters to you?'],
    warm: ['Finding common ground', 'Understanding can open a conversation about a small next step together.', 'I see what you mean.'],
  };
  const smile = (position - 50) / 50;
  return {position, phase, title: copy[phase][0], text: copy[phase][1], bubble: copy[phase][2],
    smile: Math.abs(smile) < .025 ? .025 : smile,
    brow: Math.max(0, (50 - position) / 50) * 16,
    tilt: (position - 50) / 50 * 5,
    gaze: (position - 50) / 50 * 3,
    eyes: .78 + position / 100 * .22};
}
function faceStyle(moment, person) {
  const direction = person ? -1 : 1;
  return `--face-tilt:${moment.tilt * direction}deg;--face-gaze:${moment.gaze * direction}px;--face-smile:${moment.smile};--face-brow:0px;--conversation-brow:${moment.brow}deg;--conversation-eyes:${moment.eyes}`;
}

export function conversationSceneMarkup(language = 'en') {
  const hi = language === 'hi', moment = conversationMoment(15, language);
  return `<div class="conversation-demo" data-conversation-demo data-conversation-phase="${moment.phase}"><p class="conversation-kicker">${hi ? 'एक बातचीत की काल्पनिक झलक' : 'AN ILLUSTRATED CONVERSATION'}</p><div class="conversation-bubble" data-conversation-bubble>${moment.bubble}</div><div class="conversation-pair">${[0, 1].map(person => expressiveAvatarMarkup(person, 50, language).replace(/style="[^"]*"/, `style="${faceStyle(moment, person)}"`)).join('')}<span class="conversation-bridge" aria-hidden="true">↔</span></div><label class="conversation-slider-label" for="conversation-tone">${hi ? 'Slider से बातचीत का माहौल बदलकर देखें' : 'Move the slider. Change the moment.'}</label><input id="conversation-tone" data-conversation-tone type="range" min="0" max="100" value="15" aria-label="${hi ? 'काल्पनिक बातचीत: नाराज़गी से समझ तक' : 'Illustrated conversation: tension to understanding'}"><div class="conversation-endpoints"><span>${hi ? 'नाराज़' : 'Tense'}</span><span>${hi ? 'Neutral' : 'Neutral'}</span><span>${hi ? 'Friendly' : 'Friendly'}</span></div><div class="conversation-takeaway" role="status"><strong data-conversation-title>${moment.title}</strong><p data-conversation-text>${moment.text}</p></div></div>`;
}

export function bindConversationDemo(root, language = 'en') {
  if (!root) return;
  const slider = root.querySelector('[data-conversation-tone]');
  slider.addEventListener('input', () => {
    const moment = conversationMoment(Number(slider.value), language);
    root.dataset.conversationPhase = moment.phase;
    root.querySelectorAll('[data-avatar]').forEach((avatar, person) => avatar.setAttribute('style', faceStyle(moment, person)));
    root.querySelector('[data-conversation-title]').textContent = moment.title;
    root.querySelector('[data-conversation-text]').textContent = moment.text;
    root.querySelector('[data-conversation-bubble]').textContent = moment.bubble;
  });
}
