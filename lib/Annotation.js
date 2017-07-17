let Store = require('./Store');
let Waterline = require('waterline');

let Annotation = {
    ant: null,
    resetRouter: () => {
        Annotation.ant = {};
    },
    route: (url) => {
        Annotation.resetRouter();
        return (target, key, descriptor) => {
            Annotation.ant.route = {path: url, value: target};
            Store.annotation.push(Annotation.ant);
        }
    },
    get: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['get'] = Annotation.ant['get'] || [];
            Annotation.ant['get'].push({path: url, value: descriptor.value});
        }
    },
    post: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['post'] = Annotation.ant['post'] || [];
            Annotation.ant['post'].push({path: url, value: descriptor.value});
        }
    },
    model: function (refer) {
        if (!refer || !refer.identity) throw new Error('identity must be request in a module');

        // 添加module
        Store.collection.push(Waterline.Collection.extend(refer));
        return (target, key, descriptor) => {
            Annotation.ant['model'] = Annotation.ant['model'] || [];
            Annotation.ant['model'].push({
                key: refer.identity,
                value:new refer(...Array.prototype.slice.call(arguments, 1))
            });
        };
    }
};
module.exports = Annotation;