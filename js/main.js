// js/main.js
console.log("JS cargado correctamente");

// 1) MENU MOVIL (hamburger)
const toggleBtn = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-navlinks]");

if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });
}

// 2) LINK ACTIVO AUTOMATICO (opcional si no quieres poner "active" a mano)
const current = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navlinks a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
});

// 3) FILTROS EN PRODUCTOS (buscador + categoria)
const searchInput = document.querySelector("[data-search]");
const categorySelect = document.querySelector("[data-category]");
const products = document.querySelectorAll("[data-product]");

function applyFilters() {
    const q = (searchInput?.value || "").toLowerCase().trim();
    const cat = categorySelect?.value || "";

    products.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category;

    const matchesText = !q || name.includes(q);
    const matchesCat = !cat || category === cat;

    card.classList.toggle("hidden", !(matchesText && matchesCat));
    });
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categorySelect) categorySelect.addEventListener("change", applyFilters);