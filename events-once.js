const EventEmitter = require('events');

const emitter = new EventEmitter();

console.log('=== Сравнение on и once (Группа 477) ===');

let onCount = 0;
let onceCount = 0;

emitter.on('tick', () => {
  onCount++;
  console.log(`[tick#${onCount}] on-слушатель`);
});

emitter.once('tick', () => {
  onceCount++;
  console.log(`[tick#1] once-слушатель`);
});

emitter.on('order', () => console.log('1. Первый слушатель (группа 477)'));
emitter.on('order', () => console.log('2. Второй слушатель'));
emitter.on('order', () => console.log('3. Третий слушатель'));

for (let i = 1; i <= 3; i++) {
  emitter.emit('tick');
}

console.log(`\non-слушатель вызван: ${onCount} раза`);
console.log(`once-слушатель вызван: ${onceCount} раз`);

console.log('\n=== Управление подписками ===');
console.log(`Слушателей до удаления: ${emitter.listenerCount('order')}`);

const firstListener = emitter.listeners('order')[0];
emitter.removeListener('order', firstListener);
console.log(`Слушателей после удаления одного: ${emitter.listenerCount('order')}`);

emitter.removeAllListeners('order');
console.log(`Слушателей после removeAllListeners: ${emitter.listenerCount('order')}`);

console.log('\n=== Порядок вызова ===');
emitter.emit('order');