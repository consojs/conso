let fs = require('fs');
let path = require('path');

let Store = {
    middleware: [],
    annotation: [],
    cache: {},
    collection: [],
    config: (option = {}) => {
        const {config_file_name} = option, config_data = {};

        const config_file_path = path.join(process.cwd(), config_file_name || 'webConfig.json');
        if (!fs.existsSync(config_file_path)) throw new Error((config_file_name ? config_file_name : 'webConfig.json') + ' is not found');

        config_data.proxy = option.proxy || false;
        config_data.subdomainOffset = option.subdomainOffset || 2;
        config_data.env = option.env || process.env.NODE_ENV || 'development';
        Object.assign(config_data, require(config_file_path));
        return config_data;
    }
};
module.exports = Store;