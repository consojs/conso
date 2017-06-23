let path = require('path');
let fs = require('fs');
let http = require('http');
let Emitter = require('events');
let debug = require('debug')('conso:application');

let State = require('./lib/State');
let Router = require('./lib/Router');
let Request = require('./lib/Request');
let Response = require('./lib/Response');
let Annotation = require('./lib/Annotation');
let Middleware = require('./lib/Middleware');
let Database = require('./lib/Database');
let Util = require('./lib/Util');

require("babel-register")({
    "plugins": [
        "transform-decorators-legacy",
        "transform-class-properties"
    ]
});

class Application extends Emitter {
    constructor() {
        super();
        const config_file_path = path.join(process.cwd(), 'config.js');
        if (!fs.existsSync(config_file_path)) throw new Error('config.js is not found');
        Object.assign(this, require(config_file_path));
        this.init();
    }


    init() {
        // 扫描包，自动引用
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

    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
        middleware.middleware = fn;
        return this;
    }

    handleServer(req, res) {
        let context = {};
        context.app = request.app = response.app = this;
        context.req = req;
        context.res = res;
        req = new Request(req);
        res = new Response(this.handleRender(res));
        let middleware = new Middleware(req, res);
        middleware.middleware = this.handleRouter;
        middleware.load();

    }

    handleRouter(req, res) {
        let handleRouter = State.annotation.filter(item => new RegExp(`^${item.route.path}`).test(req.url))[0];
        if (handleRouter) {
            const method = req.method.toLowerCase();
            let router = handleRouter.route;
            let index = router.path.length;
            let handleClass = router.value;
            let handleMethod = handleRouter[method].filter(item => new RegExp(`^${item.path}`).test(req.url.substr(index)))[0];
            handleRouter.resource.map(item => {
                handleClass[item.key] = item.value;
            });
            if (handleMethod) {
                handleMethod.value.call(handleClass, req, res);
                return false;
            }
        }
        res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end("{'code':404,'message':'404 页面不见啦'}");
        return false;
    }

    handleRender(res) {
        res.render = (filename, data) => {
            let {view, engine = require(view.name)} = this;
            view.ext = (view.ext.charAt(0) === '.' ? '' : '.') + view.ext;
            let template = fs.readFileSync(path.join(view.baseDir, filename + view.ext), this.encoding || "utf8");
            let result = engine.compile(template)(data);
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end(result);
        };
        return res;
    }

    afterCreate() {
        console.log(`listen on port:${this.port}`);
    }
}


module.exports = {Router, Annotation, Application};
