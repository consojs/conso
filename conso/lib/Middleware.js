let State = require('./State');
let url = require('url');
let qs = require('querystring');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let Promise = require('any-promise');

module.exports = class Middleware {
    constructor() {
        let {f1, f2, f3, f4} = this;
        this.middlewares = [
            // morgan('short'),
            // bodyParser.json,
            // bodyParser.urlencoded({extended: false}),
            // this.getParam
            f1, f2, f3, f4
        ];
    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

    load(req, res, next) {
        // for (let i = 0; i <= this.middlewares.length - 1; i++) {
        //     let fn = this.middlewares[i];
        //     if (i === this.middlewares.length - 1) {
        //         fn(req, res, next);
        //     } else {
        //         runMiddleware(fn);
        //         fn(req, res, this.middlewares[i + 1](req, res));
        //     }
        // }
        const fn = compose(this.middlewares);

        fn(req, res, next).then(() => {
            console.log(666)
        }).catch();

        function compose(middleware) {
            return function (req, res, next) {
                let context = {req, res};
                // last called middleware #
                let index = -1;
                return dispatch(0);
                function dispatch(i) {
                    if (i <= index) return Promise.reject(new Error('next() called multiple times'));
                    index = i;
                    let fn = middleware[i];
                    if (i === middleware.length) fn = next;
                    if (!fn) return Promise.resolve();
                    try {
                        return Promise.resolve(fn(context, function next() {
                            return dispatch(i + 1)
                        }))
                    } catch (err) {
                        return Promise.reject(err)
                    }
                }
            }
        }

    }

    f1(req, res, next) {
        console.log(1);
        req.f = 1;
        next();
    }

    f2(req, res, next) {
        console.log(2);
        req.f = 2;
        next();
    }

    f3(req, res, next) {
        console.log(3);
        req.f = 3;
        next();
    }

    f4(req, res, next) {
        console.log(4);
        req.f = 4;
        next();
    }

    // 处理url参数
    getParam(req, res, next) {
        req.query = req.query || qs.parse(url.parse(req.url).query);
        req.get = req.get || req.query;
        next && next();
    }
};