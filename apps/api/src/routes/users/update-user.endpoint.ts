import { defaultEndpointsFactory } from "express-zod-api";
import { UpdateUserRequest, UpdateUserResponse } from "../../models/users/User.zod.ts";

export const updateUserEndpoint = defaultEndpointsFactory.build({
    method: "put",
    input: UpdateUserRequest,
    output: UpdateUserResponse,
    handler: async ({input, ctx, logger}) => {
        return {} as any
    }
})
