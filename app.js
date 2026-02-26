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
const navBar = document.querySelector(".nav-bar");
navBar.addEventListener("click", () => {
  navBar.classList.add("open");
});
document.addEventListener("click", (event) => {
  if (!navBar.contains(event.target)) {
    navBar.classList.remove("open");
  }
});

const nav = document.querySelector(".nav-bar");
const body = document.body;

function toggleMenu() {
  nav.classList.toggle("open");

  if (nav.classList.contains("open")) {
    body.style.marginLeft = "120px";
  } else {
    body.style.marginLeft = "0px";
  }
}
//навигация на профиль
//валидация
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
