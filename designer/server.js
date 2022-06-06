module.exports = {
    start: async () => {
        const config = require("../package.json");
        const http = require("http");
        const fs = require("fs");
        const utils = require("utils");
        const path = require("path");
        const listener = http.createServer((req, res) => {
            req.setEncoding('utf8');
            const requestUrlSegments = req.url.split("/");
            const path = requestUrlSegments[1] || "login";
            const generatePath = path.resolve(path.join(__dirname, "endpoints", req.method, 'generate.js'));
            console.log(`${req.method} -> ${handlerPath}`);
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                const handler = require(generatePath);
                await handler.handle({ 
                    headers: req.headers,
                    body,
                    path
                });
                const { statusCode, statusMessage, data, headers } = handler.response;
                res.writeHead(statusCode, statusMessage, headers);
                res.end(data);
            });
        });
        listener.listen(config.bootstrap.hostport, config.bootstrap.hostname, () => {
            console.log(`listening on ${utils.getJSONString(config.bootstrap)}`);
        });
   }
}