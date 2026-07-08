import type { Routing } from "express-zod-api";
import { getCoursesEndpoint } from "./get-courses.endpoint.ts";
import { createCoursesEndpoint } from "./create-courses.endpoint.ts";
import { updateCourseEndpoint } from "./update-course.endpoint.ts";
import { deleteCourseEndpoint } from "./delete-course.endpoint.ts";

export const coursesRouter: Routing = {
    post: createCoursesEndpoint,
    ":id": {
        get: getCoursesEndpoint,
        patch: updateCourseEndpoint,
        delete: deleteCourseEndpoint,
    }
}
