// js/main.js
console.log("JS cargado correctamente");

// =======================
// NAV responsive
// =======================
const toggleBtn = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-navlinks]");

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

// =======================
// Link activo
// =======================
const current = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navlinks a").forEach(a => {
  const href = a.getAttribute("href");
  if (href === current) a.classList.add("active");
});

// =======================
// Toast (global)
// =======================
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Exponer para otros scripts (cart.js / register.js)
window.showToast = showToast;

// =======================
// Botón descargar (index)
// =======================
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
  const mainText = downloadBtn.childNodes[0];
  const original = mainText.textContent;

  downloadBtn.addEventListener("mouseenter", () => {
    mainText.textContent = "⬇ Descargar 4GB ";
  });

  downloadBtn.addEventListener("mouseleave", () => {
    mainText.textContent = original;
  });

  downloadBtn.addEventListener("click", () => {
    showToast("✅ Descarga iniciada... (simulación)");
  });
}

// =======================
// Imagen clickeable (index)
// =======================
const heroImg = document.getElementById("heroImg");
if (heroImg) {
  heroImg.addEventListener("click", () => {
    heroImg.classList.toggle("img-colored");
  });
}

// =======================
// Carrito (localStorage)
// =======================
const CART_KEY = "arcana_cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const cart = getCart();
  const count = cart.reduce((acc, it) => acc + it.qty, 0);
  badge.textContent = count;
}

// Actualiza badge al cargar cualquier página
updateCartBadge();

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(it => it.id === product.id);

  if (existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });

  setCart(cart);
  updateCartBadge();
  showToast("🛒 Agregado al carrito");
}

// =======================
// Catálogo desde JSON (productos.html)
// =======================
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.querySelector("[data-search]");
const categorySelect = document.querySelector("[data-category]");

// NodeList de cards (se actualiza después de render)
let productCards = [];

function applyFilters() {
  const q = (searchInput?.value || "").toLowerCase().trim();
  const cat = categorySelect?.value || "";

  productCards.forEach(card => {
    const name = (card.dataset.name || "").toLowerCase();
    const category = card.dataset.category || "";

    const matchesText = !q || name.includes(q);
    const matchesCat = !cat || category === cat;

    card.classList.toggle("hidden", !(matchesText && matchesCat));
  });
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categorySelect) categorySelect.addEventListener("change", applyFilters);

async function loadProductsFromJSON() {
  if (!productsGrid) return;

  try {
    const res = await fetch("data/products.json", { cache: "no-store" });
    const products = await res.json();

    // Render
    productsGrid.innerHTML = products.map(p => `
      <article class="card" data-product data-name="${escapeHtml(p.name)}" data-category="${escapeHtml(p.category)}">
        <div class="card__img">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" />
        </div>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="small">Categoría: ${labelCategory(p.category)}</p>
        <p style="margin-top:10px;">${escapeHtml(p.description)}</p>
        <p style="margin:10px 0;"><b>$${Number(p.price).toFixed(2)}</b></p>
        <button class="btn btn--brand add-to-cart" type="button" data-id="${escapeHtml(p.id)}">Agregar</button>
      </article>
    `).join("");

    // Actualizar lista para filtros
    productCards = Array.from(document.querySelectorAll("[data-product]"));
    applyFilters();

    // Click para agregar
    productsGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart");
      if (!btn) return;
      const id = btn.dataset.id;
      const product = products.find(x => x.id === id);
      if (!product) return;
      addToCart(product);
    });
  } catch (err) {
    console.error(err);
    productsGrid.innerHTML = "<p class='small'>No se pudo cargar el catálogo (JSON). Revisa la ruta <b>data/products.json</b>.</p>";
  }
}

function labelCategory(cat) {
  const map = {
    skins: "Skins",
    coaching: "Coaching",
    items: "Packs / Items",
    camisetas: "Camisetas",
    gorras: "Gorras"
  };
  return map[cat] || cat;
}

// Helpers para evitar romper HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadProductsFromJSON();
