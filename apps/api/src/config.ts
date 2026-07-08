import { createConfig, Documentation } from "express-zod-api";
import { PUBLIC_API_URL } from "./config/envVars.ts";
import { routing } from "./routing.ts";
import swaggerUi from "swagger-ui-express";


export const config = createConfig({
    http: {
        listen: process.env.PORT ?? 4000,
    },
    cors: true,
    logger: {
        level: "debug",
        color: true,
    },
    beforeRouting: ({app, getLogger}) => {
        const url = PUBLIC_API_URL || "http://localhost:4000"
        const openApiDocument = new Documentation({
            routing,
            config,
            version: "1.0.0",
            title: "Course Booking System API Documentation",
            serverUrl: url,
            hasHeadMethod: false,
        }).getSpec();

        app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(openApiDocument, {
                customSiteTitle: "API Explorer",
                swaggerOptions: {
                    persistAuthorization: true,
                },
            })
        );

        getLogger().info(`Swagger UI is available at ${url}/docs`);
    },
});
