

const fullName = "Судник Александр Николаевич";

const group = "477"; 


const journalNumber = 21; 


function calculatePi(iterations) {
    let pi = 0;
    let sign = 1;
    for (let i = 0; i < iterations; i++) {
        pi += sign / (2 * i + 1);
        sign *= -1;
    }
    return pi * 4;
}


const iterations = 10000000;
const pi = calculatePi(iterations);


console.log(fullName);                       
console.log(group);                          
console.log(pi.toFixed(journalNumber));      

var http = require('http');
var EventEmitter = require('events');

class AppServer extends EventEmitter {
    constructor() {
        super();
        this.server = null;
    }

    start(port) {
        var self = this;
        this.server = http.createServer(function(req, res) {
            var requestData = {
                url: req.url,
                method: req.method
            };
            self.emit('request:received', requestData);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello from Event-Driven Server!');
        });

        this.server.listen(port, function() {
            self.emit('server:started', port);
        });
    }

    stop() {
        var self = this;
        if (this.server != null) {
            this.server.close(function() {
                self.emit('server:stopped');
            });
        }
    }
}

var app = new AppServer();

app.on('server:started', function(p) {
    console.log('server started on ' + p);
});

app.on('request:received', function(info) {
    console.log('poluchen zapros: ' + info.method + ' ' + info.url);
});

app.on('server:stopped', function() {
    console.log('server stop');
});

app.start(3000);

setTimeout(function() {
    app.stop();
}, 10000);
