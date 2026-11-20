const { Writable } = require('stream');

const GROUP = '477';
const STUDENT = 'Судник Александр';

// Данные для записи
const dataToWrite = [
    `Группа: ${GROUP}`,
    `Студент: ${STUDENT}`,
    `Лабораторная работа: №21`,
    `Тема: Потоки в Node.js`
];

let totalChunks = 0;

// Создаем Writable-поток с маленьким буфером (16 байт)
const myWritable = new Writable({
    highWaterMark: 16,
    write(chunk, encoding, callback) {
        totalChunks++;
        // Имитация задержки обработки
        setTimeout(() => {
            console.log(`[WRITE] ${chunk.toString().trim()}`);
            callback(); // Сообщаем, что чанк обработан
        }, 100);
    }
});

console.log('=== Демонстрация Writable-потока ===');

myWritable.on('drain', () => {
    console.log('[DRAIN] Буфер освобожден, продолжаем запись');
});

myWritable.on('finish', () => {
    console.log('[FINISH] Все данные записаны');
    console.log(`Всего записано: ${totalChunks} чанка`);
});

myWritable.on('error', (err) => {
    console.error('[ERROR]', err.message);
});

// Записываем данные
for (const text of dataToWrite) {
    const isBuffered = myWritable.write(text + '\n');
    if (!isBuffered) {
        console.log('write() вернул: false (буфер переполнен!)');
    } else {
        console.log('write() вернул: true');
    }
}

// Завершаем поток
myWritable.end();