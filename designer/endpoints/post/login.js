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
            let { username, secret, token } = headers;
            let { redirectUrl } = utils.getJSONObject(body) || { redirectUrl: null };
            if (redirectUrl) {
                const session = sessions.find({ token });
                if (session) { //will only a session after login, and will only redirect when there is a session
                    module.exports.response.statusCode = 303;
                    module.exports.response.statusMessage = "authenticated, redirecting";
                    module.exports.response.headers["Location"] = redirectUrl;
                    module.exports.response.data = "";
                } else if (username && secret && username !== "undefined" && username !== "null" && secret !== "undefined" && secret !== "null") {
                    const loginDataPath = path.resolve(`${__dirname}/data/logins.json`);
                    const logins = utils.getJSONObject(fs.readFileSync(loginDataPath,"UTF-8")) || [];
                    const userLogin = logins.find(x => x.username === username);
                    if (userLogin) {
                        const { hashedPassphrase } = utils.hashPassphrase(secret, userLogin.hashedPassphraseSalt);
                        if (userLogin.hashedPassphrase === hashedPassphrase) { //Authenticated
                            token = utils.generateGUID();
                            sessions.register(username, token);
                            module.exports.response.statusCode = 200;
                            module.exports.response.statusMessage = "success";
                            module.exports.response.headers["token"] = token;
                            module.exports.response.data = utils.getJSONString({ redirectUrl });
                        } else {
                            module.exports.response.statusCode = 401;
                            module.exports.response.statusMessage = "Unauthorised";
                            module.exports.response.data = "";
                        }
                    } else {
                        module.exports.response.statusCode = 401;
                        module.exports.response.statusMessage = "Unauthorised";
                        module.exports.response.data = "";
                    }
                } else {
                    module.exports.response.statusCode = 303;
                    module.exports.response.statusMessage = "not authenticated, redirecting";
                    module.exports.response.headers["Location"] = "/login"; //Redirect to do a GET /login
                    module.exports.response.data = "";
                }
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