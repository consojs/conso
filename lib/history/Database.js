let Store = require('./Store');
let Waterline = require('waterline');

function Database() {
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

    // save connection
    Store.connection = this.connections;

    // save collection
    Object.values(Store.Collection).map(c => this.orm.loadCollection(c));

    //initialize
    this.orm.initialize({
        adapters: this.adapters,
        connections: this.connections,
        defaults: {
            migrate: 'safe'
        }
    }, function (err, models) {
        Object.keys(Store.Collection).map(k => {
            Store.Collection[k] = models.collections[k]
        });
    })
}

module.exports = Database;
