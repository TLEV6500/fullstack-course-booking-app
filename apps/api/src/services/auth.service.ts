import { User, zUser } from "../models/users/index.ts";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/envVars.ts";
import type { WithNullish } from "../utils/types.ts";
import { comparePasswords } from "../utils/crypto.ts";
import { AuthenticationFailedError } from "../errors/user.error.ts";

export async function loginUser(credentials: zUser.LoginInput) {
    const user = await User.findOne({ email: credentials.email }).select("+password +isAdmin");
    if (!user || !(await comparePasswords(credentials.password, user.password))) {
        console.error("Invalid credentials", credentials, "Expected: ", user)
        return new AuthenticationFailedError<WithNullish<zUser.LoginOutput>>({placeholderValue: {token: null}, message: "Invalid credentials"})
    }
    const token = jwt.sign(zUser.UserJWTPayload.parse({ id: user.id, isAdmin: user.isAdmin }), JWT_SECRET_KEY!, { expiresIn: "1h" });
    return { token } as zUser.LoginOutput;
}
