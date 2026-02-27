// category chips buttons
const categoryChips = document.querySelectorAll(".category-button");
categoryChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("category-button-active");
  });
});
// category switch buttons
const categorySwitchButtons = document.querySelectorAll(".card");
categorySwitchButtons.forEach((menuCategoryButton) => {
  menuCategoryButton.addEventListener("click", () => {
    categorySwitchButtons.forEach((el) => {
      el.classList.remove("active-menu-category");
    });
    menuCategoryButton.classList.add("active-menu-category");
  });
});
//navigation side-bar
const openNavBar = document.getElementById("open-nav-button");

const navBar = document.querySelector(".nav-bar");

navBar.addEventListener("click", () => {
  navBar.classList.add("open");
});
document.addEventListener("click", (event) => {
  const isClickOnOpenBtn = openNavBar.contains(event.target);
  const isClickInsideNav = navBar.contains(event.target);

  if (!isClickInsideNav && !isClickOnOpenBtn) {
    navBar.classList.remove("open");
    body.style.marginLeft = "0px";
  }
});

const nav = document.querySelector(".nav-bar");
const body = document.body;
openNavBar.addEventListener("click", toggleMenu);
function toggleMenu() {
  nav.classList.toggle("open");

  if (window.innerWidth > 1023 && nav.classList.contains("open")) {
    body.style.marginLeft = "0px";
  } else {
    body.style.marginLeft = "0px";
  }
}

// comments
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  console.log("cards found:", cards.length);

  cards.forEach((card, idx) => {
    const input = card.querySelector(".input-wrapper-profile input");

    console.log(`card ${idx} input:`, input);

    if (!input) return;

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      addComment(card, text);
      input.value = "";
    });
  });

  function addComment(card, text) {
    const comment = document.createElement("div");
    comment.classList.add("comment-row");

    const img = document.createElement("img");
    img.src = "../../img/profile-2.png";
    img.alt = "pfp";

    const span = document.createElement("span");

    const strong = document.createElement("strong");
    strong.textContent = "You";

    const p = document.createElement("p");
    p.textContent = text;

    const controls = document.createElement("div");
    controls.className = "comment-controls";
    controls.innerHTML = `
                   <button type="button" class="orange-text like-button" >
<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 12.2049C7 9.88261 8.88261 8 11.2049 8C12.5243 8 13.7672 8.61925 14.5618 9.67251L16 11.5789L17.4382 9.67251C18.2328 8.61925 19.4757 8 20.7951 8C23.1174 8 25 9.88261 25 12.2049V12.4166C25 13.8919 24.4463 15.3134 23.4484 16.4L15.55 25L8.3942 16.3884C7.49323 15.3041 7 13.9388 7 12.529V12.2049Z" stroke="var(--orange)"/>
</svg>
Like</button>
      <button type="button" class="orange-text">Reply</button>
      <button type="button" class="orange-text">Translate</button>
      <span>now</span>
    `;

    span.appendChild(strong);
    span.appendChild(p);
    span.appendChild(controls);

    comment.appendChild(img);
    comment.appendChild(span);

    const inputWrapper = card.querySelector(".input-wrapper-profile");
    card.insertBefore(comment, inputWrapper);
  }
});
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".like-button");
  if (!btn) return;

  btn.classList.toggle("liked");
});

//навигация на профиль
//валидация
//корзина
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-dish-to-the-cart");
  if (!btn) return;

  // 1) находим карточку товара (подойдет и dish-card и trending-order-card)
  const card = btn.closest(".dish-card, .trending-order-card");
  if (!card) return;

  // 2) вытаскиваем данные
  const nameEl = card.querySelector("h3");
  const name = nameEl ? nameEl.textContent.trim() : "Unknown";

  // цена (не обязательно, но можно)
  const priceEl = card.querySelector(".price");
  const price = priceEl ? priceEl.textContent.trim() : "";

  // картинка: берем первую подходящую внутри карточки, но НЕ иконку кнопки
  const imgEl = [...card.querySelectorAll("img")].find(
    (img) => !img.classList.contains("star-rating") && !img.closest("button"),
  );
  const imgSrc = imgEl ? imgEl.getAttribute("src") : "";

  addToCart({ name, price, imgSrc });
});

