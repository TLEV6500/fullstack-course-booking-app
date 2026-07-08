import { CreateCoursesRequest, CreateCoursesResponse } from "../../models/courses/Course.zod.ts"
import { authFactory } from "../../middlewares/factories/auth.factory.ts"
import * as CourseService from "../../services/course.service.ts"
import { handleFailure, type ErrorMap } from "../../errors/common.error.ts"
import { CourseCreationError } from "../../errors/course.error.ts"
import { UserNotFoundError } from "../../errors/user.error.ts"

const errorMap: ErrorMap = new Map([
    [CourseCreationError, 500],
    [UserNotFoundError, 401]
])

export const createCoursesEndpoint = authFactory.build({
    tag: ["Courses"],
    method: "post",
    input: CreateCoursesRequest,
    output: CreateCoursesResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await CourseService.createCourses(ctx.user.id, input.courses), errorMap)
        return {courses: result}
    }
})
