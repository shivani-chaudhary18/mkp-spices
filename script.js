// Editable endpoints
const APP_SCRIPT_URL = "";          // paste your Google Apps Script Web App URL
const STRIPE_PAYMENT_LINK = "";     // optional Stripe Payment Link for online payments

const products = [
  { id: "sabji", name: "Sabji Masala", price: 220, unit: "100g", tone: "#f08a24",
    img: "products-image/sabji masala.png",
    desc: "Balanced masala for daily veggies.",
    amazon: "https://amzn.in/d/0e7GNV95" },
  { id: "sambar", name: "Sambar Masala", price: 220, unit: "100g", tone: "#e6a700",
    img: "products-image/sambar masala.png",
    desc: "Tamil Nadu style, roasted lentil base.",
    amazon: "https://amzn.in/d/0i0Fw7jv" },
  { id: "rasam", name: "Rasam Powder", price: 220, unit: "100g", tone: "#f3c23c",
    img: "products-image/rasam powder.png",
    desc: "Peppery, tangy, ready for quick rasam.",
    amazon: "https://www.amazon.in/your-rasam-link" },
  { id: "gunpowder", name: "Gun Powder", price: 220, unit: "100g", tone: "#d65f2f",
    img: "products-image/gun powder.png",
    desc: "Idli podi with cold-pressed sesame oil notes.",
    amazon: "https://www.amazon.in/your-gunpowder-link" },
  { id: "chai", name: "Chai Masala", price: 220, unit: "100g", tone: "#c48a6a",
    img: "products-image/chai masala.png",
    desc: "Warming spices for kadak masala chai.",
    amazon: "https://www.amazon.in/your-chai-link" },
  { id: "chole", name: "Chole Masala", price: 220, unit: "100g", tone: "#f08f53",
    img: "products-image/chole masala.png",
    desc: "Delhi-style dark, tangy chole blend.",
    amazon: "https://amzn.in/d/0g2AEtcu" },
  { id: "rajma", name: "Rajma Masala", price: 220, unit: "100g", tone: "#f2a679",
    img: "products-image/rajma masala.png",
    desc: "Slow-simmered kidney bean curry spice.",
    amazon: "https://www.amazon.in/your-rajma-link" },
  { id: "dalmakhni", name: "Dal Makhni Masala", price: 220, unit: "100g", tone: "#ce6d4f",
    img: "products-image/dal makhni.jpeg",
    desc: "Creamy, smoky profile for dal makhni.",
    amazon: "https://amzn.in/d/0fjB87Rf" },
  { id: "garam", name: "Garam Masala", price: 220, unit: "100g", tone: "#b25d2c",
    img: "products-image/garam masala.png",
    desc: "Robust finishing blend, North Indian style.",
    amazon: "https://www.amazon.in/your-garam-link" },
  { id: "vrat", name: "Vrat Masala", price: 220, unit: "100g", tone: "#8bcf7a",
    img: "products-image/vrat special.png",
    desc: "Rock salt friendly masala for fast days.",
    amazon: "https://amzn.in/d/0eI3o9Cj" },
  { id: "vrat-chai", name: "Vrat Chai Masala", price: 220, unit: "100g", tone: "#7bb67f",
    img: "products-image/vrat chai.png",
    desc: "Caffeine-free spice mix for vrat-friendly chai.",
    amazon: "https://www.amazon.in/your-vrat-chai-link" },
  { id: "thandai", name: "Thandai Powder", price: 220, unit: "100g", tone: "#d4705f",
    img: "products-image/thandai powder.png",
    desc: "Cooling nut-spice mix for milk or desserts.",
    amazon: "https://www.amazon.in/your-thandai-link" }
];

const cart = {};

const grid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const cartStatus = document.getElementById("cart-status");
const clearCartBtn = document.getElementById("clear-cart");
const form = document.getElementById("order-form");
const submitBtn = document.getElementById("submit-btn");

function formatMoney(n) {
  return "₹" + n.toFixed(2);
}

function renderProducts() {
  if (!grid) return;
  products.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.style.setProperty("--tone", p.tone);
    card.innerHTML = `
      <div class="thumb" style="background-image:url('${p.img}')"></div>
      <div class="body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">${formatMoney(p.price)} <span class="unit">/ ${p.unit}</span></div>
        <small class="buy-note">Bulk here • Single pack on Amazon</small>
        <div class="actions">
          <button class="pill primary add" data-id="${p.id}">Add to cart (bulk)</button>
          <a class="pill ghost full" href="${p.amazon}" target="_blank" rel="noreferrer">Buy on Amazon</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  if (!cart[id]) {
    cart[id] = { ...product, qty: 1 };
  } else {
    cart[id].qty += 1;
  }
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  const items = Object.values(cart);
  cartItemsEl.innerHTML = "";
  let subtotal = 0;

  items.forEach((item) => {
    const line = item.price * item.qty;
    subtotal += line;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <div class="meta">${item.qty} x ${formatMoney(item.price)} (${item.unit})</div>
      </div>
      <div class="qty">
        <button aria-label="Decrease" data-id="${item.id}" data-delta="-1">-</button>
        <span>${item.qty}</span>
        <button aria-label="Increase" data-id="${item.id}" data-delta="1">+</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartCount.textContent = items.reduce((sum, item) => sum + item.qty, 0);
  subtotalEl.textContent = formatMoney(subtotal);
  totalEl.textContent = formatMoney(subtotal);
  cartEmpty.style.display = items.length ? "none" : "block";
}

function handleCartClick(e) {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.classList.contains("add")) {
    addToCart(btn.dataset.id);
  } else if (btn.dataset.delta) {
    changeQty(btn.dataset.id, Number(btn.dataset.delta));
  }
}

async function submitOrder(evt) {
  evt.preventDefault();
  const items = Object.values(cart);
  if (!items.length) {
    cartStatus.textContent = "Add at least one product to proceed.";
    return;
  }
  const formData = new FormData(form);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    notes: formData.get("notes"),
    payment: formData.get("payment"),
    items: items.map(({ id, name, qty, price, unit }) => ({ id, name, qty, price, unit })),
    total: Number(totalEl.textContent.replace(/[^0-9.]/g, "")),
    createdAt: new Date().toISOString(),
    source: "mkp-masale-web"
  };

  submitBtn.disabled = true;
  cartStatus.textContent = "Sending order...";

  if (!APP_SCRIPT_URL) {
    cartStatus.textContent = "Set APP_SCRIPT_URL to send orders to Google Sheets.";
    submitBtn.disabled = false;
    return;
  }

  try {
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Network error");
    cartStatus.textContent = "Order received. Check your email for confirmation.";
    Object.keys(cart).forEach((k) => delete cart[k]);
    renderCart();
    form.reset();
    if (payload.payment === "online" && STRIPE_PAYMENT_LINK) {
      window.open(STRIPE_PAYMENT_LINK, "_blank");
    }
  } catch (err) {
    console.error(err);
    cartStatus.textContent = "Could not send order. Please try again or use WhatsApp.";
  } finally {
    submitBtn.disabled = false;
  }
}

function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  grid.addEventListener("click", handleCartClick);
  cartItemsEl.addEventListener("click", handleCartClick);
  clearCartBtn.addEventListener("click", () => {
    Object.keys(cart).forEach((k) => delete cart[k]);
    renderCart();
  });
  document.getElementById("cart-pill").addEventListener("click", () => {
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
  });
  form.addEventListener("submit", submitOrder);
  initFooterYear();
});
