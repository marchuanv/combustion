module.exports = {
    start: async () => {
        
        const config = require("../package.json");
        const http = require("http");
        const utils = require("utils");
        const path = require("path");
        const fs = require("fs");
        const redirectPath = path.resolve(`${__dirname}/endpoints/redirect.js`);
        const redirect = require(redirectPath);

        const listener = http.createServer((req, res) => {
            req.setEncoding('utf8');
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                await redirect.handle(req.headers, body, req.method, req.url);
                const { statusCode, statusMessage, data, headers } = redirect.response;
                res.writeHead(statusCode, statusMessage, headers);
                res.end(data);
            });
        });
        listener.listen(config.bootstrap.hostport, config.bootstrap.hostname, () => {
            console.log(`listening on ${utils.getJSONString(config.bootstrap)}`);
        });
   }
}