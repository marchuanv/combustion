module.exports = {
     start: async () => {
        const config = require("../package.json");
        const open = require("open");
        await open(`http://${config.bootstrap.hostname}:${config.bootstrap.hostport}`);
    }
}