let State = require('./State');


let Annotation = {
    ant: null,
    resetRouter: () => {
        Annotation.ant = {router: {}};
    },
    route: (url) => {
        Annotation.resetRouter();
        return (target, key, descriptor) => {
            Annotation.ant.router.route = {path: url, target: target};
            State.annotation.push(Annotation.ant);
            console.log('State.annotation');
            console.dir(State.annotation[0].router.resource);
        }
    },
    get: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant.router['get'] = Annotation.ant.router['get'] || [];
            Annotation.ant.router['get'].push({path: url, value: descriptor.value});
        }
    },
    post: function (url) {
        return (target, key, descriptor) => {
            Annotation.ant.router['post'] = Annotation.ant.router['post'] || [];
            Annotation.ant.router['post'].push({path: url, value: descriptor.value});
        }
    },
    resource: function () {
        console.log('resource');
        return ((target, key, descriptor) => {
            Annotation.ant.router['resource'] = Annotation.ant.router['resource'] || [];
            Annotation.ant.router['resource'].push({key: target[1], value: target[2].initializer()});
        })(arguments);
    }
};
module.exports = Annotation;