let State = require('./State');
let url = require('url');
let qs = require('querystring');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let Promise = require('any-promise');

module.exports = class Middleware {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.middlewares = [
            morgan('short'),
            bodyParser.json,
            bodyParser.urlencoded({extended: false}),
            this.getParam
        ];
    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

    next() {
        let i = 0
        if (i < this.middlewares.length) {
            this.middlewares[i](this.req, this.res, next);
        } else {
            return;
        }
    }

    // 处理url参数
    getParam(req, res, next) {
        req.query = req.query || qs.parse(url.parse(req.url).query);
        req.get = req.get || req.query;
        next();
    }
};