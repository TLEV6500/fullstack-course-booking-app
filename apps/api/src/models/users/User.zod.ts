import * as z from "zod";

export const User = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    isAdmin: z.boolean(),
    isActive: z.boolean(),
    mobileNo: z.string().regex(/^(09|\+639)[0-9]{9}$/),
    createdOn: z.date(),
    lastUpdatedOn: z.date(),
    id: z.string().min(1),
})

export type User = z.infer<typeof User>

export const RegisterRequest = User.omit({
    id: true,
    isAdmin: true,
    isActive: true,
    createdOn: true,
    lastUpdatedOn: true,
})
export type RegisterInput = z.infer<typeof RegisterRequest>

export const RegisterResponse = z.object({
    message: z.string().min(1),
})
export type RegisterOutput = Omit<User, "password" | "isAdmin">;

export const LoginRequest = User.pick({
    email: true,
    password: true
})
export type LoginInput = z.infer<typeof LoginRequest>

export const LoginResponse = z.object({
    token: z.jwt()
})
export type LoginOutput = z.infer<typeof LoginResponse>

export const UpdateUserPathParams = z.object({
    id: z.string().min(1),
})

export const UpdateUserRequest = User.omit({
    id: true,
    isAdmin: true,
    password: true,
    createdOn: true,
    lastUpdatedOn: true,
})
export type UpdateUserInput = z.infer<typeof UpdateUserRequest> & z.infer<typeof UpdateUserPathParams>

export const UpdateUserResponse = User.omit({
    password: true,
    isAdmin: true,
})
export type UpdateUserOutput = z.infer<typeof UpdateUserResponse>

export const UpdatePasswordRequest = z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(1),
})
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordRequest>

export const UpdatePasswordResponse = z.object({
    message: z.string().min(1),
})
export type UpdatePasswordOutput = boolean

export const GetUserPathParams = z.object({
  id: z.string().min(1).optional(),
})
export type GetUserInput = z.infer<typeof GetUserPathParams>

export const GetUserResponse = User.omit({
    password: true,
    isAdmin: true,
})
export type GetUserOutput = z.infer<typeof GetUserResponse>

export const UserJWTPayload = User.pick({
    isAdmin: true,
    id: true
})
export type UserJWTPayload = z.infer<typeof UserJWTPayload>

export const DeleteUserPathParams = z.object({
    id: z.string().min(1),
})
export type ArchiveUserInput = z.infer<typeof DeleteUserPathParams>

export const ArchiveUserResponse = z.object({
    message: z.string().min(1),
})
export type ArchiveUserOutput = Omit<z.infer<typeof User>, 'password'>
