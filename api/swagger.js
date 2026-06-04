const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Course Booking API",
            version: "1.0.0",
            description:
                "The Course Booking API allows users to book courses. This project is an improvement on the owner's submission for the Zuitt Full-Stack Web Development Bootcamp 2026",
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
