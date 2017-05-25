let {Router} = require('../conso');
let router = new Router();

@router.route('/home')
class Index {
    constructor() {
    }

    @router.get('/test1')
    test1(req, res, next) {
        res.render('index', {title: 'tyut'});
    }

    @router.get('/tes2')
    test2(req, res, next) {
        res.json({data: 'this is a json'});
    }

    @router.post('/tes3')
    test3(req, res, next) {
        res.json({data: 'this is a json'});
    }
}
