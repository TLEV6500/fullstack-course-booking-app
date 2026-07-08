import { zCourse } from "../../models/courses/index.ts"
import { handleFailure, UnauthorizedAccessError, type ErrorMap } from "../../errors/common.error.ts"
import * as CourseService from "../../services/course.service.ts"
import { authFactory } from "../../middlewares/factories/auth.factory.ts"
import { UserNotFoundError } from "../../errors/user.error.ts"
import { CourseNotFoundError } from "../../errors/course.error.ts"

const errorMap: ErrorMap = new Map([
    [UserNotFoundError, 401],
    [UnauthorizedAccessError, 403],
    [CourseNotFoundError, 404],
])

export const updateCourseEndpoint = authFactory.build({
    method: "patch",
    input: zCourse.UpdateCoursePathParams.and(zCourse.UpdateCourseRequest),
    output: zCourse.UpdateCourseResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await CourseService.updateCourse(input.id, input, ctx.user.id), errorMap)
        return {updatedCourse: result}
    },
})
