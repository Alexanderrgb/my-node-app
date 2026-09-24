const fs = require('fs');
const path = require('path');

class FileManagerHybrid {
    constructor(baseDir = './data-hybrid') {
        this.baseDir = baseDir;
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }
    }

    // Гибридный метод: поддерживает оба стиля
    readFile(filename, callback) {
        const filePath = path.join(this.baseDir, filename);

        // Если передан колбэк — работаем в старом стиле
        if (typeof callback === 'function') {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return callback(err, null);
                callback(null, data);
            });
            return;
        }

        // Если колбэка нет — возвращаем Промис
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    }

    createFile(filename, content, callback) {
        const filePath = path.join(this.baseDir, filename);

        if (typeof callback === 'function') {
            fs.writeFile(filePath, content, 'utf8', (err) => {
                if (err) return callback(err, null);
                callback(null, filePath);
            });
            return;
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, 'utf8', (err) => {
                if (err) return reject(err);
                resolve(filePath);
            });
        });
    }
}

module.exports = FileManagerHybrid;