const { MongoClient } = require('mongodb');

let db = null;

async function connectDB() {
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('[INFO] MongoDB подключена');
        return db;
    } catch (err) {
        console.error('Ошибка подключения к MongoDB:', err.message);
        process.exit(1);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };