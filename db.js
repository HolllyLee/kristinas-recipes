// ===== 1. ПОДКЛЮЧЕНИЕ К SUPABASE =====
// Замени эти две строки на СВОИ значения (Project Settings → API)
const SUPABASE_URL = "https://luywovhmolvvyufisibj.supabase.co";
const SUPABASE_KEY = "sb_publishable_A5b0Bs-i5V0Aur8-4VV5Dg_MpTe5pbA";

const dbReady =
  typeof window.supabase !== "undefined" && SUPABASE_URL.startsWith("https://");
const sb = dbReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
let isAdmin = false;

function val(id) {
  return document.getElementById(id).value;
}

// ===== 2. РЕЦЕПТЫ ИЗ БАЗЫ =====
async function loadDbRecipes() {
  const { data, error } = await sb
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  // убираем старые рецепты из базы и добавляем свежие
  for (const id in recipes) {
    if (recipes[id].fromDb) delete recipes[id];
  }
  data.forEach(function (row) {
    recipes[row.id] = Object.assign({}, row.data, {
      photo: row.photo_url,
      fromDb: true
    });
  });

  applyLanguage();
}

// ===== 3. ФОТО НА КАРТОЧКАХ И В ОКНЕ РЕЦЕПТА =====
const renderCardsBase = renderCards;
renderCards = function () {
  renderCardsBase();
  document.querySelectorAll(".card").forEach(function (card) {
    const r = recipes[card.dataset.id];
    if (r && r.photo) {
      const box = card.querySelector(".card-emoji");
      box.innerHTML = `<img src="${r.photo}" alt="">`;
      box.classList.add("has-photo");
    }
  });
};

const renderRecipeBeforeDb = renderRecipe;
renderRecipe = function () {
  renderRecipeBeforeDb();
  const r = recipes[currentId];

  if (r.photo) {
    const img = document.createElement("img");
    img.className = "recipe-photo";
    img.src = r.photo;
    img.alt = "";
    modalContent.insertBefore(img, modalContent.firstChild);
  }

  if (isAdmin && r.fromDb) {
    const del = document.createElement("button");
    del.className = "share-btn danger";
    del.textContent = "🗑 Удалить рецепт";
    del.addEventListener("click", deleteCurrent);
    modalContent.appendChild(del);
  }
};

async function deleteCurrent() {
  if (!confirm("Удалить этот рецепт насовсем?")) return;
  const { error } = await sb.from("recipes").delete().eq("id", currentId);
  if (error) {
    alert("Не получилось удалить: " + error.message);
    return;
  }
  modal.classList.remove("open");
  await loadDbRecipes();
}

// ===== 4. ОКНО АДМИНКИ И КНОПКА ➕ =====
const adminModal = document.createElement("div");
adminModal.className = "modal";
adminModal.innerHTML = `<div class="modal-box">
  <button class="close" id="admin-close">✕</button>
  <div id="admin-content"></div>
</div>`;
document.body.appendChild(adminModal);

const adminContent = document.getElementById("admin-content");

const fab = document.createElement("button");
fab.className = "add-fab";
fab.textContent = "➕";
fab.title = "Добавить рецепт";
document.body.appendChild(fab);

function closeAdmin() {
  adminModal.classList.remove("open");
}

function openAdmin() {
  if (!dbReady) {
    alert("Supabase не подключён. Проверь URL и ключ в начале файла db.js");
    return;
  }
  if (isAdmin) {
    renderAddForm();
  } else {
    renderLogin();
  }
  adminModal.classList.add("open");
}

function updateAdminUi() {
  fab.classList.toggle("show", isAdmin);
  if (currentId && modal.classList.contains("open")) {
    renderRecipe();
  }
}

fab.addEventListener("click", openAdmin);
document.getElementById("admin-close").addEventListener("click", closeAdmin);
adminModal.addEventListener("click", function (e) {
  if (e.target === adminModal) closeAdmin();
});

// ===== 5. ВХОД =====
function renderLogin(message) {
  adminContent.innerHTML = `
    <h2>🔐 Вход</h2>
    <label class="flabel">Почта</label>
    <input id="login-email" class="finput" type="email" autocomplete="username">
    <label class="flabel">Пароль</label>
    <input id="login-pass" class="finput" type="password" autocomplete="current-password">
    <button class="share-btn" id="login-btn">Войти</button>
    <p class="fstatus" id="login-status">${message || ""}</p>`;

  document.getElementById("login-btn").addEventListener("click", doLogin);
  document.getElementById("login-pass").addEventListener("keydown", function (e) {
    if (e.key === "Enter") doLogin();
  });
}

async function doLogin() {
  const status = document.getElementById("login-status");
  status.textContent = "Входим…";
  const { error } = await sb.auth.signInWithPassword({
    email: val("login-email").trim(),
    password: val("login-pass")
  });
  if (error) {
    status.textContent = "Не получилось войти: " + error.message;
    return;
  }
  isAdmin = true;
  updateAdminUi();
  renderAddForm();
}

// ===== 6. ПОМОЩНИКИ: РАЗБОР ТЕКСТА =====
const unitAliases = {
  g: "g", gr: "g", "г": "g", "гр": "g",
  ml: "ml", "мл": "ml",
  tbsp: "tbsp", el: "tbsp", "стл": "tbsp",
  tsp: "tsp", tl: "tsp", "чл": "tsp"
};

