import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lamtra API",
      version: "1.0.0",
      description: "Lamtra milk tea chain ordering system API",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/routes/admin/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
