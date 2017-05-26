let {Application} = require('./conso');
new Application()
    .use((req, res, next) => {
        console.log(123);
    })
    .run();