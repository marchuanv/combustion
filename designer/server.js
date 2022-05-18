module.exports = {
    start: async () => {
        const config = require("../package.json");
        const http = require("http");
        const utils = require("utils");
        const path = require("path");
        const fs = require("fs");
        const listener = http.createServer((req, res) => {
            let reqPath = req.url;
            if (reqPath === "/") {
                reqPath = "/login"
            }
            const modulePath = path.resolve(`${__dirname}/endpoints${reqPath.replace(".js","")}.js`);
            if (fs.existsSync(modulePath)) {
                const handler = utils.requireUncached(modulePath);
                handler.request.url = req.url;
                handler.request.headers = req.headers;
                const id = setInterval(() => {
                    const { isProcessing } = handler;
                    if (isProcessing) {
                        return;
                    }
                    const {  error } = handler;
                    if (error) {
                        res.writeHead(500,"Internal Server Error");
                        res.end();
                        clearInterval(id);
                        return;
                    }
                    clearInterval(id);
                    
                    const { statusCode, statusMessage, data, redirectUrl, headers } = handler.response;
                    const { sessionId } = headers;

                    if (sessionId) {
                        res.setHeader("SessionId", sessionId);
                        if (redirectUrl) {
                            res.setHeader("Location", redirectUrl);
                            res.writeHead(302,"Redirecting");
                        } else {
                            res.writeHead(statusCode, statusMessage);
                        }
                    } else {
                        res.writeHead(403,"Forbidden Request");
                    }

                    res.end(data);
                },200)
            } else {
                res.writeHead(404,`resource could not be found.`);
                res.end();
            }
            
        });
        listener.listen(config.bootstrap.hostport, config.bootstrap.hostname, () => {
            console.log(`listening on ${utils.getJSONString(config.bootstrap)}`);
        });
   }
}