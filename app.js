require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { connectDB } = require('./db');
const userRoutes = require('./routes/users');

const app = new Koa();
const PORT = process.env.PORT || 3000;
const GROUP = '477'; // Твоя группа

// Middleware: логирование и заголовки
app.use(async (ctx, next) => {
    const start = Date.now();
    ctx.set('X-Group', GROUP);
    await next();
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url} - ${ctx.status} (${ms}ms)`);
});

// Middleware: обработка ошибок
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            error: err.message || 'Internal Server Error',
            details: err.details || undefined
        };
    }
});

app.use(bodyParser());
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`[INFO] Koa-сервер на порту ${PORT}`);
        console.log(`[INFO] Группа: ${GROUP}`);
    });
}

start();