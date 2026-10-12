// ===== 1. В АДМИНКЕ МОЖНО ВЫБРАТЬ НЕСКОЛЬКО ФОТО =====
const renderAddFormBeforeSlides = renderAddForm;
renderAddForm = function (message) {
  renderAddFormBeforeSlides(message);
  const inp = document.getElementById("f-photo");
  if (!inp) return;
  inp.multiple = true;
  inp.previousElementSibling.textContent =
    "Фото (можно выбрать несколько, до 6: готовое блюдо, процесс, ингредиенты)";
};

// новая версия сохранения: загружает все выбранные фото
saveRecipe = async function () {
  const status = document.getElementById("f-status");
  const saveBtn = document.getElementById("f-save");
  const same = function (text) {
    return { en: text, de: text, ru: text, uk: text };
  };

  const title = val("f-title").trim();
  const ingLines = val("f-ings").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
  const stepLines = val("f-steps").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);

  if (!title || ingLines.length === 0 || stepLines.length === 0) {
    status.textContent = "Заполни название, ингредиенты и шаги 🌸";
    return;
  }

  const tags = Array.from(adminContent.querySelectorAll(".tag-row input:checked")).map(function (i) {
    return i.value;
  });

  const recipe = {
    emoji: val("f-emoji").trim() || "🍽️",
    servings: Math.max(1, parseInt(val("f-servings")) || 1),
    time: Math.max(1, parseInt(val("f-time")) || 30),
    tags: tags,
    sourceLang: val("f-lang"),
    title: same(title),
    ingredients: ingLines.map(function (line) {
      const p = parseIngredient(line);
      return { amount: p.amount, unit: p.unit, name: same(p.name) };
    }),
    steps: stepLines.map(parseStep)
  };

  saveBtn.disabled = true;
  status.textContent = "Сохраняю…";

  try {
    const files = Array.from(document.getElementById("f-photo").files).slice(0, 6);
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      status.textContent = "Загружаю фото " + (i + 1) + " из " + files.length + "…";
      urls.push(await uploadPhoto(files[i]));
    }
    if (urls.length > 1) recipe.photos = urls;
    const photoUrl = urls[0] || null;

    const { data, error } = await sb
      .from("recipes")
      .insert({ data: recipe, photo_url: photoUrl })
      .select()
      .single();
    if (error) throw error;

    await loadDbRecipes();
    closeAdmin();
    openRecipe(data.id);
  } catch (e) {
    console.error(e);
    status.textContent = "Ошибка: " + (e.message || e);
    saveBtn.disabled = false;
  }
};

// ===== 2. СЛАЙД-ШОУ В ОКНЕ РЕЦЕПТА =====
let slideTimer = null;
let slideIdx = 0;

function stopSlides() {
  clearInterval(slideTimer);
  slideTimer = null;
}

function showSlide(box, i) {
  const imgs = box.querySelectorAll("img");
  const dots = box.querySelectorAll(".dots span");
  slideIdx = (i + imgs.length) % imgs.length;
  imgs.forEach(function (im, k) {
    im.classList.toggle("on", k === slideIdx);
  });
  dots.forEach(function (d, k) {
    d.classList.toggle("on", k === slideIdx);
  });
}

function startSlides(box) {
  slideIdx = 0;

  // каждые 4 секунды следующее фото; когда окно закрыли, слайд-шоу останавливается
  slideTimer = setInterval(function () {
    if (!modal.classList.contains("open") || !document.body.contains(box)) {
      stopSlides();
      return;
    }
    showSlide(box, slideIdx + 1);
  }, 4000);

  // свайп пальцем или тап: тап = следующее фото
  let startX = null;
  box.addEventListener("pointerdown", function (e) {
    startX = e.clientX;
  });
  box.addEventListener("pointerup", function (e) {
    if (startX === null || e.target.closest(".dots")) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) showSlide(box, slideIdx + (dx < 0 ? 1 : -1));
    else showSlide(box, slideIdx + 1);
  });

  // точки внизу
  box.querySelectorAll(".dots span").forEach(function (d) {
    d.addEventListener("click", function () {
      showSlide(box, Number(d.dataset.i));
    });
  });
}

const renderRecipeBeforeSlides = renderRecipe;
renderRecipe = function () {
  renderRecipeBeforeSlides();
  stopSlides();

  const r = recipes[currentId];
  if (!r || !r.photos || r.photos.length < 2) return;

  const box = document.createElement("div");
  box.className = "slideshow";
  box.innerHTML = r.photos.map(function (u, i) {
    return `<img src="${u}" alt="" class="${i === 0 ? "on" : ""}">`;
  }).join("") + `<div class="dots">` + r.photos.map(function (u, i) {
    return `<span data-i="${i}" class="${i === 0 ? "on" : ""}"></span>`;
  }).join("") + `</div>`;

  // заменяем обычное одиночное фото на слайд-шоу
  const old = modalContent.querySelector(".photo-wrap") || modalContent.querySelector("img.recipe-photo");
  if (old) old.replaceWith(box);
  else modalContent.insertBefore(box, modalContent.firstChild);

  startSlides(box);
};