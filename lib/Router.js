let State = require('./State');

module.exports = class Router {
    constructor() {
        this._route = {};
    }

    route(url) {
        return (target, key, descriptor) => {
            Object.assign(this._route, {url: url, target: target});
            this.setState();
        }
    }

    get(url) {
        return (target, key, descriptor) => {
            this._route.get = this._route.get || [];
            this._route.get.push({url: url, target: descriptor.value});
        }
    }

    post(url) {
        return (target, key, descriptor) => {
            this._route.post = this._route.post || [];
            this._route.post.push({url: url, target: descriptor.value});
        }
    }

    setState() {
        let _index = State.route.findIndex(item => item.url === this._route.url);
        _index === -1 ? State.route.push(this._route) : State.route[_index] = this._route;
    }

};