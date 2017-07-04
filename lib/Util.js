module.exports = {
    autoLoad: (path, name) => {
        if (name) {
            return require(path + name);
        }
        return require(path)
    }
};