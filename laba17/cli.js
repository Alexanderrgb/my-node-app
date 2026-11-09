#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const program = new Command();

// ============================================
// ЗАДАНИЕ 1: Базовый уровень (process.argv)
// ============================================

// Если запущено без аргументов — показываем справку
if (process.argv.length <= 2) {
  console.log(`
Использование: my-cli <команда> [аргументы]

Доступные команды:
  greet <имя>  - поприветствовать пользователя
  info         - вывести информацию о группе
  generate     - сгенерировать отчёт (задание 2)
  convert      - конвертировать файл (задание 2)
  init         - интерактивная инициализация (задание 3)

Для справки используйте: node cli.js --help
  `);
  process.exit(0);
}

// Обработка команд задания 1 через process.argv
const command = process.argv[2];
const arg = process.argv[3];

if (command === 'greet') {
  if (!arg) {
    console.error('Ошибка: укажите имя пользователя');
    console.error('Пример: node cli.js greet "Иван"');
    process.exit(1);
  }
  console.log(`Привет, ${arg}! Добро пожаловать в CLI-приложение группы 477.`);
  process.exit(0);
}

if (command === 'info') {
  const now = new Date().toLocaleDateString('ru-RU');
  console.log(`
Группа: 477
Студент: Судник Александр Николаевич
Лабораторная работа: №17
Дата: ${now}
  `);
  process.exit(0);
}

// ============================================
// ЗАДАНИЕ 2: Средний уровень (commander)
// ============================================

program
  .name('my-cli')
  .description('CLI-приложение для лабораторной работы №17')
  .version('1.0.0');

// Подкоманда generate
program
  .command('generate')
  .description('Сгенерировать отчёт')
  .option('-t, --type <type>', 'тип отчёта (html, pdf, json, csv)', 'html')
  .option('-o, --output <path>', 'путь для сохранения', './output')
  .option('-f, --force', 'перезаписать существующий файл', false)
  .option('--dry-run', 'показать что будет сделано без выполнения', false)
  .option('-v, --verbose', 'подробный вывод', false)
  .action((options) => {
    const validTypes = ['html', 'pdf', 'json', 'csv'];
    
    if (!validTypes.includes(options.type)) {
      console.error(`Ошибка: недопустимый тип отчёта "${options.type}".`);
      console.error(`Допустимые значения: ${validTypes.join(', ')}`);
      process.exit(1);
    }

    const outputPath = `${options.output}.${options.type}`;

    // Проверка существующего файла
    if (fs.existsSync(outputPath) && !options.force) {
      console.error(`Ошибка: файл ${outputPath} уже существует. Используйте --force для перезаписи.`);
      process.exit(1);
    }

    if (options.verbose) {
      console.log(`[VERBOSE] Запуск генерации отчёта...`);
      console.log(`[VERBOSE] Тип отчёта: ${options.type}`);
      console.log(`[VERBOSE] Путь сохранения: ${outputPath}`);
    }

    if (options.dryRun) {
      console.log(`[DRY-RUN] Будет сгенерирован отчёт типа: ${options.type}`);
      console.log(`[DRY-RUN] Файл будет сохранён в: ${outputPath}`);
      console.log(`[DRY-RUN] Действия не выполнены (режим проверки)`);
      return;
    }

    // Создаём файл
    const content = `Отчёт типа ${options.type}\nДата: ${new Date().toLocaleString('ru-RU')}\nГруппа: 477`;
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✓ Отчёт успешно сгенерирован: ${outputPath}`);
  });

// Подкоманда convert
program
  .command('convert')
  .description('Конвертировать файл')
  .requiredOption('-i, --input <path>', 'входной файл')
  .requiredOption('-o, --output <path>', 'выходной файл')
  .option('-v, --verbose', 'подробный вывод', false)
  .action((options) => {
    if (!fs.existsSync(options.input)) {
      console.error(`Ошибка: файл ${options.input} не найден`);
      process.exit(1);
    }

    if (options.verbose) {
      console.log(`[VERBOSE] Конвертация: ${options.input} -> ${options.output}`);
    }

    const content = fs.readFileSync(options.input, 'utf8');
    fs.writeFileSync(options.output, content, 'utf8');
    console.log(`✓ Файл конвертирован: ${options.output}`);
  });

// ============================================
// ЗАДАНИЕ 3: Продвинутый уровень (inquirer)
// ============================================

program
  .command('init')
  .description('Интерактивная инициализация проекта')
  .option('--name <name>', 'название проекта')
  .option('--type <type>', 'тип проекта (web, cli, lib, microservice)')
  .option('--typescript', 'использовать TypeScript', false)
  .option('--prettier', 'использовать Prettier', false)
  .option('--git', 'инициализировать Git', false)
  .option('--no-interactive', 'отключить интерактивный режим')
  .action(async (options) => {
    const isInteractive = options.interactive !== false;

    // Неинтерактивный режим
    if (!isInteractive) {
      if (!options.name || !options.type) {
        console.error('Ошибка: в неинтерактивном режиме необходимо указать --name и --type');
        process.exit(1);
      }

      const validTypes = ['web', 'cli', 'lib', 'microservice'];
      if (!validTypes.includes(options.type)) {
        console.error(`Ошибка: недопустимый тип проекта "${options.type}".`);
        console.error(`Допустимые значения: ${validTypes.join(', ')}`);
        process.exit(1);
      }

      printProjectSummary(options.name, options.type, options);
      return;
    }

    // Интерактивный режим
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Введите название проекта:',
        default: options.name || 'my-project',
        validate: (input) => input.length > 0 || 'Название не может быть пустым'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Выберите тип проекта:',
        choices: [
          { name: 'Web-приложение', value: 'web' },
          { name: 'CLI-утилита', value: 'cli' },
          { name: 'Библиотека', value: 'lib' },
          { name: 'Микросервис', value: 'microservice' }
        ],
        default: options.type
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Выберите дополнительные опции:',
        choices: [
          { name: 'TypeScript', value: 'typescript', checked: options.typescript },
          { name: 'ESLint', value: 'eslint', checked: false },
          { name: 'Prettier', value: 'prettier', checked: options.prettier },
          { name: 'Jest', value: 'jest', checked: false }
        ]
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Использовать Git?',
        default: options.git || false
      },
      {
        type: 'password',
        name: 'token',
        message: 'Введите токен доступа:',
        mask: '*'
      }
    ]);

    printProjectSummary(answers.name, answers.type, answers);
  });

// Функция вывода итоговой информации
function printProjectSummary(name, type, options) {
  const typeNames = {
    web: 'Web-приложение',
    cli: 'CLI-утилита',
    lib: 'Библиотека',
    microservice: 'Микросервис'
  };

  const features = [];
  if (options.typescript || (options.features && options.features.includes('typescript'))) {
    features.push('TypeScript');
  }
  if (options.prettier || (options.features && options.features.includes('prettier'))) {
    features.push('Prettier');
  }
  if (options.eslint || (options.features && options.features.includes('eslint'))) {
    features.push('ESLint');
  }
  if (options.jest || (options.features && options.features.includes('jest'))) {
    features.push('Jest');
  }

  const useGit = options.git || (options.features && options.features.includes('git'));

  console.log(`
✓ Проект "${name}" успешно инициализирован!
  Тип: ${typeNames[type] || type}
  Опции: ${features.length > 0 ? features.join(', ') : 'нет'}
  Git: ${useGit ? 'да' : 'нет'}
  `);
}

// Парсинг аргументов
program.parse(process.argv);