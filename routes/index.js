import {Router} from './conso';
let router = new Router();

export default class Router {
    @router.get('/getinit')
    init() {
        console.log(123);
    }
}
