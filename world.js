// ===== Тексты на 4 языках =====
const worldUi = {
  en: {
    title: "Recipes from around the world",
    sub: "Hundreds of ideas with photos. Tap a dish to open it.",
    search: "Search: chicken, cake, pasta…",
    random: "Surprise me", loading: "Loading…",
    error: "Could not load. Check your internet 🌸",
    none: "Nothing found. Try another word 🌸", more: "Show more",
    note: "Original recipe in English · via TheMealDB",
    save: "➕ Save to my recipes", saved: "Saved to your recipes 💖",
    cats: { Dessert: "Desserts", Breakfast: "Breakfast", Chicken: "Chicken", Pasta: "Pasta", Vegetarian: "Vegetarian", Vegan: "Vegan", Seafood: "Seafood", Starter: "Starters" }
  },
  de: {
    title: "Rezepte aus aller Welt",
    sub: "Hunderte Ideen mit Fotos. Tippe auf ein Gericht.",
    search: "Suchen: Hähnchen, Kuchen, Pasta…",
    random: "Überrasch mich", loading: "Lädt…",
    error: "Konnte nicht geladen werden. Prüfe dein Internet 🌸",
    none: "Nichts gefunden. Versuche ein anderes Wort 🌸", more: "Mehr anzeigen",
    note: "Originalrezept auf Englisch · via TheMealDB",
    save: "➕ In meine Rezepte speichern", saved: "In deinen Rezepten gespeichert 💖",
    cats: { Dessert: "Desserts", Breakfast: "Frühstück", Chicken: "Hähnchen", Pasta: "Pasta", Vegetarian: "Vegetarisch", Vegan: "Vegan", Seafood: "Meeresfrüchte", Starter: "Vorspeisen" }
  },
  ru: {
    title: "Рецепты со всего мира",
    sub: "Сотни идей с фото. Нажми на блюдо, чтобы открыть.",
    search: "Поиск: курица, торт, паста…",
    random: "Удиви меня", loading: "Загружаю…",
    error: "Не получилось загрузить. Проверь интернет 🌸",
    none: "Ничего не найдено. Попробуй другое слово 🌸", more: "Показать ещё",
    note: "Оригинальный рецепт на английском · TheMealDB",
    save: "➕ Сохранить в мои рецепты", saved: "Сохранено в твои рецепты 💖",
    cats: { Dessert: "Десерты", Breakfast: "Завтраки", Chicken: "Курица", Pasta: "Паста", Vegetarian: "Вегетарианское", Vegan: "Веганское", Seafood: "Морепродукты", Starter: "Закуски" }
  },
  uk: {
    title: "Рецепти з усього світу",
    sub: "Сотні ідей із фото. Натисни на страву, щоб відкрити.",
    search: "Пошук: курка, торт, паста…",
    random: "Здиви мене", loading: "Завантажую…",
    error: "Не вдалося завантажити. Перевір інтернет 🌸",
    none: "Нічого не знайдено. Спробуй інше слово 🌸", more: "Показати ще",
    note: "Оригінальний рецепт англійською · TheMealDB",
    save: "➕ Зберегти в мої рецепти", saved: "Збережено у твої рецепти 💖",
    cats: { Dessert: "Десерти", Breakfast: "Сніданки", Chicken: "Курка", Pasta: "Паста", Vegetarian: "Вегетаріанське", Vegan: "Веганське", Seafood: "Морепродукти", Starter: "Закуски" }
  }
};

function wt(key) {
  return worldUi[lang][key];
}

// ===== Настройки =====
const MEAL_API = "https://www.themealdb.com/api/json/v1/1/";
const worldCats = ["Dessert", "Breakfast", "Chicken", "Pasta", "Vegetarian", "Vegan", "Seafood", "Starter"];

const catEmoji = {
  Dessert: "🍰", Breakfast: "🥞", Chicken: "🍗", Beef: "🥩", Pasta: "🍝",
  Seafood: "🦐", Vegetarian: "🥗", Vegan: "🌱", Starter: "🥟", Side: "🍟",
  Pork: "🥓", Lamb: "🍖", Goat: "🍖"
};

