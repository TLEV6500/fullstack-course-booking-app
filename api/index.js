const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollment");
const {
    logErrors,
    handleErrors,
    create405Handler,
} = require("./middlewares/error");
require("dotenv").config();

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

    if (process.env.NODE_ENV === "test") {
        dbURI = process.env.MONGODB_STRING_TEST;
    }

    mongoose.connect(dbURI);
    mongoose.connection.once("open", () =>
        console.log("Now connected to MongoDB Atlas."),
    );

    const swaggerSpec = require("./swagger");
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

    if (require.main === module) {
        app.listen(process.env.PORT || 3000, () => {
            console.log(
                `API is now online on port ${process.env.PORT || 3000} in ${process.env.NODE_ENV} mode.`,
            );
        });
    }
    return { app, mongoose };
};

module.exports = createApplication;
