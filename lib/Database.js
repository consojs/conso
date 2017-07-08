let Store = require('./Store');

class Database {
    constructor() {
        let DBConfig = Store.config();
        if (DBConfig) {
            let {client, connection} = DBConfig;
            if (!client || !connection)throw new Error('DBConfig error');


        }
    }
}