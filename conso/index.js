import path from 'path';
import fs from 'fs';
import http from 'http';
import Emitter from 'events';
import Router from './lib/Router';
import Scanner from './lib/Scanner';


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
        if (this.annotations.enable) {
            const scanner = new Scanner(this.annotations.basePackage)
        }
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


export {Router, Scanner, Application};
