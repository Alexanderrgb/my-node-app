

const fs = require('fs').promises; 
const fsSync = require('fs');     
const path = require('path');     
const { pipeline } = require('stream/promises'); 


const VARIANT = 21;
const STUDENT = {
  fullName: 'Судник Александр Николаевич',
  group: '477',
  favoriteBooks: [
    '"Война и мир" - Л. Толстой',
    '"Преступление и наказание" - Ф. Достоевский',
    '"Мастер и Маргарита" - М. Булгаков',
    '"1984" - Дж. Оруэлл',
    '"Гарри Поттер" - Дж. Роулинг',
  ],
};


const FILE_NAME = path.join(__dirname, `student_${VARIANT}.txt`);


function formatDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

function buildContent() {
  const lines = [
    `Студент: ${STUDENT.fullName}`,
    `Группа: ${STUDENT.group}`,
    `Вариант: ${VARIANT}`,
    `Дата: ${formatDate()}`,
    `Любимые книги:`,
    ...STUDENT.favoriteBooks.map((b, i) => `${i + 1}. ${b}`),
  ];
  return lines.join('\n'); // Каждый элемент с новой строки
}

async function createFile() {
  try {
    const content = buildContent();
    await fs.writeFile(FILE_NAME, content, 'utf8');
    console.log(`Создан файл: ${path.basename(FILE_NAME)}`);
    return true;
  } catch (err) {
    console.error('Ошибка при создании файла:', err.message);
    return false;
  }
}

async function appendCountLine() {
  try {
  
    const data = await fs.readFile(FILE_NAME, 'utf8');
    const currentLines = data.split('\n').length;
    const totalLines = currentLines + 1; 

    const addLine = `\nКоличество записей: ${totalLines}\n`;
    await fs.appendFile(FILE_NAME, addLine, 'utf8');

    console.log(`Добавлена строка: Количество записей: ${totalLines}`);
  } catch (err) {
    console.error('Ошибка при добавлении строки:', err.message);
    throw err; 
  }
}


async function readAndPrint() {
  try {
    const stats = await fs.stat(FILE_NAME);
    const sizeMB = stats.size / (1024 * 1024);

    console.log('\nСодержимое файла:');
    console.log('─'.repeat(33));

    if (stats.size > 1024 * 1024) {
  
      console.log(`(файл большой — ${sizeMB.toFixed(2)} МБ, чтение через поток)\n`);
      await printFileViaStream();
    } else {
      // --- Маленький файл: обычное чтение ---
      const data = await fs.readFile(FILE_NAME, 'utf8');
      // Убираем последний пустой элемент от финального \n
      const clean = data.replace(/\n+$/, '');
      console.log(clean);
    }
  } catch (err) {
    console.error('Ошибка при чтении файла:', err.message);
  }
}

function printFileViaStream() {
  return new Promise((resolve, reject) => {
    const stream = fsSync.createReadStream(FILE_NAME, { encoding: 'utf8' });

    stream.on('data', (chunk) => process.stdout.write(chunk));
    stream.on('end', () => {
      console.log('');
      resolve();
    });
    stream.on('error', (err) => reject(err));
  });
}

async function main() {
  try {
    const created = await createFile();
    if (!created) return;

    await appendCountLine();
    await readAndPrint();
  } catch (err) {
    console.error('Критическая ошибка выполнения:', err);
    process.exitCode = 1;
  }
}

main();