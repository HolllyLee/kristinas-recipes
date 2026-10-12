// ===== Тексты на 4 языках =====
const planUi = {
  en: {
    title: "Weekly planner", add: "+ Add dish",
    listBtn: "Shopping list for the week", listTitle: "Shopping list",
    emptyWeek: "Plan some dishes first 🌸",
    skip: "Skip what is already in my fridge", atHome: "🧊 at home",
    copy: "Copy", copied: "Copied 💖",
    clear: "Clear this week", confirmClear: "Clear all dishes of this week?"
  },
  de: {
    title: "Wochenplaner", add: "+ Gericht hinzufügen",
    listBtn: "Einkaufsliste für die Woche", listTitle: "Einkaufsliste",
    emptyWeek: "Plane zuerst ein paar Gerichte 🌸",
    skip: "Weglassen, was schon im Kühlschrank ist", atHome: "🧊 zu Hause",
    copy: "Kopieren", copied: "Kopiert 💖",
    clear: "Woche leeren", confirmClear: "Alle Gerichte dieser Woche löschen?"
  },
  ru: {
    title: "Планировщик недели", add: "+ Добавить блюдо",
    listBtn: "Список покупок на неделю", listTitle: "Список покупок",
    emptyWeek: "Сначала выбери блюда на дни 🌸",
    skip: "Не включать то, что уже есть в холодильнике", atHome: "🧊 есть дома",
    copy: "Скопировать", copied: "Скопировано 💖",
    clear: "Очистить неделю", confirmClear: "Удалить все блюда этой недели?"
  },
  uk: {
    title: "Планувальник тижня", add: "+ Додати страву",
    listBtn: "Список покупок на тиждень", listTitle: "Список покупок",
    emptyWeek: "Спочатку вибери страви на дні 🌸",
    skip: "Не включати те, що вже є в холодильнику", atHome: "🧊 є вдома",
    copy: "Скопіювати", copied: "Скопійовано 💖",
    clear: "Очистити тиждень", confirmClear: "Видалити всі страви цього тижня?"
  }
};

function pt(key) {
  return planUi[lang][key];
}

const planLocales = { en: "en-GB", de: "de-DE", ru: "ru-RU", uk: "uk-UA" };

// plan = { "2026-10-12": ["pancakes", "chicken"], ... }
let plan = loadJson("plan", {});
let weekOffset = 0;
let skipFridge = true;

function plDate(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

// 7 дней недели, начиная с понедельника
function weekDays() {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow + weekOffset * 7 + i));
  }
  return days;
}

function weekLabel() {
  const d = weekDays();
  const f = { day: "numeric", month: "short" };
  return d[0].toLocaleDateString(planLocales[lang], f) + " – " +
    d[6].toLocaleDateString(planLocales[lang], f);
}

// ===== Окно со списком покупок =====
const planModal = document.createElement("div");
planModal.className = "modal";
planModal.innerHTML = `<div class="modal-box">
  <button class="close" id="plan-close">✕</button>
  <div id="plan-content"></div>
</div>`;
document.body.appendChild(planModal);
const planContent = document.getElementById("plan-content");

document.getElementById("plan-close").addEventListener("click", function () {
  planModal.classList.remove("open");
});
planModal.addEventListener("click", function (e) {
  if (e.target === planModal) planModal.classList.remove("open");
});

// ===== Список на неделю: суммируем одинаковые продукты =====
function weekItems() {
  const map = {};
  weekDays().forEach(function (d) {
    (plan[plDate(d)] || []).forEach(function (id) {
      const r = recipes[id];
      if (!r) return;
      r.ingredients.forEach(function (ing) {
        const key = ing.name.en.toLowerCase().trim() + "|" + ing.unit;
        if (!map[key]) {
          map[key] = { name: ing.name, unit: ing.unit, amount: 0 };
        }
        map[key].amount += ing.amount;
      });
    });
  });
  return Object.values(map);
}

// есть ли продукт в холодильнике
function inFridge(item) {
  if (typeof fridgeItems === "undefined") return false;
  const names = Object.values(item.name).map(function (n) {
    return n.toLowerCase();
  });
  return fridgeItems.some(function (h) {
    const x = h.toLowerCase().trim();
    return x.length >= 2 && names.some(function (n) {
      return n.includes(x) || x.includes(n);
    });
  });
}

function planText() {
  let text = `🛒 ${pt("listTitle")} (${weekLabel()})\n\n`;
  weekItems().forEach(function (it) {
    if (skipFridge && inFridge(it)) return;
    const unit = t("units")[it.unit] || "";
    text += `☐ ${formatAmount(it.amount)} ${unit} ${it.name[lang]}\n`;
  });
  text += `\n${t("from")} 🍓`;
  return text;
}

function sharePlan(app) {
  const text = planText();

  if (app === "copy") {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        if (typeof showToast === "function") showToast(pt("copied"));
      });
    }
    return;
  }

  const enc = encodeURIComponent(text);
  const url = app === "telegram"
    ? "https://t.me/share/url?url=%20&text=" + enc
    : "https://wa.me/?text=" + enc;
  window.open(url, "_blank");
}

