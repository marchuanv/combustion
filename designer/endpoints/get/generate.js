const path = require("path");
const fs = require("fs");

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
    handle: async ({ headers, body, path }) => {
        try {
            const viewPath = path.join(`../../${__dirname}`,'views', `${path}.html`);
            if (fs.existsSync(viewPath)) {
                module.exports.response.data = fs.readFileSync(viewPath, 'UTF-8');
                module.exports.response.headers["Content-Type"] = "text/html";
                module.exports.response.statusCode = 200;
                module.exports.response.statusMessage = "success";
            } else {
                module.exports.response.statusCode = 404;
                module.exports.response.statusMessage = "Not Found";
            }
        } catch (err) {
            module.exports.response.data = "";
            module.exports.response.statusCode = 500;
            module.exports.response.statusMessage = "Internal Server Error";
        }
    }
};