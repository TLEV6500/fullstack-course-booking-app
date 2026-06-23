import { defaultEndpointsFactory } from "express-zod-api";
import { GetUserQueryParams, GetUserResponse } from "../../models/users/User.zod.ts";
import { getUser } from "../../services/UserService.ts";

export const getUserEndpoint = defaultEndpointsFactory.build({
    method: "get",
    input: GetUserQueryParams,
    output: GetUserResponse,
    handler: async ({input, ctx, logger}) => {
        return await getUser(input.id || "")
    }
})