function renderShoppingList() {
  const items = weekItems();
  let html = `<h2>🛒 ${pt("listTitle")}</h2><p class="plan-weeklabel">${weekLabel()}</p>`;

  if (items.length === 0) {
    planContent.innerHTML = html + `<p>${pt("emptyWeek")}</p>`;
    return;
  }

  html += `<label class="check plan-skip">
    <input type="checkbox" id="pl-skip" ${skipFridge ? "checked" : ""}>
    <span>${pt("skip")}</span>
  </label><ul class="ing-list">`;

  items.forEach(function (it) {
    const have = inFridge(it);
    const unit = t("units")[it.unit] || "";
    html += `<li class="${have && skipFridge ? "have" : ""}">
      ${formatAmount(it.amount)} ${unit} ${it.name[lang]}
      ${have ? `<small>${pt("atHome")}</small>` : ""}
    </li>`;
  });

  html += `</ul><div class="plan-btns">
    <button class="share-btn" data-share="telegram">✈️ Telegram</button>
    <button class="share-btn" data-share="whatsapp">💬 WhatsApp</button>
    <button class="share-btn" data-share="copy">📋 ${pt("copy")}</button>
  </div>`;
  planContent.innerHTML = html;

  document.getElementById("pl-skip").addEventListener("change", function (e) {
    skipFridge = e.target.checked;
    renderShoppingList();
  });
  planContent.querySelectorAll("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      sharePlan(b.dataset.share);
    });
  });
}

function openShoppingList() {
  renderShoppingList();
  planModal.classList.add("open");
}

// ===== Сам планировщик на странице =====
function renderPlanner() {
  const box = document.getElementById("planner");
  if (!box) return;

  const todayStr = plDate(new Date());

  let options = `<option value="">${pt("add")}</option>`;
  Object.keys(recipes).forEach(function (id) {
    options += `<option value="${id}">${recipes[id].emoji} ${recipes[id].title[lang]}</option>`;
  });

  let html = `<h2 class="section-title">📅 ${pt("title")}</h2>
    <div class="plan-nav">
      <button class="filter" id="pl-prev">←</button>
      <span class="plan-week">${weekLabel()}</span>
      <button class="filter" id="pl-next">→</button>
    </div>
    <div class="plan-days">`;

  weekDays().forEach(function (d) {
    const ds = plDate(d);
    const meals = (plan[ds] || []).map(function (id, i) {
      const r = recipes[id];
      if (!r) return "";
      return `<span class="plan-chip">
        <span class="plan-open" data-id="${id}">${r.emoji} ${r.title[lang]}</span>
        <button class="plan-x" data-date="${ds}" data-i="${i}">✕</button>
      </span>`;
    }).join("");

    html += `<div class="plan-day ${ds === todayStr ? "today" : ""}">
      <div class="plan-dayname">${d.toLocaleDateString(planLocales[lang], { weekday: "short" })}<b>${d.getDate()}</b></div>
      <div class="plan-meals">${meals}<select class="plan-add" data-date="${ds}">${options}</select></div>
    </div>`;
  });

  html += `</div>
    <div class="plan-actions">
      <button class="share-btn" id="pl-list">🛒 ${pt("listBtn")}</button>
      <p><button class="link-btn" id="pl-clear">${pt("clear")}</button></p>
    </div>`;
  box.innerHTML = html;

  document.getElementById("pl-prev").addEventListener("click", function () {
    weekOffset--;
    renderPlanner();
  });
  document.getElementById("pl-next").addEventListener("click", function () {
    weekOffset++;
    renderPlanner();
  });

  box.querySelectorAll(".plan-add").forEach(function (sel) {
    sel.addEventListener("change", function () {
      if (!sel.value) return;
      const ds = sel.dataset.date;
      plan[ds] = plan[ds] || [];
      plan[ds].push(sel.value);
      saveJson("plan", plan);
      renderPlanner();
    });
  });

  box.querySelectorAll(".plan-x").forEach(function (b) {
    b.addEventListener("click", function () {
      plan[b.dataset.date].splice(Number(b.dataset.i), 1);
      saveJson("plan", plan);
      renderPlanner();
    });
  });

  box.querySelectorAll(".plan-open").forEach(function (b) {
    b.addEventListener("click", function () {
      openRecipe(b.dataset.id);
    });
  });

  document.getElementById("pl-list").addEventListener("click", openShoppingList);

  document.getElementById("pl-clear").addEventListener("click", function () {
    if (!confirm(pt("confirmClear"))) return;
    weekDays().forEach(function (d) {
      delete plan[plDate(d)];
    });
    saveJson("plan", plan);
    renderPlanner();
  });
}

// при смене языка и после загрузки рецептов из базы обновляем планировщик
const applyLanguageBeforePlanner = applyLanguage;
applyLanguage = function () {
  applyLanguageBeforePlanner();
  renderPlanner();
};

renderPlanner();