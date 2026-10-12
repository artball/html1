/* menu.js — burger-меню, sticky-хедер, мобильная навигация. Экспортирует initMenu(). */

export function initMenu() {
  const header = document.querySelector('.site-header');

  // Sticky: добавляем тень/рамку при скролле
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Burger → мобильное меню
  const burger = document.querySelector('[data-burger]');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burger && mobileMenu) {
    const closeBtn = mobileMenu.querySelector('[data-menu-close]');

    const setOpen = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-locked', open);
      mobileMenu.toggleAttribute('inert', !open);
      if (open) {
        const first = mobileMenu.querySelector('a, button');
        if (first) first.focus({ preventScroll: true });
      } else {
        burger.focus({ preventScroll: true });
      }
    };

    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) setOpen(false);
    });
    // Закрытие при возврате на desktop
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (ev) => {
      if (ev.matches) setOpen(false);
    });
    mobileMenu.toggleAttribute('inert', true);
  }

  // Дропдаун «Услуги» — открытие по клику для клавиатуры/тача
  document.querySelectorAll('.nav-item.has-sub > .nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const parent = link.parentElement;
      const isOpen = parent.classList.contains('is-open');
      document.querySelectorAll('.nav-item.has-sub.is-open').forEach((el) => el.classList.remove('is-open'));
      if (!isOpen && window.matchMedia('(max-width: 1023px)').matches) {
        e.preventDefault();
        parent.classList.add('is-open');
      }
    });
  });
}
