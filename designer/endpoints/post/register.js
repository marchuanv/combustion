const sessions = require("../../sessions.js");
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
    handle: async (headers, body) => {
        try {
            const utils = require("utils");
            const path = require("path");
            const fs = require("fs");
            let { username, secret } = headers;
            let { redirectUrl } = utils.getJSONObject(body) || { redirectUrl: null };
            if (redirectUrl) {
                const loginDataPath = path.resolve(`${__dirname}/data/logins.json`);
                const logins = utils.getJSONObject(fs.readFileSync(loginDataPath,"UTF-8")) || [];
                const userLogin = logins.find(x => x.username === username);
                if (!userLogin) {
                    const { hashedPassphrase, hashedPassphraseSalt } = utils.hashPassphrase(secret);
                    logins.push({ username, hashedPassphrase, hashedPassphraseSalt });
                    const loginDataToWrite = utils.getJSONString(logins);
                    fs.writeFileSync(loginDataPath, loginDataToWrite);
                }
                module.exports.response.statusCode = 303;
                module.exports.response.statusMessage = "Redirecting";
                module.exports.response.headers["Location"] = redirectUrl;
            } else {
                module.exports.response.statusCode = 400;
                module.exports.response.statusMessage = "Bad Request";
                module.exports.response.data = "";
            }
        } catch (err) {
            module.exports.response.statusCode = 500;
            module.exports.response.statusMessage = "Internal Server Error";
            module.exports.response.data = "";
        }
    }
};