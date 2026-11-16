const EventEmitter = require('events');

const emitter = new EventEmitter();

console.log('=== Демонстрация EventEmitter (Группа 477) ===');

emitter.on('greet', (name) => {
  console.log(`[greet] Привет, ${name}!`);
});

emitter.on('info', () => {
  console.log('[info] Группа: 477');
});

emitter.on('bye', () => {
  console.log('[bye] До свидания!');
});

emitter.emit('greet', 'Иван');
emitter.emit('info');
emitter.emit('bye');

console.log('\nПроверка наличия слушателей:');
console.log(`Событие "unknown" без слушателей: ${emitter.emit('unknown')}`); // false
console.log(`Событие "greet" со слушателями: ${emitter.emit('greet', 'Алексей')}`); // true