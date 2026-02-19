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