// слова на других языках → английский поиск
const wordMap = {
  "курица": "chicken", "курка": "chicken", "hähnchen": "chicken", "huhn": "chicken",
  "говядина": "beef", "яловичина": "beef", "rindfleisch": "beef",
  "свинина": "pork", "schweinefleisch": "pork",
  "рыба": "fish", "риба": "fish", "fisch": "fish",
  "лосось": "salmon", "lachs": "salmon",
  "креветки": "prawn", "garnelen": "prawn",
  "торт": "cake", "kuchen": "cake", "пирог": "pie",
  "блины": "pancake", "блини": "pancake", "панкейки": "pancake", "pfannkuchen": "pancake",
  "суп": "soup", "suppe": "soup",
  "паста": "pasta", "макароны": "pasta", "nudeln": "pasta",
  "пицца": "pizza", "піца": "pizza",
  "рис": "rice", "reis": "rice",
  "картошка": "potato", "картофель": "potato", "картопля": "potato", "kartoffel": "potato",
  "клубника": "strawberry", "полуниця": "strawberry", "erdbeere": "strawberry",
  "шоколад": "chocolate", "schokolade": "chocolate",
  "сыр": "cheese", "сир": "cheese", "käse": "cheese",
  "салат": "salad", "salat": "salad",
  "карри": "curry",
  "яблоко": "apple", "яблуко": "apple", "apfel": "apple",
  "банан": "banana"
};

let worldMode = "Dessert";   // категория, а "" значит идёт поиск
let worldQuery = "";
let worldList = [];
let worldShown = 12;
let worldReq = 0;
let worldLang = lang;
const worldCache = {};

async function mealApi(path) {
  const res = await fetch(MEAL_API + path);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

function setWorldStatus(text) {
  const el = document.getElementById("world-status");
  if (el) el.textContent = text;
}

// ===== Превращаем рецепт из базы в наш формат =====
const unitMap = {
  g: { u: "g", k: 1 }, gram: { u: "g", k: 1 }, grams: { u: "g", k: 1 }, kg: { u: "g", k: 1000 },
  ml: { u: "ml", k: 1 }, l: { u: "ml", k: 1000 }, litre: { u: "ml", k: 1000 }, liter: { u: "ml", k: 1000 },
  tbs: { u: "tbsp", k: 1 }, tbsp: { u: "tbsp", k: 1 }, tablespoon: { u: "tbsp", k: 1 }, tablespoons: { u: "tbsp", k: 1 },
  tsp: { u: "tsp", k: 1 }, teaspoon: { u: "tsp", k: 1 }, teaspoons: { u: "tsp", k: 1 },
  cup: { u: "ml", k: 240 }, cups: { u: "ml", k: 240 },
  oz: { u: "g", k: 28 }, lb: { u: "g", k: 454 }, lbs: { u: "g", k: 454 }
};

// "1 1/2 cups" → { amount: 360, unit: "ml", name: ... }
function parseMeasure(measure, name) {
  let m = measure.replace(/\s+/g, " ").trim();
  m = m.replace(/([a-zA-Z])\s*\/\s*\d.*$/, "$1"); // "400g/14oz" → "400g"

  if (!m) return { amount: 1, unit: "", name: name };

  let amount = null;
  let rest = m;
  let x = rest.match(/^(\d+)\/(\d+)/);
  if (x) {
    amount = Number(x[1]) / Number(x[2]);
    rest = rest.slice(x[0].length).trim();
  } else {
    x = rest.match(/^(\d+(?:\.\d+)?)(?:\s+(\d+)\/(\d+))?/);
    if (x) {
      amount = parseFloat(x[1]);
      if (x[2]) amount += Number(x[2]) / Number(x[3]);
      rest = rest.slice(x[0].length).trim();
    }
  }

  if (amount === null) {
    return { amount: 1, unit: "", name: name + " (" + m + ")" };
  }

  const u = rest.match(/^([a-zA-Z]+)\.?\s*(.*)$/);
  if (u && unitMap[u[1].toLowerCase()]) {
    const conv = unitMap[u[1].toLowerCase()];
    return {
      amount: amount * conv.k,
      unit: conv.u,
      name: name + (u[2] ? " (" + u[2] + ")" : "")
    };
  }
  return { amount: amount, unit: "", name: (rest ? rest + " " : "") + name };
}

// длинный текст → шаги
function mealSteps(text) {
  let lines = (text || "")
    .split(/\r?\n/)
    .map(function (s) { return s.trim(); })
    .filter(Boolean)
    .filter(function (s) { return !/^(step\s*\d+|\d+)[.:)]?$/i.test(s); })
    .map(function (s) { return s.replace(/^(step\s*\d+[.:)]?\s*|\d+[.)]\s*)/i, ""); })
    .filter(function (s) { return s.length > 2; });

  // если всё одним куском, режем на предложения и собираем шаги по ~180 символов
  if (lines.length < 3) {
    const sentences = lines.join(" ").match(/[^.!?]+[.!?]+(\s|$)/g) || lines;
    lines = [];
    let chunk = "";
    sentences.forEach(function (s) {
      chunk += s.trim() + " ";
      if (chunk.length > 180) {
        lines.push(chunk.trim());
        chunk = "";
      }
    });
    if (chunk.trim()) lines.push(chunk.trim());
  }

  if (lines.length === 0) lines = ["See the original recipe."];
  return lines;
}

