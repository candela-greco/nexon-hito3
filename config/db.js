
// Importa la librería Pool de 'pg' para gestionar conexiones
const { Pool } = require("pg");
require("dotenv").config();

// Crea un pool de conexiones usando la variable DATABASE_URL definida en .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;