import mongoose from "mongoose";
import "dotenv/config";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { createServer } from "express-zod-api";
import { config } from "./config.ts";
import { routing } from "./routing.ts";
import { MONGODB_STRING } from "./config/envVars.ts";

const isMainModule = fileURLToPath(import.meta.url) === process.argv[1];

const createApplication = async () => {
    await mongoose.connect(MONGODB_STRING!)
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    })
    const {app } = await createServer(config, routing )
    return { app, mongoose };
};

if (isMainModule) {
    createApplication();
}

export default createApplication;
