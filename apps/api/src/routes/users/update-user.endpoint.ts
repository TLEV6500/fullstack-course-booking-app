import { zUser } from "../../models/users/index.ts";
import { handleFailure, type ErrorMap } from "../../errors/common.error.ts";
import * as UserService from "../../services/user.service.ts";
import { authFactory } from "../../middlewares/factories/auth.factory.ts";
import { DbError } from "../../errors/db.error.ts";
import { UserUpdateFailedError } from "../../errors/user.error.ts";

const errorMap: ErrorMap = new Map([
    [DbError, 400],
    [UserUpdateFailedError, 500]
])

export const updateUserEndpoint = authFactory.build({
    tag: ["Users"],
    method: "patch",
    input: zUser.UpdateUserPathParams.and(zUser.UpdateUserRequest),
    output: zUser.UpdateUserResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await UserService.updateUser(ctx.user.isAdmin ? input.id : ctx.user.id, input), errorMap)
        return result as zUser.UpdateUserOutput
    }
})
