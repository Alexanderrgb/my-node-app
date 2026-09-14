var fs = require('fs');

function setupLogger(app) {
    app.on('server:started', function(port) {
        var time = new Date().toLocaleString();
        var message = '[' + time + '] server:started: port ' + port + '\n';
        fs.appendFile('logs.txt', message, function() {});
    });

    app.on('request:received', function(info) {
        var time = new Date().toLocaleString();
        var message = '[' + time + '] request:received: ' + info.method + ' ' + info.url + '\n';
        fs.appendFile('logs.txt', message, function() {});
    });

    app.on('server:stopped', function() {
        var time = new Date().toLocaleString();
        var message = '[' + time + '] server:stopped\n';
        fs.appendFile('logs.txt', message, function() {});
    });
}

module.exports = {
    setupLogger: setupLogger
};
