import { createConfig } from "express-zod-api";

export const config = createConfig({
    http: {
        listen: process.env.PORT ?? 4000
    },
    cors: true,
    logger: {
        level: "debug",
        color: true,
    }
});
