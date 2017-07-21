let fs = require('fs');
let {resolve} = require('path');
let delegate = require('delegates');
let Store = require('./Store');
let Request = require('./Request');
let Response = require('./Response');

class Context {
    constructor(app, req, res) {
        this.app = app;
        this.req = req;
        this.res = res;
        this.request = new Request(this);
        this.response = new Response(this);
        this.params = {};
        this.state = {};

        /**
         * Response delegation.
         */

        delegate(this, 'response')
            .method('attachment')
            .method('redirect')
            .method('file')
            .method('json')
            .method('jsonp')
            .method('send')
            .method('remove')
            .method('vary')
            .method('set')
            .method('append')
            .method('flushHeaders')
            .method('end')
            .access('status')
            .access('message')
            .access('body')
            .access('length')
            .access('type')
            .access('lastModified')
            .access('etag')
            .getter('headerSent')
            .getter('writable');

        /**
         * Request delegation.
         */

        delegate(this, 'request')
            .method('acceptsLanguages')
            .method('acceptsEncodings')
            .method('acceptsCharsets')
            .method('accepts')
            .method('get')
            .method('is')
            .access('querystring')
            .access('idempotent')
            .access('socket')
            .access('search')
            .access('method')
            .access('query')
            .access('path')
            .access('url')
            .getter('origin')
            .getter('href')
            .getter('subdomains')
            .getter('protocol')
            .getter('host')
            .getter('hostname')
            .getter('header')
            .getter('headers')
            .getter('secure')
            .getter('stale')
            .getter('fresh')
            .getter('ips')
            .getter('ip');
    }

    async render(filename, data) {
        let {view, engine = require(view.engine.toLowerCase()).__express} = this.app;
        let cache = Store.cache, template;

        if (!view.ext && !engine) {
            throw new Error('No default engine was specified and no extension was provided.');
        }

        if (view.cache) {
            template = cache[filename];
        }
        if (!template) {
            view.ext = (view.ext.charAt(0) === '.' ? '' : '.') + view.ext;

            if (view.cache) {
                cache[filename] = template;
            }
        }

        this.body = await new Promise((_resolve, reject) => {
            engine(resolve(view.dir, filename + view.ext), Object.assign(data, {
                cache: view.cache,
                settings: {
                    views: view.dir,
                    'view options': {
                        layout: view.layout
                    }
                }
            }), (err, str) => {
                if (err) return reject(err);
                _resolve(str);
            });
        });

    }
}

module.exports = Context;