setTimeout(() => {
    try {
        const path = require("path");
        const fs = require("fs");
        const { token } = module.exports.request.headers;
        const loginHTMLPath = path.resolve(`${__dirname}/login.html`);
       
        if (token) {
            module.exports.response.headers.token = token;
            module.exports.response.headers.location = "/designer";
            module.exports.response.statusCode = 303;
            module.exports.response.statusMessage = "Authorised Redirect";
            module.exports.response.data = "";
            module.exports.isProcessing = false;
        } else {
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "success";
            module.exports.response.data = fs.readFileSync(loginHTMLPath,"UTF-8");
            module.exports.isProcessing = false;
        }
    } catch (err) {
        module.exports.response.data = "";
        module.exports.response.statusCode = 500;
        module.exports.response.statusMessage = "Internal Server Error";
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