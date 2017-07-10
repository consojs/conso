let fs = require('fs');
let path = require('path');

let Store = {
    middleware: [],
    annotation: [],
    cache: {},
    collection: [],
    config: function () {
        const config_file_path = path.join(process.cwd(), 'config.js');
        if (!fs.existsSync(config_file_path)) throw new Error('config.js is not found');
        let config_data= {};
        config_data.proxy = false;
        config_data.subdomainOffset = 2;
        config_data.env = process.env.NODE_ENV || 'development';
        Object.assign(config_data, require(config_file_path));
        return config_data;
    }
};
module.exports = Store;