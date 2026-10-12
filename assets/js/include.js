/* include.js — единый layout (header / mobile menu / footer / cookie-banner / sticky-CTA).
   Подключается ПЕРЕД main.js: <script src="assets/js/include.js"></script>
   На <body>: data-active="index" (имя активной страницы без .html) */

(function () {
  'use strict';

  var BASE = ''; // относительные пути — сайт работает при открытии файлов двойным кликом (file://) и на любом хостинге без настройки

  var NAV = [
    { href: 'index.html', key: 'index', label: 'Главная' },
    {
      href: 'promotion.html', key: 'services', label: 'Услуги', sub: [
        { href: 'support.html', key: 'support', label: 'Поддержка сайта' },
        { href: 'promotion.html', key: 'promotion', label: 'Продвижение сайта' },
        { href: 'promotion-traffic.html', key: 'promotion-traffic', label: '— Продвижение по трафику', indent: true },
        { href: 'promotion-keywords.html', key: 'promotion-keywords', label: '— Продвижение по запросам', indent: true },
        { href: 'ads.html', key: 'ads', label: 'Интернет-реклама' },
        { href: 'ads-context.html', key: 'ads-context', label: '— Контекстная реклама', indent: true },
        { href: 'analytics.html', key: 'analytics', label: 'Web-аналитика' },
        { href: 'analytics-competitors.html', key: 'analytics-competitors', label: '— Анализ конкурентов', indent: true },
        { href: 'analytics-site-audit.html', key: 'analytics-site-audit', label: '— Анализ сайта', indent: true },
        { href: 'analytics-tech-seo.html', key: 'analytics-tech-seo', label: '— Технический SEO-аудит', indent: true },
        { href: 'content.html', key: 'content', label: 'Копирайтинг и контент' },
        { href: 'keywords.html', key: 'keywords', label: 'Семантическое ядро' }
      ]
    },
    { href: 'about.html', key: 'about', label: 'Обо мне' },
    { href: 'cases.html', key: 'cases', label: 'Кейсы' },
    { href: 'advantages.html', key: 'advantages', label: 'Преимущества' },
    { href: 'pricing.html', key: 'pricing', label: 'Цены' },
    { href: 'blog.html', key: 'blog', label: 'Блог' },
    { href: 'contacts.html', key: 'contacts', label: 'Контакты' }
  ];

  var active = document.body.dataset.active || '';

  /* ---------- Иконки ---------- */
  var ICON = {
    logo: '<span class="logo-mark" aria-hidden="true">SE</span>',
    sun: '<svg class="i-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.3 11.3 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="i-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    caret: '<svg class="nav-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------- Header ---------- */
  function headerHTML() {
    var navItems = NAV.map(function (item) {
      var cur = item.key === active ? ' aria-current="page"' : '';
      if (!item.sub) {
        return '<li class="nav-item"><a class="nav-link" href="' + BASE + item.href + '"' + cur + '>' + esc(item.label) + '</a></li>';
      }
      var subLinks = item.sub.map(function (s) {
        var scur = s.key === active ? ' aria-current="page"' : '';
        return '<a href="' + BASE + s.href + '"' + scur + '>' + esc(s.label) + '</a>';
      }).join('');
      var hasCurSub = item.sub.some(function (s) { return s.key === active; });
      return '<li class="nav-item has-sub' + (hasCurSub ? ' is-open' : '') + '">' +
        '<a class="nav-link" href="' + BASE + item.sub[0].href + '"' + (hasCurSub ? ' aria-current="page"' : '') + '>' + esc(item.label) + ICON.caret + '</a>' +
        '<div class="subnav">' + subLinks + '</div></li>';
    }).join('');

    return '' +
    '<a class="skip-link" href="#main">Перейти к содержимому</a>' +
    '<header class="site-header">' +
      '<div class="container header-inner">' +
        '<a class="logo" href="' + BASE + 'index.html" aria-label="SEO-специалист Максим Орлов — на главную">' + ICON.logo + 'Максим&nbsp;Орлов<em>.seo</em></a>' +
        '<nav class="main-nav" aria-label="Основная навигация"><ul class="nav-list">' + navItems + '</ul></nav>' +
        '<div class="header-actions">' +
          '<a class="btn btn-primary btn-sm header-cta" href="' + BASE + 'contacts.html" data-track="cta_click" data-track-label="header">Обсудить проект</a>' +
          '<button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Переключить тёмную или светлую тему">' + ICON.sun + ICON.moon + '</button>' +
          '<button class="icon-btn burger" type="button" data-burger aria-expanded="false" aria-controls="mobile-menu" aria-label="Открыть меню">' +
            '<span><span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  /* ---------- Mobile menu ---------- */
  function mobileMenuHTML() {
    var links = NAV.map(function (item) {
      if (!item.sub) {
        var cur = item.key === active ? ' aria-current="page"' : '';
        return '<li><a class="m-link" href="' + BASE + item.href + '"' + cur + '>' + esc(item.label) + '</a></li>';
      }
      var subs = item.sub.map(function (s) {
        var scur = s.key === active ? ' aria-current="page"' : '';
        return '<a class="m-link" href="' + BASE + s.href + '"' + scur + '>' + esc(s.label) + '</a>';
      }).join('');
      return '<li><a class="m-link" href="' + BASE + item.sub[0].href + '">Услуги</a><ul class="m-sub">' + subs + '</ul></li>';
    }).join('');

    return '' +
    '<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Меню">' +
      '<button class="icon-btn mobile-menu-close" type="button" data-menu-close aria-label="Закрыть меню">' + ICON.close + '</button>' +
      '<ul>' + links + '</ul>' +
      '<p style="margin-top:1.5rem"><a class="btn btn-primary btn-block" href="' + BASE + 'contacts.html" data-track="cta_click" data-track-label="mobile-menu">Обсудить проект</a></p>' +
    '</div>';
  }

  /* ---------- Footer ---------- */
  function footerHTML() {
    var y = new Date().getFullYear();
    return '' +
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col">' +
            '<a class="logo" href="' + BASE + 'index.html">' + ICON.logo + 'Максим&nbsp;Орлов<em>.seo</em></a>' +
            '<p class="text-soft" style="margin-top:1rem;max-width:34ch">Частный SEO-специалист и веб-аналитик. Продвигаю бизнес в поиске с 2013 года: рост трафика, заявок и выручки — прозрачно и с отчётностью.</p>' +
            '<address style="margin-top:1rem" class="text-soft">' +
              '<a href="tel:+79001234567" data-track="phone_click">+7 (900) 123-45-67</a><br>' +
              '<a href="mailto:hello@maxim-orlov.seo">hello@maxim-orlov.seo</a>' +
            '</address>' +
            '<div class="socials" style="margin-top:1rem">' +
              '<a class="icon-btn" href="https://t.me/maxim_orlov_seo" target="_blank" rel="noopener nofollow" aria-label="Telegram" data-track="telegram_click"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.04 20.6a.9.9 0 0 1-.88.06c-1.2-.5-2.8-1.4-4.3-3.2C2.2 15 1.2 12 1 11.4c-.2-.8.3-1.2 1-1.4l3.3-1L16.6 4c.7-.3 1.4-.1 1.2.6l-2.2 10.6c-.2.8-.7 1-1.4.7l-3.9-2.6-1.9 1.8c-.2.2-.4.4-.4.5z"/></svg></a>' +
              '<a class="icon-btn" href="https://wa.me/79001234567" target="_blank" rel="noopener nofollow" aria-label="WhatsApp" data-track="whatsapp_click"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5 13.7c-.3.7-1.5 1.4-2.1 1.4-.6.1-1.3.1-2.2-.1a13 13 0 0 1-5.6-4.9C6.3 11 6 9.8 6 9.1c0-.7.4-1.5 1-1.9.3-.2.6-.3.9-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.3.1.5 0 .7l-.4.6c-.2.2-.3.4-.1.7a8.4 8.4 0 0 0 3.9 3.4c.3.1.5.1.7-.1l.8-1c.2-.2.4-.2.7-.1l2 1c.3.1.5.2.5.4s0 1-.5 1.8z"/></svg></a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col"><h3>Услуги</h3><ul class="footer-links">' +
            '<li><a href="' + BASE + 'promotion.html">Продвижение сайта</a></li>' +
            '<li><a href="' + BASE + 'promotion-traffic.html">По трафику</a></li>' +
            '<li><a href="' + BASE + 'promotion-keywords.html">По запросам</a></li>' +
            '<li><a href="' + BASE + 'ads.html">Интернет-реклама</a></li>' +
            '<li><a href="' + BASE + 'ads-context.html">Контекстная реклама</a></li>' +
            '<li><a href="' + BASE + 'analytics.html">Web-аналитика</a></li>' +
            '<li><a href="' + BASE + 'keywords.html">Семантическое ядро</a></li>' +
            '<li><a href="' + BASE + 'content.html">Контент и копирайтинг</a></li>' +
            '<li><a href="' + BASE + 'support.html">Поддержка сайта</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h3>Аналитика</h3><ul class="footer-links">' +
            '<li><a href="' + BASE + 'analytics-competitors.html">Анализ конкурентов</a></li>' +
            '<li><a href="' + BASE + 'analytics-site-audit.html">Анализ сайта</a></li>' +
            '<li><a href="' + BASE + 'analytics-tech-seo.html">Технический аудит</a></li>' +
            '<li><a href="' + BASE + 'cases.html">Кейсы</a></li>' +
            '<li><a href="' + BASE + 'blog.html">Блог</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h3>Информация</h3><ul class="footer-links">' +
            '<li><a href="' + BASE + 'about.html">Обо мне</a></li>' +
            '<li><a href="' + BASE + 'advantages.html">Преимущества</a></li>' +
            '<li><a href="' + BASE + 'pricing.html">Цены</a></li>' +
            '<li><a href="' + BASE + 'contacts.html">Контакты</a></li>' +
          '</ul></div>' +
          '<div class="footer-col"><h3>Документы</h3><ul class="footer-links">' +
            '<li><a href="' + BASE + 'privacy.html">Политика конфиденциальности</a></li>' +
            '<li><a href="' + BASE + 'terms.html">Пользовательское соглашение</a></li>' +
            '<li><a href="' + BASE + 'offer.html">Публичная оферта</a></li>' +
            '<li><a href="#" data-reset-cookies>Настройки cookies</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>© ' + y + ' Максим Орлов · ИП Орлов М. А. · ИНН 770000000000</p>' +
          '<p>Работаю по всей России и СНГ · <a href="' + BASE + 'contacts.html">Оставить заявку</a></p>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  /* ---------- Cookie banner + sticky CTA ---------- */
  function extrasHTML() {
    return '' +
    '<aside class="cookie-banner" id="cookie-banner" role="region" aria-label="Использование файлов cookie">' +
      '<div class="cookie-inner">' +
        '<p class="cookie-text">Я использую cookie и сервисы веб-аналитики (Google Analytics 4, Яндекс.Метрика), чтобы сайт становился лучше. Это не обязательно для работы сайта. Подробнее — в <a href="' + BASE + 'privacy.html">политике конфиденциальности</a>.</p>' +
        '<div style="display:flex;gap:.75rem;flex-wrap:wrap">' +
          '<button class="btn btn-outline btn-sm" type="button" data-cookie-decline>Только необходимые</button>' +
          '<button class="btn btn-primary btn-sm" type="button" data-cookie-accept>Принять все</button>' +
        '</div>' +
      '</div>' +
    '</aside>' +
    '<div class="sticky-cta" aria-hidden="false">' +
      '<a class="btn btn-outline" href="tel:+79001234567" data-track="phone_click" style="flex:1">Позвонить</a>' +
      '<a class="btn btn-primary" href="' + BASE + 'contacts.html" data-track="cta_click" data-track-label="sticky" style="flex:1">Оставить заявку</a>' +
    '</div>';
  }

  /* ---------- Вставка ---------- */
  function mount() {
    var headerSlot = document.getElementById('header-slot');
    var footerSlot = document.getElementById('footer-slot');
    if (headerSlot) {
      headerSlot.outerHTML = headerHTML() + mobileMenuHTML();
      if (window.SeoThemeBind) window.SeoThemeBind();
    }
    if (footerSlot) {
      footerSlot.outerHTML = footerHTML() + extrasHTML();
      footerSlot = null;
    }
    // сброс consent
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-reset-cookies]');
      if (t) {
        e.preventDefault();
        try { localStorage.removeItem('cookie-consent'); } catch (err) {}
        location.reload();
      }
    });
    document.body.classList.add('has-sticky-cta');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
