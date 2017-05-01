import {Routers,RouterMapping} from 'conso';

export default class Router extends Routers{

	constructor(props){
		super(props);
	}

	@RouterMapping({name="/",method="get"})
	index(req,res){
		res.render('index',{title:'new conso website!'});
	}
}
