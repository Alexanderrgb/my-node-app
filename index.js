
const express = require('express');


const app = express();

const PORT = 3000;

const currentDate = new Date().toLocaleString('ru-RU');

app.get('/', (req, res) => {

    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Лабораторная работа №16</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                a { color: blue; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Лабораторная работа №16</h1>
            <p><strong>Группа:</strong> 477</p>
            <p><strong>Текущая дата и время:</strong> ${currentDate}</p>
            <p><strong>Приветственное сообщение:</strong> Добро пожаловать на мой первый сервер на Express.js!</p>
            
            <h3>Список доступных маршрутов:</h3>
            <ul>
                <li><a href="/">Главная страница (/)</a></li>
                <li><a href="/about">О разработчике (/about)</a></li>
                <li><a href="/contacts">Контакты (/contacts)</a></li>
            </ul>
        </body>
        </html>
    `);
});


app.get('/about', (req, res) => {
    res.send(`
        <h1>О разработчике</h1>
        <p>Студент группы <strong>477</strong>.</p>
        <p>Изучаю Node.js и фреймворк Express.js для создания веб-серверов.</p>
        <br>
        <a href="/">← Вернуться на главную</a>
    `);
});


app.get('/contacts', (req, res) => {
    res.send(`
        <h1>Контактная информация</h1>
        <p><strong>Email:</strong>pepepefafafaf67@ </p>
        <p><strong>Telegram:</strong>@luti tg </p>
        <p><strong>Телефон:</strong> +375 1488 67 67</p>
        <br>
        <a href="/">← Вернуться на главную</a>
    `);
});


app.listen(PORT, () => {
    
    console.log(` Сервер успешно запущен!`);
    console.log(` Откройте в браузере: http://localhost:${PORT}`);
});