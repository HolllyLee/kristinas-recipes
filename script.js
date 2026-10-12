// ===== 1. ТЕКСТЫ ИНТЕРФЕЙСА НА 4 ЯЗЫКАХ =====
const ui = {
  en: {
    subtitle: "Cozy recipes made with love",
    servings: "Servings", ingredients: "Ingredients", steps: "Steps",
    min: "min", timer: "Timer", ready: "Ready!", stop: "Stop",
    shopping: "Shopping list", from: "From Kristina's Recipes",
    search: "Search recipe or product…",
    random: "What to cook today?",
    noResults: "Nothing found 🌸",
    filters: { all: "All", quick: "Up to 20 min", protein: "High protein", dairyfree: "Dairy-free", dessert: "Dessert", favorites: "❤️ Favorites" },
    units: { g: "g", ml: "ml", tbsp: "tbsp", tsp: "tsp" }
  },
  de: {
    subtitle: "Gemütliche Rezepte, mit Liebe gemacht",
    servings: "Portionen", ingredients: "Zutaten", steps: "Schritte",
    min: "Min.", timer: "Timer", ready: "Fertig!", stop: "Stopp",
    shopping: "Einkaufsliste", from: "Von Kristina's Recipes",
    search: "Rezept oder Zutat suchen…",
    random: "Was koche ich heute?",
    noResults: "Nichts gefunden 🌸",
    filters: { all: "Alle", quick: "Bis 20 Min.", protein: "Proteinreich", dairyfree: "Milchfrei", dessert: "Dessert", favorites: "❤️ Favoriten" },
    units: { g: "g", ml: "ml", tbsp: "EL", tsp: "TL" }
  },
  ru: {
    subtitle: "Уютные рецепты, приготовленные с любовью",
    servings: "Порции", ingredients: "Ингредиенты", steps: "Шаги",
    min: "мин", timer: "Таймер", ready: "Готово!", stop: "Стоп",
    shopping: "Список покупок", from: "Из Kristina's Recipes",
    search: "Найти рецепт или продукт…",
    random: "Что приготовить сегодня?",
    noResults: "Ничего не найдено 🌸",
    filters: { all: "Все", quick: "До 20 мин", protein: "Много белка", dairyfree: "Без молока", dessert: "Десерты", favorites: "❤️ Избранное" },
    units: { g: "г", ml: "мл", tbsp: "ст. л.", tsp: "ч. л." }
  },
  uk: {
    subtitle: "Затишні рецепти, приготовані з любов'ю",
    servings: "Порції", ingredients: "Інгредієнти", steps: "Кроки",
    min: "хв", timer: "Таймер", ready: "Готово!", stop: "Стоп",
    shopping: "Список покупок", from: "З Kristina's Recipes",
    search: "Знайти рецепт або продукт…",
    random: "Що приготувати сьогодні?",
    noResults: "Нічого не знайдено 🌸",
    filters: { all: "Усі", quick: "До 20 хв", protein: "Багато білка", dairyfree: "Без молока", dessert: "Десерти", favorites: "❤️ Обране" },
    units: { g: "г", ml: "мл", tbsp: "ст. л.", tsp: "ч. л." }
  }
};

