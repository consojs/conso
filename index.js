let http = require('http');
let Emitter = require('events');
let accepts = require('accepts');
let serveStatic = require('koa-static');
let debug = require('debug')('conso:application');

let Store = require('./lib/Store');
let Context = require('./lib/Context');
let Annotation = require('./lib/Annotation');
let Scanner = require('./lib/Scanner');
let Middleware = require('./lib/Middleware');
require("babel-register")({
    "plugins": [
        "transform-decorators-legacy",
        "transform-class-properties"
    ]
});

class Application extends Emitter {
    constructor() {
        super();
        Object.assign(this, Store.config());

        // autorequire controller
        this.scanner = new Scanner(this);
    }

    run() {
        const server = http.createServer(this.handleServer.bind(this));
        return server.listen(this.port || 3000, this.afterCreate());
    }

    handleServer(req, res) {
        let ctx = new Context(this, req, res);
        let middleware = new Middleware(ctx);
        // handle static resource
        middleware.middleware = serveStatic(this.public);
        // handle route
        middleware.middleware = this.scanner.handleRouter.bind(this);
        middleware.load();
    }

    afterCreate() {
        console.log(`listen on port:${this.port}`);
    }
}


module.exports = {
    Annotation,
    Application
};
