let path = require('path');
let fs = require('fs');
let http = require('http');
let Emitter = require('events');
let debug = require('debug')('conso:application');
let State = require('./lib/State');
let Router = require('./lib/Router');
let Request = require('./lib/Request');
let Response = require('./lib/Response');
let Util = require('./lib/Util');

class Application extends Emitter {
    constructor(server) {
        super();
        Object.assign(
            this,
            {server: server},
            JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'))));
        // this.init();
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
        const server = http.createServer(this.handleServer);
        return server.listen(this.port || 4600, this.afterCreate());
    }

    handleServer(req, res) {
        req = new Request(req);
        res = new Request(res);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("1231");
    }

    afterCreate() {
        console.log(`listen on port:${this.port}`);
    }
}


module.exports = {Router, Application};