// ищем в шаге "20 minutes" и делаем из этого таймер
function stepMinutes(text) {
  let m = text.match(/(\d+)(?:\s*(?:-|–|to)\s*(\d+))?\s*(?:minutes?|mins?)\b/i);
  if (m) return Number(m[2] || m[1]);
  m = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/i);
  if (m) return Math.round(Number(m[1]) * 60);
  return null;
}

function mealToRecipe(m) {
  const same = function (x) {
    return { en: x, de: x, ru: x, uk: x };
  };

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = (m["strIngredient" + i] || "").trim();
    if (!name) continue;
    const p = parseMeasure((m["strMeasure" + i] || "").trim(), name);
    ingredients.push({ amount: p.amount, unit: p.unit, name: same(p.name) });
  }

  const steps = mealSteps(m.strInstructions).map(function (text) {
    const s = { text: same(text) };
    const min = stepMinutes(text);
    if (min && min <= 180) s.minutes = min;
    return s;
  });

  const cat = m.strCategory || "";
  const tags = [];
  if (cat === "Dessert") tags.push("dessert");
  if (["Chicken", "Beef", "Seafood", "Lamb", "Pork", "Goat"].includes(cat)) tags.push("protein");
  if (cat === "Vegan") tags.push("dairyfree");

  return {
    web: true,
    emoji: catEmoji[cat] || "🍽️",
    servings: 4,
    time: 0,
    tags: tags,
    sourceLang: "en",
    title: same(m.strMeal),
    ingredients: ingredients,
    steps: steps,
    photo: m.strMealThumb
  };
}

// ===== Загрузка =====
async function loadCategory(cat) {
  const id = ++worldReq;
  setWorldStatus(wt("loading"));
  try {
    const data = await mealApi("filter.php?c=" + encodeURIComponent(cat));
    if (id !== worldReq) return;
    worldList = (data.meals || []).map(function (m) {
      return { id: m.idMeal, title: m.strMeal, thumb: m.strMealThumb };
    });
    worldShown = 12;
    setWorldStatus("");
    renderWorldGrid();
  } catch (e) {
    if (id === worldReq) setWorldStatus(wt("error"));
  }
}

async function searchWorld(q) {
  const id = ++worldReq;
  const key = q.trim().toLowerCase();
  const term = wordMap[key] || q.trim();
  setWorldStatus(wt("loading"));
  try {
    const data = await mealApi("search.php?s=" + encodeURIComponent(term));
    if (id !== worldReq) return;
    const meals = data.meals || [];
    meals.forEach(function (m) {
      worldCache[m.idMeal] = m;
    });
    worldList = meals.map(function (m) {
      return { id: m.idMeal, title: m.strMeal, thumb: m.strMealThumb };
    });
    worldShown = 12;
    setWorldStatus(meals.length ? "" : wt("none"));
    renderWorldGrid();
  } catch (e) {
    if (id === worldReq) setWorldStatus(wt("error"));
  }
}

async function openWorld(id) {
  try {
    let meal = worldCache[id];
    if (!meal) {
      const data = await mealApi("lookup.php?i=" + encodeURIComponent(id));
      meal = data.meals && data.meals[0];
      if (!meal) return;
      worldCache[id] = meal;
    }
    const key = "web-" + id;
    recipes[key] = mealToRecipe(meal);
    openRecipe(key);
  } catch (e) {
    setWorldStatus(wt("error"));
  }
}

async function randomWorld() {
  try {
    const data = await mealApi("random.php");
    const meal = data.meals && data.meals[0];
    if (!meal) return;
    worldCache[meal.idMeal] = meal;
    openWorld(meal.idMeal);
  } catch (e) {
    setWorldStatus(wt("error"));
  }
}

