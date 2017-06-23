let JSData = require('js-data');
let DSSqlAdapter = require('js-data-sql');
let DSMongoDBAdapter = require('js-data-mongodb');

module.exports = class Database {
    constructor(ctx) {
        let store = new JSData.DS();
        let adapter = new DSSqlAdapter({
            client: 'mysql',
            connection: {
                host: '123.45.67.890',
                user: 'ubuntu',
                password: 'welcome1234',
                database: 'db1'
            }
        });

        store.registerAdapter('sql', adapter, {default: true});
    }

    add() {

    }

    delete() {

    }

    update() {

    }

    find() {

    }

};