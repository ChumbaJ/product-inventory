### Backend (Node.js + TypeORM) — краткое описание для проверяющего

Этот backend реализован на **чистом `http` без Express/Nest**, чтобы показать понимание базовых вещей: ручной роутинг, работа со стримами, валидация, обработка ошибок и организация слоёв.

---

### Архитектура

- **Входная точка**: `backend/src/app.ts`

  - Инициализация БД (`initDB` из `data-source.ts`).
  - Поднятие HTTP‑сервера (`http.createServer`).
  - Простейший CORS (заголовки + обработка `OPTIONS`).
  - Подключён логгер (`logger(req, res)`) и далее кастомный роутер (`router(req, res)`).

- **Конфиг**: `backend/src/config.ts`

  - Все настраиваемые параметры в одном месте:
    - `port` — порт HTTP‑сервера.
    - `db` — параметры подключения к Postgres (синхронизировано с `docker-compose.yml`).
    - `pagination` — дефолты и максимум для `page` / `limit`.
    - `body.maxSize` — максимальный размер тела запроса (защита от overflow).

- **Роутер**: `backend/src/router/router.ts`

  - Таблица маршрутов (метод + путь), поддержка `/products` и `/products/:id`.
  - Чтение тела только для `POST/PUT/PATCH`.
  - Использует `readBody` для безопасного чтения body, затем парсит JSON и обрабатывает ошибки:
    - превышен размер → `413 Payload Too Large`;
    - битый JSON → `400 Invalid JSON`.
  - Оборачивает сырой `IncomingMessage` в собственный `Request` и вызывает нужный контроллер.

- **Обёртка Request**: `backend/src/core/Request.ts`

  - Хранит:
    - оригинальный `IncomingMessage` (`raw`),
    - уже распарсенный `URL`,
    - `body` (распарсенный JSON).
  - Контроллеры не знают про стримы и `JSON.parse`, работают с удобным объектом.

- **Парсер тела**: `backend/src/core/bodyParser.ts`

  - Читает `IncomingMessage` по чанкам.
  - Считает размер в байтах через `Buffer.length`.
  - При превышении `config.body.maxSize` бросает ошибку `413`.

- **Ответы**: `backend/src/core/response.ts`

  - Хелпер `json(res, statusCode, data)` — все контроллеры отдают ответы в одном формате (JSON + код статуса).

- **Логгер**: `backend/src/core/logger.ts`

  - Логирует метод, URL, статус и время обработки (`res.on("finish")`).
  - Показывает минимальный, но полезный трейс запросов без внешних библиотек.

- **БД и ORM**: `backend/src/data-source.ts`, `backend/src/modules/product/product.entity.ts`

  - TypeORM + Postgres.
  - `Product`:
    - `article` — бизнес‑идентификатор с уникальным индексом (`unique: true`).
    - `price`, `quantity` — с `@Check`, не могут быть отрицательными.
  - `synchronize: true` — сознательное упрощение для ТЗ (в реальном проекте использовал бы миграции).

- **Модуль продукта**: `backend/src/modules/product`

  - `product.controller.ts` — контроллер с DI репозитория через конструктор:
    - `get` — список с пагинацией, валидация `page` / `limit`.
    - `create` — валидация тела, сохранение, обработка ошибки `23505` (дубликат `article`) → `409`.
    - `update` — partial‑update, валидация id, валидация тела, `404`, если товара нет; обработка `23505`.
    - `delete` — проверка id, `404`, если нет записи, удаление.
  - `product.module.ts` — “мини‑модуль”: создаёт репозиторий, инстанс контроллера и экспортирует его.

- **Валидация**: `backend/src/modules/product/validation/product.validation.ts`
  - `validateProductCreate` — строгая валидация тела для создания (все поля обязательны).
  - `validateProductUpdate` — partial‑update: поля опциональны, но если переданы, валидируются по тем же правилам.
  - Возвращают `{ ok, errors, value }`, контроллеры на этом строят ответы `400` с понятными сообщениями.

---

### Что осознанно не сделано (и почему)

Проект — **ТЗ и небольшой по масштабу**, поэтому я **не стал** сразу вытаскивать все “боевые” вещи, но архитектура приготовлена так, чтобы это было легко добавить:

- Отдельный слой сервисов (`ProductService`) — сейчас контроллер работает напрямую с репозиторием.
- Глобальный error‑handler / middleware‑цепочка (rate‑limit, auth и т.д.) — ошибки обрабатываются локально в роутере и контроллерах.
- Миграции TypeORM вместо `synchronize: true`.
- Конфигурация через `.env` и несколько окружений.

Все эти вещи я умею и обычно добавляю в реальных проектах, но в рамках ТЗ хотел сохранить код базовым и читаемым, чтобы было проще проследить поток данных:  
**HTTP → router → controller → repository → DB.**

---

### Запуск

**Через Docker Compose** (Postgres + backend):

```bash
docker compose up --build
```

**Локально** (если Postgres уже поднят с параметрами из `backend/src/config.ts`):

```bash
cd backend
npm install
npm run build
npm start
```

Сервер: `http://localhost:5000`

Основные эндпоинты:

- `GET /products?page=&limit=` — список товаров с пагинацией.
- `POST /products` — создать товар.
- `PUT /products/:id` — обновить товар.
- `DELETE /products/:id` — удалить товар.

Фокус этого backend’а — **показать понимание низкоуровневых HTTP‑механик и архитектуры**, а не использование готового фреймворка.
