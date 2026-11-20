const http = require('http');
const url = require('url');

const PORT = 3000;
const GROUP = 'ББМО-01-23';
const MAX_SIZE = 1024 * 1024; // Ограничение в 1 МБ

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const contentType = req.headers['content-type'] || '';

    if (path === '/echo' && method === 'POST') {
        let body = '';
        let bodySize = 0;

        // Чтение тела через события
        req.on('data', chunk => {
            bodySize += chunk.length;
            if (bodySize > MAX_SIZE) {
                res.writeHead(413, { 'Content-Type': 'text/plain' });
                res.end('413 Payload Too Large');
                req.destroy(); // Прерываем получение данных
                return;
            }
            body += chunk.toString();
        });

        req.on('end', () => {
            if (res.writableEnded) return; // Если уже отправили 413
            console.log(`[LOG] Получено тело размером: ${bodySize} байт`);

            try {
                if (contentType.includes('application/json')) {
                    const jsonData = JSON.parse(body);
                    jsonData.group = GROUP; // Добавляем группу по заданию
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(jsonData, null, 2));
                } else if (contentType.includes('text/plain')) {
                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(body);
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(body);
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('400 Bad Request (JSON parse error)');
            }
        });

        req.on('error', (err) => {
            res.writeHead(500);
            res.end('500 Internal Server Error');
        });

    } else if (path === '/form' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            // Парсим данные из формы (application/x-www-form-urlencoded)
            const params = new URLSearchParams(body);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result, null, 2));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Сервер (задание 3) запущен на порту ${PORT}`);
});