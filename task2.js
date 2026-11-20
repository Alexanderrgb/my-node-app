require('dotenv').config();
const mysql = require('mysql2/promise');

const GROUP = '477';

async function main() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // 1. Создание таблицы
        console.log('=== Создание таблицы ===');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                group_name VARCHAR(20) NOT NULL,
                course INT NOT NULL,
                grade DECIMAL(3,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('Таблица students создана');

        // Очистка перед тестом
        await pool.query('TRUNCATE TABLE students');

        // 2. INSERT
        console.log('\n=== INSERT ===');
        const [insert1] = await pool.query(
            'INSERT INTO students (name, group_name, course, grade) VALUES (?, ?, ?, ?)',
            ['Судник Александр', GROUP, 2, 4.50]
        );
        console.log(`Вставлен студент: id=${insert1.insertId}, affectedRows=${insert1.affectedRows}`);

        const [insertMany] = await pool.query(
            'INSERT INTO students (name, group_name, course, grade) VALUES ?',
            [[['Иван', GROUP, 2, 3.80], ['Мария', GROUP, 2, 4.20]]]
        );
        console.log(`Вставлено несколько студентов: affectedRows=${insertMany.affectedRows}`);

        // 3. SELECT
        console.log('\n=== SELECT ===');
        const [allStudents] = await pool.query('SELECT * FROM students');
        console.log('Все студенты:');
        allStudents.forEach(s => console.log(`id=${s.id}, name=${s.name}, group=${s.group_name}, grade=${s.grade}`));

        const [filtered] = await pool.query(
            'SELECT * FROM students WHERE group_name = ? ORDER BY grade DESC',
            [GROUP]
        );
        console.log(`\nСтуденты группы ${GROUP} (сортировка по grade):`);
        filtered.forEach(s => console.log(`id=${s.id}, name=${s.name}, grade=${s.grade}`));

        // 4. UPDATE
        console.log('\n=== UPDATE ===');
        const [upd1] = await pool.query(
            'UPDATE students SET grade = ? WHERE id = ?',
            [5.00, 1]
        );
        console.log(`Обновлен студент id=1: affectedRows=${upd1.affectedRows}, changedRows=${upd1.changedRows}`);

        const [upd2] = await pool.query(
            'UPDATE students SET grade = ? WHERE id = ?',
            [5.00, 1]
        );
        console.log(`Повторное обновление: affectedRows=${upd2.affectedRows}, changedRows=${upd2.changedRows}`);

        // 5. DELETE
        console.log('\n=== DELETE ===');
        const [del] = await pool.query('DELETE FROM students WHERE id = ?', [1]);
        console.log(`Удален студент id=1: affectedRows=${del.affectedRows}`);

        // 6. Защита от SQL-инъекций
        console.log('\n=== Защита от SQL-инъекции ===');
        const injection = "' OR '1'='1";
        console.log(`Попытка инъекции: "${injection}"`);
        
        const [injResult] = await pool.query(
            'SELECT * FROM students WHERE name = ?',
            [injection]
        );
        console.log(`Параметризованный запрос безопасен. Найдено строк: ${injResult.length}`);

    } catch (err) {
        console.error('Ошибка:', err.message);
    } finally {
        await pool.end();
    }
}

main();