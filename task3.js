const fs = require('fs');
const { pipeline } = require('stream');

// Создаем тестовый файл для чтения
fs.writeFileSync('input.txt', 'Это тестовый текст для Лабораторной работы 21.\nСтудент: Судник Александр, Группа: 477.\n');

console.log('=== Демонстрация pipe() ===');
// 1. Успешный pipe()
const readStream1 = fs.createReadStream('input.txt');
const writeStream1 = fs.createWriteStream('output-pipe.txt');

readStream1.pipe(writeStream1);
writeStream1.on('finish', () => {
    console.log('Копирование через pipe() завершено');
    console.log(`Размер: ${fs.statSync('output-pipe.txt').size} байт\n`);
    
    // 2. pipe() с ошибкой
    console.log('=== Демонстрация pipe() с ошибкой ===');
    const readStreamErr = fs.createReadStream('missing.txt'); // Несуществующий файл
    const writeStreamErr = fs.createWriteStream('output-error.txt');

    readStreamErr.pipe(writeStreamErr);
    
    readStreamErr.on('error', (err) => {
        console.log(`Ошибка: ${err.message}`);
        console.log('Внимание: pipe() не закрыл целевой поток! Возможна утечка памяти.\n');
        
        // Запускаем pipeline() после того, как pipe() отработал с ошибкой
        runPipeline();
    });
});

// 3. Успешный и ошибочный pipeline()
function runPipeline() {
    console.log('=== Демонстрация pipeline() ===');
    pipeline(
        fs.createReadStream('input.txt'),
        fs.createWriteStream('output-pipeline.txt'),
        (err) => {
            if (err) {
                console.error('Ошибка pipeline:', err.message);
            } else {
                console.log('Копирование через pipeline() завершено\n');
                
                console.log('=== Демонстрация pipeline() с ошибкой ===');
                pipeline(
                    fs.createReadStream('missing.txt'),
                    fs.createWriteStream('output-error2.txt'),
                    (err) => {
                        console.log(`Ошибка: ${err.message}`);
                        console.log('Все потоки автоматически закрыты. Утечек нет.\n');
                        
                        runChain();
                    }
                );
            }
        }
    );
}

// 4. Цепочка потоков (Transform)
function runChain() {
    const { Transform } = require('stream');
    console.log('=== Цепочка потоков ===');

    // Поток для перевода в верхний регистр
    const upperCaseTransform = new Transform({
        transform(chunk, encoding, callback) {
            callback(null, chunk.toString().toUpperCase());
        }
    });

    pipeline(
        fs.createReadStream('input.txt'),
        upperCaseTransform,
        fs.createWriteStream('output-chain.txt'),
        (err) => {
            if (err) {
                console.error('Ошибка цепочки:', err.message);
            } else {
                console.log('Обработка цепочки завершена. Проверьте output-chain.txt');
            }
        }
    );
}