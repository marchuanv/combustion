module.exports = {
    response: {
        statusCode: null,
        statusMessage: null,
        data: null,
        headers: {}
    },
    request: {
        url: null,
        headers: {},
        method: null
    },
    handle: async (headers, body, method, url) => {
        try {
            const path = require("path");
            const fs = require("fs");
            const utils = require("utils");
            const isNotRedirect = (url && url.indexOf("redirect") === -1 && url !== "/") ? true: false;
            if (method === "GET" && isNotRedirect) {
                const handlerPath = path.resolve(`${__dirname}${url}.js`);
                if (fs.existsSync(handlerPath)) {
                    const handler = require(handlerPath);
                    await handler.handle(headers, body, "GET");
                    module.exports.response = handler.response;
                } else {
                    throw `failed to get the ${url} handler"`
                }
            } else if (method === "GET") {
                const redirectHTMLPath = path.resolve(`${__dirname}/content/redirect.html`);
                module.exports.response.headers["Content-Type"] = "text/html ";
                module.exports.response.statusCode = 200;
                module.exports.response.statusMessage = "success";
                module.exports.response.data = fs.readFileSync(redirectHTMLPath,"UTF-8");
            } else if (method === "POST" && isNotRedirect) {
                console.log("");
            } else if (method === "POST") {
                const { username, secret, token } = headers;
                if (token && token !== "null" && token !== "undefined") {
                    module.exports.response.headers["Content-Type"] = "application/json ";
                    module.exports.response.statusCode = 200;
                    module.exports.response.statusMessage = "Success";
                    module.exports.response.data = `{ "redirectUrl": "/designer" }`;
                } else if (username && username !== "null" && secret && secret !== "null") {
                    const loginHandlerPath = path.resolve(`${__dirname}/login.js`);
                    if (fs.existsSync(loginHandlerPath)) {
                        const loginHandler = require(loginHandlerPath);
                        await loginHandler.handle(headers, body, "POST");
                        module.exports.response = loginHandler.response;
                    } else {
                        throw `failed to get the login handler"`
                    }
                } else {
                    module.exports.response.headers["Content-Type"] = "application/json ";
                    module.exports.response.statusCode = 200;
                    module.exports.response.statusMessage = "Success";
                    module.exports.response.data = `{ "redirectUrl": "/login" }`;
                }
            }
        } catch (err) {
            module.exports.response.data = "";
            module.exports.response.statusCode = 500;
            module.exports.response.statusMessage = "Internal Server Error";
            module.exports.isProcessing = false;
        }
    }
};