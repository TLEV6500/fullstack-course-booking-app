import { defaultEndpointsFactory } from "express-zod-api"
import { GetEnrollmentsSimpleResponse, GetEnrollmentsExpandedResponse, GetEnrollmentQueryParams } from "../../models/enrollments/Enrollment.zod.ts"

export const getEnrollmentEndpoint = defaultEndpointsFactory.build({
    method: "get",
    input: GetEnrollmentQueryParams,
    output: GetEnrollmentsSimpleResponse.or(GetEnrollmentsExpandedResponse),
    handler: async ({input, ctx, logger}) => {
        return {} as any
    }
})
