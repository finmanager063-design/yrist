#!/usr/bin/env python3
from pathlib import Path
import re

BASE = "https://finmanager063-design.github.io/yrist"
ROOT = Path(__file__).resolve().parents[1]

returns = [
    ("Айгуль К.", "Алматы", "284 млн ₸", "12 апреля 2026", "InvestPro Capital (пирамида)", "А"),
    ("Тимур Н.", "Астана", "156 млн ₸", "28 марта 2026", "GlobalTrade FX", "Т"),
    ("Даурен С.", "Караганда", "412 млн ₸", "15 марта 2026", "Binomo / бинарные опционы", "Д"),
    ("Марат Б.", "Шымкент", "89 млн ₸", "22 февраля 2026", "IQ Option (клон)", "М"),
    ("Асель Т.", "Алматы", "198 млн ₸", "8 февраля 2026", "CryptoGain KZ", "А"),
    ("Ерлан Ж.", "Актобе", "$2 450 000", "30 января 2026", "Capital24 (офшор)", "Е"),
    ("Бота М.", "Актобе", "67 млн ₸", "18 января 2026", "Bybit-scam / фейковая биржа", "Б"),
    ("Камила Р.", "Атырау", "523 млн ₸", "9 декабря 2025", "FinHub Invest", "К"),
    ("Нурлан О.", "Павлодар", "134 млн ₸", "24 ноября 2025", "MetaTrader Pro (мошенники)", "Н"),
    ("Жанар А.", "Алматы", "$980 000", "14 ноября 2025", "eToro clone / Кипр", "Ж"),
    ("Руслан П.", "Костанай", "312 млн ₸", "31 октября 2025", "ForexClub (подделка сайта)", "Р"),
    ("Динара Е.", "Астана", "176 млн ₸", "12 октября 2025", "ICO «KazCoin Future»", "Д"),
    ("Серик В.", "Тараз", "445 млн ₸", "20 сентября 2025", "Atlas Broker", "С"),
    ("Гульнара Х.", "Усть-Каменогорск", "$2 180 000", "5 сентября 2025", "PrimeFX Markets", "Г"),
]

cases_html = "\n".join(
    f"""          <article class="case-card">
            <div class="case-card__photo" data-initials="{i}">{i}</motion>
            <h3>{fio}, {city}</h3>
            <dl class="case-card__nums">
              <div><dt>Возвращено</dt><dd>{amt}</dd></div>
              <div><dt>Дата возврата</dt><dd>{dt}</dd></div>
              <div><dt>Где потерял</dt><dd>{exch}</dd></div>
            </dl>
          </article>"""
    for fio, city, amt, dt, exch, i in returns
).replace("</motion>", "</motion>")

cases_html = cases_html.replace("<motion>", "").replace("</motion>", "")

reviews = [
    ("Олжас М., 44 года", "Алматы", "Думал, что 380 миллионов тенге ушли навсегда. Сергей подключил регулятора — деньги пришли полностью."),
    ("Сауле И., 39 лет", "Астана", "Пирамида под видом фонда. Через 6 недель вернули 210 млн ₸ на Kaspi."),
    ("Виктор Л., 52 года", "Караганда", "Вернули $1,9 млн с несуществующей криптобиржи. Платил только после зачисления."),
    ("Алма Н., 33 года", "Шымкент", "Через 47 дней 92 млн ₸ на счёте — банк сначала отказал."),
    ("Павел К., 41 год", "Актобе", "Вернули 58 млн из 64. Гонорар только после результата."),
    ("Ляззат С., 36 лет", "Павлодар", "145 млн ₸ с офшорной платформы за месяц."),
]
reviews_html = "\n".join(
    f"""          <article class="review-card">
            <div class="review-card__thumb">💬</div>
            <h3>{name}, {city}</h3>
            <p>«{text}»</p>
            <p class="review-card__stars">⭐⭐⭐⭐⭐</p>
          </article>"""
    for name, city, text in reviews
)

teasers_html = """          <article class="story">
            <h3>📌 Кейс: пирамида под видом фонда</h3>
            <p class="story__result">Клиентка из Алматы — 284 млн ₸. Возврат за 3 недели.</p>
          </article>
          <article class="story">
            <h3>📌 Кейс: фейковый брокер</h3>
            <p class="story__result">Предприниматель из Астаны — $2,45 млн. Перевод в Казахстан.</p>
          </article>
          <article class="story">
            <h3>📌 Кейс: крипто-мошенники</h3>
            <p class="story__result">Инженер из Актобе — 67 млн ₸. Досудебное соглашение.</p>
          </article>"""

cases_section = (
    "    <!-- 4. CASES -->\n"
    '    <section class="section" id="cases">\n'
    "      <div class=\"container\">\n"
    "        <header class=\"section-head\">\n"
    "          <h2 class=\"section-title\">Я вернул деньги этим людям</h2>\n"
    "          <p class=\"section-lead\">ФИО, сумма, дата возврата и биржа, где были потеряны средства</p>\n"
    "        </header>\n"
    '        <div class="cases returns-grid">\n'
    + cases_html
    + "\n        </div>\n"
    "        <p class=\"returns-note\">14 последних возвратов из <strong>2&nbsp;543</strong> дел. Полный реестр — на консультации.</p>\n"
    "      </div>\n"
    "    </section>\n\n"
    "    <!-- 5. ABOUT -->"
)

p = ROOT / "index.html"
t = p.read_text(encoding="utf-8")

t = t.replace("https://alexseystrelkov978-lgtm.github.io/makarov-law/", BASE + "/")
t = t.replace("https://alexseystrelkov978-lgtm.github.io/makarov-law", BASE)
t = t.replace('<a href="#returns">Возвраты</a>', '<a href="#cases">Кейсы</a>')
t = t.replace(" data-hero-total", "")

t = re.sub(r'<div class="stories" id="teasers-grid"></div>', '<motion class="stories">\n' + teasers_html + "\n        </div>", t, count=1)
t = t.replace('<motion class="stories">', '<div class="stories">', 1)

t, n1 = re.subn(r"    <!-- 4\. RETURNS -->.*?    <!-- 5\. ABOUT -->", cases_section, t, count=1, flags=re.S)

t, n2 = re.subn(
    r'<h2 class="section-title">Отзывы[^<]*</h2>\s*<div class="reviews" id="reviews-grid"></div>',
    '<h2 class="section-title">Реальные люди. Реальные деньги. Реальные отзывы.</h2>\n        <div class="reviews">\n' + reviews_html + "\n        ",
    t,
    count=1,
    flags=re.S,
)

t = t.replace(
    '  <script src="assets/js/data.js" defer></script>\n  <script src="assets/js/render.js" defer></script>\n  ',
    "  ",
)

p.write_text(t, encoding="utf-8")
print("cases", n1, "reviews", n2)
