let State = require('./State');
let url = require('url');
let qs = require('querystring');
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

module.exports = class Middleware {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.index = 0;
        this.middlewares = [
            morgan('short'),
            bodyParser.json(),
            bodyParser.urlencoded({extended: false}),
            this.getParam
        ];
        return this;
    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

    load() {
        next.call(this);
    }

    // 处理url参数
    getParam(req, res, next) {
        req.query = req.query || qs.parse(url.parse(req.url).query);
        req.get = req.get || req.query;
        next();
    }
};