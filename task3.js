require('dotenv').config();
const { MongoClient } = require('mongodb');

const URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

async function main() {
    const client = new MongoClient(URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection('students_big');
        
        // Очистка и генерация 10000 документов
        await collection.deleteMany({});
        console.log('Генерация 10000 документов...');
        const docs = [];
        for (let i = 1; i <= 10000; i++) {
            docs.push({
                name: `Student_${i}`,
                group_name: i % 2 === 0 ? '477' : '478',
                course: (i % 4) + 1,
                grade: (Math.random() * 3 + 2).toFixed(1) // от 2.0 до 5.0
            });
        }
        
        // Вставляем пачками по 1000
        for (let i = 0; i < docs.length; i += 1000) {
            await collection.insertMany(docs.slice(i, i + 1000));
        }
        console.log('Вставка завершена.\n');
        
        console.log('=== Курсоры ===');
        const startCursor = Date.now();
        const cursor = collection.find({}).batchSize(1000);
        let count = 0;
        for await (const doc of cursor) {
            count++;
        }
        console.log(`Итерация через for await: Получено ${count} документов за ${(Date.now() - startCursor)/1000} сек`);
        
        console.log('\n=== Агрегации ===');
        // Средний балл по группам
        const aggAvg = await collection.aggregate([
            { $group: { _id: "$group_name", avgGrade: { $avg: "$grade" } } }
        ]).toArray();
        console.log('Средний балл по группам:');
        aggAvg.forEach(g => console.log(`${g._id}: ${g.avgGrade.toFixed(2)}`));
        
        // Количество по курсам
        const aggCount = await collection.aggregate([
            { $group: { _id: "$course", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();
        console.log('\nКоличество по курсам:');
        aggCount.forEach(c => console.log(`${c._id} курс: ${c.count}`));
        
        // $lookup (имитация JOIN с коллекцией groups)
        console.log('\n$Lookup (имитация JOIN):');
        // Создадим коллекцию групп для теста
        const groupsCol = db.collection('groups');
        await groupsCol.deleteMany({});
        await groupsCol.insertMany([{ _id: '477', curator: 'Сидоров С.С.' }, { _id: '478', curator: 'Петров П.П.' }]);
        
        const aggLookup = await collection.aggregate([
            { $group: { _id: "$group_name", studentsCount: { $sum: 1 } } },
            { $lookup: { from: 'groups', localField: '_id', foreignField: '_id', as: 'groupInfo' } },
            { $unwind: "$groupInfo" },
            { $project: { _id: 1, studentsCount: 1, curator: "$groupInfo.curator" } }
        ]).toArray();
        console.log('Результат:');
        aggLookup.forEach(g => console.log(`Группа: ${g._id}, студентов: ${g.studentsCount}, куратор: ${g.curator}`));
        
        console.log('\n=== Индексы ===');
        await collection.createIndex({ group_name: 1, grade: -1 });
        console.log('Создан составной индекс: group_name_1_grade_-1');
        
        // Текстовый индекс и поиск
        await collection.createIndex({ name: 'text' });
        console.log('Создан текстовый индекс: name_text');
        
        const textSearch = await collection.find({ $text: { $search: 'Student_1' } }).toArray();
        console.log(`\nТекстовый поиск 'Student_1': Найдено ${textSearch.length} документов`);

    } catch (err) {
        console.error('Ошибка:', err.message);
    } finally {
        await client.close();
    }
}

main();