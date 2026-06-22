const { MongoMemoryServer } = require("mongodb-memory-server");
const createApplication = require("../index");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

async function start() {
    console.log("Configuring pre-downloaded mongodb-memory-server...");
    const mongoServer = await MongoMemoryServer.create({
        instance: {
            storageEngine: "ephemeralForTest",
        },
    });

    const dbTestUri = mongoServer.getUri();

    // Ensure predictable test environment variables
    process.env.NODE_ENV = "test";
    process.env.MONGODB_STRING_TEST = dbTestUri;
    process.env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "testsecret";
    process.env.ALLOWED_ORIGINS =
        process.env.ALLOWED_ORIGINS ||
        '{"test":["http://localhost:5173","http://localhost:8000"]}';

    const { app, mongoose } = createApplication();

    // Wait for mongoose to connect before touching the database
    if (mongoose.connection.readyState !== 1) {
        await new Promise((resolve, reject) => {
            mongoose.connection.once("open", resolve);
            mongoose.connection.on("error", reject);
        });
    }

    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, "..", "reports");
    try {
        fs.mkdirSync(reportsDir, { recursive: true });
    } catch (e) {
        // ignore
    }

    // Create or ensure admin user and write token for fuzz runner
    const User = require("../models/User");
    const auth = require("../middlewares/auth");

    const adminEmail = process.env.FUZZ_ADMIN_EMAIL || "admin+fuzz@example.com";
    const adminPassword = process.env.FUZZ_ADMIN_PASSWORD || "adminpass";
    const adminMobile = process.env.FUZZ_ADMIN_MOBILE || "09170000000";
    const tokenFile = path.join(__dirname, "..", ".fuzz_auth_token");

    try {
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const hashed = bcrypt.hashSync(adminPassword, 10);
            admin = new User({
                firstName: "Admin",
                lastName: "User",
                email: adminEmail,
                password: hashed,
                mobileNo: adminMobile,
                isAdmin: true,
            });
            await admin.save();
            console.log(`Created admin user ${adminEmail}`);
        } else if (!admin.isAdmin) {
            admin.isAdmin = true;
            await admin.save();
            console.log(`Updated existing user ${adminEmail} to admin`);
        } else {
            console.log(`Admin user ${adminEmail} already exists`);
        }

        const token = auth.createAccessToken(admin);
        fs.writeFileSync(tokenFile, token, "utf8");
        console.log(`[READY] Fuzz admin token written to ${tokenFile}`);
    } catch (err) {
        console.error("Failed to create admin or write token:", err);
        await mongoose.disconnect();
        await mongoServer.stop();
        process.exit(1);
    }

    // Inside run-st-test-server.js, after the Admin user creation
    const Course = require("../models/Course");

    // Seed a dummy course so GET/PUT/DELETE /courses/:id actually hits business logic
    const dummyCourse = await Course.findOne({ name: "Fuzz Testing 101" });
    if (!dummyCourse) {
        await Course.create({
            _id: "64a1b2c3d4e5f60012345678", // Hardcoded ID you can reference in Swagger examples
            name: "Fuzz Testing 101",
            description: "A seeded course for Schemathesis to mutate.",
            price: 5000,
            isActive: true,
        });
        console.log("Seeded dummy Course data.");
    }

    const PORT = process.env.PORT || 4000;

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
        try {
            fs.unlinkSync(tokenFile);
        } catch (e) {
            // ignore
        }
        process.exit(0);
    };

    process.on("SIGTERM", cleanup);
    process.on("SIGINT", cleanup);
}

start().catch((err) => {
    console.error("Critical: Failed to boot test server environment:", err);
    process.exit(1);
});
