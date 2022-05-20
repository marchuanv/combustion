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
    handle: async (headers, body) => {
        try {
            const utils = require("utils");
            const path = require("path");
            const fs = require("fs");
            let { token } = headers;
            let { redirectUrl } = utils.getJSONObject(body) || { redirectUrl: null };
            if (redirectUrl) {
                if (token && token !== "null" && token !== "undefined") {
                    module.exports.response.statusCode = 200;
                    module.exports.response.statusMessage = "Success";
                    module.exports.response.data = "";
                } else {
                    module.exports.response.statusCode = 303;
                    module.exports.response.statusMessage = "Redirecting";
                    module.exports.response.headers["Location"] = "/login";
                    module.exports.response.data = "";
                }
            } else {
                module.exports.response.statusCode = 400;
                module.exports.response.statusMessage = "Bad Request";
                module.exports.response.data = "";
            }
        } catch (err) {
            module.exports.response.data = "";
            module.exports.response.statusCode = 500;
            module.exports.response.statusMessage = "Internal Server Error";
            module.exports.isProcessing = false;
        }
    }
};