/* theme.js — переключатель тёмной/светлой темы.
   Подключать синхронно в <head> как обычный скрипт (не module), чтобы избежать FOUC:
   <script src="assets/js/theme.js"></script>
*/
(function () {
  'use strict';
  var KEY = 'theme';
  var root = document.documentElement;
  root.classList.remove('no-js');

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* приватный режим */ }
  apply(saved || systemTheme());

  // Слушаем смену системной темы, если пользователь не выбрал явно
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (ev) {
      var stored = null;
      try { stored = localStorage.getItem(KEY); } catch (e) {}
      if (!stored) apply(ev.matches ? 'dark' : 'light');
    });
  }

  // Глобальный API для кнопки-переключателя (меню может быть добавлено через JS-инклюд)
  window.SeoTheme = {
    get: function () { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; },
    toggle: function () {
      var next = this.get() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
      return next;
    }
  };

  function bindToggle(scope) {
    (scope || document).querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      if (btn.__themeBound) return;
      btn.__themeBound = true;
      btn.addEventListener('click', function () {
        window.SeoTheme.toggle();
        if (window.SeoAnalytics) window.SeoAnalytics.track('theme_switch', { theme: window.SeoTheme.get() });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bindToggle(); });
  } else {
    bindToggle();
  }
  window.SeoThemeBind = bindToggle;
})();
