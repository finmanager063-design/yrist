# 🍬 Сайт-конфетка Сергея Макарова

Лендинг: **возврат денег от мошенников** в Казахстане. Гонорар успеха, кейсы, международный контур, 14 секций.

## Красивые ссылки для клиентов

| Назначение | URL |
|------------|-----|
| **Короткая на консультацию** | `https://finmanager063-design.github.io/yrist/konsult.html` |
| **Страница «скопировать текст»** | `https://finmanager063-design.github.io/yrist/share.html` |
| Полный сайт | `https://finmanager063-design.github.io/yrist/` |

В WhatsApp/Telegram вставляйте **konsult.html** — откроется карточка с заголовком и картинкой, затем форма записи.

Свой домен: см. `CNAME.example` → GitHub Pages → Custom domain.

## Контакты на сайте

- Телефон / WhatsApp: **+7 (775) 419-49-17**
- Email: **finmanager063@gmail.com**
- Telegram: **@smakarov_law**

## GitHub Pages (основной адрес — yrist)

Сайт лежит в репозитории **finmanager063-design/yrist**. Локальная папка `rabota/` — это тот же проект.

**Опубликовать на старый URL:**

```bash
cd "/home/vladymyr/Рабочий стол/rabota"
export YRIST_DEPLOY_TOKEN=ghp_...   # PAT от finmanager063-design
./deploy-yrist.sh
```

Либо: push в `makarov-backup` + секрет `YRIST_DEPLOY_TOKEN` в настройках репозитория **makarov-law** (Actions) — workflow сам скопирует файлы в yrist.

**Пока yrist не обновлён** (тот же контент уже на зеркале):

https://alexseystrelkov978-lgtm.github.io/makarov-law/

Settings → Pages → branch `main`, folder `/ (root)`.

## Локально

```bash
python3 -m http.server 8080
```

## Перед запуском (чек-лист)

- [ ] Фото Сергея → `assets/img/sergey.jpg` (подключить в `.hero-card__photo` и `.about__photo`)
- [ ] Скриншоты переводов / кейсов
- [ ] Видеоотзывы в секцию `#video`
- [ ] Номер свидетельства в подвале
- [ ] Яндекс.Метрика / Google Analytics