// ===== 2. РЕЦЕПТЫ НА 4 ЯЗЫКАХ (tags — для фильтров) =====
const recipes = {
  pancakes: {
    emoji: "🥞", servings: 4, time: 20, tags: ["dessert"],
    title: { en: "Fluffy Pancakes", de: "Fluffige Pfannkuchen", ru: "Пышные панкейки", uk: "Пишні панкейки" },
    ingredients: [
      { amount: 200, unit: "g", name: { en: "Flour", de: "Mehl", ru: "Мука", uk: "Борошно" } },
      { amount: 300, unit: "ml", name: { en: "Milk", de: "Milch", ru: "Молоко", uk: "Молоко" } },
      { amount: 2, unit: "", name: { en: "Eggs", de: "Eier", ru: "Яйца", uk: "Яйця" } },
      { amount: 2, unit: "tbsp", name: { en: "Sugar", de: "Zucker", ru: "Сахар", uk: "Цукор" } }
    ],
    steps: [
      { text: {
        en: "Mix flour and sugar in a bowl.",
        de: "Mehl und Zucker in einer Schüssel vermischen.",
        ru: "Смешайте муку и сахар в миске.",
        uk: "Змішайте борошно та цукор у мисці." } },
      { text: {
        en: "Add milk and eggs, whisk until smooth.",
        de: "Milch und Eier hinzufügen und glatt rühren.",
        ru: "Добавьте молоко и яйца, взбейте до однородности.",
        uk: "Додайте молоко та яйця, збийте до однорідності." } },
      { minutes: 2, text: {
        en: "Fry in a pan for 2 minutes on each side.",
        de: "Auf jeder Seite 2 Minuten in der Pfanne braten.",
        ru: "Жарьте на сковороде по 2 минуты с каждой стороны.",
        uk: "Смажте на сковороді по 2 хвилини з кожного боку." } }
    ]
  },
  pasta: {
    emoji: "🍝", servings: 2, time: 25, tags: [],
    title: { en: "Creamy Pasta", de: "Cremige Pasta", ru: "Паста в сливочном соусе", uk: "Паста у вершковому соусі" },
    ingredients: [
      { amount: 200, unit: "g", name: { en: "Pasta", de: "Nudeln", ru: "Паста", uk: "Паста" } },
      { amount: 150, unit: "ml", name: { en: "Cream", de: "Sahne", ru: "Сливки", uk: "Вершки" } },
      { amount: 2, unit: "", name: { en: "Garlic cloves", de: "Knoblauchzehen", ru: "Зубчики чеснока", uk: "Зубчики часнику" } },
      { amount: 50, unit: "g", name: { en: "Parmesan", de: "Parmesan", ru: "Пармезан", uk: "Пармезан" } }
    ],
    steps: [
      { minutes: 10, text: {
        en: "Boil the pasta for 10 minutes.",
        de: "Nudeln 10 Minuten kochen.",
        ru: "Варите пасту 10 минут.",
        uk: "Варіть пасту 10 хвилин." } },
      { minutes: 5, text: {
        en: "Fry garlic, add cream and simmer for 5 minutes.",
        de: "Knoblauch anbraten, Sahne hinzufügen und 5 Minuten köcheln lassen.",
        ru: "Обжарьте чеснок, добавьте сливки и томите 5 минут.",
        uk: "Обсмажте часник, додайте вершки та томіть 5 хвилин." } },
      { text: {
        en: "Mix with pasta and sprinkle with parmesan.",
        de: "Mit den Nudeln vermischen und mit Parmesan bestreuen.",
        ru: "Смешайте с пастой и посыпьте пармезаном.",
        uk: "Змішайте з пастою та посипте пармезаном." } }
    ]
  },
  cake: {
    emoji: "🍰", servings: 8, time: 60, tags: ["dessert"],
    title: { en: "Strawberry Cake", de: "Erdbeerkuchen", ru: "Клубничный торт", uk: "Полуничний торт" },
    ingredients: [
      { amount: 250, unit: "g", name: { en: "Flour", de: "Mehl", ru: "Мука", uk: "Борошно" } },
      { amount: 400, unit: "g", name: { en: "Strawberries", de: "Erdbeeren", ru: "Клубника", uk: "Полуниця" } },
      { amount: 150, unit: "g", name: { en: "Sugar", de: "Zucker", ru: "Сахар", uk: "Цукор" } },
      { amount: 4, unit: "", name: { en: "Eggs", de: "Eier", ru: "Яйца", uk: "Яйця" } }
    ],
    steps: [
      { text: {
        en: "Whisk eggs with sugar until fluffy.",
        de: "Eier mit Zucker schaumig schlagen.",
        ru: "Взбейте яйца с сахаром до пышности.",
        uk: "Збийте яйця з цукром до пишності." } },
      { minutes: 40, text: {
        en: "Fold in the flour and bake for 40 minutes.",
        de: "Mehl unterheben und 40 Minuten backen.",
        ru: "Аккуратно добавьте муку и выпекайте 40 минут.",
        uk: "Обережно додайте борошно та випікайте 40 хвилин." } },
      { text: {
        en: "Decorate with fresh strawberries.",
        de: "Mit frischen Erdbeeren dekorieren.",
        ru: "Украсьте свежей клубникой.",
        uk: "Прикрасьте свіжою полуницею." } }
    ]
  },
  chicken: {
    emoji: "🍗", servings: 2, time: 15, tags: ["protein", "dairyfree"],
    title: {
      en: "Crispy Airfryer Chicken & Potatoes",
      de: "Knusprige Airfryer-Kartoffeln & Hähnchen",
      ru: "Хрустящая картошка с курицей в аэрогриле",
      uk: "Хрустка картопля з куркою в аерогрилі" },
    ingredients: [
      { amount: 300, unit: "g", name: { en: "Potatoes", de: "Kartoffeln", ru: "Картофель", uk: "Картопля" } },
      { amount: 150, unit: "g", name: { en: "Chicken breast", de: "Hähnchenbrust", ru: "Куриная грудка", uk: "Куряча грудка" } },
      { amount: 1, unit: "tbsp", name: { en: "Olive oil", de: "Olivenöl", ru: "Оливковое масло", uk: "Оливкова олія" } },
      { amount: 1, unit: "tsp", name: { en: "Paprika powder", de: "Paprikapulver", ru: "Паприка молотая", uk: "Мелена паприка" } }
    ],
    steps: [
      { text: {
        en: "Cut the potatoes and chicken into small pieces.",
        de: "Kartoffeln und Hähnchen in kleine Stücke schneiden.",
        ru: "Нарежьте картофель и курицу небольшими кусочками.",
        uk: "Наріжте картоплю та курку невеликими шматочками." } },
      { text: {
        en: "Mix with olive oil and paprika.",
        de: "Mit Olivenöl und Paprika vermengen.",
        ru: "Перемешайте с оливковым маслом и паприкой.",
        uk: "Перемішайте з оливковою олією та паприкою." } },
      { minutes: 15, text: {
        en: "Cook in the airfryer at 200 °C for 15 minutes.",
        de: "Im Airfryer bei 200 °C 15 Minuten garen.",
        ru: "Готовьте в аэрогриле при 200 °C 15 минут.",
        uk: "Готуйте в аерогрилі при 200 °C 15 хвилин." } }
    ]
  }
};

