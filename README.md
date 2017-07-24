![](https://raw.githubusercontent.com/wiki/tageecc/conso/conso.png)

Fast, Configurable, Intelligent web framework for [node](http://nodejs.org).

[![NPM version][npm-image]][npm-url]
[![NPM quality][quality-image]][quality-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/conso.svg?style=flat-square
[npm-url]: https://npmjs.org/package/conso
[quality-image]: http://npm.packagequality.com/shield/conso.svg
[quality-url]: http://packagequality.com/#?package=conso
[travis-image]: https://img.shields.io/travis/tageecc/conso.svg?style=flat-square
[travis-url]: https://travis-ci.org/tageecc/conso
[codecov-image]: https://img.shields.io/codecov/c/github/tageecc/conso.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/tageecc/conso
[david-image]: https://img.shields.io/david/tageecc/conso.svg?style=flat-square
[david-url]: https://david-dm.org/tageecc/conso
[download-image]: https://img.shields.io/npm/dm/conso.svg?style=flat-square
[download-url]: https://npmjs.org/package/conso

## Installation

```bash
$ npm install conso -g
```
## Features

- ✔︎ Annotation
- ✔︎ Dependency Injection
- ✔︎ Configurable
- ✔︎ Async/Await
- ✔︎ Database Support Using [waterline](https://github.com/balderdashy/waterline)

## Example

you can mapping `http://localhost:3000/home/user/:uid` via code below

```javascript
let {Annotation} = require('conso');
let UserModel = require('../model/UserModel');

let {route, get, model} = Annotation;

@route('/home')
class index {

    @model(UserModel)
    user;

    @get('/user/:uid')
    async homePage(ctx, next) {
        let _user = await this.user.findOne({uid: ctx.params.id});
        // await ctx.render('index', {user:_user});
        ctx.json({user:_user});
    }
}

```

## Quick Start

> conso has a built-in generator which you can use that to generate an application as shown below:

 - Install the executable.

```bash
$ npm install -g conso
```

 - Create the app:
 
```bash
$ conso init showcase && cd showcase
```

 - Install dependencies:
  
```bash
$ npm install
```
  
 - Start the server:
  
```bash
$ npm start
```

 Then Open `http://localhost:3000`

## Docs & Community

>This project uses JSDoc. For the full public API documentation, clone the repository and run npm run doc. This will run JSDoc with the proper options and output the documentation to out/.

Coming soon! Please expecting!


## License

[MIT](LICENSE)