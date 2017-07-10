let Store = require('./Store');
let {promisify} = require("./Util");
let Waterline = require('waterline');

async function Database() {
    let {client, config} = Store.config().DBConfig;
    if (!client || !config) throw new Error('DBConfig error');

    client = client.toLowerCase();
    client = client === 'mongodb' ? 'mongo' : client;

    this.orm = new Waterline();

    // 适配器
    this.adapters = {};
    this.adapters[client] = require(`sails-${client}`);
    // 连接器
    this.connections = {
        client: {
            adapter: client
        }
    };
    Object.assign(this.connections.client, config);

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