// ===== 3. СОХРАНЕНИЕ В БРАУЗЕРЕ =====
function loadJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v === null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== 4. СОСТОЯНИЕ =====
let lang = localStorage.getItem("lang") || "en";
let searchQuery = "";
let activeFilter = "all";
let favs = loadJson("favs", []);
let checks = loadJson("checks", {});
let currentId = null;
let currentServings = 1;

const filterKeys = ["all", "quick", "protein", "dairyfree", "dessert", "favorites"];

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const timerBox = document.getElementById("timer");
const timerTime = document.getElementById("timer-time");

function t(key) {
  return ui[lang][key];
}

function formatAmount(n) {
  return Math.round(n * 10) / 10;
}

// ===== 5. ЯЗЫК =====
function setLanguage(newLang) {
  lang = newLang;
  localStorage.setItem("lang", newLang);
  applyLanguage();
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.getElementById("subtitle").textContent = t("subtitle");
  document.getElementById("timer-title").textContent = "⏱ " + t("timer");
  document.getElementById("timer-stop").textContent = t("stop");
  document.getElementById("search").placeholder = t("search");
  document.getElementById("random-btn").textContent = "🎲 " + t("random");

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.classList.toggle("active", b.dataset.lang === lang);
  });

  renderFilters();
  renderCards();
  if (currentId && modal.classList.contains("open")) {
    renderRecipe();
  }
  if (typeof renderFridge === "function") renderFridge();
}

document.querySelectorAll(".lang-switch button").forEach(function (b) {
  b.addEventListener("click", function () {
    setLanguage(b.dataset.lang);
  });
});

// ===== 6. ПОИСК И ФИЛЬТРЫ =====
function recipeMatches(id) {
  const r = recipes[id];
  const q = searchQuery.trim().toLowerCase();

  if (q) {
    const texts = Object.values(r.title);
    for (const ing of r.ingredients) {
      texts.push(...Object.values(ing.name));
    }
    const found = texts.some(function (s) {
      return s.toLowerCase().includes(q);
    });
    if (!found) return false;
  }

  if (activeFilter === "all") return true;
  if (activeFilter === "quick") return r.time <= 20;
  if (activeFilter === "favorites") return favs.includes(id);
  return r.tags.includes(activeFilter);
}

function renderFilters() {
  const box = document.getElementById("filters");
  box.innerHTML = "";
  filterKeys.forEach(function (key) {
    const b = document.createElement("button");
    b.className = "filter" + (key === activeFilter ? " active" : "");
    b.textContent = t("filters")[key];
    b.addEventListener("click", function () {
      activeFilter = key;
      renderFilters();
      renderCards();
    });
    box.appendChild(b);
  });
}

document.getElementById("search").addEventListener("input", function (e) {
  searchQuery = e.target.value;
  renderCards();
});

// ===== 7. КАРТОЧКИ И ИЗБРАННОЕ =====
function toggleFav(id) {
  const pos = favs.indexOf(id);
  if (pos === -1) {
    favs.push(id);
  } else {
    favs.splice(pos, 1);
  }
  saveJson("favs", favs);
  renderCards();
}

function renderCards() {
  const box = document.getElementById("recipes");
  box.innerHTML = "";
  let shown = 0;

  for (const id in recipes) {
    if (!recipeMatches(id)) continue;
    shown++;

    const r = recipes[id];
    const isFav = favs.includes(id);
    const card = document.createElement("div");
    card.className = "card";
        card.dataset.id = id;
    card.innerHTML = `
      <button class="fav-btn">${isFav ? "❤️" : "🤍"}</button>
      <div class="card-emoji">${r.emoji}</div>
      <h2>${r.title[lang]}</h2>
      <p>${r.time} ${t("min")} · ${t("servings")}: ${r.servings}</p>`;

    card.addEventListener("click", function () {
      openRecipe(id);
    });
    card.querySelector(".fav-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      toggleFav(id);
    });
    box.appendChild(card);
  }

  if (shown === 0) {
    box.innerHTML = `<p class="empty">${t("noResults")}</p>`;
  }
}

