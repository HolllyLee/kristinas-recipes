// ===== Тексты холодильника на 4 языках =====
const fridgeUi = {
  en: {
    title: "My fridge", hint: "Tap the fridge and add what you have 👆",
    placeholder: "eggs, milk, cheese…", add: "Add",
    empty: "The fridge is empty. Add some products!",
    cook: "What can I cook?", missing: "Missing",
    ready: "You have everything!", none: "No matching recipes yet"
  },
  de: {
    title: "Mein Kühlschrank", hint: "Tippe auf den Kühlschrank und füge hinzu, was du hast 👆",
    placeholder: "Eier, Milch, Käse…", add: "Hinzufügen",
    empty: "Der Kühlschrank ist leer. Füge Produkte hinzu!",
    cook: "Was kann ich kochen?", missing: "Es fehlt",
    ready: "Alles da!", none: "Noch keine passenden Rezepte"
  },
  ru: {
    title: "Мой холодильник", hint: "Нажми на холодильник и добавь, что у тебя есть 👆",
    placeholder: "яйца, молоко, сыр…", add: "Добавить",
    empty: "Холодильник пуст. Добавь продукты!",
    cook: "Что можно приготовить?", missing: "Не хватает",
    ready: "Всё есть!", none: "Пока нет подходящих рецептов"
  },
  uk: {
    title: "Мій холодильник", hint: "Натисни на холодильник і додай, що в тебе є 👆",
    placeholder: "яйця, молоко, сир…", add: "Додати",
    empty: "Холодильник порожній. Додай продукти!",
    cook: "Що можна приготувати?", missing: "Не вистачає",
    ready: "Все є!", none: "Поки немає відповідних рецептів"
  }
};

function ft(key) {
  return fridgeUi[lang][key];
}

// ===== Продукты в холодильнике (запоминаются в браузере) =====
let fridgeItems = [];
try {
  fridgeItems = JSON.parse(localStorage.getItem("fridge") || "[]");
} catch (e) {
  fridgeItems = [];
}

function saveFridge() {
  localStorage.setItem("fridge", JSON.stringify(fridgeItems));
}

// Защита: превращает спецсимволы в безопасный текст
function esc(s) {
  return s.replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

const fridgeModal = document.getElementById("fridge-modal");
const fridgeContent = document.getElementById("fridge-content");

// ===== Холодильник на странице =====
function renderFridge() {
  document.getElementById("fridge-title").textContent = "🧊 " + ft("title");
  document.getElementById("fridge-hint").textContent = ft("hint");

  document.getElementById("magnets").innerHTML = fridgeItems
    .map(function (item, i) {
      const angle = ((i * 7) % 11) - 5;
      return `<span class="magnet" style="transform: rotate(${angle}deg)">${esc(item)}</span>`;
    })
    .join("");

  if (fridgeModal.classList.contains("open")) {
    renderFridgeModal();
  }
}

// ===== Какие рецепты подходят =====
function matchRecipes() {
  const have = fridgeItems
    .map(function (x) { return x.toLowerCase(); })
    .filter(function (x) { return x.length >= 2; });
  const results = [];

  for (const id in recipes) {
    const r = recipes[id];
    let found = 0;
    const missing = [];

    for (const ing of r.ingredients) {
      // сравниваем со всеми языками сразу
      const names = Object.values(ing.name).map(function (n) { return n.toLowerCase(); });
      const ok = have.some(function (h) {
        return names.some(function (n) { return n.includes(h) || h.includes(n); });
      });
      if (ok) {
        found++;
      } else {
        missing.push(ing.name[lang]);
      }
    }

    if (found > 0) {
      results.push({ id: id, recipe: r, found: found, total: r.ingredients.length, missing: missing });
    }
  }

  results.sort(function (a, b) {
    return b.found / b.total - a.found / a.total;
  });
  return results;
}

// ===== Окно холодильника =====
function renderFridgeModal() {
  let html = `<h2>🧊 ${ft("title")}</h2>`;
  html += `<div class="fridge-row">
    <input id="fridge-input" type="text" placeholder="${ft("placeholder")}">
    <button class="share-btn" id="fridge-add">${ft("add")}</button>
  </div>`;

  if (fridgeItems.length === 0) {
    html += `<p>${ft("empty")}</p>`;
  } else {
    fridgeItems.forEach(function (item, i) {
      html += `<span class="chip">${esc(item)} <button onclick="removeFromFridge(${i})">✕</button></span>`;
    });

    html += `<h3>${ft("cook")}</h3>`;
    const results = matchRecipes();
    if (results.length === 0) {
      html += `<p>${ft("none")}</p>`;
    }
    for (const m of results) {
      const info = m.missing.length === 0
        ? "✅ " + ft("ready")
        : ft("missing") + ": " + m.missing.join(", ");
      html += `<div class="cook-item" onclick="openRecipeFromFridge('${m.id}')">
        ${m.recipe.emoji} <b>${m.recipe.title[lang]}</b> (${m.found}/${m.total})
        <small>${info}</small>
      </div>`;
    }
  }

  fridgeContent.innerHTML = html;

  const input = document.getElementById("fridge-input");
  document.getElementById("fridge-add").addEventListener("click", addFromInput);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addFromInput();
  });
}

function addFromInput() {
  const input = document.getElementById("fridge-input");
  const parts = input.value.split(/[,;\n]+/)
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  for (const p of parts) {
    const exists = fridgeItems.some(function (x) { return x.toLowerCase() === p.toLowerCase(); });
    if (!exists) fridgeItems.push(p);
  }
  saveFridge();
  renderFridge();
  document.getElementById("fridge-input").focus();
}

function removeFromFridge(i) {
  fridgeItems.splice(i, 1);
  saveFridge();
  renderFridge();
}

function openRecipeFromFridge(id) {
  fridgeModal.classList.remove("open");
  openRecipe(id);
}

// ===== Открыть и закрыть =====
document.getElementById("fridge").addEventListener("click", function () {
  fridgeModal.classList.add("open");
  renderFridgeModal();
});

document.getElementById("fridge-close").addEventListener("click", function () {
  fridgeModal.classList.remove("open");
});

fridgeModal.addEventListener("click", function (e) {
  if (e.target === fridgeModal) {
    fridgeModal.classList.remove("open");
  }
});

// ===== Старт =====
renderFridge();