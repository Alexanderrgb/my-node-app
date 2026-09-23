const FileManagerHybrid = require('./fileManagerHybrid');
const fs = require('fs');
const manager = new FileManagerHybrid();

// Создаем тестовый файл заранее
fs.writeFileSync('./data-hybrid/test.txt', 'Данные для гибридного теста');

async function runHybridTests() {
    console.log('=== ТЕСТИРОВАНИЕ ГИБРИДНОГО ПОДХОДА ===\n');

    // ТЕСТ 1: Использование как КОЛБЭК
    console.log('1. Вызов с колбэком (старый стиль):');
    manager.readFile('test.txt', (err, data) => {
        if (err) console.error('   ❌ Ошибка:', err.message);
        else console.log('   ✅ Успех (колбэк):', data);
    });

    // ТЕСТ 2: Использование как ПРОМИС
    console.log('\n2. Вызов как промис (async/await):');
    try {
        const data = await manager.readFile('test.txt');
        console.log('   ✅ Успех (промис):', data);
    } catch (err) {
        console.error('   ❌ Ошибка:', err.message);
    }

    // ТЕСТ 3: Обработка ошибки
    console.log('\n3. Проверка обработки ошибки:');
    try {
        await manager.readFile('nonexistent_file.txt');
    } catch (err) {
        console.log('   ✅ Ошибка корректно поймана! Код:', err.code);
    }

    // ТЕСТ 4: createFile в обоих стилях
    console.log('\n4. Создание файла через промис:');
    try {
        const path = await manager.createFile('new.txt', 'Новый файл');
        console.log('   ✅ Создан:', path);
    } catch (err) {
        console.error('   ❌ Ошибка:', err.message);
    }

    console.log('\n5. Создание файла через колбэк:');
    manager.createFile('new2.txt', 'Ещё один файл', (err, path) => {
        if (err) console.error('   ❌ Ошибка:', err.message);
        else console.log('   ✅ Создан:', path);
    });
}

runHybridTests();