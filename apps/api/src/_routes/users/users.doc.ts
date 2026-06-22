import type { ZodOpenApiOperationObject, ZodOpenApiPathsObject } from "zod-openapi";
import {Users} from "@course-booking/models";

export const registerUserOperation: ZodOpenApiOperationObject = {
    requestBody: {
        content: {
            "application/json": {
                schema: Users.RegisterRequest
            }
        }
    },
    responses: {
        "201": {
            description: "User registered successfully",
            content: {
                "application/json": {
                    schema: Users.RegisterResponse
                }
            }
        },
        "400": {
            description: "Invalid request body",
            content: {
                "application/json": {
                    schema: Users.RegisterErrorResponse
                }
            }
        }
    }
}
export const loginUserOperation: ZodOpenApiOperationObject = {
    requestBody: {
        content: {
            "application/json": {
                schema: Users.LoginRequest
            }
        }
    },
    responses: {
        "200": {
            description: "Successfully authenticated user",
            content: {
                "application/json": {
                    schema: Users.LoginResponse
                }
            }
        },
        "400": {
            description: "Invalid request body",
            content: {
                "application/json": {
                    schema: Users.LoginErrorResponse
                }
            }
        },
        "401": {
            description: "Invalid credentials",
            content: {
                "application/json": {
                    schema: Users.LoginErrorResponse
                }
            }
        },
    }
}
export const getUserOperation: ZodOpenApiOperationObject = {
    responses: {
        "200": {
            description: "Successfully retrieved user profile",
            content: {
                "application/json": {
                    schema: Users.GetUserResponse
                }
            }
        },
        "403": {
            description: "Access denied",
            content: {
                "application/json": {
                    schema: Users.GetUserErrorResponse
                }
            }
        }
    }
}
export const updateUserOperation: ZodOpenApiOperationObject = {
    requestBody: {
        content: {
            "application/json": {
                schema: Users.UpdateUserRequest
            }
        }
    },
    responses: {
        "200": {
            description: "Successfully updated user",
            content: {
                "application/json": {
                    schema: Users.UpdateUserResponse
                }
            }
        },
        "400": {
            description: "Invalid request body",
            content: {
                "application/json": {
                    schema: Users.UpdateUserErrorResponse
                }
            }
        },
        "403": {
            description: "Access denied",
            content: {
                "application/json": {
                    schema: Users.UpdateUserErrorResponse
                }
            }
        },
    }
}
export const updatePasswordOperation: ZodOpenApiOperationObject = {
    requestBody: {
        content: {
            "application/json": {
                schema: Users.UpdatePasswordRequest
            }
        }
    },
    responses: {
        "200": {
            description: "Successfully reset password",
            content: {
                "application/json": {
                    schema: Users.UpdatePasswordResponse
                }
            }
        },
        "400": {
            description: "Invalid request body",
            content: {
                "application/json": {
                    schema: Users.UpdatePasswordErrorResponse
                }
            }
        },
        "403": {
            description: "Access denied",
            content: {
                "application/json": {
                    schema: Users.UpdatePasswordErrorResponse
                }
            }
        },
    }
}

export const usersPaths: ZodOpenApiPathsObject = {
    "/users/me": {
        get: getUserOperation,
        put: updateUserOperation
    },
    "/users/register": {
        post: registerUserOperation
    },
    "/users/login": {
        post: loginUserOperation
    },
    "/users/reset-password": {
        post: updatePasswordOperation
    }
}
