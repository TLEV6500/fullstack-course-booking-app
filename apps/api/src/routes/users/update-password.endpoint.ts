import { defaultEndpointsFactory } from "express-zod-api";
import { UpdatePasswordRequest, UpdatePasswordResponse } from "../../models/users/User.zod.ts";

export const updatePasswordEndpoint = defaultEndpointsFactory.build({
    method: "put",
    input: UpdatePasswordRequest,
    output: UpdatePasswordResponse,
    handler: async ({input, ctx, logger}) => {
        return {
            message: ""
        }
    }
})
