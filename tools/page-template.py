#!/usr/bin/env python3
"""Генератор внутренних страниц из Python-описания. usage: exec в build.py"""

HEAD = '''<!DOCTYPE html>
<html lang="ru" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="https://maxim-orlov.seo/{file}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{og_title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="https://maxim-orlov.seo/{file}">
  <meta property="og:image" content="https://maxim-orlov.seo/assets/img/og/og-image.png">
  <meta property="og:locale" content="ru_RU">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0c0e12" media="(prefers-color-scheme: dark)">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"></noscript>
  <style>:root{{--c-bg:#fff;--c-text:#14161a;--header-h:68px}}body{{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--c-bg);color:var(--c-text)}}.container{{max-width:1200px;margin:0 auto;padding:0 1.25rem}}h1{{font-size:clamp(2rem,4vw,3.25rem)}}</style>
  <link rel="stylesheet" href="/assets/css/variables.css">
  <link rel="stylesheet" href="/assets/css/reset.css">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  <link rel="stylesheet" href="/assets/css/layout.css">
  <link rel="stylesheet" href="/assets/css/pages.css">
  <script src="/assets/js/theme.js"></script>
{jsonld_head}</head>

<body data-active="{active}">
  <div id="header-slot"></div>

  <main id="main">
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Хлебные крошки">
          <ol>{crumbs}</ol>
        </nav>
        <span class="badge">{kicker}</span>
        <h1>{h1}</h1>
        <p class="lead">{sub}</p>
        <div class="hero-ctas" style="margin-top:2rem">
          <a class="btn btn-primary btn-lg" href="#order" data-track="cta_click" data-track-label="{active}_hero">Обсудить задачу</a>
          <a class="btn btn-outline btn-lg" href="/pricing.html">Посмотреть цены</a>
        </div>
      </div>
    </section>
{content}
    <section class="section section-alt" id="order" aria-labelledby="order-h">
      <div class="container">
        <div class="grid-2">
          <div class="reveal">
            <h2 id="order-h">{cta_h2}</h2>
            <p class="lead">{cta_sub}</p>
            <ul class="feature-list">
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m5 13 4 4L19 7"/></svg>Ответ в течение 2 часов в рабочее время;</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m5 13 4 4L19 7"/></svg>Бесплатная экспресс-диагностика перед сделкой;</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m5 13 4 4L19 7"/></svg>Договор, счёт, закрывающие документы.</li>
            </ul>
            <p class="small text-mute" style="margin-top:1.5rem">Или напрямую: <a href="https://t.me/maxim_orlov_seo" target="_blank" rel="noopener nofollow">Telegram</a> · <a href="tel:+79001234567">+7 (900) 123-45-67</a></p>
          </div>
          <div class="card reveal reveal-delay-1">
            <form data-form="lead-{active}" data-endpoint="https://formspree.io/f/xxxxxxxx" class="form" novalidate>
              <div class="form-row">
                <div class="field">
                  <label for="o-name">Имя <span class="req">*</span></label>
                  <input class="input" id="o-name" name="name" type="text" required autocomplete="name" data-validate="name">
                  <p class="field-error" aria-live="polite"></p>
                </div>
                <div class="field">
                  <label for="o-contact">Telegram / e-mail <span class="req">*</span></label>
                  <input class="input" id="o-contact" name="contact" type="text" required data-validate="email">
                  <p class="field-error" aria-live="polite"></p>
                </div>
              </div>
              <div class="field">
                <label for="o-site">Сайт</label>
                <input class="input" id="o-site" name="site" type="text" placeholder="https://...">
                <p class="field-error" aria-live="polite"></p>
              </div>
              <div class="field">
                <label for="o-msg">Задача <span class="req">*</span></label>
                <textarea class="textarea" id="o-msg" name="message" required data-validate="text"></textarea>
                <p class="field-error" aria-live="polite"></p>
              </div>
              <input type="text" name="_gotcha" hidden data-hp tabindex="-1" autocomplete="off">
              <label class="checkbox"><input type="checkbox" name="consent" required> Соглашаюсь с <a href="/privacy.html">политикой конфиденциальности</a></label>
              <button class="btn btn-primary btn-block btn-lg" type="submit">Отправить</button>
              <p class="form-status" data-form-status aria-live="polite"></p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  <div id="footer-slot"></div>
  <script src="/assets/js/include.js"></script>
  <script type="module" src="/assets/js/main.js"></script>
</body>
</html>
'''

