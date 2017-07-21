let {Annotation} = require('conso');

let {route, get} = Annotation;

@route('/')
class index {

    @get('/')
    async homePage(ctx, next) {
        await ctx.render('index', {title: 'Conso'});
    }
}
