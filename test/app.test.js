const {Application} = require('..');
const assert = require('assert');
const app = new Application(
    {
        config_file_path: __dirname,
        config_file_name: 'webConfig.json'
    }
);

describe('app', () => {
    it('should inherit from event emitter', done => {
        app.on('foo', done);
        app.emit('foo');
    });
    it('should be callable', () => {
        assert.equal(typeof app, 'object');
    })
});
