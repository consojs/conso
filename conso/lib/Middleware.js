let State = require('./State');
let url = require('url');
let qs = require('querystring');
module.exports = class Middleware {
    constructor() {
        this.middlewares = [
            this.getParam
        ];
    }

    get middleware() {
        return this.middlewares;
    }

    set middleware(fn) {
        this.middlewares.push(fn);
    }

    borderParse(res, req) {
    }

    load(req, res) {
        this.middlewares.map(fn => fn(req, res));
    }

    // 处理url参数
    getParam(req, res) {
        req.query = req.query || qs.parse(url.parse(req.url).query);
        req.get = req.get || req.query;

        if (!req.body) {
            let formData = '';
            req.on('data', data => {
                console.log(1)
                formData += data;
            });
            req.on('end', () => {
                console.log(2,qs.parse(formData))
                req.body = qs.parse(formData);
            })
        }
        console.log('req.body:');
        console.log(req.body);

    }
};