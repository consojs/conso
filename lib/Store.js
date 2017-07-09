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
        let _config = {};
        _config.proxy = false;
        _config.subdomainOffset = 2;
        _config.env = process.env.NODE_ENV || 'development';
        Object.assign(_config, require(config_file_path));
        return _config;
    }
};
module.exports = Store;