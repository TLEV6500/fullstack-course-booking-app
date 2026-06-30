import { defaultEndpointsFactory } from "express-zod-api";
import * as z from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../config/envVars.ts";
import { UserJWTPayload } from "../../models/users/User.zod.ts";
import createHttpError from "http-errors";

export const authFactory = defaultEndpointsFactory.addMiddleware({
    handler: async ({ request, logger }) => {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw createHttpError(401, "Authorization header is missing or invalid");
        }
        const token = authHeader.slice(7);
        try {
            const decodedToken = UserJWTPayload.parse(jwt.verify(token, JWT_SECRET_KEY!));
            logger.debug(`User ${decodedToken.id} authenticated`);
            return {user: decodedToken};
        } catch (error) {
            throw createHttpError(401, "Invalid token")
        }
    }
})
