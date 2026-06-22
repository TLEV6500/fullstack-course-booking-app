import { defaultEndpointsFactory } from "express-zod-api"
import { GetCoursesQueryParams, GetCoursesResponse } from "../../models/courses/Course.zod.ts"

export const getCoursesEndpoint = defaultEndpointsFactory.build({
    method: "get",
    input: GetCoursesQueryParams,
    output: GetCoursesResponse,
    handler: async ({input, ctx, logger}) => {
        return {} as any
    }
})
