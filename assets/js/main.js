/* main.js — точка входа: подключает все модули. Загружается как <script type="module" defer>. */

import { initMenu } from './menu.js';
import { initAnimations } from './animations.js';
import { initAccordion } from './accordion.js';
import { initSliders } from './slider.js';
import { initForms } from './forms.js';
import { initAnalytics, track } from './analytics.js';
import { initCookieBanner } from './cookie-banner.js';

// Единая глобальная шина событий для аналитики (используют другие модули)
window.SeoAnalytics = { track };

function boot() {
  initMenu();
  initAnimations();
  initAccordion();
  initSliders();
  initForms();
  initCookieBanner();
  initAnalytics();
  initStickyCta();
  initCaseFilters();
}

/* ---------- Sticky CTA на мобильных ---------- */
function initStickyCta() {
  const cta = document.querySelector('.sticky-cta');
  if (!cta) return;
  const hero = document.querySelector('.hero, .page-hero');
  if (!hero) { cta.classList.add('is-active'); return; }
  const io = new IntersectionObserver(([en]) => {
    cta.classList.toggle('is-active', !en.isIntersecting);
  }, { threshold: 0 });
  io.observe(hero);
}

/* ---------- Фильтры кейсов (без перезагрузки) ---------- */
function initCaseFilters() {
  const bar = document.querySelector('[data-case-filters]');
  const grid = document.querySelector('[data-case-grid]');
  if (!bar || !grid) return;

  const buttons = bar.querySelectorAll('[data-filter]');
  const items = grid.querySelectorAll('[data-category]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      const f = btn.dataset.filter;
      let shown = 0;
      items.forEach((item) => {
        const match = f === 'all' || item.dataset.category.split(' ').includes(f);
        item.hidden = !match;
        if (match) shown++;
      });
      const empty = grid.parentElement.querySelector('[data-cases-empty]');
      if (empty) empty.hidden = shown > 0;
      if (window.SeoAnalytics) track('cases_filter', { filter: f });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
