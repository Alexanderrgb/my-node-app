const os = require('os');

console.log('=== Сетевые интерфейсы ===');
const interfaces = os.networkInterfaces();
let interfaceCount = 0;
let mainInterface = null;

for (const [name, details] of Object.entries(interfaces)) {
  for (const detail of details) {
    interfaceCount++;
    
    // Маскирование MAC-адреса
    const maskedMac = detail.mac.replace(/(..:..:..).*/, '$1:**:**:**');
    
    console.log(`Интерфейс: ${name}`);
    console.log(`  IPv4: ${detail.address}`);
    console.log(`  MAC: ${maskedMac}`);
    console.log(`  Внутренний: ${detail.internal ? 'да' : 'нет'}`);
    
    // Определение основного интерфейса (первый внешний IPv4)
    if (!mainInterface && !detail.internal && detail.family === 'IPv4') {
      mainInterface = { name, address: detail.address };
    }
  }
}

console.log(`\nВсего интерфейсов: ${interfaceCount}`);
if (mainInterface) {
  console.log(`Основной интерфейс: ${mainInterface.name} (${mainInterface.address})`);
}

console.log('\n=== Информация о пользователе ===');
const userInfo = os.userInfo();
console.log(`Имя пользователя: ${userInfo.username}`);

if (os.platform() !== 'win32') {
  console.log(`UID: ${userInfo.uid}`);
  console.log(`GID: ${userInfo.gid}`);
}

console.log(`Домашняя директория: ${userInfo.homedir}`);
console.log(`Оболочка по умолчанию: ${userInfo.shell || 'не определена'}`);
console.log('Группа: 477');

// Проверка root для группы ББМО-01-23
if (os.platform() !== 'win32' && userInfo.uid === 0) {
  console.log('⚠️ ВНИМАНИЕ: Вы работаете под root!');
} else {
  console.log('Проверка root: нет');
}