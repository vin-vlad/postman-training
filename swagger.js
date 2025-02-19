const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express Training API",
            version: "1.0.0",
            description: "API documentation for the Express.js training project",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
            {
                url: "https://postman-training.onrender.com",
            }
        ],
    },
    apis: ["./app.js"], // Point to files where API documentation is included
};

const specs = swaggerJsdoc(options);
module.exports = specs;
