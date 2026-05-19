# Проекты в папке «rabota» — ссылки и доступ

Обновлено: 19.05.2026

## Онлайн (GitHub Pages)

| Проект | Описание | Ссылка |
|--------|----------|--------|
| **HR & Legal — документы** | 3 типа: отчёт, иск, договор. Админка + короткая ссылка на подпись | **Главная (админ):** https://alexseystrelkov978-lgtm.github.io/hrl-documents/ |
| | Отчёт | https://alexseystrelkov978-lgtm.github.io/hrl-documents/admin/report.html |
| | Иск | https://alexseystrelkov978-lgtm.github.io/hrl-documents/admin/claim.html |
| | Договор | https://alexseystrelkov978-lgtm.github.io/hrl-documents/admin/contract.html |
| **Сайт Сергея Макарова (yrist)** | Лендинг юриста, консультация | https://finmanager063-design.github.io/yrist/ |
| | Короткая на консультацию | https://finmanager063-design.github.io/yrist/konsult.html |
| | Страница «поделиться» | https://finmanager063-design.github.io/yrist/share.html |

## Локально на компьютере

| Проект | Папка | Как открыть |
|--------|-------|-------------|
| **GlobalSafe Finance (newsell)** | `dla_posobia/newsell/` | `cd public_html && php -S 127.0.0.1:8080` → http://127.0.0.1:8080 |
| **GlobalSafe (hybrid)** | `dla_posobia/newsell_hybrid/` | то же |
| **Sels (старая версия)** | `dla_posobia/Sels/public_html/` | PHP + MySQL на хостинге |
| **Пособие (HTML)** | `dla_posobia/ПОЛНОЕ_ПРАКТИЧЕСКОЕ_ПОСОБИЕ_ПОЛНАЯ_ВЕРСИЯ.html` | открыть файл в браузере |

## Документы (не сайт)

PDF, Word, Excel в `dla_posobia/` — открываются локально.

## Сервер 161.35.146.240

Сейчас на сервере: **DeepSig** (прокси на порт 8080), каталог `/var/www/gsf` — другой проект (GSF).  
PHP-платформы newsell/Sels туда **ещё не вынесены** — нужен отдельный vhost и MySQL.

---

Репозитории GitHub:
- https://github.com/alexseystrelkov978-lgtm/hrl-documents
- https://github.com/finmanager063-design/yrist (лендинг Макарова)
