import { defaultEndpointsFactory } from "express-zod-api";
import { zUser } from "../../models/users/index.ts";
import { loginUser } from "../../services/auth.service.ts";
import { throwFailureAsHttpError as handleFailure } from "../../errors/common.error.ts";

export const loginUserEndpoint = defaultEndpointsFactory.build({
    method: "post",
    input: zUser.LoginRequest,
    output: zUser.LoginResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await loginUser(input), 401)
        return result
    }
})
