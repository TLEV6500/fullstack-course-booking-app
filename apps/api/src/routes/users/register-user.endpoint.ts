import { defaultEndpointsFactory } from "express-zod-api";
import { zUser } from "../../models/users/index.ts";
import * as UserService from "../../services/user.service.ts";
import { handleFailure } from "../../errors/common.error.ts";

export const registerUserEndpoint = defaultEndpointsFactory.build({
    method: "post",
    input: zUser.RegisterRequest,
    output: zUser.RegisterResponse,
    handler: async ({ input, ctx, logger }) => {
        handleFailure(await UserService.createUser(input), 409)
        return {
            message: "User registered successfully"
        };
    }
})
