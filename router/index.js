let {Router} = require('../conso');
let router = new Router();

@router.request('/home')
class Index {
    constructor() {
        console.log(123);
    }

    @router.get('/article')
    getArticle(req, res, next) {
        return 333;
    }
}
