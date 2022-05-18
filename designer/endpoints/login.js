setTimeout(() => {
    try {
        const utils = require("utils");
        const path = require("path");
        const fs = require("fs");
        const { sessionId, location } = module.exports.request.headers;
        const loginHTMLPath = path.resolve(`${__dirname}/login.html`);
        if (sessionId) {
            module.exports.response.data = fs.readFileSync(loginHTMLPath,"UTF-8");
            module.exports.response.headers.sessionId = sessionId;
            module.exports.response.statusCode = 200;
            module.exports.response.redirectUrl = "";
            module.exports.response.statusMessage = "success";
            module.exports.isProcessing = false;
        } else {
            module.exports.response.headers.sessionId = utils.generateGUID();
            module.exports.response.data = "";
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "successfully created session";
            if (module.exports.request.url.indexOf("login") === -1) {
                module.exports.response.redirectUrl = "/login";
            }
            module.exports.response.data = fs.readFileSync(loginHTMLPath,"UTF-8");
            module.exports.isProcessing = false;
        }
    } catch (err) {
        module.exports.error = err;
        module.exports.isProcessing = false;
    }
},1000);
module.exports = {
    response: {
        statusCode: null,
        statusMessage: null,
        redirectUrl: null,
        data: null,
        headers: {

        }
    },
    request: {
        url: null,
        headers: {
            
        }
    },
    isProcessing: true,
    error: null
};