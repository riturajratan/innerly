const center = [452, 397];
const blue = '#4a71b4';
const lilac = '#8064b7';
const radii = [29, 52, 76, 101];
const incomingHeights = [124, 211, 299, 389, 479, 574];
const outgoingHeights = [35, 102, 174, 248, 326, 406, 489, 574, 660];
const ringFor = index => radii[index % radii.length];
const ringColor = index => index % 2 === 0 ? blue : lilac;
const incomingEnd = .33;
const ringExit = .55;
const turn = Math.PI * 2;
// Guide points for the light. The image mask keeps the glow on the original contour.
const profile = [
  [286, 905], [310, 821], [331, 749], [321, 663], [271, 586],
  [234, 516], [224, 448], [238, 369], [276, 302], [329, 253],
  [402, 222], [466, 214], [536, 224], [600, 253], [652, 303],
  [685, 360], [701, 423], [703, 459], [725, 493], [766, 548],
  [754, 566], [732, 576], [733, 594], [739, 609], [723, 623],
  [734, 640], [721, 658], [719, 691], [713, 714], [685, 730],
  [635, 729], [593, 732], [561, 751], [539, 799], [527, 855], [524, 905]
];
const profileSegments = [];
let profileLength = 0;
for (let index = 1; index < profile.length; index++) {
  const start = profile[index - 1];
  const end = profile[index];
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
  profileSegments.push({start, end, length, from: profileLength});
  profileLength += length;
}

function outlineMask(image) {
  const mask = document.createElement('canvas');
  mask.width = image.naturalWidth;
  mask.height = image.naturalHeight;
  const ctx = mask.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, mask.width, mask.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const ink = Math.max(0, Math.min(1, (180 - pixels.data[i]) / 145));
    pixels.data[i + 3] = ink * 255;
  }
  ctx.putImageData(pixels, 0, 0);
  return mask;
}

function ringPoint(radius, angle) {
  return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
}

function curvePoint([start, first, second, end], t) {
  const u = 1 - t;
  return [0, 1].map(axis =>
    u ** 3 * start[axis] + 3 * u ** 2 * t * first[axis]
    + 3 * u * t ** 2 * second[axis] + t ** 3 * end[axis]
  );
}

