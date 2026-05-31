const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./tienda.db");

// crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL
    )
  `);
});

module.exports = db;