function addToCart({ name, price, imgSrc }) {
  const cart = document.querySelector(".cart-item-container");
  if (!cart) return;

  const checkoutBtn = cart.querySelector(".main-button");

  // ищем есть ли уже такой item по названию
  const existing = [...cart.querySelectorAll(".cart-item")].find((item) => {
    const title = item.querySelector(".pizza-name")?.textContent.trim();
    return title === name;
  });

  if (existing) {
    // увеличить счетчик x N
    const countEl = existing.querySelector(".pizza-count");
    const current = parseInt(countEl.textContent.replace(/\D/g, ""), 10) || 1;
    countEl.textContent = `x ${current + 1}`;
    return;
  }

  // создать новый item
  const item = document.createElement("div");
  item.className = "cart-item";
  item.setAttribute("draggable", "true"); // на будущее для drag&drop

  item.innerHTML = `
    <div class="cart-item-bg"></div>

    <img src="${imgSrc}" alt="${name}" class="cart-item-img" />

    <div class="cart-item-info">
      <p class="pizza-name">${name}</p>
      <span class="pizza-count">x 1</span>
    </div>
  `;

  // вставляем перед Checkout
  if (checkoutBtn) cart.insertBefore(item, checkoutBtn);
  else cart.appendChild(item);
}
//drag n drop
const box = document.querySelector(".cart-item-container");
const btn = box.querySelector(".main-button");

let dragEl = null;
let ph = null;
let shiftX = 0,
  shiftY = 0;

box.addEventListener("mousedown", (e) => {
  const item = e.target.closest(".cart-item");
  if (!item || !box.contains(item)) return;

  dragEl = item;

  const itemRect = dragEl.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();

  shiftX = e.clientX - itemRect.left;
  shiftY = e.clientY - itemRect.top;

  ph = document.createElement("div");
  ph.style.height = itemRect.height + "px";
  ph.style.margin = getComputedStyle(dragEl).margin;
  box.insertBefore(ph, dragEl);

  dragEl.style.width = itemRect.width + "px";
  dragEl.style.height = itemRect.height + "px";

  box.style.position = box.style.position || "relative";
  dragEl.style.position = "absolute";
  dragEl.style.zIndex = "999";
  dragEl.style.pointerEvents = "none";

  dragEl.style.transition = "transform 0.05s linear";
  dragEl.style.transform = "translateZ(0)";

  moveAt(e, boxRect);

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp, { once: true });

  e.preventDefault();
});

function onMouseMove(e) {
  if (!dragEl) return;

  const boxRect = box.getBoundingClientRect();
  moveAt(e, boxRect);

  const elUnder = document.elementFromPoint(e.clientX, e.clientY);
  const target = elUnder && elUnder.closest(".cart-item");

  if (!target || target === dragEl || !box.contains(target)) return;

  const items = [...box.querySelectorAll(".cart-item")];
  const targetIndex = items.indexOf(target);
  const phIndex = [...box.children].indexOf(ph);

  if (phIndex < targetIndex) {
    box.insertBefore(ph, target.nextElementSibling);
  } else {
    box.insertBefore(ph, target);
  }

  if (btn) box.appendChild(btn);
}

function moveAt(e, boxRect) {
  let x = e.clientX - boxRect.left - shiftX;
  let y = e.clientY - boxRect.top - shiftY;

  const maxX = box.clientWidth - dragEl.offsetWidth;
  const maxY = box.clientHeight - dragEl.offsetHeight;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  dragEl.style.left = x + "px";
  dragEl.style.top = y + "px";
}

function onMouseUp() {
  document.removeEventListener("mousemove", onMouseMove);

  if (!dragEl) return;

  box.insertBefore(dragEl, ph);
  ph.remove();
  ph = null;

  dragEl.style.position = "";
  dragEl.style.zIndex = "";
  dragEl.style.left = "";
  dragEl.style.top = "";
  dragEl.style.width = "";
  dragEl.style.height = "";
  dragEl.style.pointerEvents = "";
  dragEl.style.transition = "";
  dragEl.style.transform = "";

  dragEl = null;
}
// лайкии