// ===== 8. "ЧТО ПРИГОТОВИТЬ СЕГОДНЯ?" =====
document.getElementById("random-btn").addEventListener("click", function () {
  const ids = Object.keys(recipes);
  openRecipe(ids[Math.floor(Math.random() * ids.length)]);
});

// ===== 9. ОКНО РЕЦЕПТА =====
function renderRecipe() {
  const r = recipes[currentId];
  const factor = currentServings / r.servings;
  const done = checks[currentId] || [];

  let html = `<h2>${r.emoji} ${r.title[lang]}</h2>`;
  html += `<div class="servings">
    <button onclick="changeServings(-1)">−</button>
    <span>${t("servings")}: ${currentServings}</span>
    <button onclick="changeServings(1)">+</button>
  </div>`;

  html += `<h3>${t("ingredients")}</h3><ul class="ing-list">`;
  r.ingredients.forEach(function (item, i) {
    const unit = t("units")[item.unit] || "";
    const checked = done.includes(i) ? "checked" : "";
    html += `<li><label class="check">
      <input type="checkbox" ${checked} onchange="toggleCheck(${i})">
      <span>${formatAmount(item.amount * factor)} ${unit} ${item.name[lang]}</span>
    </label></li>`;
  });
  html += `</ul>`;
  html += `<button class="share-btn" onclick="shareList('telegram')">✈️ Telegram</button> <button class="share-btn" onclick="shareList('whatsapp')">💬 WhatsApp</button>`;

  html += `<h3>${t("steps")}</h3><ol>`;
  for (const step of r.steps) {
    let timerButton = "";
    if (step.minutes) {
      timerButton = `<button class="step-timer" onclick="startTimer(${step.minutes})">⏱ ${step.minutes} ${t("min")}</button>`;
    }
    html += `<li>${step.text[lang]} ${timerButton}</li>`;
  }
  html += `</ol>`;

  modalContent.innerHTML = html;
}

function toggleCheck(i) {
  const list = checks[currentId] || [];
  const pos = list.indexOf(i);
  if (pos === -1) {
    list.push(i);
  } else {
    list.splice(pos, 1);
  }
  checks[currentId] = list;
  saveJson("checks", checks);
  renderRecipe();
}

function openRecipe(id) {
  currentId = id;
  currentServings = recipes[id].servings;
  renderRecipe();
  modal.classList.add("open");
}

function changeServings(delta) {
  currentServings = Math.max(1, currentServings + delta);
  renderRecipe();
}

// ===== 10. ТАЙМЕР =====
let timerInterval = null;
let timerLeft = 0;
let audioCtx = null;

function showTime() {
  const m = String(Math.floor(timerLeft / 60)).padStart(2, "0");
  const s = String(timerLeft % 60).padStart(2, "0");
  timerTime.textContent = m + ":" + s;
}

function startTimer(minutes) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  clearInterval(timerInterval);
  timerLeft = Math.round(minutes * 60);
  showTime();
  timerBox.classList.add("show");

  timerInterval = setInterval(function () {
    timerLeft--;
    showTime();
    if (timerLeft <= 0) {
      clearInterval(timerInterval);
      playChime();
      timerTime.textContent = t("ready") + " 🍓";
    }
  }, 1000);
}

function playChime() {
  const notes = [784, 988, 1175];
  notes.forEach(function (freq, i) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const time = audioCtx.currentTime + i * 0.35;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.25, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 1.3);
  });
}

document.getElementById("timer-stop").addEventListener("click", function () {
  clearInterval(timerInterval);
  timerBox.classList.remove("show");
});

// ===== 11. СПИСОК ПОКУПОК =====
function buildShoppingList() {
  const r = recipes[currentId];
  const factor = currentServings / r.servings;

  let text = `🛒 ${t("shopping")}: ${r.title[lang]} (${t("servings")}: ${currentServings})\n\n`;
  for (const item of r.ingredients) {
    const unit = t("units")[item.unit] || "";
    text += `☐ ${formatAmount(item.amount * factor)} ${unit} ${item.name[lang]}\n`;
  }
  text += `\n${t("from")} 🍓`;
  return text;
}

function shareList(app) {
  const text = encodeURIComponent(buildShoppingList());
  let url;
  if (app === "telegram") {
    url = "https://t.me/share/url?url=%20&text=" + text;
  } else {
    url = "https://wa.me/?text=" + text;
  }
  window.open(url, "_blank");
}

// ===== 12. ЗАКРЫТИЕ ОКНА =====
document.getElementById("close").addEventListener("click", function () {
  modal.classList.remove("open");
});

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.classList.remove("open");
  }
});

// ===== 13. СТАРТ =====
applyLanguage();