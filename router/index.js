let {Router} = require('../conso');
let router = new Router();

export default class index {
    @router.get('/home')
    init(req, res, next) {
        console.log('init...');
    }
}
