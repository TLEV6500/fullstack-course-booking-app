import { UpdatePasswordRequest, UpdatePasswordResponse } from "../../models/users/User.zod.ts";
import { updateUserPassword } from "../../services/user.service.ts";
import { authFactory } from "../../middlewares/factories/auth.factory.ts";
import {  DomainError, handleFailure, type ErrorMap } from "../../errors/common.error.ts";
import { AuthenticationFailedError, UserNotFoundError, UserUpdateFailedError } from "../../errors/user.error.ts";
import createHttpError from "http-errors";

const errorMap: ErrorMap = new Map([
    [UserNotFoundError, 404],
    [UserUpdateFailedError, 500],
    [AuthenticationFailedError, 401],
]);

export const updatePasswordEndpoint = authFactory.build({
    method: "patch",
    input: UpdatePasswordRequest,
    output: UpdatePasswordResponse,
    handler: async ({ input, ctx, logger }) => {
        const result = handleFailure(await updateUserPassword(ctx.user.id, input), errorMap)
        if (result) throw createHttpError(500, "Unhandled error, failed to update password");
        return {
            message: "Updated password successfully"
        };
    }
})
