const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollment");
const logErrors = require("./middlewares/error");
require("dotenv").config();

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

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
    console.log("Now connected to MongoDB Atlas."),
);

const swaggerSpec = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use(logErrors);

if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${process.env.PORT || 3000}`);
    });
}

module.exports = { app, mongoose };
