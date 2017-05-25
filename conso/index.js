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
        const server = http.createServer(this.handleServer.bind(this));
        return server.listen(this.port || 4600, this.afterCreate());
    }

    handleServer(req, res) {
        this.handleRouter(new Request(req), new Request(res));

    }

    handleRouter(req, res) {
        arguments[0] = new Request(req);
        arguments[1] = new Response(this.handleRender(res));
        let handleClass = State.route.filter(item => new RegExp(`^${item.url}`).test(req.url))[0];
        if (handleClass) {
            const method = req.method.toLowerCase();
            let handleMethod = handleClass[method].filter(item => new RegExp(`^${item.url}`).test(req.url.replace(handleClass.url, '')))[0];
            if (handleMethod) {
                let targetClass = new handleClass.target();
                handleMethod.target.apply(targetClass, arguments);
            }
        }
    }

    handleRender(res) {
        res.render = (filename, data) => {
            this.engine = this.engine || require(this.view.name);
            let template = fs.readFileSync(path.join(this.view.baseDir, filename + this.view.ext), "utf8");
            let result = this.engine.compile(template)(data);
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end(result);
        };
        return res;
    }

    afterCreate() {
        console.log(`listen on port:${this.port}`);
    }
}


module.exports = {Router, Application};
