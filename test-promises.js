const FileManagerPromises = require('./fileOperationsPromises');
const manager = new FileManagerPromises('./data-promises');

async function runTests() {
    console.log('=== ТЕСТИРОВАНИЕ ПРОМИСОВ ===');
    try {
        const path = await manager.createFile('test1.txt', 'Привет из промисов!');
        console.log('✅ 1. Файл создан:', path);

        const content = await manager.readFile('test1.txt');
        console.log('✅ 2. Прочитано:', content);

        await manager.deleteFile('test1.txt');
        console.log('✅ 3. Файл удален');
        
        console.log('✨ Код стал плоским и читаемым!');
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

runTests();
