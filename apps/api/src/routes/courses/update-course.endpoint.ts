import { defaultEndpointsFactory } from "express-zod-api"
import { UpdateCourseRequest } from "../../models/courses/Course.zod.ts"

export const updateCourseEndpoint = defaultEndpointsFactory.build({
    method: "put",
    input: UpdateCourseRequest,
    output: UpdateCourseRequest,
    handler: async ({input, ctx, logger}) => {
        return {} as any
    },
})
