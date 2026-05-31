const container = document.getElementById("products");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let products = [];

fetch("/products")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts();
    updateCart();
  });

function renderProducts() {

  products.forEach(p => {

    container.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>

        <button onclick="addToCart(${p.id})">
          Comprar
        </button>
      </div>
    `;

  });

}

function addToCart(id) {

  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();

}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  updateCart();
}

function increase(id) {
  const item = cart.find(p => p.id === id);
  item.quantity++;
  updateCart();
}

function decrease(id) {
  const item = cart.find(p => p.id === id);

  item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  updateCart();
}

function updateCart() {

  const cartContainer = document.getElementById("cart");
  const totalText = document.getElementById("total");

  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach(item => {

    const subtotal = item.price * item.quantity;
    total += subtotal;

    cartContainer.innerHTML += `
      <div class="card">
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <p>Cantidad: ${item.quantity}</p>
        <p>Subtotal: $${subtotal}</p>

        <button onclick="increase(${item.id})">➕</button>
        <button onclick="decrease(${item.id})">➖</button>
        <button onclick="removeFromCart(${item.id})">Eliminar</button>
      </div>
    `;

  });

  totalText.innerText = `Total: $${total}`;

  localStorage.setItem("cart", JSON.stringify(cart));
}