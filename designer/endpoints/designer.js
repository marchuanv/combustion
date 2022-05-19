setTimeout(() => {
    try {
        const path = require("path");
        const fs = require("fs");
        const { precheck, token } = module.exports.request.headers;
        const designerHTMLPath = path.resolve(`${__dirname}/designer.html`);
       
        if (token) {
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "success";
            module.exports.response.data = fs.readFileSync(designerHTMLPath,"UTF-8");
            module.exports.isProcessing = false;
        } else {
            // module.exports.response.headers.location = "/login";
            // module.exports.response.headers["no-cache"] = "private";
            // module.exports.response.statusCode = 303;
            // module.exports.response.statusMessage = "Unauthorised Redirect";
            // module.exports.response.data = "Unauthorised Redirect";
            // module.exports.isProcessing = false;

            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "success";
            module.exports.response.data = fs.readFileSync(designerHTMLPath,"UTF-8");
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