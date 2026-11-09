const os = require('os');

console.log('=== Информация о процессоре ===');
const cpus = os.cpus();
console.log(`Количество логических ядер: ${cpus.length}`);
console.log(`Модель процессора: ${cpus[0].model}`);

// Расчёт средней частоты
const totalSpeed = cpus.reduce((sum, cpu) => sum + cpu.speed, 0);
const avgSpeed = Math.round(totalSpeed / cpus.length);
console.log(`Средняя частота: ${avgSpeed} МГц`);

console.log('\n=== Информация о памяти ===');
const totalMemGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
const freeMemGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
const usedMemGB = (totalMemGB - freeMemGB).toFixed(2);
const memPercent = ((usedMemGB / totalMemGB) * 100).toFixed(1);

console.log(`Общий объём: ${totalMemGB} ГБ`);
console.log(`Свободно: ${freeMemGB} ГБ`);
console.log(`Использовано: ${usedMemGB} ГБ (${memPercent}%)`);
console.log('Группа: 477');

// Предупреждение при малом объёме памяти
if (parseFloat(memPercent) > 80) {
  console.log('⚠️ ВНИМАНИЕ: Свободной памяти меньше 20%!');
} else {
  console.log('Память в норме');
}

console.log('\n=== Средняя загрузка системы ===');
const loadAvg = os.loadavg();
if (os.platform() === 'win32') {
  console.log('Загрузка CPU (1/5/15 мин): недоступно в Windows');
} else {
  console.log(`Загрузка CPU (1/5/15 мин): ${loadAvg.join(' / ')}`);
}