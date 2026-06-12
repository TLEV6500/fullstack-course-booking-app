const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

if (process.env.NODE_ENV !== "test") {
    process.env.NODE_ENV = "test";
}

if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS =
        '{"test":["http://localhost:5173","http://localhost:8000"]}';
}

if (process.env.JWT_SECRET_KEY) {
    process.env.JWT_SECRET_KEY = "testsecret";
}

if (!process.env.MONGODB_STRING_TEST) {
    throw new Error("MONGODB_STRING_TEST not set");
}

process.env.PORT = "0";
