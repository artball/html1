/* slider.js — слайдер на чистом JS: кнопки, точки, свайп, автопрокрутка, доступность. */

export function initSliders(root = document) {
  root.querySelectorAll('.slider[data-slider]').forEach(createSlider);
}

function createSlider(el) {
  const track = el.querySelector('.slider-track');
  const slides = [...track.children];
  if (!track || slides.length < 2) return;

  const prevBtn = el.querySelector('[data-slider-prev]');
  const nextBtn = el.querySelector('[data-slider-next]');
  const dotsWrap = el.querySelector('.slider-dots');
  const perViewAttr = parseInt(el.dataset.perView || '1', 10);
  const autoplay = parseInt(el.dataset.autoplay || '0', 10) * 1000;

  let index = 0;
  let timer = null;

  const perView = () => (window.matchMedia('(min-width: 900px)').matches ? perViewAttr : 1);
  const maxIndex = () => Math.max(0, slides.length - perView());

  // Точки
  let dots = [];
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    dots = [];
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.className = 'slider-dot';
      b.type = 'button';
      b.setAttribute('aria-label', `Слайд ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsWrap.appendChild(b);
      dots.push(b);
    }
  }

  function render() {
    const w = track.parentElement.clientWidth / perView();
    track.style.transform = `translateX(${-index * w}px)`;
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex();
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    slides.forEach((s, i) => s.setAttribute('aria-hidden', String(Math.abs(i - index) >= perView())));
  }

  function go(i) {
    index = Math.min(Math.max(0, i), maxIndex());
    render();
    restart();
  }
  const next = () => go(index >= maxIndex() ? 0 : index + 1);
  const prev = () => go(index <= 0 ? maxIndex() : index - 1);

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Клавиатура
  el.setAttribute('tabindex', '0');
  el.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // Свайп
  let startX = null;
  el.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
    startX = null;
  }, { passive: true });

  // Автопрокрутка (пауза при ховере/фокусе)
  function restart() {
    if (!autoplay) return;
    clearInterval(timer);
    if (!el.matches(':hover') && !el.contains(document.activeElement)) {
      timer = setInterval(next, autoplay);
    }
  }
  el.addEventListener('mouseenter', () => clearInterval(timer));
  el.addEventListener('mouseleave', restart);
  el.addEventListener('focusin', () => clearInterval(timer));
  el.addEventListener('focusout', restart);

  // Resize
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { buildDots(); render(); }, 150);
  });

  buildDots();
  render();
  restart();
}
