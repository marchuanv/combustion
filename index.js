const config = require("./package.json");
if (config.bootstrap.mode === "designer") {
    const designer = require("./designer/index.js");
    designer.start();
}