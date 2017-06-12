let State = require('./State');
module.exports = class Request {
    constructor(res) {
        return this.handle(res);
    }

    handle(res) {
        return res;
    }
};