def crumbs_html(items):
    """items: [(label, href|None), ...] — без 'Главная', добавляется автоматически"""
    out = ['<li><a href="/">Главная</a></li>']
    for label, href in items:
        if href:
            out.append(f'<li><a href="{href}">{label}</a></li>')
        else:
            out.append(f'<li><span aria-current="page">{label}</span></li>')
    return "\n          ".join(out)

def service_jsonld(name, description, page_url, breadcrumb_items, service_type="Service"):
    import json
    bc = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Главная", "item": "https://maxim-orlov.seo/"}
        ] + [
            {"@type": "ListItem", "position": i + 2, "name": label,
             "item": ("https://maxim-orlov.seo/" + href.lstrip("/")) if href else None}
            for i, (label, href) in enumerate(breadcrumb_items)
        ]
    }
    # remove item=None for last
    for el in bc["itemListElement"]:
        el.pop("item", None) if el.get("item") is None else None
    svc = {
        "@context": "https://schema.org",
        "@type": service_type,
        "name": name,
        "description": description,
        "url": "https://maxim-orlov.seo/" + page_url,
        "provider": {
            "@type": "Person", "name": "Максим Орлов",
            "url": "https://maxim-orlov.seo/about.html",
            "telephone": "+7-900-123-45-67", "email": "hello@maxim-orlov.seo"
        },
        "areaServed": "RU",
        "offers": {
            "@type": "Offer", "priceCurrency": "RUB",
            "price": "55000", "availability": "https://schema.org/InStock"
        }
    }
    ld = {"@graph": [svc, bc]}
    return '  <script type="application/ld+json">\n  ' + json.dumps(ld, ensure_ascii=False, indent=2).replace("\n", "\n  ") + '\n  </script>\n'

def faq_jsonld(qa_list):
    import json
    ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a_text}}
            for q, a_html, a_text in qa_list
        ]
    }
    return '  <script type="application/ld+json">\n  ' + json.dumps(ld, ensure_ascii=False, indent=2).replace("\n", "\n  ") + '\n  </script>\n'

def faq_html(qa_list, exclusive=False):
    attr = ' data-faq-exclusive' if exclusive else ''
    items = []
    for q, a_html, _ in qa_list:
        items.append(f'''          <details class="faq-item">
            <summary>{q}<span class="faq-icon" aria-hidden="true"></span></summary>
            <div class="faq-body">{a_html}</div>
          </details>''')
    return f'''    <section class="section{' section-alt'}" aria-labelledby="faq-h">
      <div class="container" style="max-width:880px">
        <div class="section-head center reveal">
          <p class="section-num">// FAQ</p>
          <h2 id="faq-h">Частые вопросы</h2>
        </div>
        <div class="faq reveal"{attr}>
{chr(10).join(items)}
        </div>
      </div>
    </section>
'''

def render(file, active, title, desc, og_title, kicker, h1, sub, content, crumbs,
           svc_name, svc_desc, cta_h2, cta_sub, faq=None):
    jld = service_jsonld(svc_name, svc_desc, file, crumbs)
    if faq:
        jld += faq_jsonld(faq)
    html_out = HEAD.format(
        title=title, desc=desc, og_title=og_title, file=file, active=active,
        jsonld_head=jld, kicker=kicker, h1=h1, sub=sub,
        crumbs=crumbs_html(crumbs), content=content,
        cta_h2=cta_h2, cta_sub=cta_sub
    )
    with open('/workspace/' + file, 'w') as f:
        f.write(html_out)
    print('generated', file)
