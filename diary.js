// ===== Тексты на 4 языках =====
const diaryUi = {
  en: {
    diary: "My cooking diary", cooked: "✅ I cooked it!", cookedTimes: "Cooked",
    garden: "My garden", stamps: "Recipe stamps", ach: "Achievements",
    empty: "Cook your first recipe to plant the first flower 🌱",
    added: "Added to your diary 💖", newAch: "New achievement:",
    reset: "Reset diary", confirmReset: "Delete the whole diary?",
    levels: ["Seedling", "Kitchen Sprout", "Sunny Cook", "Berry Chef", "Kitchen Queen"],
    achs: {
      first: { name: "First Breakfast", desc: "Cook your first recipe" },
      fridge: { name: "Nothing Goes to Waste", desc: "Cook a recipe using only products from your fridge" },
      week: { name: "A Week Without Repeats", desc: "Cook different dishes 7 days in a row" },
      sweet: { name: "Little Pastry Chef", desc: "Cook 5 desserts" },
      collector: { name: "Recipe Collector", desc: "Cook 5 different recipes" }
    }
  },
  de: {
    diary: "Mein Kochtagebuch", cooked: "✅ Gekocht!", cookedTimes: "Gekocht",
    garden: "Mein Garten", stamps: "Rezept-Stempel", ach: "Erfolge",
    empty: "Koche dein erstes Rezept und pflanze die erste Blume 🌱",
    added: "Im Tagebuch gespeichert 💖", newAch: "Neuer Erfolg:",
    reset: "Tagebuch zurücksetzen", confirmReset: "Das ganze Tagebuch löschen?",
    levels: ["Setzling", "Küchenkeimling", "Sonnenköchin", "Beerenchefin", "Küchenkönigin"],
    achs: {
      first: { name: "Erstes Frühstück", desc: "Koche dein erstes Rezept" },
      fridge: { name: "Nichts wird weggeworfen", desc: "Koche ein Rezept nur mit Zutaten aus deinem Kühlschrank" },
      week: { name: "Eine Woche ohne Wiederholung", desc: "Koche 7 Tage hintereinander verschiedene Gerichte" },
      sweet: { name: "Kleine Konditorin", desc: "Koche 5 Desserts" },
      collector: { name: "Rezeptsammlerin", desc: "Koche 5 verschiedene Rezepte" }
    }
  },
  ru: {
    diary: "Мой кулинарный дневник", cooked: "✅ Я приготовила!", cookedTimes: "Приготовлено",
    garden: "Мой садик", stamps: "Печати рецептов", ach: "Достижения",
    empty: "Приготовь первый рецепт, и вырастет первый цветочек 🌱",
    added: "Добавлено в дневник 💖", newAch: "Новое достижение:",
    reset: "Сбросить дневник", confirmReset: "Удалить весь дневник?",
    levels: ["Росточек", "Кухонный бутон", "Солнечная повариха", "Ягодный шеф", "Королева кухни"],
    achs: {
      first: { name: "Первый завтрак", desc: "Приготовь первый рецепт" },
      fridge: { name: "Ничего не выбрасываю", desc: "Приготовь рецепт только из продуктов, которые есть в холодильнике" },
      week: { name: "Неделя без повторов", desc: "Готовь разные блюда 7 дней подряд" },
      sweet: { name: "Маленький кондитер", desc: "Приготовь 5 десертов" },
      collector: { name: "Коллекционерка рецептов", desc: "Приготовь 5 разных рецептов" }
    }
  },
  uk: {
    diary: "Мій кулінарний щоденник", cooked: "✅ Я приготувала!", cookedTimes: "Приготовано",
    garden: "Мій садок", stamps: "Печатки рецептів", ach: "Досягнення",
    empty: "Приготуй перший рецепт, і виросте перша квіточка 🌱",
    added: "Додано до щоденника 💖", newAch: "Нове досягнення:",
    reset: "Скинути щоденник", confirmReset: "Видалити весь щоденник?",
    levels: ["Паросток", "Кухонний бутон", "Сонячна кухарка", "Ягідна шефиня", "Королева кухні"],
    achs: {
      first: { name: "Перший сніданок", desc: "Приготуй перший рецепт" },
      fridge: { name: "Нічого не викидаю", desc: "Приготуй рецепт лише з продуктів, що є в холодильнику" },
      week: { name: "Тиждень без повторів", desc: "Готуй різні страви 7 днів поспіль" },
      sweet: { name: "Маленька кондитерка", desc: "Приготуй 5 десертів" },
      collector: { name: "Колекціонерка рецептів", desc: "Приготуй 5 різних рецептів" }
    }
  }
};

