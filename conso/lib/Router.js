let State = require('./State');

module.exports = class Router {
    constructor() {
        this.router = {};
    }

    request(url) {
        return (target, key, descriptor) => {
            Object.assign(this.router, {url: url, target: target});
            this.setState();
        }
    }

    get(url) {
        return (target, key, descriptor) => {
            this.router.get = this.router.get || [];
            this.router.get.push({url: url, target: descriptor.value});
        }
    }

    post(url) {
        return (target, key, descriptor) => {
            this.router.post = this.router.post || [];
            this.router.post.push({url: url, target: descriptor.value});
            this.setState();
        }
    }

    setState() {
        let _index = State.router.findIndex(item => item.url === this.router.url);
        _index === -1 ? State.router.push(this.router) : State.router[_index] = this.router;
    }

};