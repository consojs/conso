let fs = require('fs');
let path = require('path');
let delegate = require('delegates');
let Cookies = require('cookies');
let Request = require('./Request');
let Response = require('./Response');
class Context {
    constructor(app, req, res) {
        this.app = app;
        this.req = req;
        this.res = res;
        this.request = new Request(this);
        this.response = new Response(this);
        this.state = {};

        /**
         * Response delegation.
         */

        delegate(this, 'response')
            .method('attachment')
            .method('redirect')
            .method('json')
            .method('jsonp')
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

    render(filename, data) {
        let {view, engine = require(view.name)} = this.app;

        view.ext = (view.ext.charAt(0) === '.' ? '' : '.') + view.ext;
        let template = fs.readFileSync(path.join(view.baseDir, filename + view.ext), this.encoding || "utf8");
        let result = engine.compile(template)(data);
        this.res.writeHead(200, {'Content-type': 'text/html'});
        this.end(result);
    }
}

module.exports = Context;