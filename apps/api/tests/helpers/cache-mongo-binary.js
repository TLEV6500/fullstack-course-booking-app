const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
    try {
        console.log("Downloading mongodb-memory-server binary to cache...");
        const mongod = await MongoMemoryServer.create();
        await mongod.stop();
        console.log("mongodb-memory-server binary is ready");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
