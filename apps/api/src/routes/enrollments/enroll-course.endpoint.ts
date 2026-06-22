import { defaultEndpointsFactory } from "express-zod-api"
import { EnrollmentRequest, EnrollmentResponse } from "../../models/enrollments/Enrollment.zod.ts"

export const enrollCourseEndpoint = defaultEndpointsFactory.build({
    method: "post",
    input: EnrollmentRequest,
    output: EnrollmentResponse,
    handler: async ({input, ctx, logger}) => {
        return {} as any
    }
})
