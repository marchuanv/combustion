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
            const resourceName = requestUrlSegments[1] || "login";
            const handlerPath = path.resolve(path.join(__dirname, "endpoints", req.method,`${resourceName}.js`));
            console.log(`${req.method} -> ${handlerPath}`);
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                if (fs.existsSync(handlerPath)) {
                    const handler = require(handlerPath);
                    await handler.handle(req.headers, body, req.url);
                    const { statusCode, statusMessage, data, headers } = handler.response;
                    res.writeHead(statusCode, statusMessage, headers);
                    res.end(data);
                } else {
                    res.writeHead(404, "Not Found");
                    res.end();
                }
            });
        });
        listener.listen(config.bootstrap.hostport, config.bootstrap.hostname, () => {
            console.log(`listening on ${utils.getJSONString(config.bootstrap)}`);
        });
   }
}