// ===== Отрисовка =====
function renderWorldGrid() {
  const grid = document.getElementById("world-grid");
  if (!grid) return;

  grid.innerHTML = worldList.slice(0, worldShown).map(function (m, i) {
    const thumb = esc(m.thumb);
    return `<div class="wcard" data-id="${esc(m.id)}" style="--d:${(i % 6) * 0.12}s">
      <div class="wcard-img"><img src="${thumb}/medium" alt="" loading="lazy" onerror="this.onerror=null;this.src='${thumb}'"></div>
      <h3>${esc(m.title)}</h3>
    </div>`;
  }).join("");

  grid.querySelectorAll(".wcard").forEach(function (c) {
    c.addEventListener("click", function () {
      openWorld(c.dataset.id);
    });
  });

  document.getElementById("world-more").style.display =
    worldList.length > worldShown ? "inline-block" : "none";
}

function renderWorldShell() {
  const box = document.getElementById("world");
  if (!box) return;

  let html = `<h2 class="section-title">🌍 ${wt("title")}</h2>
    <p class="world-sub">${wt("sub")}</p>
    <div class="world-controls">
      <input id="world-q" type="text" placeholder="${wt("search")}">
      <button class="share-btn" id="world-go">🔍</button>
      <button class="share-btn" id="world-rand">🎲 ${wt("random")}</button>
    </div>
    <div class="world-cats">`;
  worldCats.forEach(function (c) {
    html += `<button class="filter ${worldMode === c ? "active" : ""}" data-cat="${c}">${wt("cats")[c]}</button>`;
  });
  html += `</div>
    <p class="world-status" id="world-status"></p>
    <div class="world-grid" id="world-grid"></div>
    <button class="share-btn" id="world-more" style="display:none">${wt("more")}</button>`;
  box.innerHTML = html;

  const input = document.getElementById("world-q");
  input.value = worldQuery;

  function doSearch() {
    const q = input.value.trim();
    if (!q) return;
    worldQuery = q;
    worldMode = "";
    worldList = [];
    renderWorldShell();
    searchWorld(q);
  }

  document.getElementById("world-go").addEventListener("click", doSearch);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") doSearch();
  });
  document.getElementById("world-rand").addEventListener("click", randomWorld);
  document.getElementById("world-more").addEventListener("click", function () {
    worldShown += 12;
    renderWorldGrid();
  });
  box.querySelectorAll("[data-cat]").forEach(function (b) {
    b.addEventListener("click", function () {
      worldMode = b.dataset.cat;
      worldQuery = "";
      worldList = [];
      renderWorldShell();
      loadCategory(worldMode);
    });
  });

  renderWorldGrid();
}

// ===== В окне рецепта: двигающееся фото, подпись и кнопка сохранения =====
async function saveWebRecipe() {
  if (typeof sb === "undefined" || !sb) return;
  const r = recipes[currentId];
  const copy = Object.assign({}, r);
  delete copy.web;
  delete copy.photo;

  const { data, error } = await sb
    .from("recipes")
    .insert({ data: copy, photo_url: r.photo })
    .select()
    .single();

  if (error) {
    alert("Ошибка: " + error.message);
    return;
  }
  await loadDbRecipes();
  if (typeof showToast === "function") showToast(wt("saved"));
  openRecipe(data.id);
}

const renderRecipeBeforeWorld = renderRecipe;
renderRecipe = function () {
  renderRecipeBeforeWorld();
  const r = recipes[currentId];
  if (!r) return;

  // фото в рамке, внутри которой оно медленно "плывёт"
  const img = modalContent.querySelector("img.recipe-photo");
  if (img && !img.parentNode.classList.contains("photo-wrap")) {
    const wrap = document.createElement("div");
    wrap.className = "photo-wrap";
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
  }

  if (r.web) {
    const note = document.createElement("p");
    note.className = "web-note";
    note.textContent = "🌍 " + wt("note");
    modalContent.appendChild(note);

    if (typeof isAdmin !== "undefined" && isAdmin) {
      const btn = document.createElement("button");
      btn.className = "share-btn";
      btn.textContent = wt("save");
      btn.addEventListener("click", saveWebRecipe);
      modalContent.appendChild(btn);
    }
  }
};

// при смене языка обновляем подписи раздела
const applyLanguageBeforeWorld = applyLanguage;
applyLanguage = function () {
  applyLanguageBeforeWorld();
  if (worldLang !== lang) {
    worldLang = lang;
    renderWorldShell();
  }
}; renderWorldShell();
loadCategory(worldMode);