import mongoose from "mongoose";
import { AuthenticationFailedError, UserCreationFailedError, UserNotFoundError, UserUpdateFailedError } from "../errors/user.error.ts";
import { User, zUser } from "../models/users/index.ts";
import { comparePasswords, hashPassword } from "../utils/crypto.ts";
import { DbError } from "../errors/db.error.ts";

export async function getUser(id: string) {
    const user = await User.findOne({
            _id: id,
            isActive: true
    }).select("+isActive");
    if (!user) return new UserNotFoundError({message: "User not found"});
    const userOutput = user.toObject({virtuals: true});
    return userOutput as zUser.GetUserOutput
}

export async function createUser(user: zUser.RegisterInput) {
    try {
        user.password = await hashPassword(user.password);
        const newUser = new User(user);
        const result = await newUser.save();
        if (!result.id) return new UserCreationFailedError({ message: "Failed to create user" });
        return newUser.toObject({ virtuals: true }) as zUser.RegisterOutput;
    } catch (error) {
        if (error.code === 11000) {
            return new UserCreationFailedError({ message: "Failed to create user" });
        }
        throw error;
    }
}

export async function updateUser(id: string, user: zUser.UpdateUserInput) {
    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        if (!updatedUser) return new UserUpdateFailedError({ message: "Failed to update user" });
        return updatedUser.toObject({virtuals: true}) as zUser.UpdateUserOutput;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError || error instanceof mongoose.Error.ValidationError) {
            return new DbError({cause: error})
        }
        throw error;
    }
}

export async function updateUserPassword(id: string, passwords: zUser.UpdatePasswordInput) {
    const user = await User.findById(id);
    if (!user) return new UserNotFoundError({message: "User not found"});

    if (!(await comparePasswords(passwords.oldPassword, user.password))) return new AuthenticationFailedError({message: "Invalid credentials"});

    const hashedPassword = await hashPassword(passwords.newPassword);
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    if (!updatedUser) return new UserUpdateFailedError({message: "Failed to update password"});
    return !!updatedUser.id as zUser.UpdatePasswordOutput;
}
