const http = require("http");
const fs = require("fs");
const path = require("path");
let loggedIn = false;
let products = [];

const filePath = path.join(__dirname, "productos.json");

try {
  const data = fs.readFileSync(filePath, "utf8");
  products = JSON.parse(data);
} catch (err) {
  console.log("No se pudo cargar productos.json, usando vacío");
  console.log("ERROR REAL:", err.message);
  products = [];
}


const server = http.createServer((req, res) => {

  if (req.url === "/products") {

  const filePath = path.join(__dirname, "productos.json");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(products));

  } catch (err) {
    console.log("Error leyendo productos.json:", err.message);
    res.writeHead(500);
    res.end("Error cargando productos");
  }

  return;
}
 if (req.url === "/add-product" && req.method === "POST") {

  if (!loggedIn) {
    res.writeHead(401);
    res.end("No autorizado");
    return;
  }

  let body = "";

  req.on("data", chunk => body += chunk);

  req.on("end", () => {
    const product = JSON.parse(body);

    products.push({
  id: Date.now(),
  name: product.name,
  price: Number(product.price),
  image: product.image || "https://via.placeholder.com/150"
});

fs.writeFileSync(
  "./productos.json",
  JSON.stringify(products, null, 2)
);

res.end("OK");
  });

  return;
}
 if (req.url === "/backup") {

  if (!loggedIn) {
    res.writeHead(401);
    res.end("No autorizado");
    return;
  } 

  const backupName =
    `backup-${Date.now()}.db`;

  fs.copyFile(
    "./tienda.db",
    `./${backupName}`,
    (err) => {

      if (err) {

        res.writeHead(500);
        res.end("Error creando respaldo");
        return;

      }

      res.writeHead(200);
      res.end(
        `Respaldo creado: ${backupName}`
      );

    }
  );

  return;
}
 if (req.url === "/delete-product" && req.method === "POST") {

  if (!loggedIn) {
    res.writeHead(401);
    res.end("No autorizado");
    return;
  } 

  let body = "";

  req.on("data", chunk => body += chunk);

  req.on("end", () => {

    const data = JSON.parse(body);

    products = products.filter(
        p => p.id !== data.id
    );
    fs.writeFileSync(
      "./productos.json",
      JSON.stringify(products, null, 2)
    );

    res.writeHead(200);
    res.end("OK");

  });

  return;
}
if (req.url === "/update-product" && req.method === "POST") {

  if (!loggedIn) {
    res.writeHead(401);
    res.end("No autorizado");
    return;
  } 

  let body = "";

  req.on("data", chunk => body += chunk);

  req.on("end", () => {

    const data = JSON.parse(body);

    const product = products.find(
        p => p.id === data.id
    );

    if (product) {
      product.name = data.name;
      product.price = Number(data.price);
    }
    fs.writeFileSync(
      "./productos.json",
      JSON.stringify(products, null, 2)
    );

    res.writeHead(200);
    res.end("OK");

  });

  return;
}
if (req.url === "/login" && req.method === "POST") {

  let body = "";

  req.on("data", chunk => body += chunk);

  req.on("end", () => {

    const data = JSON.parse(body);

   if (data.user.toLowerCase() === "admin" && data.pass === "1234") {

  loggedIn = true;

  res.writeHead(200);
  res.end("OK");

} else {

  res.writeHead(200);
  res.end("FAIL");

}

  });

  return;
}

  let filePath = "." + req.url;
  if (filePath === "./") filePath = "./index.html";

  const ext = filePath.split(".").pop();

  const types = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript"
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("No encontrado");
      return;
    }

    res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
    res.end(data);
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
