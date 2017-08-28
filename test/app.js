const assert = require('assert');
const conso = require('..');
const request = require('supertest');

describe('app', function () {
    it('should inherit from event emitter', function (done) {
        let app = conso();
        app.on('foo', done);
        app.emit('foo');
    });

    it('should be callable', function () {
        let app = conso();
        assert.equal(typeof app, 'function');
    });

    it('should 404 without routes', function (done) {
        request(conso())
            .get('/')
            .expect(404, done);
    });
});
