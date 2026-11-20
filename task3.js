require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

    console.log('=== Демонстрация ошибок ===');
    
    // 1. Ошибка подключения (неверный порт)
    try {
        await mysql.createConnection({ ...config, port: 9999 });
    } catch (err) {
        console.log(`[${err.code}] Сервер недоступен`);
    }

    // 2. Ошибка авторизации
    try {
        await mysql.createConnection({ ...config, password: 'wrongpassword' });
    } catch (err) {
        console.log(`[${err.code}] Неверный пароль`);
    }

    const pool = mysql.createPool({ ...config, connectionLimit: 10 });

    // 3. Синтаксическая ошибка
    try {
        await pool.query('SELECT * FRM students');
    } catch (err) {
        console.log(`[${err.code}] Синтаксическая ошибка`);
    }

    // Подготовка таблицы для дубликатов и потоков
    await pool.query('DROP TABLE IF EXISTS big_data');
    await pool.query(`
        CREATE TABLE big_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            val INT
        )
    `);

    // 4. Дубликат ключа
    try {
        await pool.query("INSERT INTO big_data (id, name, val) VALUES (1, 'Test', 10)");
        await pool.query("INSERT INTO big_data (id, name, val) VALUES (1, 'Test2', 20)");
    } catch (err) {
        console.log(`[${err.code}] Дублирование ключа`);
    }

    // 5. Null в NOT NULL
    try {
        await pool.query("INSERT INTO big_data (name, val) VALUES (NULL, 10)");
    } catch (err) {
        console.log(`[${err.code}] NULL в NOT NULL столбце`);
    }


    console.log('\n=== Потоковый запрос ===');
    // Генерация 100 000 записей (используем пачки для скорости)
    console.log('Генерация 100 000 записей...');
    let values = [];
    for (let i = 2; i <= 100000; i++) {
        values.push([`User_${i}`, Math.floor(Math.random() * 100)]);
    }
    // Вставляем пачками по 10 000
    for (let i = 0; i < values.length; i += 10000) {
        await pool.query('INSERT INTO big_data (name, val) VALUES ?', [values.slice(i, i + 10000)]);
    }

    console.log('Чтение 100000 записей через поток...');
    let count = 0;
    const startTime = Date.now();

    // Чтение через поток
    const stream = pool.query('SELECT * FROM big_data').stream();
    
    stream.on('data', (row) => {
        count++;
        if (count % 25000 === 0) {
            console.log(`[STREAM] Получено: ${count} (${(count / 100000) * 100}%)`);
        }
    });

    stream.on('end', async () => {
        const time = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`Обработано за ${time} сек`);
        
        // Очистка
        await pool.query('DROP TABLE big_data');
        await pool.end();
        console.log('Тестовая таблица удалена. Пул закрыт.');
    });

    stream.on('error', (err) => {
        console.error('Ошибка потока:', err.message);
    });
}

main();