export function mountThoughtWaves(figure, {pagePaused = false, strongerStrokes = false} = {}) {
  const canvas = figure?.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!context) return null;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController();
  const image = figure.querySelector('img');
  const light = document.createElement('canvas');
  const lightSize = 192;
  light.width = light.height = lightSize;
  const lightContext = light.getContext('2d');
  let mask = null;
  const labels = new Map([...figure.querySelectorAll('[data-strand]')].map(label => [
    Number(label.dataset.strand), {label, position: Number(label.dataset.position)}
  ]));
  let visible = false;
  let frame = 0;
  let elapsed = 0;
  let lastFrame = null;

  function drawProfileLight(time) {
    if (!mask || !lightContext) return;
    const progress = (time / 10500 + .42) % 1;
    const distance = progress * profileLength;
    const segment = profileSegments.find(({from, length}) => distance < from + length);
    const fraction = (distance - segment.from) / segment.length;
    const x = segment.start[0] + (segment.end[0] - segment.start[0]) * fraction;
    const y = segment.start[1] + (segment.end[1] - segment.start[1]) * fraction;
    const half = lightSize / 2;
    const gradient = lightContext.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, '#b9d8ff');
    gradient.addColorStop(.28, '#858ee0');
    gradient.addColorStop(1, '#858ee000');
    lightContext.globalCompositeOperation = 'source-over';
    lightContext.clearRect(0, 0, lightSize, lightSize);
    lightContext.drawImage(mask, half - x, half - y);
    lightContext.globalCompositeOperation = 'source-in';
    lightContext.fillStyle = gradient;
    lightContext.fillRect(0, 0, lightSize, lightSize);

    context.save();
    context.globalAlpha = Math.min(1, Math.sin(progress * Math.PI) * 3);
    context.shadowColor = '#749beec0';
    context.shadowBlur = 9;
    context.drawImage(light, x - half, y - half);
    context.restore();
  }

  function drawWave(pointAt, color, labelIndex) {
    context.globalAlpha = strongerStrokes ? .46 : .34;
    context.strokeStyle = color;
    context.lineWidth = strongerStrokes ? 2.15 : 1.9;
    context.beginPath();
    context.moveTo(...pointAt(0));
    for (let step = 1; step <= 80; step++) {
      context.lineTo(...pointAt(step / 80));
    }
    context.stroke();

    const caption = labels.get(labelIndex);
    if (caption) {
      const [x, y] = pointAt(caption.position);
      caption.label.style.setProperty('--x', `${x / canvas.width * 100}%`);
      caption.label.style.setProperty('--y', `${y / canvas.height * 100}%`);
    }
  }

  function drawScene(time, animate) {
    const [x, y] = center;
    const incoming = incomingHeights.map((height, index) => {
      const entryAngle = Math.PI + (.5 - index / (incomingHeights.length - 1)) * 1.18;
      const end = ringPoint(ringFor(index), entryAngle);
      const curve = [
        [-24, height], [152, height + Math.sin(time / 1900 + index) * 16],
        [end[0] - 92, end[1] + (height - end[1]) * .22 + Math.sin(time / 2300 + index) * 12], end
      ];
      return {curve, entryAngle};
    });
    const outgoing = outgoingHeights.map((height, index) => {
      const ring = ringFor(index);
      const exitAngle = (index - 4) * .15;
      const start = ringPoint(ring, exitAngle);
      const curve = [start, [start[0] + 215, start[1] + (height - y) * .22], [1120, height + 20], [1560, height]];
      const progress = (time / (7100 + (index % 4) * 450) + index / outgoingHeights.length) % 1;
      const pulse = (progress - ringExit) / (1 - ringExit);
      function pointAt(t) {
        const [waveX, waveY] = curvePoint(curve, t);
        // The ripple travels away from the ring. Its amplitude is zero at the attachment point.
        const distance = t - pulse;
        const ripple = animate && pulse >= 0
          ? Math.exp(-((distance / .17) ** 2)) * Math.sin(distance * 24) * Math.sin(Math.PI * t) * 17
          : 0;
        return [waveX, waveY + ripple];
      }
      return {pointAt, ring, exitAngle, progress};
    });

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    const glow = context.createRadialGradient(x, y, 0, x, y, radii.at(-1) + 10);
    glow.addColorStop(0, '#d8d9ffbb');
    glow.addColorStop(.55, '#dce8fb65');
    glow.addColorStop(1, '#dce8fb00');
    context.fillStyle = glow;
    context.fillRect(x - 112, y - 112, 224, 224);
    incoming.forEach(({curve}, index) => drawWave(t => curvePoint(curve, t), ringColor(index), index));
    outgoing.forEach(({pointAt}, index) => drawWave(pointAt, ringColor(index), incoming.length + index));

    for (const [index, radius] of radii.entries()) {
      context.globalAlpha = strongerStrokes ? .63 : .48;
      context.strokeStyle = ringColor(index);
      context.lineWidth = strongerStrokes ? 2.65 : 2.3;
      context.beginPath();
      context.arc(x, y, radius, 0, turn);
      context.stroke();

      // The small rings sit on the four larger rings and drift with the thought flow.
      for (const side of [0, Math.PI]) {
        const angle = index * 1.17 - .9 + side + time / (1700 + index * 500);
        const [orbitX, orbitY] = ringPoint(radius, angle);
        context.globalAlpha = .72;
        context.lineWidth = 1.65;
        context.beginPath();
        context.arc(orbitX, orbitY, 4 + index * .65, 0, turn);
        context.stroke();
      }
    }

    if (animate) {
      outgoing.forEach(({pointAt, ring, exitAngle, progress}, index) => {
        const {curve: incomingCurve, entryAngle} = incoming[index < incoming.length ? index : index - radii.length];
        const ringEndAngle = index % 2 === 0 ? exitAngle : exitAngle + Math.PI * 2;
        const route = position => {
          if (position < incomingEnd) return curvePoint(incomingCurve, position / incomingEnd);
          if (position < ringExit) {
            const turn = (position - incomingEnd) / (ringExit - incomingEnd);
            return ringPoint(ring, entryAngle + (ringEndAngle - entryAngle) * turn);
          }
          return pointAt((position - ringExit) / (1 - ringExit));
        };
        const tail = Math.max(0, progress - .06);
        context.globalAlpha = .76 * Math.sin(progress * Math.PI);
        context.strokeStyle = ringColor(index);
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(...route(tail));
        for (let step = 1; step <= 14; step++) {
          context.lineTo(...route(tail + (progress - tail) * step / 14));
        }
        context.stroke();
        if (progress >= incomingEnd && progress <= ringExit) {
          const activity = (progress - incomingEnd) / (ringExit - incomingEnd);
          const angle = entryAngle + (ringEndAngle - entryAngle) * activity;
          const direction = Math.sign(ringEndAngle - entryAngle);
          context.save();
          context.strokeStyle = ringColor(index);
          context.shadowColor = ringColor(index);
          context.shadowBlur = 13;
          context.globalAlpha = .85 * Math.sin(activity * Math.PI);
          context.lineWidth = 4.2;
          context.beginPath();
          context.arc(x, y, ring, angle - direction * .42, angle, direction < 0);
          context.stroke();
          context.restore();

          context.beginPath();
          context.fillStyle = ringColor(index);
          context.arc(...route(progress), 4, 0, turn);
          context.fill();
        }
      });
    }
    context.globalAlpha = 1;
    if (animate) drawProfileLight(time);
  }

  function draw(time) {
    if (lastFrame !== null) elapsed += time - lastFrame;
    lastFrame = time;
    drawScene(elapsed, true);
    frame = requestAnimationFrame(draw);
  }

  function updateMotion() {
    cancelAnimationFrame(frame);
    lastFrame = null;
    drawScene(reducedMotion.matches ? 0 : elapsed, !reducedMotion.matches);
    if (!pagePaused && !reducedMotion.matches && !document.hidden && visible) {
      frame = requestAnimationFrame(draw);
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateMotion();
  });
  observer.observe(figure);

  const options = {signal: listeners.signal};
  function prepareOutline() {
    if (image.naturalWidth) mask = outlineMask(image);
  }
  if (image.complete) prepareOutline();
  else image.addEventListener('load', prepareOutline, options);
  reducedMotion.addEventListener('change', updateMotion, options);
  document.addEventListener('visibilitychange', updateMotion, options);
  updateMotion();

  return {
    setPagePaused(value) {
      pagePaused = value;
      updateMotion();
    },
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      listeners.abort();
    }
  };
}
