let {Annotation} = require('conso');

let {route, get} = Annotation;

@route('/')
class index {

    @get('/')
    index(ctx, next) {
        ctx.render('index', {title: 'Conso'});
    }
}
