import { coursesRouter } from "./routes/courses/courses.routing.ts";
import { enrollmentsRouter } from "./routes/enrollments/enrollments.routing.ts";
import { usersRouter } from "./routes/users/users.routing.ts";

export const routing = {
    courses: coursesRouter,
    users: usersRouter,
    enrollments: enrollmentsRouter,
}
