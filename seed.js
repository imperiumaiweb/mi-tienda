const db = require("./database");

db.serialize(() => {

  db.run(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    ["Producto 1", 10]
  );

  db.run(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    ["Producto 2", 20]
  );

  db.run(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    ["Producto 3", 30]
  );

});

console.log("Productos agregados");

db.close();