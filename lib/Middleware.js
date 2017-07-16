let State = require('./Store');
let url = require('url');
let statuses = require('statuses');
let Stream = require('stream');
let qs = require('querystring');
let morgan = require('koa-morgan');
let compose = require('koa-compose');
let bodyParser = require('koa-bodyparser');


module.exports = class Middleware {
    constructor(ctx) {
        this.ctx = ctx;
        this.middlewares = [
            morgan('short'),
            bodyParser(),
            this.getParam()
        ];
    }

    load() {
        const fn = compose(this.middleware);
        fn(this.ctx)
            .then(() => this.respond())
            .catch(err => {
                throw new Error(err)
            });
    }

    // middleware callback
    respond() {
        let ctx = this.ctx;
        // allow bypassing koa
        if (false === ctx.respond) return;

        const res = ctx.res;
        if (!ctx.writable) return;

        let body = ctx.body;
        const code = ctx.status;

        // ignore body
        if (statuses.empty[code]) {
            // strip headers
            ctx.body = null;
            return ctx.end();
        }

        if ('HEAD' == ctx.method) {
            if (!res.headersSent && isJSON(body)) {
                ctx.length = Buffer.byteLength(JSON.stringify(body));
            }
            return ctx.end();
        }

        // status body
        if (null == body) {
            body = ctx.message || String(code);
            if (!ctx.headersSent) {
                ctx.type = 'text';
                ctx.length = Buffer.byteLength(body);
            }
            return ctx.end(body);
        }
        // responses
        if (Buffer.isBuffer(body)) return ctx.end(body);
        if ('string' == typeof body) return ctx.end(body);
        if (body instanceof Stream) return body.pipe(ctx.res);

        // body: json
        body = JSON.stringify(body);
        if (!ctx.headersSent) {
            ctx.length = Buffer.byteLength(body);
        }
        ctx.end(body);
    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

    // 处理url参数
    getParam(ctx, next) {
        return async function (ctx, next) {
            ctx.query = ctx.query || qs.parse(url.parse(ctx.url).query);
            ctx.get = ctx.get || ctx.query;
            await next();
        }
    }
};