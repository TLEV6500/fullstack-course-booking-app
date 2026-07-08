import { zCourse } from "../../models/courses/index.ts"
import * as z from "zod"
import * as CourseService from "../../services/course.service.ts"
import { optionalAuthFactory } from "../../middlewares/factories/auth.factory.ts"
import { handleFailure, UnauthorizedAccessError, type ErrorMap } from "../../errors/common.error.ts"
import { CourseNotFoundError } from "../../errors/course.error.ts"

const errorMap: ErrorMap = new Map([
    [CourseNotFoundError, 404],
    [UnauthorizedAccessError, 403]
])

export const getCoursesEndpoint = optionalAuthFactory.build({
    tag: ["Courses"],
    method: "get",
    input: z.intersection(zCourse.GetCoursesQueryParams, zCourse.GetCoursesPathParams),
    output: zCourse.GetCoursesResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await CourseService.getCourses(ctx.user?.id ?? "", input), errorMap)
        return {courses: result}
    }
})
