// ===== Продукты на полках внутри холодильника =====
function renderInside() {
  const box = document.getElementById("fridge-inside");
  const shelves = [[], [], []];

  fridgeItems.forEach(function (item, i) {
    shelves[i % 3].push(item);
  });

  box.innerHTML = shelves.map(function (list) {
    const items = list.map(function (x) {
      return `<span class="in-item">${esc(x)}</span>`;
    }).join("");
    return `<div class="shelf">${items}</div>`;
  }).join("");
}

// подключаемся к уже существующей функции renderFridge
const renderFridgeBase = renderFridge;
renderFridge = function () {
  renderFridgeBase();
  renderInside();
};

// ===== Дверца открывается, потом выезжает окно =====
const fridgeEl = document.getElementById("fridge");

document.querySelector(".fridge-section").addEventListener("click", function (e) {
  if (!e.target.closest("#fridge")) return;

  e.stopPropagation(); // старое открытие окна пока останавливаем
  if (fridgeEl.classList.contains("open")) return;

  fridgeEl.classList.add("open");
  setTimeout(function () {
    fridgeModal.classList.add("open");
    renderFridgeModal();
  }, 800);
}, true);

// когда окно закрыли, дверца закрывается
new MutationObserver(function () {
  if (!fridgeModal.classList.contains("open")) {
    fridgeEl.classList.remove("open");
  }
}).observe(fridgeModal, { attributes: true, attributeFilter: ["class"] });

renderFridge();