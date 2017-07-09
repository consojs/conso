let Store = require('./Store');
let {promisify} = require("./Util");
let Waterline = require('waterline');
let mysqlAdapter = require('sails-mysql');
let mongoAdapter = require('sails-mongo');

async function Database() {
    let {client, config} = Store.config().DBConfig;
    if (!client || !config) throw new Error('DBConfig error');

    this.orm = new Waterline();

    // 适配器
    this.adapters = {
        mysql: mysqlAdapter,
    };

    // 连接器
    this.connections = {
        client: {
            adapter: client,
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database,
        }
    };
    // 加载数据集合
    Store.collection.map(collection => orm.loadCollection(collection));

    let initialize = promisify(this.orm.initialize, this.orm);

    //初始化
    return await initialize({
        adapters: this.adapters,
        connections: this.connections
    });
}

module.exports = Database;