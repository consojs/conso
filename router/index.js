let {Router} = require('../conso');
let router = new Router();

@router.route('/home')
class Index {
    constructor() {
    }

    @router.get('/article')
    getArticle(req, res, next) {
        res.render('index', {title: 'conso'});
    }

    @router.post('/article')
    test(req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("xcv");
    }
}