function dt(key) {
  return diaryUi[lang][key];
}

// ===== Дневник (запоминается в браузере) =====
let diary = loadJson("diary", []);

function fmtDate(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

function addDays(dateStr, n) {
  const p = dateStr.split("-").map(Number);
  return fmtDate(new Date(p[0], p[1] - 1, p[2] + n));
}

// ===== Достижения =====
function weekCheck(d) {
  const byDay = {};
  d.forEach(function (e) {
    if (!byDay[e.date]) byDay[e.date] = e.id;
  });
  const days = Object.keys(byDay).sort();

  for (let i = 0; i + 6 < days.length; i++) {
    let ok = true;
    const ids = new Set();
    for (let k = 0; k < 7; k++) {
      if (days[i + k] !== addDays(days[i], k)) {
        ok = false;
        break;
      }
      ids.add(byDay[days[i + k]]);
    }
    if (ok && ids.size === 7) return true;
  }
  return false;
}

const achievements = [
  { id: "first", emoji: "🍳", check: function (d) { return d.length >= 1; } },
  { id: "fridge", emoji: "🧊", check: function (d) { return d.some(function (e) { return e.fromFridge; }); } },
  { id: "week", emoji: "📅", check: weekCheck },
  { id: "sweet", emoji: "🧁", check: function (d) { return d.filter(function (e) { return e.dessert; }).length >= 5; } },
  { id: "collector", emoji: "📚", check: function (d) {
    return new Set(d.map(function (e) { return e.id; })).size >= 5;
  } }
];

function unlockedIds() {
  return achievements
    .filter(function (a) { return a.check(diary); })
    .map(function (a) { return a.id; });
}

// ===== Уровни и садик =====
const levelMins = [0, 3, 7, 12, 20];
const levelEmojis = ["🌱", "🌷", "🌻", "🍓", "👑"];
const flowers = ["🌷", "🌸", "🌼", "🌻", "🌺", "🌹", "🍓", "🍒"];
const decorations = [
  { min: 3, e: "🦋" }, { min: 6, e: "🐝" }, { min: 10, e: "🌈" },
  { min: 15, e: "🏡" }, { min: 20, e: "✨" }
];

function levelIndex(n) {
  let idx = 0;
  levelMins.forEach(function (m, i) {
    if (n >= m) idx = i;
  });
  return idx;
}

function renderDiary() {
  const box = document.getElementById("diary");
  if (!box) return;

  const count = diary.length;
  const idx = levelIndex(count);
  const last = levelMins.length - 1;
  const pct = idx === last
    ? 100
    : Math.round(((count - levelMins[idx]) / (levelMins[idx + 1] - levelMins[idx])) * 100);

  let html = `<h2 class="section-title">📖 ${dt("diary")}</h2>`;

  html += `<div class="level-box">
    <b>${levelEmojis[idx]} ${dt("levels")[idx]}</b>
    <div class="level-bar"><div style="width:${pct}%"></div></div>
    <small>${count} ✓</small>
  </div>`;

  // садик
  html += `<h3 class="diary-sub">🌿 ${dt("garden")}</h3>`;
  if (count === 0) {
    html += `<p class="diary-empty">${dt("empty")}</p>`;
  }
  html += `<div class="garden"><div class="sky">`;
  decorations.forEach(function (d) {
    if (count >= d.min) html += `<span class="deco">${d.e}</span>`;
  });
  html += `</div><div class="plots">`;
  const shown = diary.slice(-24);
  for (let i = 0; i < 24; i++) {
    if (i < shown.length) {
      const flower = flowers[(diary.length - shown.length + i) % flowers.length];
      html += `<span class="plant" style="animation-delay:${(i % 6) * 0.3}s">${flower}</span>`;
    } else {
      html += `<span class="plot"></span>`;
    }
  }
  html += `</div></div>`;

  // достижения
  html += `<h3 class="diary-sub">🏆 ${dt("ach")}</h3><div class="badges">`;
  achievements.forEach(function (a) {
    const ok = a.check(diary);
    const info = dt("achs")[a.id];
    html += `<div class="badge ${ok ? "on" : "off"}">
      <span class="badge-emoji">${ok ? a.emoji : "🔒"}</span>
      <b>${info.name}</b>
      <small>${info.desc}</small>
    </div>`;
  });
  html += `</div>`;

  // печати
  if (count > 0) {
    html += `<h3 class="diary-sub">💮 ${dt("stamps")}</h3><div class="stamps">`;
    const stamps = {};
    diary.forEach(function (e) {
      if (!stamps[e.id]) stamps[e.id] = { n: 0 };
      stamps[e.id].n++;
      stamps[e.id].last = e;
    });
    Object.values(stamps).forEach(function (s, i) {
      const title = s.last.title[lang] || s.last.title.en;
      const times = s.n > 1 ? " · ×" + s.n : "";
      html += `<div class="stamp" style="--r:${(i % 5) * 3 - 6}deg">
        <div class="stamp-emoji">${s.last.emoji}</div>
        <div class="stamp-title">${title}</div>
        <small>${s.last.date}${times}</small>
      </div>`;
    });
    html += `</div>`;
    html += `<p><button class="link-btn" onclick="resetDiary()">${dt("reset")}</button></p>`;
  }

  box.innerHTML = html;
}

function resetDiary() {
  if (!confirm(dt("confirmReset"))) return;
  diary = [];
  saveJson("diary", diary);
  renderDiary();
}

// ===== Всплывающее сообщение =====
function showToast(text) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function () {
    el.remove();
  }, 3500);
}

