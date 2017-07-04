let State = require('./State');
let url = require('url');
let qs = require('querystring');
<<<<<<< HEAD
let morgan = require('koa-morgan');
let compose = require('koa-compose');
let bodyParser = require('koa-bodyparser');

=======
let morgan = require('morgan');
let bodyParser = require('body-parser');

function next(err) {
    if (err) {
        return this.res.end('error:', err.toString());
    }
    if (this.index < this.middlewares.length) {
        this.middlewares[this.index++](this.req, this.res, next.bind(this));
    }
}
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

module.exports = class Middleware {
    constructor(ctx) {
        this.ctx = ctx;
<<<<<<< HEAD
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
=======
        this.req = ctx.req;
        this.res = ctx.res;
        this.index = 0;
        this.middlewares = [
            morgan('short'),
            bodyParser.json(),
            bodyParser.urlencoded({extended: false}),
            this.getParam
        ];
        return this;
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

<<<<<<< HEAD
    // 处理url参数
    getParam(ctx, next) {
        return async function (ctx, next) {
            ctx.query = ctx.query || qs.parse(url.parse(ctx.url).query);
            ctx.get = ctx.get || ctx.query;
            await next();
        }
=======
    load() {
        next.call(this);
    }

    // 处理url参数
    getParam(req, res, next) {
        req.query = req.query || qs.parse(url.parse(req.url).query);
        req.get = req.get || req.query;
        next();
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
    }
};