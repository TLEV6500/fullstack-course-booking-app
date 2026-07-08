import { authFactory } from "../../middlewares/factories/auth.factory.ts"
import { zEnrollment } from "../../models/enrollments/index.ts"

export const enrollCourseEndpoint = authFactory.build({
    tag: ["Enrollments"],
    method: "post",
    input: zEnrollment.EnrollmentRequest,
    output: zEnrollment.EnrollmentResponse,
    handler: async ({input, ctx, logger}) => {
        return {} as any
    }
})
