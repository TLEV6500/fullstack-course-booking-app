/**
 * Integration tests for /courses routes
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
const Course = require("../models/Course");
const auth = require("../middlewares/auth");

describe("Courses routes integration tests", () => {
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

    const adminEmail = `admin+${Date.now()}@example.com`;
    const adminPassword = "adminpass";
    let adminToken;
    let courseId;
    const courseName = `Test Course ${Date.now()}`;

    test("create admin user and generate token", async () => {
        const adminUser = new User({
            firstName: "Admin",
            lastName: "User",
            email: adminEmail,
            password: adminPassword,
            mobileNo: "09170000000",
            isAdmin: true,
        });
        const savedAdmin = await adminUser.save();
        adminToken = auth.createAccessToken(savedAdmin);
        expect(adminToken).toBeTruthy();
    });

    test("POST /courses should create a new course (admin)", async () => {
        const payload = {
            name: courseName,
            description: "A test course created by integration tests",
            price: 9.99,
        };

        const res = await request(app)
            .post("/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Course added successfully");
        expect(res.body).toHaveProperty("result");
        expect(res.body.result).toHaveProperty("name", courseName);
        courseId = res.body.result._id;
        expect(courseId).toBeTruthy();
        expect(res).toSatisfyApiSpec();
    });

    test("GET /courses should list active courses (including created)", async () => {
        const res = await request(app).get("/courses");
        expect(res.status).toBe(200);
        // Because we created an active course we expect an array
        expect(Array.isArray(res.body)).toBe(true);
        const found = res.body.find(
            (c) => String(c._id) === String(courseId) || c.name === courseName,
        );
        expect(found).toBeTruthy();
        expect(res).toSatisfyApiSpec();
    });

    test("GET /courses/specific/:id should return the course", async () => {
        const res = await request(app).get(`/courses/specific/${courseId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id", courseId);
        expect(res.body).toHaveProperty("name");
        expect(res).toSatisfyApiSpec();
    });

    test("PATCH /courses/:courseId should update the course (admin)", async () => {
        const updatePayload = {
            name: `${courseName} Updated`,
            description: "Updated description",
            price: 19.99,
        };

        const res = await request(app)
            .patch(`/courses/${courseId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatePayload);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(
            "message",
            "Course updated successfully",
        );
        expect(res).toSatisfyApiSpec();
    });

    test("PATCH /courses/:courseId/archive should archive the course (admin)", async () => {
        const res = await request(app)
            .patch(`/courses/${courseId}/archive`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("course");
        expect(res).toSatisfyApiSpec();
    });

    test("GET /courses/specific/:id should return isActive false after archive", async () => {
        const res = await request(app).get(`/courses/specific/${courseId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("isActive", false);
        expect(res).toSatisfyApiSpec();
    });

    test("PATCH /courses/:courseId/activate should activate the course (admin)", async () => {
        const res = await request(app)
            .patch(`/courses/${courseId}/activate`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("course");
        expect(res).toSatisfyApiSpec();
    });

    test("GET /courses/specific/:id should return isActive true after activation", async () => {
        const res = await request(app).get(`/courses/specific/${courseId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("isActive", true);
        expect(res).toSatisfyApiSpec();
    });

    test("POST /courses/search should find course by name", async () => {
        const res = await request(app)
            .post("/courses/search")
            .send({ courseName: "Test Course" });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        const found = res.body.find(
            (c) =>
                String(c._id) === String(courseId) ||
                (c.name && c.name.includes("Test Course")),
        );
        expect(found).toBeTruthy();
        expect(res).toSatisfyApiSpec();
    });

    test("GET /courses/all should return all courses for admin", async () => {
        const res = await request(app)
            .get("/courses/all")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        const found = res.body.find((c) => String(c._id) === String(courseId));
        expect(found).toBeTruthy();
        expect(res).toSatisfyApiSpec();
    });

    afterAll(async () => {
        try {
            if (courseId) {
                await Course.deleteOne({ _id: courseId });
            }
            await User.deleteOne({ email: adminEmail });
        } catch (err) {
            // ignore cleanup errors
        }
        try {
            await mongoose.connection.close();
        } catch (err) {
            // ignore
        }
    });
});
