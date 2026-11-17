const EventEmitter = require('events');

class DatabaseConnection extends EventEmitter {
  constructor() {
    super();
    this.connected = false;
  }

  connect() {
    console.log('[EVENT] Подключение к БД...');
    setTimeout(() => {
      this.connected = true;
      this.emit('connect', { timestamp: new Date().toISOString() });
    }, 500);
  }

  query(sql) {
    if (!this.connected) {
      this.emit('error', new Error('Нет подключения к БД'));
      return;
    }

    console.log(`[EVENT] Выполнение запроса: ${sql}`);
    
    const result = sql.includes('SELECT') 
      ? { rows: 50, message: '50 записей' }
      : { rows: 1, message: '1 запись добавлена' };
      
    this.emit('query', { sql, result });
  }

  close() {
    console.log('[EVENT] Закрытие соединения...');
    this.connected = false;
    this.emit('close');
  }
}

console.log('=== DatabaseConnection (Группа 477) ===');

const db = new DatabaseConnection();

db.on('connect', (data) => {
  console.log(`[EVENT] Соединение установлено (${data.timestamp})`);
});

db.on('query', ({ sql, result }) => {
  console.log(`[EVENT] Результат: ${result.message}`);
});

db.on('close', () => {
  console.log('[EVENT] Соединение закрыто');
});

db.on('error', (err) => {
  console.error(`[EVENT] Ошибка: ${err.message}`);
});

db.connect();

setTimeout(() => {
  db.query('SELECT * FROM students');
  db.query('INSERT INTO students VALUES (...)');
  db.close();
}, 600);

console.log('\n=== Демонстрация ошибки без слушателя ===');
const badDb = new DatabaseConnection();
badDb.connect();
setTimeout(() => {
  // Убираем слушателя error, чтобы показать падение
  badDb.removeAllListeners('error');
  try {
    badDb.emit('error', new Error('Connection timeout'));
  } catch (e) {
    console.log('(без слушателя error — процесс упал бы с исключением)');
  }
}, 700);