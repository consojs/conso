let State = require('./State');
let url = require('url');
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

    load(callback) {
        const fn = compose(this.middleware);
        fn(this.ctx)
            .then((ctx) => callback && callback())
            .catch(err => {
                throw new Error(err)
            });
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