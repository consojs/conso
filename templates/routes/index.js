let {Annotation} = require('conso');
let User = require('../module/User');

let {route, get, post, model} = Annotation;

@route('/')
class index {

    @model(User)
    user;

    @get('/')
    index(ctx, next) {
        ctx.render('index', {title: 'Conso'});
    }
}
