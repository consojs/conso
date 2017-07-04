module.exports = {
<<<<<<< HEAD
    autoLoad: (path, name) => {
=======
    autoLoad: function (path, name) {
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
        if (name) {
            return require(path + name);
        }
        return require(path)
    }
};