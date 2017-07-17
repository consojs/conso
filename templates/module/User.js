module.exports = {
    identity: 'user',
    connection: 'client',
    schema: true,
    attributes: {
        username: {
            type: 'string',
            required: true,
            minLength: 6,
            maxLength: 17
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6
        },
        birthday: {
            type: 'date',
            after: new Date('1990-01-01'),
            before: function () {
                return new Date();
            }
        },
        address: {
            type: 'string',
        },
        createTime: {
            type: 'date',
            before: '2200-01-01',
            //在某个时间点之后
            after: function () {
                return new Date();
            }
        }
    },
    beforeCreate: function (value, cb) {
        value.createTime = new Date();
        value.address = 'china';
        console.log('beforeCreate executed');
        return cb();
    }
};