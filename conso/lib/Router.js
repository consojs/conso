export default class Router {
    constructor() {

    }
    get(url) {
        return function (target, key, descriptor) {
            console.log(descriptor);
        }
    }
    post(url){
        return function (target, key, descriptor) {
        }
    }
}