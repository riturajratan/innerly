export function avatarExpression(value) {
  const amount = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) / 100 : .5;
  return { tilt: (amount - .5) * 12, gaze: (amount - .5) * 6,
    brow: Math.sin(amount * Math.PI) * -3, smile: .55 + amount * .45 };
}

export function avatarStyle(value) {
  const expression = avatarExpression(value);
  return `--face-tilt:${expression.tilt}deg;--face-gaze:${expression.gaze}px;--face-brow:${expression.brow}px;--face-smile:${expression.smile}`;
}

export function expressiveAvatarMarkup(person, value, language = 'en') {
  const female = person === 1, hi = language === 'hi';
  const hair = female ? '#334858' : '#293b49', skin = female ? '#d7a887' : '#c99877';
  return `<figure class="expressive-avatar expressive-avatar-${person}" data-avatar="${person}" style="${avatarStyle(value)}"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="73" fill="${female ? '#f7f1e8' : '#edf5fa'}"/><path d="M25 158Q28 115 66 119H94Q132 115 135 158" fill="${female ? '#918ba9' : '#4d7c99'}"/><path d="M68 106V124Q80 137 92 124V106" fill="${skin}"/><g class="avatar-head">${female ? `<path d="M43 114C26 100 33 42 49 30C70 13 107 22 120 44C127 69 125 97 117 117L97 112H58Z" fill="${hair}"/>` : ''}<ellipse cx="46" cy="79" rx="7" ry="11" fill="${skin}"/><ellipse cx="114" cy="79" rx="7" ry="11" fill="${skin}"/><path d="M48 57Q49 30 80 31Q111 30 112 57V82Q111 112 80 119Q49 112 48 82Z" fill="${skin}"/>${female ? `<path d="M44 65Q32 32 60 24Q90 13 111 34Q124 46 114 68Q101 57 98 41Q80 61 47 62Z" fill="${hair}"/>` : `<path d="M45 64Q34 49 43 34Q41 22 56 23Q65 9 80 22Q95 11 106 25Q123 24 121 40Q130 55 113 66L109 48Q85 58 60 45L49 64Z" fill="${hair}"/>`}<g class="avatar-brows" fill="none" stroke="${hair}" stroke-width="3.5" stroke-linecap="round"><path d="M57 67Q64 63 71 66"/><path d="M90 66Q97 63 104 67"/></g><g class="avatar-eyes"><ellipse cx="64" cy="77" rx="6.5" ry="5" fill="#fff9f1"/><ellipse cx="97" cy="77" rx="6.5" ry="5" fill="#fff9f1"/><g class="avatar-gaze" fill="#253b4b"><circle cx="64" cy="77" r="3.4"/><circle cx="97" cy="77" r="3.4"/></g></g><path d="M81 78L78 88H84" fill="none" stroke="#ac7d60" stroke-width="2" stroke-linecap="round"/><path class="avatar-smile" vector-effect="non-scaling-stroke" d="M66 96Q80 108 95 96" fill="none" stroke="#80584c" stroke-width="3" stroke-linecap="round"/>${female ? '<circle cx="47" cy="88" r="3" fill="#c5a253"/><circle cx="114" cy="88" r="3" fill="#c5a253"/>' : '<path d="M52 94Q53 116 80 121Q105 116 109 94Q101 110 80 112Q61 109 52 94" fill="#394750" opacity=".35"/>'}</g></svg><figcaption>${hi ? 'व्यक्ति' : 'Person'} ${person ? 'B' : 'A'}<span data-avatar-caption="${person}"></span></figcaption></figure>`;
}
