import { zUser } from "../../models/users/index.ts";
import { getUser } from "../../services/user.service.ts";
import { authFactory } from "../../middlewares/factories/auth.factory.ts";
import { handleFailure } from "../../errors/common.error.ts";

export const getUserEndpoint = authFactory.build({
    method: "get",
    input: zUser.GetUserQueryParams,
    output: zUser.GetUserResponse,
    handler: async ({ input, ctx, logger }) => {
        let user: zUser.GetUserOutput;
        if (!ctx.user.isAdmin) user = handleFailure(await getUser(ctx.user.id), 404)
        else {
            user = handleFailure(await getUser(input.id?.toString() || ""), 404)
        }
        return user;
    }
})
