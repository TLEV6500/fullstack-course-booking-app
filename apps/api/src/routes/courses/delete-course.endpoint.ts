import { handleFailure, UnauthorizedAccessError, type ErrorMap } from "../../errors/common.error.ts";
import { CourseNotFoundError } from "../../errors/course.error.ts";
import { UserNotFoundError } from "../../errors/user.error.ts";
import { authFactory } from "../../middlewares/factories/auth.factory.ts";
import { zCourse } from "../../models/courses/index.ts";
import * as CourseService from "../../services/course.service.ts";

const errorMap: ErrorMap = new Map([
    [UserNotFoundError, 401],
    [UnauthorizedAccessError, 403],
    [CourseNotFoundError, 404]
])

export const deleteCourseEndpoint = authFactory.build({
    tag: ["Courses"],
    method: "delete",
    input: zCourse.DeleteCoursePathParams,
    output: zCourse.DeleteCourseResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await CourseService.deleteCourse(input.id, ctx.user.id), errorMap)
        return result
    },
})
