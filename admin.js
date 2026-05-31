loadProducts();

function loadProducts() {

  fetch("/products")
    .then(res => res.json())
    .then(products => {

      const table =
        document.getElementById("productsTable");

      table.innerHTML = "";

      products.forEach(product => {

  table.innerHTML += `
  <tr>
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>$${product.price}</td>

    <td>
      <button onclick="deleteProduct(${product.id})">🗑️</button>
      <button onclick="editProduct(${product.id}, '${product.name}', ${product.price})">✏️</button>
    </td>
  </tr>
`;

      });

    });

}

function addProduct() {

  const name =
    document.getElementById("name").value;

  const price =
    document.getElementById("price").value;

  fetch("/add-product", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      name,
      price
    })

  })
  .then(() => {

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";

    loadProducts();

  });

}
function deleteProduct(id) {

  fetch("/delete-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  })
  .then(() => loadProducts());

}
function editProduct(id, name, price) {

  const newName = prompt("Nuevo nombre:", name);

  if (newName === null) return; // cancelado

  const newPrice = prompt("Nuevo precio:", price);

  if (newPrice === null) return; // cancelado

  fetch("/update-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id,
      name: newName,
      price: newPrice
    })
  })
  .then(() => loadProducts());

}
    
function createBackup() {

  fetch("/backup")
    .then(res => res.text())
    .then(message => {

      document.getElementById("backupMessage")
        .innerText = message;

    })
    .catch(err => {

      document.getElementById("backupMessage")
        .innerText = "Error creando respaldo";

    });

}