// js/cart.js
// Renderiza el carrito (agregar, quitar, cantidades, totales) usando localStorage

(function () {
  const CART_KEY = "arcana_cart";

  const cartContainer = document.getElementById("cartContainer");
  const totalEl = document.getElementById("cartTotal");
  const btnClear = document.getElementById("btnClear");
  const btnCheckout = document.getElementById("btnCheckout");

  if (!cartContainer || !totalEl) return; // Solo corre en carrito.html

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }

  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // actualizar badge si existe
    const badge = document.getElementById("cartBadge");
    if (badge) {
      const count = cart.reduce((acc, it) => acc + it.qty, 0);
      badge.textContent = count;
    }
  }

  function render() {
    const cart = getCart();

    if (!cart.length) {
      cartContainer.innerHTML = "<p class='small'>Tu carrito está vacío. Ve a <a href='productos.html'>Productos</a> para agregar items.</p>";
      totalEl.textContent = "0.00";
      return;
    }

    const rows = cart.map(it => {
      const sub = (it.price * it.qty).toFixed(2);
      return `
        <tr data-id="${it.id}">
          <td class="cart-prod">
            <img src="${it.image}" alt="${it.name}" class="cart-img" />
            <div>
              <b>${it.name}</b>
              <div class="small">$${it.price.toFixed(2)}</div>
            </div>
          </td>
          <td class="cart-qty">
            <button class="qty-btn" data-action="dec" type="button">-</button>
            <span class="qty-val">${it.qty}</span>
            <button class="qty-btn" data-action="inc" type="button">+</button>
          </td>
          <td><b>$${sub}</b></td>
          <td><button class="btn btn--danger btn--sm remove" type="button">Eliminar</button></td>
        </tr>
      `;
    }).join("");

    cartContainer.innerHTML = `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    const total = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
    totalEl.textContent = total.toFixed(2);
  }

  function updateQty(id, dir) {
    const cart = getCart();
    const it = cart.find(x => x.id === id);
    if (!it) return;

    if (dir === "inc") it.qty += 1;
    if (dir === "dec") it.qty = Math.max(1, it.qty - 1);

    setCart(cart);
    render();
  }

  function removeItem(id) {
    const cart = getCart().filter(x => x.id !== id);
    setCart(cart);
    render();
  }

  cartContainer.addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-id]");
    if (!row) return;
    const id = row.dataset.id;

    if (e.target.matches(".qty-btn")) updateQty(id, e.target.dataset.action);
    if (e.target.matches(".remove")) removeItem(id);
  });

  btnClear?.addEventListener("click", () => {
    setCart([]);
    render();
    if (typeof showToast === "function") showToast("🧹 Carrito vacío");
  });

  btnCheckout?.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;
    if (typeof showToast === "function") showToast("✅ Compra finalizada (simulación)");
    setCart([]);
    render();
  });

  // primera render
  render();
})();
