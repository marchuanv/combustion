const path = require("path");
const fs = require("fs");
const loginViewPath = path.join(`../../${__dirname}`, 'views', 'login.html');
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
    handle: async () => {
        try {
            module.exports.response.headers["Content-Type"] = "text/html";
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "success";
            module.exports.response.data = fs.readFileSync(loginViewPath,"UTF-8");
        } catch (err) {
            module.exports.response.data = "";
            module.exports.response.statusCode = 500;
            module.exports.response.statusMessage = "Internal Server Error";
            module.exports.isProcessing = false;
        }
    }
};