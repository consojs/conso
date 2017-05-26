let State = require('./State');
let bodyParser = require('body-parser');
let parseUrl = require('parseurl');
let qs = require('qs');
module.exports = class Middleware {
    constructor() {
        this.middlewares = [
            this.param4get,
            bodyParser.urlencoded({extended: false})
        ];
    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

    load(req, res, next) {
        this.middlewares.map(fn => fn(req, res, next));
    }

    param4get(req, res, next) {
        if (!req.query) {
            let val = parseUrl(req).query;
            req.query = qs.parse(val);
        }
        if (!req.get) {
            req.get = req.query;
        }
    };

    // param4post(req, res) {
    //     if (!req.query) {
    //         let val = parseUrl(req).query;
    //         req.query = qs.parse(val);
    //     }
    //     if (!req.get) {
    //         req.get = req.query;
    //     }
    // };
};