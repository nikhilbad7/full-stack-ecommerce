const request = require("supertest");

const app = require("../app");
const createTestToken = require("./helpers/auth");

describe("Orders API", () => {
  const adminToken = createTestToken({
    userId: 1,
    role: "admin",
  });

  describe("GET /api/orders", () => {
    it("should return orders for the authenticated user", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 401 when no authentication token is provided", async () => {
      const response = await request(app).get("/api/orders");

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should return paginated orders", async () => {
      const response = await request(app)
        .get("/api/orders?page=1&limit=2")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 2,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });

      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return an order belonging to the authenticated user", async () => {
      const response = await request(app)
        .get("/api/orders/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("items");
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it("should not allow access to another user's order", async () => {
      const response = await request(app)
        .get("/api/orders/3")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /api/orders", () => {
    it("should return 404 when a product does not exist", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          items: [
            {
              productId: 99999,
              quantity: 1,
            },
          ],
        });

      expect(response.statusCode).toBe(404);
    });

    it("should return 409 when a product is out of stock", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          items: [
            {
              productId: 6,
              quantity: 1,
            },
          ],
        });

      expect(response.statusCode).toBe(409);
    });

    it("should return 400 when the same product appears more than once", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          items: [
            {
              productId: 1,
              quantity: 1,
            },
            {
              productId: 1,
              quantity: 2,
            },
          ],
        });

      expect(response.statusCode).toBe(400);
    });
  });
});
