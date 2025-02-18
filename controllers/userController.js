const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya está registrado" });
    }
    // Hashear la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Insertar el nuevo usuario en la base de datos (retornar solo los campos necesarios)
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    // Generar un token JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Devolver el usuario y el token en la respuesta
    res.status(201).json({ ...newUser.rows[0], token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    const user = userResult.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

afterAll(async () => {
  // Cerrar el pool de conexiones para que Jest pueda finalizar correctamente
  await pool.end();
});