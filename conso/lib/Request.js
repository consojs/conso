let State = require('./State');
module.exports = class Request {
    constructor(req) {
        return this.handle(req);
    }

    handle(req) {
        return req;
    }
};