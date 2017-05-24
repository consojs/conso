let {Router} = require('../conso');
let router = new Router();

@router.request('/home')
class Index {
    constructor(str) {
        console.log(str)
    }

    @router.get('/article')
    getArticle(req, res, next) {
        return 333;
    }
}
