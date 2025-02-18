const request = require("supertest");
const app = require("../server");
require("dotenv").config();

describe("API REST Tests", () => {
  let token = "";

  // 🟢 Test 1: Obtener todos los productos (GET /api/products)
  it("Debe obtener todos los productos", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // 🟢 Test 2: Registrar un nuevo usuario (POST /api/register)
  it("Debe registrar un nuevo usuario", async () => {
    const newUser = {
      name: "Test User",
      email: `test${Date.now()}@mail.com`,
      password: "password123",
    };

    const res = await request(app).post("/api/register").send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", newUser.email);
  });

  // 🟢 Test 3: Iniciar sesión y obtener un token (POST /api/login)
  it("Debe iniciar sesión y devolver un token", async () => {
    const loginData = {
      email: "testuser@mail.com",
      password: "password123",
    };

    const res = await request(app).post("/api/login").send(loginData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  // 🔴 Test 4: Intentar crear un producto sin autenticación (POST /api/products)
  it("Debe rechazar la creación de un producto sin autenticación", async () => {
    const newProduct = {
      title: "Nuevo Producto",
      description: "Descripción del producto",
      price: 100,
      condition: "nuevo",
    };

    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.statusCode).toBe(401);
  });

  // 🟢 Test 5: Crear un producto autenticado (POST /api/products)
  it("Debe crear un producto si está autenticado", async () => {
    const newProduct = {
      title: "Producto Test",
      description: "Descripción de prueba",
      price: 50,
      condition: "usado",
    };

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", newProduct.title);
  });
});
