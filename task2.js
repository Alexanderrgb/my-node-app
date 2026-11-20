const http = require('http');
const url = require('url');

const PORT = 3000;
const GROUP = '477';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Установка заголовков
    res.setHeader('X-Powered-By', 'Node.js');
    res.setHeader('X-Group', GROUP);
    res.setHeader('Cache-Control', 'no-cache');

    if (path === '/headers' && method === 'GET') {
        // Чтение входящих заголовков
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            headers: req.headers, 
            method: method,
            url: path,
            httpVersion: req.httpVersion
        }, null, 2));

    } else if (path === '/headers/set' && method === 'GET') {
        // Установка исходящих заголовков
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.writeHead(200);
        res.end(`<h1>Заголовки установлены!</h1>
                 <p>X-Powered-By: ${res.getHeader('X-Powered-By')}</p>
                 <p>X-Group: ${res.getHeader('X-Group')}</p>
                 <p>Cache-Control: ${res.getHeader('Cache-Control')}</p>
                 <p>Content-Type: ${res.getHeader('Content-Type')}</p>`);

    } else if (path === '/headers/check' && method === 'GET') {
        // Проверка наличия заголовков
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            hasContentType: res.hasHeader('Content-Type'),
            hasXGroup: res.hasHeader('X-Group'),
            hasUnknown: res.hasHeader('X-Unknown')
        }, null, 2));

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Сервер (задание 2) запущен на порту ${PORT}`);
});