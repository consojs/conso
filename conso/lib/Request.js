let State = require('./State');
module.exports = class Request {
    constructor(req) {
        return this.handle(req);
    }

    handle(req) {
        let router = State.router.filter(item => new RegExp(`^${item.url}`).test(req.url));
        console.log(router);
        return req;
    }
};