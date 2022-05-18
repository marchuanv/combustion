( async () => {
    const config = require("./package.json");
    if (config.bootstrap.mode === "designer") {
        const designerClient = require("./designer/client.js");
        const designerHost = require("./designer/server.js");
        await designerHost.start();
       // await designerClient.start();
    }
})().catch((err) => {
    console.log(err);
});