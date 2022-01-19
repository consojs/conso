let Store = require('./Store');
let Util = require('./Util');
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

            // order by path.length
            Util.getObjKeys(Annotation.ant).map((method) => {
                if ('model' === method || 'route' === method) {
                    return true;
                }
                Annotation.ant[method].sort((a, b) => a.path.length - b.path.length);
            });

            Store.annotation.push(Annotation.ant);
        };
    },
    model: function (refer) {
        if (!refer || !refer.identity) throw new Error('identity must be request in a module');

        // add module
        refer.connection = refer.connection || 'client';
        Store.Collection[refer.identity] = Waterline.Collection.extend(refer);
        return (target, key, descriptor) => {
            Annotation.ant['model'] = Annotation.ant['model'] || [];
            Annotation.ant['model'].push({
                key: refer.identity
            });
        };
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
    head: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['head'] = Annotation.ant['head'] || [];
            Annotation.ant['head'].push({path: url, value: descriptor.value});
        }
    },
    options: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['options'] = Annotation.ant['options'] || [];
            Annotation.ant['options'].push({path: url, value: descriptor.value});
        }
    },
    put: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['put'] = Annotation.ant['put'] || [];
            Annotation.ant['put'].push({path: url, value: descriptor.value});
        }
    },
    delete: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['delete'] = Annotation.ant['delete'] || [];
            Annotation.ant['delete'].push({path: url, value: descriptor.value});
        }
    },
    trace: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['trace'] = Annotation.ant['trace'] || [];
            Annotation.ant['trace'].push({path: url, value: descriptor.value});
        }
    },
    connect: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant['connect'] = Annotation.ant['connect'] || [];
            Annotation.ant['connect'].push({path: url, value: descriptor.value});
        }
    },
};
module.exports = Annotation;
