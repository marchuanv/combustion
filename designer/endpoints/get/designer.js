const path = require("path");
const fs = require("fs");
const designerViewPath = path.join(`../../${__dirname}`,'views', 'designer.html');
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
            module.exports.response.statusCode = 200;
            module.exports.response.statusMessage = "success";
            module.exports.response.data = fs.readFileSync(designerViewPath, 'UTF-8');
        } catch (err) {
            module.exports.response.data = "";
            module.exports.response.statusCode = 500;
            module.exports.response.statusMessage = "Internal Server Error";
            module.exports.isProcessing = false;
        }
    }
};