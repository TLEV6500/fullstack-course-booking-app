import type { Routing } from "express-zod-api";
import { getUserEndpoint } from "./get-user.endpoint.ts";
import { loginUserEndpoint } from "./login-user.endpoint.ts";
import { registerUserEndpoint } from "./register-user.endpoint.ts";
import { updatePasswordEndpoint } from "./update-password.endpoint.ts";
import { updateUserEndpoint } from "./update-user.endpoint.ts";

export const usersRouter: Routing = {
    ":id": {
        get: getUserEndpoint,
        patch: updateUserEndpoint
    },
    login: loginUserEndpoint,
    register: registerUserEndpoint,
    "update-password": updatePasswordEndpoint,
}
