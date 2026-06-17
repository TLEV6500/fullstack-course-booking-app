import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/user.ts";
import courseRoutes from "./routes/course.ts";
import enrollmentRoutes from "./routes/enrollment.ts";
import {
    logErrors,
    handleErrors,
    create405Handler,
} from "./middlewares/error.ts";
import "dotenv/config";
import swaggerSpec from "./config/swagger.ts";
import { fileURLToPath } from "node:url";
import process from "node:process";

const isMainModule = fileURLToPath(import.meta.url) === process.argv[1];

const createApplication = () => {
    if (!process.env.ALLOWED_ORIGINS || !process.env.NODE_ENV)
        throw new Error(
            "Environmental variables ALLOWED_ORIGINS and NODE_ENV must be set.",
        );

    const app = express();

    app.use(express.json());

    const corsOptions = {
        origin: JSON.parse(process.env.ALLOWED_ORIGINS)[process.env.NODE_ENV],
        credentials: true,
        optionsSuccessStatus: 200,
    };

    app.use(cors(corsOptions));
    app.get("/", (req, res) => {
        return res.status(200).send("Server is running!");
    });

    let dbURI = process.env.MONGODB_STRING;
    if (!dbURI) throw new Error("MONGODB_STRING environment variable not set.");

    if (process.env.NODE_ENV === "test") {
        dbURI = process.env.MONGODB_STRING_TEST;
    }

    mongoose.connect(dbURI!);
    mongoose.connection.once("open", () =>
        console.log("Now connected to MongoDB Atlas."),
    );

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    app.use("/users", userRoutes);
    app.use("/courses", courseRoutes);
    app.use("/enrollments", enrollmentRoutes);
    app.all("*path", create405Handler(["GET", "POST", "PUT", "PATCH"]));
    app.use(logErrors);
    app.use(handleErrors);

    if (isMainModule) {
        app.listen(process.env.PORT || 3000, () => {
            console.log(
                `API is now online on port ${process.env.PORT || 3000} in ${process.env.NODE_ENV} mode.`,
            );
        });
    }
    return { app, mongoose };
};

if (isMainModule) {
    createApplication();
}

export default createApplication;
