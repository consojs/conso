const {resolve} = require('path');
let fs = require('fs');


let Store = require('./Store');
let Database = require('./Database');
let Util = require('./Util');

class Scanner {
    constructor(app) {
        this.app = app;
        if (app.annotations.enable) {
            let baseDir = resolve(app.annotations.basePackage);
            let dirList = fs.readdirSync(baseDir);
            dirList.map(file => {
                let filePath = resolve(app.annotations.basePackage, file);
                Util.autoLoad(filePath);
            });
        }
    }

    async handleRouter(ctx, next) {

        if (!ctx.app.annotations.enable) return next();

        let handleRouter = Store.annotation.filter(item => new RegExp(`^${item.route.path}`).test(ctx.url))[0];
        if (handleRouter) {
            const method = ctx.method.toLowerCase();
            let router = handleRouter.route;
            let index = router.path.length;
            let handleClass = router.value;
            let handleMethod = handleRouter[method].filter(item => new RegExp(`^${item.path}`).test(ctx.url.substr(index)))[0];

            this.database = this.database || await Database();
            handleRouter.model.map(item => {
                handleClass[item.key] = this.database.collections[item.key];
            });

            if (handleMethod) {
                handleMethod.value.call(handleClass, ctx, next);
                return next();
            } 
        }
        ctx.res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
        ctx.res.end("404");
    }
}

module.exports = Scanner;