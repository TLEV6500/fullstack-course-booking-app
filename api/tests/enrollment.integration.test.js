/**
 * Integration tests for /enrollments routes
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
const Enrollment = require("../models/Enrollment");
const auth = require("../middlewares/auth");

describe("Enrollments routes integration tests", () => {
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

    const userEmail = `student+${Date.now()}@example.com`;
    const userPassword = "studentpass";
    let userToken;
    let userId;
    let course;
    let enrollmentId;

    test("create a normal user and generate token", async () => {
        const user = new User({
            firstName: "Student",
            lastName: "User",
            email: userEmail,
            password: userPassword,
            mobileNo: "09170000002",
            isAdmin: false,
        });
        const saved = await user.save();
        userId = String(saved._id);
        userToken = auth.createAccessToken(saved);
        expect(userToken).toBeTruthy();
    });

    test("create a course to enroll in", async () => {
        course = new Course({
            name: `Enrollment Course ${Date.now()}`,
            description: "Course for enrollment tests",
            price: 49.99,
        });
        course = await course.save();
        expect(course._id).toBeTruthy();
    });

    test("POST /enrollments/enroll should enroll the authenticated user", async () => {
        const payload = {
            enrolledCourses: [{ courseId: String(course._id) }],
            totalPrice: course.price,
        };

        const res = await request(app)
            .post("/enrollments/enroll")
            .set("Authorization", `Bearer ${userToken}`)
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Enrolled successfully");
        expect(res).toSatisfyApiSpec();
    });

    test("GET /enrollments/get-enrollments should return the user's enrollments", async () => {
        const res = await request(app)
            .get("/enrollments/get-enrollments")
            .set("Authorization", `Bearer ${userToken}`);

        // Could be multiple enrollments; ensure at least one and it belongs to this user
        if (res.status === 200) {
            expect(Array.isArray(res.body)).toBe(true);
            const found = res.body.find(
                (e) => String(e.userId) === String(userId),
            );
            expect(found).toBeTruthy();
            // Validate the enrolled course id is present
            expect(
                found.enrolledCourses.some(
                    (c) => String(c.courseId) === String(course._id),
                ),
            ).toBe(true);
        } else {
            // Controller may respond 404 if no enrollments found - fail the test then
            throw new Error(`Expected 200 with enrollments, got ${res.status}`);
        }
        expect(res).toSatisfyApiSpec();
    });

    afterAll(async () => {
        try {
            // remove enrollments for this user
            await Enrollment.deleteMany({ userId: String(userId) });
            if (course && course._id) {
                await Course.deleteOne({ _id: course._id });
            }
            await User.deleteOne({ email: userEmail });
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
