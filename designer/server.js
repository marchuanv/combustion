module.exports = {
    start: async () => {
        const config = require("../package.json");
        const http = require("http");
        const utils = require("utils");
        const path = require("path");
        const fs = require("fs");
        const listener = http.createServer((req, res) => {
            req.setEncoding('utf8');
            let reqPath = req.url;
            if (reqPath === "/") {
                reqPath = "/login"
            }
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                const modulePath = path.resolve(`${__dirname}/endpoints${reqPath.replace(".js","")}.js`);
                if (fs.existsSync(modulePath)) {
                    const handler = utils.requireUncached(modulePath);
                    handler.request.url = req.url;
                    handler.request.headers = req.headers;
                    handler.request.body = body;
                    const id = setInterval(() => {
                        const { isProcessing } = handler;
                        if (isProcessing) {
                            return;
                        }
                        clearInterval(id);
                        const { statusCode, statusMessage, data, headers } = handler.response;
                        res.writeHead(statusCode, statusMessage, headers);
                        res.end(data);
                    },200)
                } else {
                    res.writeHead(404,`resource could not be found.`);
                    res.end();
                }
            });
        });
        listener.listen(config.bootstrap.hostport, config.bootstrap.hostname, () => {
            console.log(`listening on ${utils.getJSONString(config.bootstrap)}`);
        });
   }
}