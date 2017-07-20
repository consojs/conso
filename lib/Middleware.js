let url = require('url');
let qs = require('querystring');
let morgan = require('koa-morgan');
let bodyParser = require('koa-bodyparser');


module.exports = class Middleware {
    constructor(ctx) {
        this.ctx = ctx;
        this.middlewares = [
            morgan('short'),
            bodyParser(),
            this.getParam
        ];
    }

    async load(callback) {
        let handleFn = async (i) => {
            if (i === this.middlewares.length) return false;
            let fn = this.middlewares[i];
            await fn(this.ctx, async () => {
                await handleFn(i + 1);
            })
        };
        await handleFn(0);

        callback();

    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

    // 处理url参数
    async getParam(ctx, next) {
        ctx.query = ctx.query || qs.parse(url.parse(ctx.url).query);
        ctx.get = ctx.get || ctx.query;
        await next();
    }
};