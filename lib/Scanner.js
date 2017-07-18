const {resolve} = require('path');
let fs = require('fs');
let pathToRegexp = require('path-to-regexp');
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
        ctx.url += '/';
        ctx.url = ctx.url.replace(/\/+/g, '/');

        if (handleRouter) {

            const method = ctx.method.toLowerCase();

            let router = handleRouter.route;
            let index = router.path.length;
            let handleClass = router.value;
            let handleMethod, params_key = [];

            handleRouter[method].map(item => {
                let match = pathToRegexp(item.path, params_key).exec(ctx.url.substr(index));
                if (match) {
                    handleMethod = item;
                    params_key.map((key, index) => ctx.params[key.name] = match[index + 1])
                }
            });

            if (ctx.app.DBConfig) {
                this.database = this.database || await Database();
                handleRouter.model.map(item => {
                    handleClass[item.key] = this.database.collections[item.key];
                });
            }
            if (handleMethod) {
                await handleMethod.value.call(handleClass, ctx, next);
                return next();
            }

        }
        ctx.res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
        ctx.res.end("404");
    }
}

module.exports = Scanner;