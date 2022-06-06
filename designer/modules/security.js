const sessions = require("./sessions.js");
const utils = require("utils");
const path = require("path");
const fs = require("fs");
const loginStorePath = path.resolve(`${__dirname}/data/logins.json`);
module.exports = {
    getToken: async ({ username, secret }) => {
        const hasCredentials = (username && secret && username !== "undefined" && username !== "null" && secret !== "undefined" && secret !== "null");
        if (hasCredentials) {
            const logins = utils.getJSONObject(fs.readFileSync(loginStorePath,"UTF-8")) || [];
            const userLogin = logins.find(x => x.username === username);
            if (userLogin) {
                const { hashedPassphrase } = utils.hashPassphrase(secret, userLogin.hashedPassphraseSalt);
                if (userLogin.hashedPassphrase === hashedPassphrase) { //Authenticated
                    return utils.generateGUID();
                }
            }
        }
        return null;
    }
};