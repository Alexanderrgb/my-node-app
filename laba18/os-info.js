const os = require('os');

console.log('=== Информация о системе (группа 477) ===');
console.log(`Платформа: ${os.platform()}`);
console.log(`Тип ОС: ${os.type()}`);
console.log(`Архитектура: ${os.arch()}`);
console.log(`Версия ОС: ${os.release()}`);
console.log(`Имя хоста: ${os.hostname()}`);

// Форматирование времени работы
const uptimeSeconds = os.uptime();
const hours = Math.floor(uptimeSeconds / 3600);
const minutes = Math.floor((uptimeSeconds % 3600) / 60);
const seconds = Math.floor(uptimeSeconds % 60);
console.log(`Время работы: ${hours} ч ${minutes} мин ${seconds} сек`);

// Определение платформы
const platform = os.platform();
if (platform === 'win32') {
  console.log('Вы работаете в Windows');
} else if (platform === 'linux') {
  console.log('Вы работаете в Linux');
} else if (platform === 'darwin') {
  console.log('Вы работаете в macOS');
} else {
  console.log('Неизвестная платформа');
}