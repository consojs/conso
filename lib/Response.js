<<<<<<< HEAD
=======

>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
'use strict';

/**
 * Module dependencies.
 */

const contentDisposition = require('content-disposition');
const ensureErrorHandler = require('error-inject');
const getType = require('mime-types').contentType;
const onFinish = require('on-finished');
const isJSON = require('koa-is-json');
const escape = require('escape-html');
const typeis = require('type-is').is;
const statuses = require('statuses');
const destroy = require('destroy');
const assert = require('assert');
const extname = require('path').extname;
<<<<<<< HEAD
=======
const vary = require('vary');
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
const only = require('only');

/**
 * Prototype.
 */
<<<<<<< HEAD
class Response {

    constructor(ctx) {
        this.ctx = this.app = ctx;
        this.req = ctx.req;
        this.res = ctx.res;
    }
=======

module.exports = {
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Return the request socket.
     *
     * @return {Connection}
     * @api public
     */
<<<<<<< HEAD
    get socket() {
        return this.ctx.req.socket;
    }
=======

    get socket() {
        return this.ctx.req.socket;
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Return response header.
     *
     * @return {Object}
     * @api public
     */
<<<<<<< HEAD
    get header() {
        return this.res._headers || {};
    }
=======

    get header() {
        return this.res._headers || {};
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Return response header, alias as response.header
     *
     * @return {Object}
     * @api public
     */
<<<<<<< HEAD
    get headers() {
        return this.header;
    }
=======

    get headers() {
        return this.header;
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Get response status code.
     *
     * @return {Number}
     * @api public
     */

    get status() {
        return this.res.statusCode;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set response status code.
     *
     * @param {Number} code
     * @api public
     */

    set status(code) {
        assert('number' == typeof code, 'status code must be a number');
        assert(statuses[code], `invalid status code: ${code}`);
        assert(!this.res.headersSent, 'headers have already been sent');
        this._explicitStatus = true;
        this.res.statusCode = code;
        this.res.statusMessage = statuses[code];
        if (this.body && statuses.empty[code]) this.body = null;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Get response status message
     *
     * @return {String}
     * @api public
     */

    get message() {
        return this.res.statusMessage || statuses[this.status];
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set response status message
     *
     * @param {String} msg
     * @api public
     */

    set message(msg) {
        this.res.statusMessage = msg;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Get response body.
     *
     * @return {Mixed}
     * @api public
     */

    get body() {
        return this._body;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set response body.
     *
     * @param {String|Buffer|Object|Stream} val
     * @api public
     */

    set body(val) {
        const original = this._body;
        this._body = val;

        if (this.res.headersSent) return;

        // no content
        if (null == val) {
            if (!statuses.empty[this.status]) this.status = 204;
            this.remove('Content-Type');
            this.remove('Content-Length');
            this.remove('Transfer-Encoding');
            return;
        }

        // set the status
        if (!this._explicitStatus) this.status = 200;

        // set the content-type only if not yet set
        const setType = !this.header['content-type'];

        // string
        if ('string' == typeof val) {
            if (setType) this.type = /^\s*</.test(val) ? 'html' : 'text';
            this.length = Buffer.byteLength(val);
            return;
        }

        // buffer
        if (Buffer.isBuffer(val)) {
            if (setType) this.type = 'bin';
            this.length = val.length;
            return;
        }

        // stream
        if ('function' == typeof val.pipe) {
            onFinish(this.res, destroy.bind(null, val));
            ensureErrorHandler(val, err => this.ctx.onerror(err));

            // overwriting
            if (null != original && original != val) this.remove('Content-Length');

            if (setType) this.type = 'bin';
            return;
        }

        // json
        this.remove('Content-Length');
        this.type = 'json';
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set Content-Length field to `n`.
     *
     * @param {Number} n
     * @api public
     */

    set length(n) {
        this.set('Content-Length', n);
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Return parsed response Content-Length when present.
     *
     * @return {Number}
     * @api public
     */

    get length() {
        const len = this.header['content-length'];
        const body = this.body;

        if (null == len) {
            if (!body) return;
            if ('string' == typeof body) return Buffer.byteLength(body);
            if (Buffer.isBuffer(body)) return body.length;
            if (isJSON(body)) return Buffer.byteLength(JSON.stringify(body));
            return;
        }

        return ~~len;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Check if a header has been written to the socket.
     *
     * @return {Boolean}
     * @api public
     */

    get headerSent() {
        return this.res.headersSent;
<<<<<<< HEAD
    }

    /**
     * lety on `field`.
=======
    },

    /**
     * Vary on `field`.
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
     *
     * @param {String} field
     * @api public
     */

<<<<<<< HEAD
    lety(field) {
        lety(this.res, field);
    }
=======
    vary(field) {
        vary(this.res, field);
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Perform a 302 redirect to `url`.
     *
     * The string "back" is special-cased
     * to provide Referrer support, when Referrer
     * is not present `alt` or "/" is used.
     *
     * Examples:
     *
     *    this.redirect('back');
     *    this.redirect('back', '/index.html');
     *    this.redirect('/login');
     *    this.redirect('http://google.com');
     *
     * @param {String} url
     * @param {String} [alt]
     * @api public
     */

    redirect(url, alt) {
        // location
        if ('back' == url) url = this.ctx.get('Referrer') || alt || '/';
        this.set('Location', url);
<<<<<<< HEAD
        // status
        if (!statuses.redirect[this.status]) this.status = 302;
=======

        // status
        if (!statuses.redirect[this.status]) this.status = 302;

>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
        // html
        if (this.ctx.accepts('html')) {
            url = escape(url);
            this.type = 'text/html; charset=utf-8';
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
<<<<<<< HEAD
        } else {
            // text
            this.type = 'text/plain; charset=utf-8';
            this.body = `Redirecting to ${url}.`;
        }
        this.end(this.body);
    }
=======
            return;
        }

        // text
        this.type = 'text/plain; charset=utf-8';
        this.body = `Redirecting to ${url}.`;
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set Content-Disposition header to "attachment" with optional `filename`.
     *
     * @param {String} filename
     * @api public
     */

    attachment(filename) {
        if (filename) this.type = extname(filename);
        this.set('Content-Disposition', contentDisposition(filename));
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set Content-Type response header with `type` through `mime.lookup()`
     * when it does not contain a charset.
     *
     * Examples:
     *
     *     this.type = '.html';
     *     this.type = 'html';
     *     this.type = 'json';
     *     this.type = 'application/json';
     *     this.type = 'png';
     *
     * @param {String} type
     * @api public
     */

    set type(type) {
        type = getType(type) || false;
        if (type) {
            this.set('Content-Type', type);
        } else {
            this.remove('Content-Type');
        }
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set the Last-Modified date using a string or a Date.
     *
     *     this.response.lastModified = new Date();
     *     this.response.lastModified = '2013-09-13';
     *
     * @param {String|Date} type
     * @api public
     */

    set lastModified(val) {
        if ('string' == typeof val) val = new Date(val);
        this.set('Last-Modified', val.toUTCString());
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Get the Last-Modified date in Date form, if it exists.
     *
     * @return {Date}
     * @api public
     */

    get lastModified() {
        const date = this.get('last-modified');
        if (date) return new Date(date);
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set the ETag of a response.
     * This will normalize the quotes if necessary.
     *
     *     this.response.etag = 'md5hashsum';
     *     this.response.etag = '"md5hashsum"';
     *     this.response.etag = 'W/"123456789"';
     *
     * @param {String} etag
     * @api public
     */

    set etag(val) {
        if (!/^(W\/)?"/.test(val)) val = `"${val}"`;
        this.set('ETag', val);
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Get the ETag of a response.
     *
     * @return {String}
     * @api public
     */

    get etag() {
        return this.get('ETag');
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Return the response mime type void of
     * parameters such as "charset".
     *
     * @return {String}
     * @api public
     */

    get type() {
        const type = this.get('Content-Type');
        if (!type) return '';
        return type.split(';')[0];
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Check whether the response is one of the listed types.
     * Pretty much the same as `this.request.is()`.
     *
     * @param {String|Array} types...
     * @return {String|false}
     * @api public
     */

    is(types) {
        const type = this.type;
        if (!types) return type || false;
        if (!Array.isArray(types)) types = [].slice.call(arguments);
        return typeis(type, types);
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Return response header.
     *
     * Examples:
     *
     *     this.get('Content-Type');
     *     // => "text/plain"
     *
     *     this.get('content-type');
     *     // => "text/plain"
     *
     * @param {String} field
     * @return {String}
     * @api public
     */

    get(field) {
        return this.header[field.toLowerCase()] || '';
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Set header `field` to `val`, or pass
     * an object of header fields.
     *
     * Examples:
     *
     *    this.set('Foo', ['bar', 'baz']);
     *    this.set('Accept', 'application/json');
     *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
     *
     * @param {String|Object|Array} field
     * @param {String} val
     * @api public
     */

    set(field, val) {
        if (2 == arguments.length) {
            if (Array.isArray(val)) val = val.map(String);
            else val = String(val);
            this.res.setHeader(field, val);
        } else {
            for (const key in field) {
                this.set(key, field[key]);
            }
        }
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Append additional header `field` with value `val`.
     *
     * Examples:
     *
     * ```
     * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
     * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
     * this.append('Warning', '199 Miscellaneous warning');
     * ```
     *
     * @param {String} field
     * @param {String|Array} val
     * @api public
     */

    append(field, val) {
        const prev = this.get(field);

        if (prev) {
            val = Array.isArray(prev)
                ? prev.concat(val)
                : [prev].concat(val);
        }

        return this.set(field, val);
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Remove header `field`.
     *
     * @param {String} name
     * @api public
     */

    remove(field) {
        this.res.removeHeader(field);
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Checks if the request is writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     *
     * @return {Boolean}
     * @api private
     */

    get writable() {
        // can't write any more after response finished
        if (this.res.finished) return false;

        const socket = this.res.socket;
        // There are already pending outgoing res, but still writable
        // https://github.com/nodejs/node/blob/v4.4.7/lib/_http_server.js#L486
        if (!socket) return true;
        return socket.writable;
<<<<<<< HEAD
    }

    /**
     * Send JSON response.
     *
     * Examples:
     *
     *     res.json(null);
     *     res.json({ user: 'tj' });
     *
     * @param {string|number|boolean|object} obj
     * @public
     */
    json(obj) {
        let val = obj;

        // allow status / body
        if (arguments.length === 2) {
            // res.json(body, status) backwards compat
            if (typeof arguments[1] === 'number') {
                deprecate('res.json(obj, status): Use res.status(status).json(obj) instead');
                this.statusCode = arguments[1];
            } else {
                deprecate('res.json(status, obj): Use res.status(status).json(obj) instead');
                this.statusCode = arguments[0];
                val = arguments[1];
            }
        }

        // settings
        let app = this.app;
        let replacer = app.get('json replacer');
        let spaces = app.get('json spaces');
        let body = JSON.stringify(val, replacer, spaces);

        // content-type
        if (!this.get('Content-Type')) {
            this.set('Content-Type', 'application/json');
        }

        return this.end(body);
    };

    /**
     * Send JSON response with JSONP callback support.
     *
     * Examples:
     *
     *     res.jsonp(null);
     *     res.jsonp({ user: 'tj' });
     *
     * @param {string|number|boolean|object} obj
     * @public
     */

    jsonp(obj) {
        let val = obj;

        // allow status / body
        if (arguments.length === 2) {
            // res.json(body, status) backwards compat
            if (typeof arguments[1] === 'number') {
                deprecate('res.jsonp(obj, status): Use res.status(status).json(obj) instead');
                this.statusCode = arguments[1];
            } else {
                deprecate('res.jsonp(status, obj): Use res.status(status).jsonp(obj) instead');
                this.statusCode = arguments[0];
                val = arguments[1];
            }
        }
        // settings
        let app = this.app;
        let replacer = app.get('json replacer');
        let spaces = app.get('json spaces');
        let body = JSON.stringify(val, replacer, spaces);
        let callback = app.query[app.get('jsonp callback name') || 'callback'];
        // content-type
        if (!this.get('Content-Type')) {
            this.set('X-Content-Type-Options', 'nosniff');
            this.set('Content-Type', 'application/json');
        }

        // fixup callback
        if (Array.isArray(callback)) {
            callback = callback[0];
        }

        // jsonp
        if (typeof callback === 'string' && callback.length !== 0) {
            this.charset = 'utf-8';
            this.set('X-Content-Type-Options', 'nosniff');
            this.set('Content-Type', 'text/javascript');

            // restrict callback charset
            callback = callback.replace(/[^\[\]\w$.]/g, '');

            // replace chars not allowed in JavaScript that are in JSON
            body = body
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029');

            // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
            // the typeof check is just to reduce client error noise
            body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';
        }

        return this.end(body);
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Inspect implementation.
     *
     * @return {Object}
     * @api public
     */

    inspect() {
        if (!this.res) return;
        const o = this.toJSON();
        o.body = this.body;
        return o;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Return JSON representation.
     *
     * @return {Object}
     * @api public
     */

    toJSON() {
        return only(this, [
            'status',
            'message',
            'header'
        ]);
<<<<<<< HEAD
    }
=======
    },
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233

    /**
     * Flush any set headers, and begin the body
     */
    flushHeaders() {
        this.res.flushHeaders();
    }
<<<<<<< HEAD

    /**
     * deletate request.end
     */
    end(str) {
        return this.res.end(str);
    }
}

module.exports = Response;
=======
};
>>>>>>> a7c5de60be46194ab901db6de9332592d53b6233
