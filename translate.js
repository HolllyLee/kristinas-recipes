// ===== Перевод мировых рецептов на язык сайта =====
// Необязательно: если впишешь почту, лимит MyMemory вырастет с 5 000 до 50 000 знаков в день.
// Но код лежит на GitHub открыто, поэтому почта будет видна всем. Лучше оставить пустым.
const MYMEMORY_EMAIL = "";

const trTargets = ["de", "ru", "uk"];
let trCache = loadJson("trCache", {});

const trUi = {
  en: { btn: "", busy: "Translating…", fail: "Could not translate: " },
  de: { btn: "🌐 Auf Deutsch übersetzen", busy: "Übersetze…", fail: "Übersetzung nicht möglich: " },
  ru: { btn: "🌐 Перевести на русский", busy: "Перевожу…", fail: "Не получилось перевести: " },
  uk: { btn: "🌐 Перекласти українською", busy: "Перекладаю…", fail: "Не вдалося перекласти: " }
};

function tt(key) {
  return trUi[lang][key];
}

// ===== Способ 1: переводчик, встроенный в Chrome =====
async function chromeTranslator(target) {
  if (!("Translator" in self)) return null;
  try {
    const opts = { sourceLanguage: "en", targetLanguage: target };
    const state = await Translator.availability(opts);
    if (state === "unavailable") return null;
    return await Translator.create(opts);
  } catch (e) {
    return null;
  }
}

// ===== Способ 2: бесплатный сервис MyMemory =====
function decodeHtml(s) {
  const t = document.createElement("textarea");
  t.innerHTML = s;
  return t.value;
}

async function myMemory(text, target) {
  let url = "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text.slice(0, 480)) + "&langpair=en|" + target;
  if (MYMEMORY_EMAIL) url += "&de=" + encodeURIComponent(MYMEMORY_EMAIL);

  const res = await fetch(url);
  const data = await res.json();
  const out = data.responseData && data.responseData.translatedText;

  if (Number(data.responseStatus) !== 200 || !out || out.indexOf("MYMEMORY WARNING") === 0) {
    throw new Error("дневной лимит бесплатного перевода исчерпан, попробуй завтра или в Chrome на компьютере");
  }
  return decodeHtml(out);
}

// длинный текст режем на куски, потому что сервис принимает до ~500 знаков за раз
async function myMemoryLong(text, target) {
  if (text.length <= 450) return myMemory(text, target);

  const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  let out = "";
  let chunk = "";
  for (const p of parts) {
    if ((chunk + p).length > 450 && chunk) {
      out += (await myMemory(chunk, target)) + " ";
      chunk = "";
    }
    chunk += p;
  }
  if (chunk) out += await myMemory(chunk, target);
  return out.trim();
}

// ===== Применяем перевод к рецепту =====
// порядок: название, ингредиенты, шаги
function applyTranslation(id, target, out) {
  const r = recipes[id];
  r.title[target] = out[0];
  r.ingredients.forEach(function (ing, k) {
    ing.name[target] = out[1 + k];
  });
  r.steps.forEach(function (s, j) {
    s.text[target] = out[1 + r.ingredients.length + j];
  });
}

// если рецепт уже переводили раньше, подставляем перевод из памяти браузера
function applyCachedTranslation(id) {
  const r = recipes[id];
  if (!r || !r.web) return;
  trTargets.forEach(function (target) {
    const out = trCache[id + "|" + target];
    if (out && out.length === 1 + r.ingredients.length + r.steps.length) {
      applyTranslation(id, target, out);
    }
  });
}

async function translateRecipe(id, target, onProgress) {
  const r = recipes[id];
  const items = [r.title.en]
    .concat(r.ingredients.map(function (i) { return i.name.en; }))
    .concat(r.steps.map(function (s) { return s.text.en; }));

  const tr = await chromeTranslator(target);
  const out = [];

  try {
    for (let i = 0; i < items.length; i++) {
      out.push(tr ? await tr.translate(items[i]) : await myMemoryLong(items[i], target));
      if (onProgress) onProgress(i + 1, items.length);
    }
  } finally {
    if (tr && tr.destroy) tr.destroy();
  }

  trCache[id + "|" + target] = out;
  saveJson("trCache", trCache);
  applyTranslation(id, target, out);
}

// ===== Кнопка в окне рецепта =====
async function runTranslate(btn, status) {
  btn.disabled = true;
  status.textContent = tt("busy");
  try {
    await translateRecipe(currentId, lang, function (done, total) {
      status.textContent = tt("busy") + " " + done + "/" + total;
    });
    renderRecipe();
  } catch (e) {
    status.textContent = tt("fail") + (e.message || e);
    btn.disabled = false;
  }
}

function addTranslateUi() {
  const r = recipes[currentId];
  if (!r || !r.web || lang === "en") return;
  if (trCache[currentId + "|" + lang]) return; // уже переведён

  const row = document.createElement("div");
  row.className = "tr-row";
  row.innerHTML = `<button class="share-btn">${tt("btn")}</button><span class="tr-status"></span>`;

  const btn = row.querySelector("button");
  const status = row.querySelector(".tr-status");
  btn.addEventListener("click", function () {
    runTranslate(btn, status);
  });

  modalContent.querySelector("h2").insertAdjacentElement("afterend", row);
}

// подключаемся к уже существующему окну рецепта
const renderRecipeBeforeTranslate = renderRecipe;
renderRecipe = function () {
  applyCachedTranslation(currentId);
  renderRecipeBeforeTranslate();
  addTranslateUi();
};