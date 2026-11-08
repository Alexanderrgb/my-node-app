const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// ============================================
// ЗАДАНИЕ 3.2: Middleware обработки ошибок
// (должен быть ПЕРВЫМ, чтобы ловить все ошибки)
// ============================================
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || 'Внутренняя ошибка сервера',
      status: ctx.status
    };
  }
});

// ============================================
// ЗАДАНИЕ 3.1: Middleware логирования
// ============================================
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const now = new Date().toLocaleString('ru-RU');
  console.log(`[${now}] ${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});

// Middleware для парсинга JSON
app.use(bodyParser());

// ============================================
// ЗАДАНИЕ 1: Главная страница (HTML)
// ============================================
router.get('/', (ctx) => {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU');

  ctx.type = 'html';
  ctx.body = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>ЛР №15</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px; }
        .card { background: #fff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        p { font-size: 16px; color: #333; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Лабораторная работа №15</h1>
        <p><b>Группа:</b> ББМО-01-23</p>
        <p><b>Дата и время:</b> ${dateStr}</p>
        <p>Добро пожаловать! Сервер работает на Koa.js.</p>
      </div>
    </body>
    </html>
  `;
});

// ============================================
// ЗАДАНИЕ 2: REST API для пользователей (CRUD)
// ============================================
let users = [
  { id: 1, name: 'Иванов Иван', group: 'ББМО-01-23' },
  { id: 2, name: 'Петров Петр', group: 'ББМО-01-23' },
];
let nextId = 3;

// GET /api/users — получить всех
router.get('/api/users', (ctx) => {
  ctx.body = users;
});

// GET /api/users/:id — получить одного
router.get('/api/users/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }
  ctx.body = user;
});

// POST /api/users — создать нового
router.post('/api/users', (ctx) => {
  const { name, group } = ctx.request.body;

  if (!name || !group) {
    ctx.status = 400;
    ctx.body = { error: 'Поля name и group обязательны' };
    return;
  }

  const newUser = { id: nextId++, name, group };
  users.push(newUser);
  ctx.status = 201;
  ctx.body = newUser;
});

// PUT /api/users/:id — обновить
router.put('/api/users/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }

  const { name, group } = ctx.request.body;
  if (name) user.name = name;
  if (group) user.group = group;

  ctx.body = user;
});

// DELETE /api/users/:id — удалить
router.delete('/api/users/:id', (ctx) => {
  const id = parseInt(ctx.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }

  users.splice(index, 1);
  ctx.body = { message: `Пользователь с ID ${id} удалён` };
});

// ============================================
// ЗАДАНИЕ 3.3: Middleware авторизации
// ============================================
const authMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: 'Не авторизован', status: 401 };
    return;
  }
  await next();
};

// Защищённый маршрут (только с заголовком Authorization)
router.get('/protected', authMiddleware, (ctx) => {
  ctx.body = { message: 'Доступ разрешён! Это защищённый маршрут.' };
});

// ============================================
// ЗАДАНИЕ 3.4: Тестовый маршрут для проверки обработки ошибок
// ============================================
router.get('/error', (ctx) => {
  throw new Error('Тестовая ошибка сервера');
});

// Подключаем роутер
app.use(router.routes());
app.use(router.allowedMethods());

// Запуск сервера
app.listen(3000, () => {
  console.log('✅ Сервер запущен на http://localhost:3000');
});