setTimeout(() => {
    try {
        const utils = require("utils");
        const path = require("path");
        const fs = require("fs");
        const { username, secret, token } = module.exports.request.headers;

        if (token && token !== "null") {
            module.exports.response.headers.token = token;
            module.exports.response.headers.location = "/designer";
            module.exports.response.statusCode = 303;
            module.exports.response.statusMessage = "Authorised Redirect";
            module.exports.response.data = "";
            module.exports.isProcessing = false;
        } else if (username && secret) {
            //check the username and the secret against records
            module.exports.response.headers.token = utils.generateGUID();
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "Authorised";
            module.exports.response.data = "Authorised";
            module.exports.isProcessing = false;
        } else  {
            const authenticateHTMLPath = path.resolve(`${__dirname}/authenticate.html`);
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "Authenticate";
            module.exports.response.data = fs.readFileSync(authenticateHTMLPath,"UTF-8");
            module.exports.isProcessing = false;
        }
    } catch (err) {
        module.exports.response.statusCode = 500;
        module.exports.response.statusMessage = "Internal Server Error";
        module.exports.response.data = "";
        module.exports.isProcessing = false;
    }
},1000);
module.exports = {
    response: {
        statusCode: null,
        statusMessage: null,
        data: null,
        headers: {}
    },
    request: {
        url: null,
        headers: {}
    },
    isProcessing: true
};