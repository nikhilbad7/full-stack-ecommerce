const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Full Stack E-Commerce API",
      version: "1.0.0",
      description: "REST API for the full-stack e-commerce application",
    },

    servers: [
      {
        url: "/",
        description: "API server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Wireless Headphones",
            },
            price: {
              type: "number",
              example: 2999,
            },
            category: {
              type: "string",
              example: "Electronics",
            },
            inStock: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        OrderItemInput: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: {
              type: "integer",
              example: 1,
            },
            quantity: {
              type: "integer",
              minimum: 1,
              example: 2,
            },
          },
        },

        OrderItem: {
          type: "object",
          properties: {
            productId: {
              type: "integer",
              example: 1,
            },
            productName: {
              type: "string",
              example: "Wireless Headphones",
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            price: {
              type: "number",
              example: 2999,
            },
          },
        },

        Order: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 4,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            total: {
              type: "number",
              example: 8497,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
          },
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
