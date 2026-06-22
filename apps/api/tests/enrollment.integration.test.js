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
        const userDetails = {
            firstName: "Student",
            lastName: "User",
            email: userEmail,
            password: userPassword,
            mobileNo: "09170000002",
            isAdmin: false,
        };
        await request(app).post("/users/register").send(userDetails);

        const loginRes = await request(app)
            .post("/users/login")
            .send({ email: userDetails.email, password: userDetails.password });
        userToken = loginRes.body.access;

        const saved = await request(app)
            .get("/users/details")
            .set("Authorization", `Bearer ${userToken}`);

        userId = saved.body._id;

        expect(userToken).toBeTruthy();
        expect(saved.status).toBe(200);
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

        // console.log("enroll token", userToken);
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
        // console.log("Using token: ", userToken);
        const res = await request(app)
            .get("/enrollments/get-enrollments")
            .set("Authorization", `Bearer ${userToken}`);

        // Could be multiple enrollments; ensure at least one and it belongs to this user
        if (res.status === 200) {
            expect(Array.isArray(res.body)).toBe(true);
            // console.log("UserId: ", userId);
            // console.log("Enrollments:", res.body);
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
            throw new Error(`Expected 200 with enrollments, got ${res.status}`);
        }
        expect(res).toSatisfyApiSpec();
    });

    test("TRACE /enrollments/enroll should return 405", async () => {
        const res = await request(app).trace(`/enrollments/enroll`);
        expect(res.status).toBe(405);
    });

    test("TRACE /enrollments/get-enrollments should return 405", async () => {
        const res = await request(app).trace(`/enrollments/get-enrollments`);
        expect(res.status).toBe(405);
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
