/**
 * Integration tests for /users routes
 * - Uses supertest to exercise the running Express app
 * - Validates responses against the bundled OpenAPI spec with jest-openapi
 *
 * NOTE: The app (../index) reads env vars on require. We set sensible defaults
 * for test runs so the file can be executed directly via `npm run test:integration`.
 */
jest.setTimeout(30000);

const request = require("supertest");
const jestOpenApi = require("jest-openapi").default;

// Require app after environment is prepared
const createApplication = require("../index");
const User = require("../models/User");

describe("User routes integration tests", () => {
    let app;
    let mongoose;
    beforeAll(async () => {
        const api = createApplication();
        app = api.app;
        mongoose = api.mongoose;

        const swaggerSpec = require("../swagger");
        jestOpenApi(swaggerSpec);

        // wait for mongoose to connect before running requests
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve, reject) => {
                mongoose.connection.once("open", resolve);
                mongoose.connection.on("error", reject);
            });
        }
    });

    const testEmail = `testuser+${Date.now()}@example.com`;
    const password = "passw0rd";
    let token;

    test("POST /users/check-email should return emailExists false for new email", async () => {
        const res = await request(app)
            .post("/users/check-email")
            .send({ email: testEmail });
        expect(res.status).toBe(200);
        expect(res.body.emailExists).toBe(false);
        expect(res).toSatisfyApiSpec();
    });

    test("POST /users/register should create a new user", async () => {
        const payload = {
            firstName: "Test",
            lastName: "User",
            email: testEmail,
            password,
            mobileNo: "09171234567",
        };

        const res = await request(app).post("/users/register").send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty(
            "message",
            "User registered successfully",
        );
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("email", testEmail);
        expect(res).toSatisfyApiSpec();
    });

    test("POST /users/check-email should return emailExists true after register", async () => {
        const res = await request(app)
            .post("/users/check-email")
            .send({ email: testEmail });
        expect(res.status).toBe(200);
        expect(res.body.emailExists).toBe(true);
        expect(res).toSatisfyApiSpec();
    });

    test("POST /users/login should authenticate and return access token", async () => {
        const res = await request(app)
            .post("/users/login")
            .send({ email: testEmail, password });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("access");
        token = res.body.access;
        expect(token).toBeTruthy();
        expect(res).toSatisfyApiSpec();
    });

    test("GET /users/details should return user profile when authenticated", async () => {
        const res = await request(app)
            .get("/users/details")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", testEmail);
        // controller intentionally sets password to empty string in the response
        expect(res.body.password).toBe("");
        expect(res).toSatisfyApiSpec();
    });

    test("PUT /users/profile should update profile when authenticated", async () => {
        const updateBody = {
            firstName: "Updated",
            lastName: "User",
            mobileNo: "09170000001",
        };
        const res = await request(app)
            .put("/users/profile")
            .set("Authorization", `Bearer ${token}`)
            .send(updateBody);

        expect(res.status).toBe(200);
        expect(res.body.firstName).toBe(updateBody.firstName);
        expect(res.body.lastName).toBe(updateBody.lastName);
        expect(res.body.mobileNo).toBe(updateBody.mobileNo);
        expect(res.body.password).toBe("");
        expect(res).toSatisfyApiSpec();
    });

    test("POST /users/reset-password should change password and allow login with new password", async () => {
        const newPassword = "newStrongPass1";

        const res = await request(app)
            .post("/users/reset-password")
            .set("Authorization", `Bearer ${token}`)
            .send({ newPassword });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(
            "message",
            "Password reset successfully",
        );
        expect(res).toSatisfyApiSpec();

        // now login with the new password
        const loginRes = await request(app)
            .post("/users/login")
            .send({ email: testEmail, password: newPassword });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty("access");
        expect(loginRes).toSatisfyApiSpec();
    });

    afterAll(async () => {
        try {
            await User.deleteOne({ email: testEmail });
            await mongoose.connection.close();
        } catch (err) {
            // ignore cleanup errors
        }
    });
});
