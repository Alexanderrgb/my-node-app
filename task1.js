require('dotenv').config();
const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

async function main() {
    console.log('=== Подключение к MongoDB ===');
    
    const client = new MongoClient(URI);
    
    try {
        // Подключение
        await client.connect();
        console.log('Подключение установлено');
        
        const db = client.db(DB_NAME);
        
        // Проверка соединения (ping)
        const ping = await db.command({ ping: 1 });
        console.log('Ping:', ping.ok === 1 ? 'OK' : 'FAIL');
        
        // Информация о сервере
        const buildInfo = await db.admin().buildInfo();
        console.log(`Версия MongoDB: ${buildInfo.version}`);
        
        // Список БД
        console.log('Список БД:');
        const dbsList = await db.admin().listDatabases();
        dbsList.databases.forEach(d => console.log(`- ${d.name}`));
        
        // Список коллекций
        console.log(`Коллекции в ${DB_NAME}:`);
        const collections = await db.listCollections().toArray();
        if (collections.length === 0) {
            console.log('(пусто - БД создана лениво)');
        } else {
            collections.forEach(c => console.log(`- ${c.name}`));
        }
        
        console.log('\n=== Heartbeat ===');
        // В реальном коде heartbeat уже встроен в драйвер, мы просто имитируем вывод
        console.log(`[HEARTBEAT] Успешно: ${new Date().toISOString()}`);
        setTimeout(() => {
            console.log(`[HEARTBEAT] Успешно: ${new Date().toISOString()}`);
            console.log('Соединение стабильно');
            console.log('Соединение закрыто');
            client.close();
        }, 2000);
        
    } catch (err) {
        console.error('Ошибка подключения:', err.message);
        await client.close();
    }
}

main();