// ===== Магниты, которые можно двигать пальцем =====
let magnetPos = loadJson("magnetPos", {});
const magnetBox = document.getElementById("magnets");
const fridgeBox = document.getElementById("fridge");
let drag = null;
let justDragged = false;

// где магнит стоит, если его ещё не двигали
function defaultPos(i) {
  return { x: (i % 2) * 0.46 + 0.02, y: Math.floor(i / 2) * 0.1 + 0.02 };
}

// расставляем магниты по сохранённым местам
function applyMagnets() {
  const w = magnetBox.clientWidth;
  const h = magnetBox.clientHeight;

  magnetBox.querySelectorAll(".magnet").forEach(function (el, i) {
    const p = magnetPos[el.textContent] || defaultPos(i);
    const x = Math.max(0, Math.min(p.x * w, w - el.offsetWidth));
    const y = Math.max(0, Math.min(p.y * h, h - el.offsetHeight));
    el.style.left = x + "px";
    el.style.top = y + "px";
  });
}

// после каждой отрисовки холодильника расставляем магниты
const renderFridgeBeforeMagnets = renderFridge;
renderFridge = function () {
  renderFridgeBeforeMagnets();
  applyMagnets();
};

// схватили магнит
magnetBox.addEventListener("pointerdown", function (e) {
  const el = e.target.closest(".magnet");
  if (!el) return;

  const r = el.getBoundingClientRect();
  drag = {
    el: el,
    dx: e.clientX - r.left,
    dy: e.clientY - r.top,
    startX: e.clientX,
    startY: e.clientY,
    moved: false
  };
  el.setPointerCapture(e.pointerId);
  el.classList.add("grabbing");
  fridgeBox.classList.add("dragging");
  e.preventDefault();
});

// тащим
magnetBox.addEventListener("pointermove", function (e) {
  if (!drag) return;

  if (Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY) > 4) {
    drag.moved = true;
  }

  const c = magnetBox.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - c.left - drag.dx, c.width - drag.el.offsetWidth));
  const y = Math.max(0, Math.min(e.clientY - c.top - drag.dy, c.height - drag.el.offsetHeight));
  drag.el.style.left = x + "px";
  drag.el.style.top = y + "px";
});

// отпустили
function endDrag() {
  if (!drag) return;

  const el = drag.el;
  el.classList.remove("grabbing");
  fridgeBox.classList.remove("dragging");

  if (drag.moved) {
    magnetPos[el.textContent] = {
      x: parseFloat(el.style.left) / magnetBox.clientWidth,
      y: parseFloat(el.style.top) / magnetBox.clientHeight
    };
    saveJson("magnetPos", magnetPos);

    // чтобы после перетаскивания дверца не открылась случайно
    justDragged = true;
    setTimeout(function () {
      justDragged = false;
    }, 150);
  }
  drag = null;
}

magnetBox.addEventListener("pointerup", endDrag);
magnetBox.addEventListener("pointercancel", endDrag);

document.addEventListener("click", function (e) {
  if (justDragged) {
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

renderFridge();