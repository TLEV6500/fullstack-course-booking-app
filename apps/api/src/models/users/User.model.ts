import mongoose from "mongoose";
import type { User } from "./User.zod.ts";
import { SCHEMA_OPTS } from "../mongoose.ts";

export type UserDocument = Omit<User, "id">

type UserVirtuals = {
    id: string;
}

type UserModel = mongoose.Model<UserDocument, {}, {}, UserVirtuals>;

const userSchema = new mongoose.Schema<UserDocument, UserModel, {}, {}, UserVirtuals>({
    firstName: {
        type: String,
        required: [true, "First Name is Required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is Required"],
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        select: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        select: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false,
    },
    mobileNo: {
        type: String,
        required: [true, "Mobile Number is Required"],
    },
}, SCHEMA_OPTS);

export default mongoose.model<UserDocument, UserModel>("User", userSchema);
