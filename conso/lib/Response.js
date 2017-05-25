let State = require('./State');
module.exports = class Response {
    constructor(res) {
        return this.handle(res);
    }

    handle(res) {
        res.set = res.header = this.set;
        res.json = this.json;
        return res;
    }

    json(val) {
        let body = JSON.stringify(val);
        this.set('Content-Type', 'application/json');
        return this.end(body);
    };

    set(field, val) {
        this.setHeader(field, val);
        return this;
    };
};