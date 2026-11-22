const { Readable } = require('stream');

const GROUP = '477';
const STUDENT = 'Судник Александр';

// Данные, которые будем выдавать по частям
const chunks = [
    `Группа: ${GROUP}`,
    `Студент: ${STUDENT}`,
    `Лабораторная работа: №21`,
    `Тема: Потоки в Node.js`
];

let currentChunk = 0;
let totalSize = 0;

const myReadable = new Readable({
    read() {
        if (currentChunk < chunks.length) {
            const data = chunks[currentChunk] + '\n';
            totalSize += Buffer.byteLength(data);
            console.log(`[CHUNK ${currentChunk + 1}] ${chunks[currentChunk]}`);
            this.push(data); // Отправляем чанк
            currentChunk++;
        } else {
            this.push(null); // Конец потока
        }
    }
});

console.log('=== Демонстрация Readable-потока ===');

myReadable.on('data', () => {
    // Данные уже выведены в методе read()
});

myReadable.on('end', () => {
    console.log('[END] Поток завершен');
    console.log(`Всего получено чанков: ${chunks.length}`);
    console.log(`Общий размер данных: ${totalSize} байт`);
});

myReadable.on('error', (err) => {
    console.error('[ERROR]', err.message);
});