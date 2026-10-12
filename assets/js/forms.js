/* forms.js — валидация (HTML5 + кастомная) и отправка форм через fetch.
   Настройки endpoint: data-endpoint на <form> (Formspree / Telegram Bot API / свой бэкенд). */

export function initForms() {
  document.querySelectorAll('form[data-form]').forEach(bindForm);
}

const RULES = {
  name: {
    test: (v) => /^[А-Яа-яЁёA-Za-z\s'-]{2,60}$/.test(v.trim()),
    msg: 'Укажите имя (минимум 2 символа).'
  },
  email: {
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    msg: 'Введите корректный e-mail, например ivan@mail.ru.'
  },
  phone: {
    test: (v) => v.trim() === '' || /^\+?[\d\s()-]{10,18}$/.test(v.trim()),
    msg: 'Телефон может содержать только цифры, +, скобки и пробелы.'
  },
  text: {
    test: (v) => v.trim().length >= 10,
    msg: 'Расскажите чуть подробнее (от 10 символов).'
  }
};

function validateField(field) {
  const input = field.querySelector('input, textarea, select');
  if (!input) return true;
  const errEl = field.querySelector('.field-error');
  let ok = true;
  let msg = '';

  // Нативная валидация
  if (!input.checkValidity()) {
    ok = false;
    msg = input.validationMessage || 'Проверьте поле.';
    if (input.validity.valueMissing) msg = 'Это поле обязательно.';
  }

  // Кастомная по data-validate
  if (ok && input.dataset.validate) {
    for (const rule of input.dataset.validate.split(',')) {
      const r = RULES[rule.trim()];
      if (r && !r.test(input.value)) { ok = false; msg = r.msg; break; }
    }
  }

  field.classList.toggle('is-invalid', !ok);
  if (errEl) errEl.textContent = ok ? '' : msg;
  input.setAttribute('aria-invalid', String(!ok));
  return ok;
}

function bindForm(form) {
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');

  // Живая валидация после первого «проблема»
  form.querySelectorAll('.field').forEach((field) => {
    const input = field.querySelector('input, textarea, select');
    if (!input) return;
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll('.field')];
    const allOk = fields.map(validateField).every(Boolean);
    if (!allOk) {
      const firstBad = form.querySelector('.field.is-invalid input, .field.is-invalid textarea');
      if (firstBad) firstBad.focus();
      setStatus(status, 'err', 'Пожалуйста, исправьте ошибки в форме.');
      return;
    }

    // honeypot
    if (form.querySelector('[data-hp]')?.value) return;

    const originalLabel = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.classList.add('is-loading'); submitBtn.textContent = 'Отправляю…'; }

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const endpoint = form.dataset.endpoint || '/api/lead';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, _page: location.href, _ts: Date.now() })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      form.reset();
      setStatus(status, 'ok', 'Спасибо! Заявка отправлена — отвечу в течение рабочего дня.');
      if (window.SeoAnalytics) window.SeoAnalytics.track('form_submit', { form: form.dataset.form, page: location.pathname });
    } catch (err) {
      // Демо-режим: при открытии file:// или без бэкенда имитируем успех, но пишем в консоль
      console.warn('[forms] endpoint недоступен:', err.message);
      if (/^file:/.test(location.protocol) || err.message.includes('Failed to fetch')) {
        form.reset();
        setStatus(status, 'ok', '(Демо) Заявка принята локально. Подключите Formspree/Telegram для реальной отправки.');
        if (window.SeoAnalytics) window.SeoAnalytics.track('form_submit_demo', { form: form.dataset.form });
      } else {
        setStatus(status, 'err', 'Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.');
      }
    } finally {
      if (submitBtn) { submitBtn.classList.remove('is-loading'); submitBtn.innerHTML = originalLabel; }
    }
  });
}

function setStatus(el, cls, text) {
  if (!el) return;
  el.className = 'form-status ' + cls;
  el.textContent = text;
  el.setAttribute('role', cls === 'err' ? 'alert' : 'status');
}
