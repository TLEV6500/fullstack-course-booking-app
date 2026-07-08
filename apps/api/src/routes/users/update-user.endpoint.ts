import { UpdateUserRequest, UpdateUserResponse } from "../../models/users/User.zod.ts";
import { handleFailure, type ErrorMap } from "../../errors/common.error.ts";
import * as UserService from "../../services/user.service.ts";
import { authFactory } from "../../middlewares/factories/auth.factory.ts";
import { DbError } from "../../errors/db.error.ts";
import { UserUpdateFailedError } from "../../errors/user.error.ts";
import type { zUser } from "../../models/users/index.ts";

const errorMap: ErrorMap = new Map([
    [DbError, 400],
    [UserUpdateFailedError, 500]
])

export const updateUserEndpoint = authFactory.build({
    method: "patch",
    input: UpdateUserRequest,
    output: UpdateUserResponse,
    handler: async ({input, ctx, logger}) => {
        const result = handleFailure(await UserService.updateUser(ctx.user.id, input), errorMap)
        return result as zUser.UpdateUserOutput
    }
})
