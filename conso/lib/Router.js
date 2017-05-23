export default class Router {
    constructor() {

    }

    get(url) {
        return function (target, key, descriptor) {
            console.log(arguments);
        }
    }

    post(url) {
        return function (target, key, descriptor) {
        }
    }

    delete(url) {
        return function (target, key, descriptor) {
        }
    }
}