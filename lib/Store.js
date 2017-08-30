let fs = require('fs');
let path = require('path');

let Store = {
    middleware: [],
    annotation: [],
    cache: {},
    collection: [],
    config: (option = {}) => {
        const {config_file_name} = option;

        const config_file_path = path.join(process.cwd(), config_file_name || 'webConfig.json');
        if (!fs.existsSync(config_file_path)) throw new Error((config_file_name ? config_file_name : 'webConfig.json') + ' is not found');

        option.proxy = option.proxy || false;
        option.subdomainOffset = option.subdomainOffset || 2;
        option.env = option.env || process.env.NODE_ENV || 'development';
        Object.assign(option, require(config_file_path));
        return option;
    }
};
module.exports = Store;
