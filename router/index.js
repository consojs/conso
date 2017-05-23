let {Router} = require('../conso');
let router = new Router();

module.exports = class Index {
    constructor() {
    }

    @router.get('/home')
    init(req, res, next) {
        console.log('init...');
    }
};
