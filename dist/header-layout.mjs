// Keep stacked sticky content below the real header, including wrapped nav,
// translated labels, font loading and the larger-text setting.
const header = document.querySelector('.innerly-header');
if (header) {
  const measure = () => document.documentElement.style.setProperty('--site-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
  measure();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(measure).observe(header);
  else window.addEventListener('resize', measure);
}
