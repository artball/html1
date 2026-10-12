/* accordion.js — FAQ на <details>/<summary> с плавной анимацией открытия/закрытия. */

export function initAccordion() {
  const items = document.querySelectorAll('details.faq-item');
  if (!items.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach((details) => {
    const summary = details.querySelector('summary');
    const body = details.querySelector('.faq-body');
    if (!summary || !body) return;

    // Отслеживаем клики для аналитики
    summary.addEventListener('click', () => {
      if (window.SeoAnalytics) {
        window.SeoAnalytics.track('faq_open', { question: summary.textContent.trim().slice(0, 90) });
      }
    });

    if (reduced) return;

    // Плавное закрытие: перехватываем клик по открытому summary
    summary.addEventListener('click', (e) => {
      if (!details.open) return; // открытие обрабатывает CSS-анимация
      e.preventDefault();
      const startH = body.offsetHeight;
      body.style.overflow = 'hidden';
      body.animate(
        [{ height: startH + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: 240, easing: 'ease' }
      ).onfinish = () => {
        details.open = false;
        body.style.overflow = '';
      };
    });

    // Плавное открытие через height-анимацию
    const origOpenObserver = new MutationObserver(() => {
      if (details.open && body.style.overflow !== 'hidden') {
        body.style.overflow = 'hidden';
        const anim = body.animate(
          [{ height: '0px', opacity: 0 }, { height: body.offsetHeight + 'px', opacity: 1 }],
          { duration: 260, easing: 'ease' }
        );
        anim.onfinish = () => { body.style.overflow = ''; };
      }
    });
    origOpenObserver.observe(details, { attributes: true, attributeFilter: ['open'] });
  });

  // Эксклюзивный режим: при открытии одного закрывать остальные (опционально)
  const group = document.querySelector('[data-faq-exclusive]');
  if (group) {
    group.addEventListener('toggle', (e) => {
      if (e.target.tagName === 'DETAILS' && e.target.open) {
        group.querySelectorAll('details[open]').forEach((d) => {
          if (d !== e.target) d.removeAttribute('open');
        });
      }
    }, true);
  }
}
