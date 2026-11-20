require('dotenv').config();
const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const GROUP = '477';

async function main() {
    const client = new MongoClient(URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection('students');
        
        // Очистка перед тестом
        await collection.deleteMany({});
        
        // Создание индекса
        await collection.createIndex({ group_name: 1 });
        console.log('Индекс по group_name создан');
        
        console.log('=== INSERT ===');
        // Вставка одного
        const res1 = await collection.insertOne({
            name: 'Судник Александр',
            group_name: GROUP,
            course: 2,
            grade: 4.5,
            created_at: new Date()
        });
        console.log(`Вставлен: insertedId=${res1.insertedId}`);
        
        // Вставка нескольких
        const resMany = await collection.insertMany([
            { name: 'Иван', group_name: GROUP, course: 2, grade: 3.8, created_at: new Date() },
            { name: 'Мария', group_name: GROUP, course: 2, grade: 4.2, created_at: new Date() }
        ]);
        console.log(`Вставлено ${Object.keys(resMany.insertedIds).length} документа`);
        
        console.log('\n=== SELECT ===');
        // Все документы
        const all = await collection.find({}).toArray();
        console.log(`Все документы (${all.length}):`);
        all.forEach(d => console.log(`name=${d.name}, grade=${d.grade}`));
        
        // С фильтром и сортировкой
        const filtered = await collection.find({ group_name: GROUP }).sort({ grade: -1 }).toArray();
        console.log(`\nС фильтром по группе ${GROUP} и сортировкой по grade:`);
        filtered.forEach(d => console.log(`name=${d.name}, grade=${d.grade}`));
        
        // Проекция (только name и grade)
        const proj = await collection.find({}, { projection: { _id: 0, name: 1, grade: 1 } }).toArray();
        console.log('\nС проекцией (только name, grade):');
        proj.forEach(d => console.log(JSON.stringify(d)));
        
        console.log('\n=== UPDATE ===');
        // Обновление одного
        const updOne = await collection.updateOne(
            { name: 'Судник Александр' },
            { $set: { grade: 5.0 } }
        );
        console.log(`updateOne: matchedCount=${updOne.matchedCount}, modifiedCount=${updOne.modifiedCount}`);
        
        // Обновление многих ($inc course на 1)
        const updMany = await collection.updateMany(
            { group_name: GROUP },
            { $inc: { course: 1 } }
        );
        console.log(`updateMany: matchedCount=${updMany.matchedCount}, modifiedCount=${updMany.modifiedCount}`);
        
        console.log('\n=== DELETE ===');
        const delOne = await collection.deleteOne({ name: 'Иван' });
        console.log(`deleteOne: deletedCount=${delOne.deletedCount}`);
        
        // Удаляем всех, у кого оценка ниже 3 (если есть) или просто удалим остаток
        const delMany = await collection.deleteMany({ grade: { $lt: 3 } });
        console.log(`deleteMany (grade < 3): deletedCount=${delMany.deletedCount}`);

    } catch (err) {
        console.error('Ошибка:', err.message);
    } finally {
        await client.close();
    }
}

main();