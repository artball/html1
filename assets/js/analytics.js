/* analytics.js — GA4 + Яндекс.Метрика, загрузка ТОЛЬКО после согласия cookie,
   единый API window.SeoAnalytics.track(name, params), события dataLayer и ym().
   Отслеживание: клики CTA, телефон, мессенджеры, скролл 25/50/75/100%, время на странице. */

const MEASUREMENT_ID = 'G-XXXXXXXXXX';   // ← замените на ваш GA4 ID
const YM_COUNTER_ID = 00000000;          // ← замените на номер счётчика Метрики (число)

let metricsReady = false;

/* ---------- Инициализация счётчиков ---------- */
export function initAnalytics() {
  const consent = getConsent();
  if (consent === 'granted') loadMetrics();

  // Слушаем событие из cookie-banner
  document.addEventListener('cookie-consent', (e) => {
    if (e.detail.consent === 'granted') loadMetrics();
  });

  trackPageEngagement();
  bindClickTracking();
}

function loadMetrics() {
  if (metricsReady) return;
  metricsReady = true;

  /* Google Analytics 4 (async) */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { send_page_view: true });

  const ga = document.createElement('script');
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(ga);

  /* Яндекс.Метрика (async) */
  (function (m, e, t, r, i) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    const s = e.createElement(t), a = e.getElementsByTagName(t)[0];
    s.async = 1; s.src = 'https://mc.yandex.ru/metrika/tag.js';
    a.parentNode.insertBefore(s, a);
  })(window, document, 'script', 0, 'ym');

  if (YM_COUNTER_ID) {
    ym(YM_COUNTER_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }
}

/* ---------- Единый трекер событий ---------- */
export function track(name, params = {}) {
  // dataLayer / gtag
  if (window.gtag) gtag('event', name, params);
  // Яндекс.Метрика
  if (window.ym && YM_COUNTER_ID) ym(YM_COUNTER_ID, 'reachGoal', name, params);
  // Логируем всегда (удобно для отладки без счётчиков)
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push({ event: name, ...params });
}

/* ---------- Кастомные события по data-атрибутам ---------- */
function bindClickTracking() {
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    track(el.dataset.track, {
      label: el.dataset.trackLabel || el.textContent.trim().slice(0, 80),
      href: el.href || undefined
    });
  });

  // Телефонные ссылки
  document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
    a.addEventListener('click', () => track('phone_click', { href: a.href }));
  });

  // Ссылки на внешние источники / мессенджеры
  document.querySelectorAll('a[target="_blank"], a[href^="https://t.me"], a[href^="https://wa.me"]').forEach((a) => {
    a.addEventListener('click', () => track('external_link', { href: a.href }));
  });

  // Скачивание прайса
  document.querySelectorAll('a[download]').forEach((a) => {
    a.addEventListener('click', () => track('file_download', { file: a.download || a.href }));
  });
}

/* ---------- Глубина скролла и время на странице ---------- */
function trackPageEngagement() {
  const marks = [25, 50, 75, 100];
  const fired = new Set();
  let reached50 = false;

  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    const pct = Math.round((window.scrollY / h) * 100);
    for (const m of marks) {
      if (!fired.has(m) && pct >= m) {
        fired.add(m);
        track('scroll_depth', { percent: m });
        if (m === 50) reached50 = true;
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Время на странице (отправка при уходе)
  const start = Date.now();
  const sendTime = () => {
    const secs = Math.round((Date.now() - start) / 1000);
    if (secs > 2) track('time_on_page', { seconds: secs, engaged: reached50 });
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendTime();
  });
  window.addEventListener('pagehide', sendTime);
}

function getConsent() {
  try { return localStorage.getItem('cookie-consent'); } catch (e) { return null; }
}
