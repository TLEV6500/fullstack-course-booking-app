import { defaultEndpointsFactory } from "express-zod-api";
import { LoginRequest, LoginResponse } from "../../models/users/User.zod.ts";

export const loginUserEndpoint = defaultEndpointsFactory.build({
    method: "post",
    input: LoginRequest,
    output: LoginResponse,
    handler: async ({input, ctx, logger}) => {
        return {
            token: ""
        }
    }
})
