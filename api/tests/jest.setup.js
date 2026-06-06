require("dotenv").config();

if (process.env.NODE_ENV != "test") process.env.NODE_ENV = "test";
if (process.env.ALLOWED_ORIGINS)
    process.env.ALLOWED_ORIGINS =
        '{"test":["http://localhost:5173","http://localhost:8000"]}';
if (process.env.JWT_SECRET_KEY) process.env.JWT_SECRET_KEY = "testsecret";
if (process.env.MONGODB_STRING_TEST)
    process.env.MONGODB_STRING_TEST =
        "mongodb+srv://timleovil_db_user:tlev123@cluster0.vl7qh1h.mongodb.net/course-booking-api-test";
