# -*- coding: utf-8 -*-
import json, io

def head(title, desc, pagefile, ld=''):
    return f"""<!DOCTYPE html>
<html lang="ru" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="https://maxim-orlov.seo/{pagefile}">
  <link rel="icon" href="favicon.ico" sizes="any">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title.split(' — ')[0].split(' | ')[0]}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="https://maxim-orlov.seo/{pagefile}">
  <meta property="og:image" content="https://maxim-orlov.seo/assets/img/og/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="ru_RU">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0c0e12" media="(prefers-color-scheme: dark)">

  <!-- Шрифты: preconnect + swap -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"></noscript>

  <!-- Критический CSS (инлайн) + основные стили -->
  <style>:root{{--c-bg:#fff;--c-text:#14161a;--c-accent:#4f46e5;--header-h:68px}}body{{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--c-bg);color:var(--c-text)}}.container{{max-width:1200px;margin:0 auto;padding:0 1.25rem}}.site-header{{position:sticky;top:0;height:var(--header-h)}}h1{{font-size:clamp(2rem,4vw,3.25rem)}}</style>
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/pages.css">

  <!-- Тема без FOUC -->
  <script src="assets/js/theme.js"></script>
{ld}
</head>
"""

TAIL = """  <div id="footer-slot"></div>

  <script src="assets/js/include.js"></script>
  <script type="module" src="assets/js/main.js"></script>
</body>
</html>
"""

CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m5 13 4 4L19 7"/></svg>'

def breadcrumb_ld(name, href):
    data = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Главная", "item": "https://maxim-orlov.seo/"},
        {"@type": "ListItem", "position": 2, "name": name, "item": "https://maxim-orlov.seo/" + href}]}
    return '  <script type="application/ld+json">\n  ' + json.dumps(data, ensure_ascii=False) + '\n  </script>'

def faq_block(items):
    out = []
    for q, a in items:
        out.append(f'''            <details class="faq-item reveal" itemprop="mainEntity" itemscope itemtype="https://schema.org/Question">
              <summary itemprop="name">{q}<span class="faq-icon" aria-hidden="true"></span></summary>
              <div class="faq-body" itemprop="acceptedAnswer" itemscope><p itemprop="text">{a}</p></div>
            </details>''')
    return '\n'.join(out)

