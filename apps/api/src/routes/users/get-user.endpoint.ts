import { zUser } from "../../models/users/index.ts";
import * as UserService from "../../services/user.service.ts";
import { authFactory } from "../../middlewares/factories/auth.factory.ts";
import { handleFailure } from "../../errors/common.error.ts";

export const getUserEndpoint = authFactory.build({
    tag: ["Users"],
    method: "get",
    input: zUser.GetUserPathParams,
    output: zUser.GetUserResponse,
    handler: async ({ input, ctx, logger }) => {
        let user: zUser.GetUserOutput;
        if (!ctx.user.isAdmin) user = handleFailure(await UserService.getUser(ctx.user.id), 404)
        else {
            user = handleFailure(await UserService.getUser(input.id?.toString() || ""), 404)
        }
        return user;
    }
})
