// Editable endpoints
const APP_SCRIPT_URL = ""; // paste your Google Apps Script Web App URL
const STRIPE_PAYMENT_LINK = ""; // optional Stripe Payment Link for online payments

const products = [
  {
    id: "sabji",
    name: "Sabji Masala",
    price: 2.5,
    unit: "100g",
    tone: "#f08a24",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    desc: "Balanced masala for daily veggies."
  },
  {
    id: "sambar",
    name: "Sambar Masala",
    price: 2.9,
    unit: "100g",
    tone: "#e6a700",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    desc: "Tamil Nadu style, roasted lentil base."
  },
  {
    id: "rasam",
    name: "Rasam Powder",
    price: 2.7,
    unit: "100g",
    tone: "#f3c23c",
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    desc: "Peppery, tangy, ready for quick rasam."
  },
  {
    id: "gunpowder",
    name: "Gun Powder (Molaga Podi)",
    price: 3.1,
    unit: "120g",
    tone: "#d65f2f",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    desc: "Idli podi with cold-pressed sesame oil notes."
  },
  {
    id: "chai",
    name: "Chai Masala",
    price: 3.4,
    unit: "75g",
    tone: "#c48a6a",
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    desc: "Warming spices for kadak masala chai."
  },
  {
    id: "chole",
    name: "Chole Masala",
    price: 2.8,
    unit: "100g",
    tone: "#f08f53",
    img: "https://images.unsplash.com/photo-1604908176888-3c9ad9c13b53?auto=format&fit=crop&w=800&q=80",
    desc: "Delhi-style dark, tangy chole blend."
  },
  {
    id: "rajma",
    name: "Rajma Masala",
    price: 2.8,
    unit: "100g",
    tone: "#f2a679",
    img: "https://images.unsplash.com/photo-1628485811705-51f9eb9fc830?auto=format&fit=crop&w=800&q=80",
    desc: "Slow-simmered kidney bean curry spice."
  },
  {
    id: "dalmakhni",
    name: "Dal Makhni Masala",
    price: 3.0,
    unit: "100g",
    tone: "#ce6d4f",
    img: "https://images.unsplash.com/photo-1612874472278-5c1b07f9d8d6?auto=format&fit=crop&w=800&q=80",
    desc: "Creamy, smoky profile for dal makhni."
  },
  {
    id: "garam",
    name: "Garam Masala",
    price: 3.2,
    unit: "80g",
    tone: "#b25d2c",
    img: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=800&q=80",
    desc: "Robust finishing blend, North Indian style."
  },
  {
    id: "vrat",
    name: "Vrat Masala",
    price: 2.6,
    unit: "90g",
    tone: "#8bcf7a",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
    desc: "Rock salt friendly masala for fast days."
  },
  {
    id: "vrat-chai",
    name: "Vrat Chai Masala",
    price: 3.0,
    unit: "70g",
    tone: "#7bb67f",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    desc: "Caffeine-free spice mix for vrat-friendly chai."
  },
  {
    id: "thandai",
    name: "Thandai Powder",
    price: 3.5,
    unit: "150g",
    tone: "#d4705f",
    img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
    desc: "Cooling nut-spice mix for milk or desserts."
  }
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
const formHint = document.getElementById("form-hint");

function formatMoney(n) {
  return "$" + n.toFixed(2);
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
        <button class="pill primary add" data-id="${p.id}">Add to cart</button>
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
