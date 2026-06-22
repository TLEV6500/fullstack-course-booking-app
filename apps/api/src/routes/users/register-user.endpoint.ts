import { defaultEndpointsFactory } from "express-zod-api";
import { RegisterResponse } from "../../models/users/User.zod.ts";

export const registerUserEndpoint = defaultEndpointsFactory.build({
    method: "post",
    output: RegisterResponse,
    handler: async ({input, ctx, logger}) => {
        return {
            message: "",
        }
    }
})
