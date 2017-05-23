import path from 'path';
import fs from 'fs';
import http from 'http';
import Emitter from 'events';
import Router from './lib/Router';
import Debug from 'debug'
import Scanner from './lib/Scanner';

const debug = new Debug('conso:application');

class Application extends Emitter {
    constructor(server) {
        super();
        Object.assign(
            this,
            {server: server},
            JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'))));
    }

    run() {
        debug('listen');
        const server = this.server || http.createServer(this.callback());
        return server.listen(this.port || 4600);
    }

    callback() {
        return (req, res) => {
            res.writeHead(200, {'Content-Type': 'text/plain'});

            // 发送响应数据 "Hello World"
            res.end('Hello Conso\n');
        };
    }
}


export {Router, Scanner, Application};
