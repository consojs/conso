module.exports = {
    autoLoad: function (path, name) {
        if (name) {
            return require(path + name);
        }
        return require(path)
    }
};