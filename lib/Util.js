module.exports = {
    autoLoad: (path, name) => {
        if (name) {
            return require(path + name);
        }
        return require(path)
    },
    promisify: (fn, receiver) => {
        return (...args) => {
            return new Promise((resolve, reject) => {
                fn.call(receiver, ...args, (err, res) => {
                    return err ? reject(err) : resolve(res);
                });
            });
        };
    }
}