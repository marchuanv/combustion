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
            const urlPath = requestUrlSegments[1] || "/login";
            const handlerPath = path.join(__dirname, "http", `${req.method}.js`);
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                const handler = require(handlerPath);
                await handler.handle({ 
                    headers: req.headers,
                    body,
                    urlPath
                });
                const { statusCode, statusMessage, data, headers } = generator.response;
                res.writeHead(statusCode, statusMessage, headers);
                res.end(data);
            });
        });
        listener.listen(config.bootstrap.hostport, config.bootstrap.hostname, () => {
            console.log(`listening on ${utils.getJSONString(config.bootstrap)}`);
        });
   }
}