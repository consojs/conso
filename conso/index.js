let path = require('path');
let fs = require('fs');
let http = require('http');
let Emitter = require('events');
let State = require('./lib/state');
let Router = require('./lib/Router');
let Scanner = require('./lib/Scanner');
let Util = require('./lib/Util');

class Application extends Emitter {
    constructor(server) {
        super();
        Object.assign(
            this,
            {server: server},
            JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'))));
        this.init();
    }

    init() {
        // const scanner = new Scanner(this.annotations.basePackage)
        let baseDir = path.join(process.cwd(), this.annotations.basePackage);
        let dirList = fs.readdirSync(baseDir);
        dirList.map(file => {
            let filePath = path.join(process.cwd(), this.annotations.basePackage, file);
            Util.autoLoad(filePath);
        });
    }

    run() {
        const server = this.server || http.createServer(this.callback());
        return server.listen(this.port || 4600);
    }

    callback() {
        return (req, res) => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello Conso\n');
        };
    }
}


module.exports = {Router, Scanner, Application};
