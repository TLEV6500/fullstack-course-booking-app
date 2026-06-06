const { MongoMemoryServer } = require("mongodb-memory-server");
const createApplication = require("../index");

async function start() {
    console.log("Configuring pre-downloaded mongodb-memory-server...");
    const mongoServer = await MongoMemoryServer.create({
        instance: {
            storageEngine: "ephemeralForTest",
        },
    });

    const dbTestUri = mongoServer.getUri();

    process.env.NODE_ENV = "test";
    process.env.MONGODB_STRING_TEST = dbTestUri;

    const { app, mongoose } = createApplication();
    const PORT = process.env.PORT || 0;

    const server = app.listen(PORT, () => {
        console.log(
            `[READY] Express Server running on http://localhost:${PORT}`,
        );
        console.log(
            `[READY] OpenAPI schema exposed at http://localhost:${PORT}/api-docs.json`,
        );
    });

    const cleanup = async () => {
        console.log("\nShutting down in-memory test stack cleanly...");
        server.close();
        await mongoose.disconnect();
        await mongoServer.stop();
        process.exit(0);
    };

    process.on("SIGTERM", cleanup);
    process.on("SIGINT", cleanup);
}

start().catch((err) => {
    console.error("Critical: Failed to boot test server environment:", err);
    process.exit(1);
});
