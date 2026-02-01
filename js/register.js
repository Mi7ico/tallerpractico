// js/register.js
// Registro con validación usando expresiones regulares (localStorage en JSON)

(function () {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("msg");
  if (!form || !msg) return; // Solo corre en registro.html

  const USERS_KEY = "arcana_users";

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,60}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }
  function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function setMessage(text, ok) {
    msg.textContent = text;
    msg.style.color = ok ? "var(--success, #22c55e)" : "crimson";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!nameRegex.test(fullName)) return setMessage("Nombre inválido: solo letras/espacios (mín. 3).", false);
    if (!emailRegex.test(email)) return setMessage("Correo inválido.", false);
    if (!passRegex.test(password)) return setMessage("Contraseña: 8+ con mayúscula, minúscula y número.", false);
    if (password !== confirm) return setMessage("Las contraseñas no coinciden.", false);

    const users = getUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return setMessage("Ese correo ya está registrado.", false);

    users.push({ fullName, email, createdAt: new Date().toISOString() });
    setUsers(users);

    setMessage("Registro exitoso ✅", true);
    if (typeof showToast === "function") showToast("✅ Usuario registrado");
    form.reset();
  });
})();