def faq_ld(items):
    main = [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": main}
    return '  <script type="application/ld+json">\n  ' + json.dumps(data, ensure_ascii=False) + '\n  </script>'

def service_ld(name, desc, pagefile):
    data = {"@context": "https://schema.org", "@type": "Service", "name": name, "description": desc,
            "serviceType": "SEO и интернет-маркетинг", "provider": {"@type": "Person", "name": "Максим Орлов"},
            "areaServed": "RU", "url": "https://maxim-orlov.seo/" + pagefile}
    return '  <script type="application/ld+json">\n  ' + json.dumps(data, ensure_ascii=False) + '\n  </script>'

def hero(badge, h1, lead, ctas='Смотреть цены', cta_href='pricing.html'):
    return hero2(badge, h1, lead, f'<li><a href="index.html">Главная</a></li>\n          <li><span aria-current="page">{h1}</span></li>', ctas, cta_href)

def hero2(badge, h1, lead, crumb_html, ctas='Смотреть цены', cta_href='pricing.html'):
    return f'''    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Хлебные крошки">
          <ol>
          {crumb_html}
          </ol>
        </nav>
        <span class="badge">{badge}</span>
        <h1>{h1}</h1>
        <p class="lead">{lead}</p>
        <div class="hero-ctas" style="margin-top:2rem">
          <a class="btn btn-primary btn-lg" href="#order" data-track="cta_click" data-track-label="hero">Обсудить задачу</a>
          <a class="btn btn-outline btn-lg" href="{cta_href}">{ctas}</a>
        </div>
      </div>
    </section>'''

def sec(inner, alt=False, labelledby=None):
    cls = 'section section-alt' if alt else 'section'
    lab = f' aria-labelledby="{labelledby}"' if labelledby else ''
    return f'    <section class="{cls}"{lab}>\n      <div class="container">\n{inner}\n      </div>\n    </section>'

def cards(items, cols=3):
    arts = []
    for i, (t, d) in enumerate(items):
        delay = f' reveal-delay-{i % 4}' if i >= 4 and i % 4 else ''
        arts.append(f'''          <article class="card card-hover reveal{delay}">
            <h3>{t}</h3>
            <p class="text-soft small">{d}</p>
          </article>''')
    return f'''        <div class="grid-{cols}">
{chr(10).join(arts)}
        </div>'''

def features(items):
    lis = '\n'.join(f'              <li>{CHECK_SVG}{t}</li>' for t in items)
    return f'''            <ul class="feature-list">
{lis}
            </ul>'''

def table(headers, rows, cap=None):
    th = ''.join(f'<th scope="col">{h}</th>' for h in headers)
    trs = '\n'.join('            <tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    c = f'<caption>{cap}</caption>\n          ' if cap else ''
    return f'''        <div class="table-wrap reveal">
          <table>
            {c}<thead><tr>{th}</tr></thead>
            <tbody>
{trs}
            </tbody>
          </table>
        </div>'''

def steps(items):
    divs = '\n'.join(f'''          <div class="step reveal">
            <h3>{t}</h3>
            <p>{d}</p>
          </div>''' for t, d in items)
    return f'''        <div class="steps reveal reveal-delay-1">
{divs}
        </div>'''

def faq_sec(items):
    return sec(f'''        <div class="section-head center reveal">
          <h2>Частые вопросы</h2>
          <p class="lead">Коротко о главном — до звонка и брифа.</p>
        </div>
        <div class="faq" itemscope itemtype="https://schema.org/FAQPage">
{faq_block(items)}
        </div>''', alt=True)

FORM_TMPL = '''            <form data-form="lead-{fid}" data-endpoint="https://formspree.io/f/xxxxxxxx" class="form" novalidate>
              <div class="form-row">
                <div class="field">
                  <label for="o-name-{fid}">Имя <span class="req">*</span></label>
                  <input class="input" id="o-name-{fid}" name="name" type="text" required autocomplete="name" data-validate="name">
                  <p class="field-error" aria-live="polite"></p>
                </div>
                <div class="field">
                  <label for="o-contact-{fid}">Телефон или Telegram <span class="req">*</span></label>
                  <input class="input" id="o-contact-{fid}" name="contact" type="text" required data-validate="email">
                  <p class="field-error" aria-live="polite"></p>
                </div>
              </div>
              <div class="field">
                <label for="o-site-{fid}">Сайт</label>
                <input class="input" id="o-site-{fid}" name="site" type="text" placeholder="https://...">
                <p class="field-error" aria-live="polite"></p>
              </div>
              <div class="field">
                <label for="o-msg-{fid}">Задача <span class="req">*</span></label>
                <textarea class="textarea" id="o-msg-{fid}" name="message" required data-validate="text"></textarea>
                <p class="field-error" aria-live="polite"></p>
              </div>
              <input type="text" name="_gotcha" hidden data-hp tabindex="-1" autocomplete="off">
              <label class="checkbox"><input type="checkbox" name="consent" required> Соглашаюсь с <a href="privacy.html">политикой конфиденциальности</a></label>
              <button class="btn btn-primary btn-block btn-lg" type="submit">Отправить</button>
              <p class="form-status" data-form-status aria-live="polite"></p>
            </form>'''

def order_sec(fid, h2, lead, bullets):
    return f'''    <section class="section section-alt" id="order" aria-labelledby="order-h">
      <div class="container">
        <div class="grid-2">
          <div class="reveal">
            <h2 id="order-h">{h2}</h2>
            <p class="lead">{lead}</p>
{features(bullets)}
            <p class="small text-mute" style="margin-top:1.5rem">Или напрямую: <a href="https://t.me/maxim_orlov_seo" target="_blank" rel="noopener nofollow" data-track="telegram_click">Telegram</a> · <a href="tel:+79001234567" data-track="phone_click">+7 (900) 123-45-67</a></p>
          </div>
          <div class="card reveal reveal-delay-1">
{FORM_TMPL.format(fid=fid)}
          </div>
        </div>
      </div>
    </section>'''

CROSSLINK = '''    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <h2>Смежные услуги</h2>
          <p class="lead">Результат приходит, когда работы связаны в единую стратегию.</p>
        </div>
        <div class="grid-3">
          <article class="card card-hover reveal"><h3><a href="keywords.html">Семантическое ядро</a></h3><p class="text-soft small">Сбор и кластеризация запросов — фундамент продвижения и рекламы.</p></article>
          <article class="card card-hover reveal"><h3><a href="content.html">Контент и копирайтинг</a></h3><p class="text-soft small">Тексты под интент: читают люди, любят поисковики.</p></article>
          <article class="card card-hover reveal"><h3><a href="analytics-site-audit.html">Анализ сайта</a></h3><p class="text-soft small">Поведение, юзабилити и конверсии — где теряются заявки.</p></article>
        </div>
      </div>
    </section>'''

def build(pagefile, title, desc, badge, h1, lead, sections, fid, ld_extra='', ctas='Смотреть цены', cta_href='pricing.html',
          crumbs=None, active=None):
    if crumbs is None:
        crumbs = [('Главная', 'index.html')]
    crumb_html = '\n          '.join(
        f'<li><a href="{h}">{l}</a></li>' if h else f'<li><span aria-current="page">{l}</span></li>'
        for l, h in crumbs)
    ld = '\n'.join(x for x in [breadcrumb_ld(h1, pagefile), ld_extra] if x)
    parts = [head(title, desc, pagefile, ld),
             f'<body data-active="{active or pagefile[:-5]}">',
             '  <div id="header-slot"></div>', '',
             '  <main id="main">',
             hero2(badge, h1, lead, crumb_html, ctas, cta_href)]
    parts += sections
    parts.append(order_sec(fid, 'Готовы обсудить ваш проект?', 'Опишите задачу — в течение рабочего дня пришлю предварительную оценку, план работ и релевантные кейсы. Консультация бесплатна.', ['Ответ в течение рабочего дня', 'Бесплатный экспресс-аудит сайта перед стартом', 'Договор, счёт и закрывающие документы как для юрлиц']))
    parts.append(TAIL)
    return '\n'.join(parts) + '\n'
