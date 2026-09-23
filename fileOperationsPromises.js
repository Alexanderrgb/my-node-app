const fs = require('fs').promises;
const path = require('path');

class FileManagerPromises {
    constructor(baseDir = './data-promises') {
        this.baseDir = baseDir;
        if (!require('fs').existsSync(baseDir)) {
            require('fs').mkdirSync(baseDir, { recursive: true });
        }
    }

    async createFile(filename, content) {
        const filePath = path.join(this.baseDir, filename);
        await fs.writeFile(filePath, content, 'utf8');
        return filePath;
    }

    async readFile(filename) {
        const filePath = path.join(this.baseDir, filename);
        return await fs.readFile(filePath, 'utf8');
    }

    async deleteFile(filename) {
        const filePath = path.join(this.baseDir, filename);
        await fs.unlink(filePath);
    }
}

module.exports = FileManagerPromises;
