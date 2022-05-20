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
    handle: async (headers) => {
        try {
            const path = require("path");
            const fs = require("fs");
            const designerHTMLPath = path.resolve(`${__dirname}/content/designer.html`);
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "success";
            module.exports.response.data = fs.readFileSync(designerHTMLPath,"UTF-8");
        } catch (err) {
            module.exports.response.data = "";
            module.exports.response.statusCode = 500;
            module.exports.response.statusMessage = "Internal Server Error";
            module.exports.isProcessing = false;
        }
    }
};