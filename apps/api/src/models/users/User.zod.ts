import * as z from "zod";
import { ObjectId } from "../misc/ObjectId.ts";

export const User = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    isAdmin: z.boolean(),
    mobileNo: z.string().regex(/^(09|\+639)[0-9]{9}$/),
    createdOn: z.date(),
    lastUpdatedOn: z.date(),
    id: ObjectId,
})

export type User = z.infer<typeof User>

export const RegisterRequest = User.omit({
    id: true,
    isAdmin: true,
    createdOn: true,
    lastUpdatedOn: true,
})

export const RegisterResponse = z.object({
    message: z.string().min(1),
})

export const LoginRequest = User.pick({
    email: true,
    password: true
})

export const LoginResponse = z.object({
    token: z.jwt()
})

export const UpdateUserRequest = User.omit({
    id: true,
    isAdmin: true,
    password: true,
    createdOn: true,
    lastUpdatedOn: true,
})

export const UpdateUserResponse = User.omit({
    password: true,
    isAdmin: true,
})

export const UpdatePasswordRequest = z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(1),
})

export const UpdatePasswordResponse = z.object({
    message: z.string().min(1),
})

export const GetUserResponse = User.omit({
    password: true,
    isAdmin: true,
})
