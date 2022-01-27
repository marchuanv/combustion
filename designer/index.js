module.exports = {
    start: () => {
        const config = require("./package.json");
        const open = require("open");
        open(`http://${config.bootstrap.host}/${config.bootstrap.port}`);
    }
}