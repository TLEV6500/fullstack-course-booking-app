import { defaultEndpointsFactory } from "express-zod-api";
import { GetUserResponse } from "../../models/users/User.zod.ts";

export const getUserEndpoint = defaultEndpointsFactory.build({
    method: "get",
    output: GetUserResponse,
    handler: async ({input, ctx, logger}) => {
        return {} as any
    }
})
