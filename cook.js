// ===== Тексты =====
const cookUi = {
  en: { cook: "👩‍🍳 Cooking mode", done: "Done", noteTitle: "💌 Add a sweet note", notePlaceholder: "Write a note. It will be added to the list you send…" },
  de: { cook: "👩‍🍳 Kochmodus", done: "Fertig", noteTitle: "💌 Süße Notiz hinzufügen", notePlaceholder: "Schreibe eine Notiz. Sie wird an die Liste angehängt, die du sendest…" },
  ru: { cook: "👩‍🍳 Режим готовки", done: "Готово", noteTitle: "💌 Добавить милую записку", notePlaceholder: "Напиши записку. Она добавится к списку, который ты отправишь…" },
  uk: { cook: "👩‍🍳 Режим готування", done: "Готово", noteTitle: "💌 Додати милу записку", notePlaceholder: "Напиши записку. Вона додасться до списку, який ти надішлеш…" }
};

function cu(key) {
  return cookUi[lang][key];
}

// ===== Записки (сохраняются в браузере) =====
let notes = loadJson("notes", {});

// ===== Экран не гаснет во время готовки =====
let wakeLock = null;

async function keepAwake() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch (e) {
    // не все браузеры это умеют, это не страшно
  }
}

function releaseAwake() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

// ===== Экран режима готовки =====
const cookView = document.createElement("div");
cookView.className = "cook-view";
document.body.appendChild(cookView);

let cookStep = 0;

function renderCook() {
  const r = recipes[currentId];
  const step = r.steps[cookStep];
  const total = r.steps.length;
  const isLast = cookStep === total - 1;

  let html = `<button class="cook-close" onclick="closeCook()">✕</button>`;
  html += `<div class="cook-progress">${cookStep + 1} / ${total}</div>`;
  html += `<div class="cook-bar"><div style="width:${((cookStep + 1) / total) * 100}%"></div></div>`;
  html += `<div class="cook-text">${step.text[lang]}</div>`;

  if (step.minutes) {
    html += `<button class="share-btn cook-timer" onclick="startTimer(${step.minutes})">⏱ ${step.minutes} ${t("min")}</button>`;
  }

  html += `<div class="cook-nav">`;
  html += `<button class="cook-nav-btn" onclick="cookMove(-1)" ${cookStep === 0 ? "disabled" : ""}>←</button>`;
  if (isLast) {
    html += `<button class="cook-nav-btn" onclick="closeCook()" title="${cu("done")}">🍓</button>`;
  } else {
    html += `<button class="cook-nav-btn" onclick="cookMove(1)">→</button>`;
  }
  html += `</div>`;

  cookView.innerHTML = html;
}

function openCook() {
  cookStep = 0;
  renderCook();
  cookView.classList.add("open");
  keepAwake();
}

function closeCook() {
  cookView.classList.remove("open");
  releaseAwake();
}

function cookMove(delta) {
  const total = recipes[currentId].steps.length;
  cookStep = Math.min(total - 1, Math.max(0, cookStep + delta));
  renderCook();
}

// если вкладку свернули и вернулись, снова просим не гасить экран
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible" && cookView.classList.contains("open")) {
    keepAwake();
  }
});

// ===== Кнопка и поле записки в окне рецепта =====
function addCookButton() {
  const title = modalContent.querySelector("h2");
  const btn = document.createElement("button");
  btn.className = "share-btn cook-start";
  btn.textContent = cu("cook");
  btn.addEventListener("click", openCook);
  title.insertAdjacentElement("afterend", btn);
}

function addNoteBox() {
  const box = document.createElement("div");
  box.className = "note-box";
  box.innerHTML = `<h3>${cu("noteTitle")}</h3>
    <textarea rows="3" placeholder="${cu("notePlaceholder")}"></textarea>`;

  const area = box.querySelector("textarea");
  area.value = notes[currentId] || "";
  area.addEventListener("input", function () {
    notes[currentId] = area.value;
    saveJson("notes", notes);
  });

  const shareBtn = modalContent.querySelector(".share-btn:not(.cook-start)");
  if (shareBtn) {
    shareBtn.parentNode.insertBefore(box, shareBtn);
  } else {
    modalContent.appendChild(box);
  }
}

// ===== Подключаемся к уже существующим функциям =====
const renderRecipeBeforeCook = renderRecipe;
renderRecipe = function () {
  renderRecipeBeforeCook();
  addCookButton();
  addNoteBox();
};

// записка добавляется в конец списка покупок
const buildShoppingListBase = buildShoppingList;
buildShoppingList = function () {
  let text = buildShoppingListBase();
  const note = (notes[currentId] || "").trim();
  if (note) {
    text += `\n\n💌 ${note}`;
  }
  return text;
};