function cleanToken(s) {
  return (s || "").toLowerCase().replace(/[.\s]/g, "");
}

// "200 г Мука" → { amount: 200, unit: "g", name: "Мука" }
function parseIngredient(line) {
  const m = line.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!m) {
    return { amount: 1, unit: "", name: line };
  }

  const amount = parseFloat(m[1].replace(",", "."));
  const tokens = m[2].split(/\s+/).filter(Boolean);
  let unit = "";
  let start = 0;

  if (tokens.length > 1 && unitAliases[cleanToken(tokens[0] + tokens[1])]) {
    unit = unitAliases[cleanToken(tokens[0] + tokens[1])];
    start = 2;
  } else if (tokens.length > 0 && unitAliases[cleanToken(tokens[0])]) {
    unit = unitAliases[cleanToken(tokens[0])];
    start = 1;
  }

  const name = tokens.slice(start).join(" ") || line;
  return { amount: amount, unit: unit, name: name };
}

// "Жарь 2 минуты [2]" → шаг с таймером на 2 минуты
function parseStep(line) {
  const same = function (text) {
    return { en: text, de: text, ru: text, uk: text };
  };
  const m = line.match(/\[\s*(\d+(?:[.,]\d+)?)[^\]]*\]/);
  if (m) {
    const step = { text: same(line.replace(m[0], "").trim()) };
    step.minutes = parseFloat(m[1].replace(",", "."));
    return step;
  }
  return { text: same(line) };
}

// уменьшаем фото до 1200 px, чтобы грузилось быстро
function resizeImage(file, maxSize) {
  return new Promise(function (resolve, reject) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = function () {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error("Не получилось обработать фото"));
      }, "image/jpeg", 0.85);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      reject(new Error("Не получилось открыть фото"));
    };
    img.src = url;
  });
}

async function uploadPhoto(file) {
  const blob = await resizeImage(file, 1200);
  const path = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
  const { error } = await sb.storage
    .from("recipe-photos")
    .upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return sb.storage.from("recipe-photos").getPublicUrl(path).data.publicUrl;
}

// ===== 7. ФОРМА "ДОБАВИТЬ РЕЦЕПТ" =====
function renderAddForm(message) {
  adminContent.innerHTML = `
    <h2>➕ Новый рецепт</h2>

    <label class="flabel">Название</label>
    <input id="f-title" class="finput" type="text">

    <div class="form-row">
      <div><label class="flabel">Эмодзи</label>
        <input id="f-emoji" class="finput" type="text" value="🍽️"></div>
      <div><label class="flabel">Минут</label>
        <input id="f-time" class="finput" type="number" min="1" value="30"></div>
      <div><label class="flabel">Порций</label>
        <input id="f-servings" class="finput" type="number" min="1" value="2"></div>
    </div>

    <label class="flabel">На каком языке ты пишешь рецепт?</label>
    <select id="f-lang" class="finput">
      <option value="ru">Русский</option>
      <option value="uk">Українська</option>
      <option value="de">Deutsch</option>
      <option value="en">English</option>
    </select>

    <label class="flabel">Теги</label>
    <div class="tag-row">
      <label><input type="checkbox" value="protein"> Много белка</label>
      <label><input type="checkbox" value="dairyfree"> Без молока</label>
      <label><input type="checkbox" value="dessert"> Десерт</label>
    </div>

    <label class="flabel">Ингредиенты (каждый с новой строки, сначала число)</label>
    <textarea id="f-ings" class="finput" rows="6" placeholder="200 г Мука&#10;2 Яйца&#10;1 ст. л. Сахар"></textarea>

    <label class="flabel">Шаги (каждый с новой строки; таймер: [10] в конце)</label>
    <textarea id="f-steps" class="finput" rows="6" placeholder="Смешай муку и сахар.&#10;Жарь по 2 минуты с каждой стороны [2]"></textarea>

    <label class="flabel">Фото</label>
    <input id="f-photo" type="file" accept="image/*">

    <button class="share-btn" id="f-save">Сохранить рецепт</button>
    <p class="fstatus" id="f-status">${message || ""}</p>
    <button class="link-btn" id="f-logout">Выйти</button>`;

  document.getElementById("f-save").addEventListener("click", saveRecipe);
  document.getElementById("f-logout").addEventListener("click", async function () {
    await sb.auth.signOut();
    isAdmin = false;
    updateAdminUi();
    closeAdmin();
  });
}

async function saveRecipe() {
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
    let photoUrl = null;
    const file = document.getElementById("f-photo").files[0];
    if (file) {
      status.textContent = "Загружаю фото…";
      photoUrl = await uploadPhoto(file);
    }

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
}

// ===== 8. СТАРТ =====
function checkHash() {
  if (location.hash === "#admin") openAdmin();
}

async function startDb() {
  const { data } = await sb.auth.getSession();
  isAdmin = !!data.session;
  updateAdminUi();

  sb.auth.onAuthStateChange(function (event, session) {
    isAdmin = !!session;
    updateAdminUi();
  });

  await loadDbRecipes();
  checkHash();
}

window.addEventListener("hashchange", checkHash);

if (dbReady) {
  startDb();
}