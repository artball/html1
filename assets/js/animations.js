/* animations.js — scroll-reveal (IntersectionObserver), счётчики цифр, прогресс-бары. */

export function initAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal при скролле ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------- Счётчики ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.counter);
      const decimals = (el.dataset.counter.split('.')[1] || '').length;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = reduced ? 0 : 1600;
      const start = performance.now();
      const fmt = (v) => prefix + v.toLocaleString('ru-RU', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }) + suffix;
      if (!dur) { el.textContent = fmt(target); return; }
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window) || reduced) {
      counters.forEach(animate);
    } else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { animate(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------- Прогресс-бары (скиллы) ---------- */
  const bars = document.querySelectorAll('.progress-mini > span[data-width]');
  if (bars.length) {
    const setBar = (el) => { el.style.width = el.dataset.width + '%'; };
    if (!('IntersectionObserver' in window) || reduced) {
      bars.forEach(setBar);
    } else {
      const bio = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { setBar(en.target); bio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      bars.forEach((el) => { el.style.width = '0%'; bio.observe(el); });
    }
  }
}
