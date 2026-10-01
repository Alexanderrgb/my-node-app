const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = 3002;

app.use(express.json());
app.use(compression());

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: "Слишком много запросов, попробуйте позже", status: 429 },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const now = new Date().toLocaleString('ru-RU');
        console.log(`[${now}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

let books = [
    { id: 1, title: "Война и мир", author: "Толстой", year: 1869 },
    { id: 2, title: "Анна Каренина", author: "Толстой", year: 1877 },
    { id: 3, title: "Преступление и наказание", author: "Достоевский", year: 1866 }
];

app.get('/api/books', (req, res) => {
    res.json(books);
});

app.get('/api/books/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) {
        return next({ message: "Книга не найдена", status: 404 });
    }
    res.json(book);
});

app.post('/api/books', (req, res, next) => {
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
        return next({ message: "Нужно заполнить title, author и year", status: 400 });
    }
    const newBook = { id: books.length + 1, title, author, year };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.get('/error', (req, res, next) => {
    next(new Error("Тестовая ошибка"));
});

app.get('/async-error', async (req, res, next) => {
    try {
        throw new Error("Асинхронная ошибка");
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Внутренняя ошибка сервера";
    res.status(status).json({ error: message, status });
});

app.listen(PORT, () => {
    console.log(` Сервер с middleware запущен на порту ${PORT}`);
    console.log(` http://localhost:${PORT}/api/books`);
    console.log(` http://localhost:${PORT}/error`);
    console.log(` http://localhost:${PORT}/async-error`);
});