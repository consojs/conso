'use strict';

let http = require('http');
let {resolve} = require('path');
let fs = require('fs');
let Emitter = require('events');
let Stream = require('stream');
let statuses = require('statuses');
let serveStatic = require('koa-static');
let pathToRegexp = require('path-to-regexp');

let Util = require('./lib/Util');
let Store = require('./lib/Store');
let Context = require('./lib/Context');
let Database = require('./lib/Database');
let Annotation = require('./lib/Annotation');
let Middleware = require('./lib/Middleware');
require("babel-register")({
    "plugins": [
        "transform-decorators-legacy",
        "transform-class-properties"
    ]
});

/**
 * Application
 */
class Application extends Emitter {
    constructor(option = {}) {
        super();
        Object.assign(this, Store.config(option));
        this._middleware = [];

        // auto require routes
        if (this.annotations.enable) {
            let baseDir = resolve(this.annotations.basePackage);
            let dirList = fs.readdirSync(baseDir);
            dirList.map(file => {
                let filePath = resolve(this.annotations.basePackage, file);
                Util.autoLoad(filePath);
            });
        }

        if (this.DBConfig) {
            Store.database = Store.database || Database();
        }
    }

    /**
     * start server
     * @example new Application().run()
     */
    run() {
        const server = http.createServer(this.handleServer.bind(this));
        return server.listen(this.port || 3000, this.afterCreate());
    }

    /**
     * Add middleware function
     * @param fn {Function} middleware function
     * @returns {Application} return application,for method chaining
     * @example
     * app.use((ctx,next)=>{
     *      console.log('middleware')
     * })
     */
    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
        this._middleware.push(fn);
        return this;
    }

    /**
     * handleServer callback
     * @param req
     * @param res
     * @private
     */
    handleServer(req, res) {

        this.ctx = new Context(this, req, res);

        this.middleware = new Middleware(this.ctx);
        // handle use
        this._middleware.map(mdw => middleware.middleware = mdw);
        // handle static resource
        this.middleware.middleware = serveStatic(this.public);
        // handle route
        this.middleware.middleware = this.handleRouter;

        this.middleware.load(this.handleSend.bind(this));
    }

    /**
     * handle router mapping
     * @param ctx
     * @param next
     * @returns {Promise.<*>}
     * @private
     */
    async handleRouter(ctx, next) {
        if (!ctx.app.annotations.enable) return await next();

        let handleRouter;
        Store.annotation.map(item => {
            if (new RegExp(`^${item.route.path}`).test(ctx.url)) handleRouter = item;
        });

        if (handleRouter) {

            const method = ctx.method.toLowerCase();

            let router = handleRouter.route;
            let index = '/' === router.path ? router.path.length - 1 : router.path.length;
            let handleClass = router.value;
            let handleMethod, params_key = [];

            handleRouter[method].map(item => {
                let match = pathToRegexp(item.path, params_key).exec(ctx.url.substr(index));

                if (match) {
                    handleMethod = item;
                    params_key.map((key, index) => ctx.params[key.name] = match[index + 1])
                }
            });

            if (ctx.app.DBConfig) {
                handleRouter.model && handleRouter.model.map(item => {
                    handleClass[item.key] = Store.database.collections[item.key];
                });
            }

            if (handleMethod) {
                await handleMethod.value.call(handleClass, ctx);
            }
        }
    }

    /**
     * handle response
     * @returns {*}
     * @private
     */
    handleSend() {
        let {status: code, body, res} = this.ctx;

        if (!this.ctx.writable) return;

        // ignore body
        if (statuses.empty[code]) {
            this.ctx.body = null;
            return this.ctx.end();
        }

        if ('HEAD' === this.ctx.method) {
            if (!res.headersSent && isJSON(body)) {
                this.ctx.length = Buffer.byteLength(JSON.stringify(body));
            }
            return this.ctx.end();
        }

        // status body
        if (null == body) {
            body = this.ctx.message || String(code);
            if (!this.ctx.headersSent) {
                this.ctx.type = 'text';
                this.ctx.length = Buffer.byteLength(body);
            }
            return this.ctx.end(body);
        }
        // responses
        if (Buffer.isBuffer(body)) return this.ctx.end(body);
        if ('string' == typeof body) return this.ctx.end(body);
        if (body instanceof Stream) return body.pipe(res);

        body = body || "";

        // body: json
        body = JSON.stringify(body);
        if (!this.ctx.headersSent) {
            this.ctx.length = Buffer.byteLength(body);
        }
        this.ctx.end(body);
    }

    /**
     * after create server callback
     * @returns {*}
     * @private
     */
    afterCreate() {
        console.log(`listen on port:${this.port}`);
    }
}

module.exports = {
    Annotation,
    Application
};
