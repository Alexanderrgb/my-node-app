const http = require('http');
const url = require('url');

const PORT = 3000;
const GROUP = '477'; 

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const time = new Date().toLocaleString('ru-RU');

    // Логирование
    console.log(`[${time}] ${method} ${path}`);

    // Заголовки (безопасные)
    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('X-Group', GROUP);

    if (path === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>=== Лабораторная работа №20 ===</h1>
            <p>Группа: ${GROUP}</p>
            <p>Метод: ${method}</p>
            <p>URL: ${path}</p>
        `);
    } else if (path === '/about' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>=== О студенте ===</h1>
            <p>Группа: ${GROUP}</p>
            <p>Студент: Кузьмин Александр Николаевич</p>
        `);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>=== 404 Not Found ===</h1>
            <p>Путь ${path} не найден</p>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Группа: ${GROUP}`);
});