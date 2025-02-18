const pool = require("../config/db");

// Endpoint para obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Endpoint para crear un nuevo producto (requiere autenticación)
exports.createProduct = async (req, res) => {
  const { title, description, price, condition } = req.body;
  // Supongamos que el middleware de autenticación agrega el objeto "user" a req
  const user_id = req.user.id;
  try {
    const newProduct = await pool.query(
      "INSERT INTO products (title, description, price, condition, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, price, condition, user_id]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
