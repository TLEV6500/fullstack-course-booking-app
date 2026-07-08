import type { Routing } from "express-zod-api";
import { enrollCourseEndpoint } from "./enroll-course.endpoint.ts";
import { getEnrollmentEndpoint } from "./get-enrollment.endpoint.ts";

export const enrollmentsRouter: Routing = {
    post: enrollCourseEndpoint,
    ":id": {
        get: getEnrollmentEndpoint,
    }
}
