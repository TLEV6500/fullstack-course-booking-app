import * as EnrollmentService from "../../services/enrollment.service.ts"
import { zEnrollment } from "../../models/enrollments/index.ts"
import { authFactory } from "../../middlewares/factories/auth.factory.ts"
import { handleFailure, type ErrorMap } from "../../errors/common.error.ts"
import { AuthenticationFailedError, UserNotFoundError } from "../../errors/user.error.ts"

const errorMap: ErrorMap = new Map([
    [UserNotFoundError, 401],
    [AuthenticationFailedError, 403],
])

export const getEnrollmentEndpoint = authFactory.build({
    method: "get",
    input: zEnrollment.GetEnrollmentsPathParams.and(zEnrollment.GetEnrollmentQueryParams),
    output: zEnrollment.GetEnrollmentsResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await EnrollmentService.getEnrollments(ctx.user.id, input.id, input), errorMap)
        return result
    }
})
