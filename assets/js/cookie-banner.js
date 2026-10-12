/* cookie-banner.js — GDPR / 152-ФЗ: баннер с согласием, сохранение в localStorage. */

const KEY = 'cookie-consent'; // 'granted' | 'denied'

export function initCookieBanner() {
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (stored) return; // выбор уже сделан

  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  requestAnimationFrame(() => banner.classList.add('is-visible'));
  document.body.classList.add('cookie-shown');

  const decide = (value) => {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    banner.classList.remove('is-visible');
    document.body.classList.remove('cookie-shown');
    document.dispatchEvent(new CustomEvent('cookie-consent', { detail: { consent: value } }));
  };

  banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => decide('granted'));
  banner.querySelector('[data-cookie-decline]')?.addEventListener('click', () => decide('denied'));
}

// Позволить сбросить выбор (например, ссылка «Настроить cookies» в футере)
export function resetCookieConsent() {
  try { localStorage.removeItem(KEY); } catch (e) {}
  location.reload();
}
