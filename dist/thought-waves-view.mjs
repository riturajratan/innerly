const labels = [
  [1, .49, 12, 25, 'Memories', 'यादें'],
  [4, .39, 10, 44, 'Overthinking', 'बहुत ज़्यादा सोचना', 'rose'],
  [5, .34, 10, 53, 'Stress', 'तनाव'],
  [7, .76, 80, 12, 'Feelings', 'भावनाएँ'],
  [8, .57, 65, 21, 'Focus', 'ध्यान'],
  [9, .88, 90, 25, 'Work', 'काम'],
  [10, .66, 73, 32, 'Relationships', 'रिश्ते', 'teal'],
  [12, .61, 69, 45, 'Decisions', 'फ़ैसले', 'amber'],
  [13, .77, 81, 54, 'Hopes', 'उम्मीदें'],
  [14, .65, 73, 60, 'Rest', 'आराम']
];

export function thoughtWavesMarkup(language, headingId) {
  const hi = language === 'hi';
  const alt = hi
    ? 'एक चेहरे की रूपरेखा, जिसमें विचारों की लहरें गोल घेरों से होकर गुज़रती हैं।'
    : 'A side profile with thoughts flowing through rings and back out.';
  return `<figure class="thought-visual" data-thought-waves aria-labelledby="${headingId}">
    <div class="thought-art">
      <img src="assets/planning-profile.webp" width="1536" height="1024" alt="${alt}">
      <canvas class="thought-motion" width="1536" height="1024" aria-hidden="true"></canvas>
      <ul class="thought-labels" aria-label="${hi ? 'विचारों के उदाहरण' : 'Examples of thoughts'}">
        ${labels.map(([strand, position, x, y, en, hindi, accent]) => `<li data-strand="${strand}" data-position="${position}"${accent ? ` data-accent="${accent}"` : ''} style="--x:${x}%;--y:${y}%">${hi ? hindi : en}</li>`).join('')}
      </ul>
    </div>
  </figure>`;
}
