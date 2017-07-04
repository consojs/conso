let path = require('path');
let fs = require('fs');
let http = require('http');
let Emitter = require('events');
let accepts = require('accepts');

let debug = require('debug')('conso:application');

let State = require('./lib/State');
let Router = require('./lib/Router');
let Context = require('./lib/Context');
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
        this.proxy = false;
        this.subdomainOffset = 2;
        this.env = process.env.NODE_ENV || 'development';
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

    handleServer(req, res) {
        let ctx = new Context(this, req, res);
        let middleware = new Middleware(ctx);
        middleware.middleware = this.handleRouter;
        middleware.load();

    }

    handleRouter(ctx, next) {
        let handleRouter = State.annotation.filter(item => new RegExp(`^${item.route.path}`).test(ctx.url))[0];
        if (handleRouter) {
            const method = ctx.method.toLowerCase();
            let router = handleRouter.route;
            let index = router.path.length;
            let handleClass = router.value;
            let handleMethod = handleRouter[method].filter(item => new RegExp(`^${item.path}`).test(ctx.url.substr(index)))[0];
            handleRouter.resource.map(item => {
                handleClass[item.key] = item.value;
            });
            if (handleMethod) {
                handleMethod.value.call(handleClass, ctx, next);
                return false;
            }
        }
        ctx.res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
        ctx.res.end("{'code':404,'message':'404 页面不见啦'}");
        return false;
    }

    afterCreate() {
        console.log(`listen on port:${this.port}`);
    }
}


module.exports = {Router, Annotation, Application};