// ===== "Я приготовила!" =====
function cookDone(id) {
  const r = recipes[id];
  const before = unlockedIds();

  const fromFridge = typeof matchRecipes === "function" &&
    matchRecipes().some(function (m) {
      return m.id === id && m.missing.length === 0;
    });

  diary.push({
    id: id,
    date: fmtDate(new Date()),
    t: Date.now(),
    emoji: r.emoji,
    title: r.title,
    dessert: !!(r.tags && r.tags.includes("dessert")),
    fromFridge: fromFridge
  });
  saveJson("diary", diary);

  const fresh = unlockedIds().filter(function (a) {
    return !before.includes(a);
  });

  renderDiary();
  renderRecipe();
  if (typeof confetti === "function") confetti();

  if (fresh.length > 0) {
    showToast("🏆 " + dt("newAch") + " " + dt("achs")[fresh[0]].name);
  } else {
    showToast(dt("added"));
  }
}

// ===== Кнопка в окне рецепта =====
const renderRecipeBeforeDiary = renderRecipe;
renderRecipe = function () {
  renderRecipeBeforeDiary();

  const n = diary.filter(function (e) {
    return e.id === currentId;
  }).length;

  const wrap = document.createElement("div");
  wrap.className = "cooked-wrap";
  wrap.innerHTML = `<button class="share-btn">${dt("cooked")}</button>` +
    (n ? `<span class="cooked-count">${dt("cookedTimes")}: ${n}×</span>` : "");
  wrap.querySelector("button").addEventListener("click", function () {
    cookDone(currentId);
  });

  modalContent.insertBefore(wrap, modalContent.querySelector(".danger"));
};

// при смене языка обновляем и дневник
const applyLanguageBeforeDiary = applyLanguage;
applyLanguage = function () {
  applyLanguageBeforeDiary();
  renderDiary();
};

renderDiary();