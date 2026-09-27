const request = require("supertest");

const app = require("../app");

describe("Products API", () => {
  describe("GET /api/products", () => {
    it("should return the list of products", async () => {
      const response = await request(app).get("/api/products");

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a product when the product exists", async () => {
      const response = await request(app).get("/api/products/1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("price");
    });

    it("should return 404 when the product does not exist", async () => {
      const response = await request(app).get("/api/products/99999");

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });
});

describe("Admin product endpoints", () => {
  describe("POST /api/products", () => {
    it("should return 401 when no authentication token is provided", async () => {
      const response = await request(app).post("/api/products").send({
        name: "Test Product",
        price: 100,
        category: "Test",
        in_stock: true,
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should return 401 when no authentication token is provided", async () => {
      const response = await request(app).put("/api/products/1").send({
        name: "Updated Product",
        price: 150,
        category: "Test",
        in_stock: true,
      });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
    });
  });
});
