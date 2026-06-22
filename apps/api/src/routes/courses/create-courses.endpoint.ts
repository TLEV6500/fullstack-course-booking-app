import { defaultEndpointsFactory } from "express-zod-api"
import { CreateCoursesRequest, CreateCoursesResponse } from "../../models/courses/Course.zod.ts"

export const createCoursesEndpoint = defaultEndpointsFactory.build({
    method: "post",
    input: CreateCoursesRequest,
    output: CreateCoursesResponse,
    handler: async ({input, ctx, logger}) => {
        return {} as any
    }
})
