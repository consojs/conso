let State = require('./State');


let Annotation = {
    ant: null,
    resetRouter: () => {
        Annotation.ant = {};
    },
    route: (url) => {
        Annotation.resetRouter();
        return (target, key, descriptor) => {
            Annotation.ant.route = {path: url, target: target};
            State.annotation.push(Annotation.ant);
            console.log('State.annotation');
            console.dir(State.annotation);
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
    resource: function (refer) {
        return (target, key, descriptor) => {
            Annotation.ant['resource'] = Annotation.ant['resource'] || [];
            Annotation.ant['resource'].push({key: key, value: new refer()});
        };
    }
};
module.exports = Annotation;