const request = require("supertest");
const app = require("../server"); // Importa la aplicación Express

describe("🧪 Pruebas de Usuarios", () => {
  it("Debe registrar un usuario correctamente", async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`; // Email único
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: uniqueEmail,
      password: "password123"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token"); // Debe devolver un token
  });

  it("Debe fallar si el email ya está registrado", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123"
    });

    expect(res.statusCode).toBe(400);
  });
});
