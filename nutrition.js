(function () {
  // ===== Тексты на 4 языках =====
  const nUi = {
    en: {
      title: "Per serving", kcal: "kcal", protein: "Protein", fat: "Fat", carbs: "Carbs",
      total: "All {n} servings", missing: "Not counted: ",
      lookup: "🔍 Look up in Open Food Facts", looking: "Looking up",
      fail: "Could not look up: ",
      note: "Approximate values for raw ingredients, for orientation only, not medical advice.",
      source: "Averages from a food table and Open Food Facts (ODbL)."
    },
    de: {
      title: "Pro Portion", kcal: "kcal", protein: "Eiweiß", fat: "Fett", carbs: "Kohlenhydrate",
      total: "Alle {n} Portionen", missing: "Nicht berechnet: ",
      lookup: "🔍 In Open Food Facts suchen", looking: "Suche",
      fail: "Suche nicht möglich: ",
      note: "Ungefähre Werte für rohe Zutaten, nur zur Orientierung, keine medizinische Beratung.",
      source: "Durchschnittswerte aus einer Nährwerttabelle und Open Food Facts (ODbL)."
    },
    ru: {
      title: "На порцию", kcal: "ккал", protein: "Белки", fat: "Жиры", carbs: "Углеводы",
      total: "На все {n} порц.", missing: "Не посчитано: ",
      lookup: "🔍 Найти в Open Food Facts", looking: "Ищу",
      fail: "Не получилось найти: ",
      note: "Приблизительные значения для сырых продуктов, только для ориентира, не медицинская рекомендация.",
      source: "Средние значения из таблицы продуктов и Open Food Facts (ODbL)."
    },
    uk: {
      title: "На порцію", kcal: "ккал", protein: "Білки", fat: "Жири", carbs: "Вуглеводи",
      total: "На всі {n} порц.", missing: "Не пораховано: ",
      lookup: "🔍 Знайти в Open Food Facts", looking: "Шукаю",
      fail: "Не вдалося знайти: ",
      note: "Приблизні значення для сирих продуктів, лише для орієнтиру, не медична рекомендація.",
      source: "Середні значення з таблиці продуктів і Open Food Facts (ODbL)."
    }
  };

  function nt(key) {
    return nUi[lang][key];
  }

  // ===== Таблица продуктов: значения на 100 г =====
  // n("слова|через|палку", ккал, белки, жиры, углеводы, г в 1 мл, г в 1 штуке)
  // слово с "=" в начале значит "название должно совпасть точно"
  function n(keys, kcal, p, f, c, d, piece) {
    return { k: keys.split("|"), kcal: kcal, p: p, f: f, c: c, d: d || 1, piece: piece || 0 };
  }

  const TABLE = [
    // молочное (сначала самое конкретное, потом общее)
    n("buttermilk|buttermilch|пахт", 40, 3.3, 0.9, 4.8, 1.03),
    n("coconut milk|kokosmilch|кокосовое молоко|кокосове молоко", 197, 2, 21, 2.8),
    n("chocolate|schokolade|шоколад", 540, 6, 31, 58),
    n("milk|milch|молок", 64, 3.3, 3.6, 4.8, 1.03),
    n("cream cheese|frischkäse|frischkase|сливочный сыр|вершковий сир", 250, 6, 24, 4),
    n("sour cream|saure sahne|сметан", 200, 2.5, 20, 3.5),
    n("cream|sahne|сливки|вершки", 300, 2.2, 30, 3),
    n("peanut butter|erdnussbutter|арахисовая паста", 588, 25, 50, 20),
    n("butter|сливочное масло|вершкове масло", 717, 0.9, 81, 0.1, 0.93),
    n("parmesan|parmigiano|пармезан", 400, 36, 28, 3.5),
    n("mozzarella|моцарел", 260, 20, 20, 2),
    n("feta|фета", 264, 14, 21, 4),
    n("cheese|käse|kase|сыр|сир", 350, 24, 28, 2),
    n("yogurt|yoghurt|joghurt|йогурт", 60, 3.5, 3, 4.5, 1.03),
    n("eggplant|aubergine|баклажан", 25, 1, 0.2, 6, 1, 300),
    n("egg|eier|яйц|яйця", 143, 12.6, 9.5, 0.7, 1, 50),

    // мясо и рыба
    n("chicken breast|hähnchenbrust|hahnchenbrust|куриная грудка|куряча грудка|грудк", 120, 22.5, 2.6, 0),
    n("chicken|hähnchen|hahnchen|huhn|куриц|курин|курк|куряч", 165, 20, 9, 0),
    n("minced|mince|hackfleisch|фарш", 255, 17, 20.5, 0),
    n("beef|rindfleisch|говяд|яловичин", 190, 20, 12, 0),
    n("pork|schwein|свинин", 242, 17, 19, 0),
    n("lamb|lamm|баран|ягнят", 250, 17, 20, 0),
    n("bacon|speck|бекон", 417, 13, 40, 1),
    n("salmon|lachs|лосос", 208, 20, 13, 0),
    n("prawn|shrimp|garnele|креветк", 100, 20, 1.5, 0.5),
    n("tuna|thunfisch|тунец|тунц", 130, 29, 1, 0),
    n("fish|fisch|рыб|риб|cod|haddock", 100, 20, 2, 0),

    // овощи и фрукты
    n("bell pepper|red pepper|green pepper|yellow pepper|болгарск|сладкий перец|солодкий перець|paprikaschote", 31, 1, 0.3, 6, 1, 150),
    n("paprika powder|paprikapulver|мелена паприка|паприка молота|молотая паприка", 282, 14, 13, 54, 0.5),
    n("potato|kartoffel|картофел|картопл|картошк", 77, 2, 0.1, 17, 1, 150),
    n("onion|zwiebel|лук|цибул", 40, 1.1, 0.1, 9.3, 1, 110),
    n("garlic|knoblauch|чеснок|часник", 149, 6.4, 0.5, 33, 1, 4),
    n("tomato|tomate|помидор|томат|помідор", 18, 0.9, 0.2, 3.9, 1, 120),
    n("cucumber|gurke|огур|огір", 15, 0.7, 0.1, 3.6, 1, 200),
    n("carrot|karotte|möhre|морков|морква", 41, 0.9, 0.2, 9.6, 1, 80),
    n("mushroom|champignon|гриб", 22, 3.1, 0.3, 3.3),
    n("spinach|spinat|шпинат", 23, 2.9, 0.4, 3.6),
    n("avocado|авокадо", 160, 2, 15, 9, 1, 150),
    n("lemon|zitrone|лимон", 29, 1.1, 0.3, 9.3, 1, 80),
    n("lime|лайм", 30, 0.7, 0.2, 10.5, 1, 60),
    n("strawberr|erdbeer|клубник|полуниц", 32, 0.7, 0.3, 7.7),
    n("raspberr|himbeer|малин", 52, 1.2, 0.7, 12),
    n("blueberr|heidelbeer|черник|лохин|чорниц", 57, 0.7, 0.3, 14),
    n("cherry|cherries|kirsche|вишн|черешн", 63, 1, 0.2, 16),
    n("banana|банан", 89, 1.1, 0.3, 23, 1, 120),
    n("apple|apfel|яблок|яблук", 52, 0.3, 0.2, 14, 1, 180),

    // бакалея
    n("flour|mehl|мук|борошн", 364, 10, 1, 76, 0.53),
    n("powdered sugar|icing sugar|puderzucker|сахарная пудра|цукрова пудра|sugar|zucker|сахар|цукор", 387, 0, 0, 100, 0.85),
    n("honey|honig|мёд|мед", 304, 0.3, 0, 82, 1.4),
    n("vinegar|essig|уксус|оцет", 18, 0, 0, 0.6, 1.01),
    n("rice|reis|рис", 360, 7, 0.6, 79, 0.85),
    n("pasta|spaghetti|penne|noodle|nudeln|макарон|паста|спагет", 350, 12, 1.5, 71, 0.45),
    n("bread|brot|хлеб|хліб", 265, 9, 3.2, 49),
    n("olive oil|olivenöl|olivenol|оливков|оливк", 884, 0, 100, 0, 0.92),
    n("oil|öl|олія|растительное масло|подсолнечн|соняшник", 884, 0, 100, 0, 0.92),
    n("yeast|hefe|дрожж|дріжд", 325, 40, 7, 41),
    n("cocoa|kakao|какао", 228, 20, 14, 58, 0.5),
    n("sesame|sesam|кунжут", 573, 18, 50, 23, 0.6),
    n("walnut|walnuss|грецк|волошськ", 654, 15, 65, 14),
    n("almond|mandel|миндал|мигдал", 579, 21, 50, 22),
    n("nori|норі|нори", 35, 5.8, 0.3, 5.1, 1, 2.5),
    n("soy sauce|sojasoße|sojasosse|соевый соус|соєвий соус", 53, 8, 0.6, 4.9, 1.15),
    n("wasabi|васаби|васабі", 109, 4.8, 0.6, 23.5),

    // травы и специи
    n("cilantro|koriander|coriander|кинза|кінза", 23, 2.1, 0.5, 3.7),
    n("dill|укроп|кріп", 43, 3.5, 1.1, 7),
    n("parsley|petersilie|петрушк", 36, 3, 0.8, 6.3),
    n("basil|basilikum|базилик|базилік", 23, 3.2, 0.6, 2.7),
    n("bay leaf|bay leaves|lorbeer|лавров", 313, 7.6, 8.4, 75, 1, 0.5),
    n("pepper|pfeffer|перец|перець", 251, 10, 3.3, 64, 0.5),
    n("broth|stock|brühe|bruhe|бульон|бульйон", 5, 0.5, 0.2, 0.5),

    // то, что считаем нулём калорий
    n("=water|=wasser|=вода|=salt|=salz|=соль|=сіль|=sea salt|=baking soda|=baking powder|=backpulver|=natron|=разрыхлитель|=ice", 0, 0, 0, 0)
  ];

  // ===== Память найденного в Open Food Facts =====
  const offCache = loadJson("offCache", {});

  function norm(s) {
    return String(s || "").toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
  }

  function offKey(ing) {
    return norm(ing.name.en);
  }

  // ищем продукт: сначала в таблице, потом в памяти от Open Food Facts
  function findEntry(ing) {
    const names = Object.values(ing.name).map(norm);

    for (const e of TABLE) {
      for (const k of e.k) {
        if (k.charAt(0) === "=") {
          if (names.indexOf(k.slice(1)) !== -1) return e;
        } else if (names.some(function (nm) { return nm.indexOf(k) !== -1; })) {
          return e;
        }
      }
    }

    const cached = offCache[offKey(ing)];
    if (cached && !cached.none) return cached;
    return null;
  }

  // сколько граммов в этом ингредиенте
  function grams(ing, e) {
    const a = ing.amount;
    if (ing.unit === "g") return a;
    if (ing.unit === "ml") return a * e.d;
    if (ing.unit === "tbsp") return a * 15 * e.d;
    if (ing.unit === "tsp") return a * 5 * e.d;
    if (e.piece) return a * e.piece; // штуки: яйцо, луковица, зубчик
    return null;
  }

  function calc(r) {
    const sum = { kcal: 0, p: 0, f: 0, c: 0 };
    const unknown = [];
    const noWeight = [];
    let usedOff = false;

    r.ingredients.forEach(function (ing) {
      const e = findEntry(ing);
      if (!e) {
        unknown.push(ing);
        return;
      }
      const g = grams(ing, e);
      if (g === null) {
        noWeight.push(ing);
        return;
      }
      sum.kcal += (e.kcal * g) / 100;
      sum.p += (e.p * g) / 100;
      sum.f += (e.f * g) / 100;
      sum.c += (e.c * g) / 100;
      if (e.off) usedOff = true;
    });

    return { sum: sum, unknown: unknown, noWeight: noWeight, usedOff: usedOff };
  }

  // ===== Open Food Facts =====
  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function offLookup(name) {
    const url = "https://world.openfoodfacts.org/cgi/search.pl?search_terms=" +
      encodeURIComponent(name) +
      "&search_simple=1&action=process&json=1&page_size=8&fields=product_name,nutriments";

    const res = await fetch(url, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(20000) : undefined
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    // берём до 5 подходящих товаров и усредняем, чтобы один странный не испортил результат
    const found = [];
    (data.products || []).forEach(function (p) {
      const nu = p.nutriments || {};
      const kcal = nu["energy-kcal_100g"];
      if (typeof kcal === "number" && kcal >= 0 && kcal < 950 && found.length < 5) {
        found.push({
          kcal: kcal,
          p: Number(nu.proteins_100g) || 0,
          f: Number(nu.fat_100g) || 0,
          c: Number(nu.carbohydrates_100g) || 0
        });
      }
    });
    if (found.length === 0) return null;

    const avg = function (key) {
      return found.reduce(function (s, x) { return s + x[key]; }, 0) / found.length;
    };
    return { kcal: avg("kcal"), p: avg("p"), f: avg("f"), c: avg("c"), d: 1, piece: 0, off: true };
  }

  async function runLookup(btn, status) {
    btn.disabled = true;
    const unknown = calc(recipes[currentId]).unknown;
    const names = Array.from(new Set(unknown.map(offKey)));

    try {
      for (let i = 0; i < names.length; i++) {
        status.textContent = nt("looking") + " " + (i + 1) + "/" + names.length + ": " + names[i] + "…";
        const v = await offLookup(names[i]);
        offCache[names[i]] = v || { none: true };
        saveJson("offCache", offCache);
        if (i < names.length - 1) await sleep(6500); // база разрешает ~10 поисков в минуту
      }
      renderRecipe();
    } catch (e) {
      status.textContent = nt("fail") + (e.message || e);
      btn.disabled = false;
    }
  }

  // ===== Блок под списком ингредиентов =====
  function addNutritionBox() {
    const r = recipes[currentId];
    const list = modalContent.querySelector(".ing-list");
    if (!r || !list) return;

    const res = calc(r);
    const servings = r.servings || 1;
    const per = {
      kcal: res.sum.kcal / servings,
      p: res.sum.p / servings,
      f: res.sum.f / servings,
      c: res.sum.c / servings
    };

    // доли калорий: белки и углеводы по 4 ккал на грамм, жиры по 9
    const eP = per.p * 4;
    const eC = per.c * 4;
    const eF = per.f * 9;
    const eAll = eP + eC + eF || 1;

    const box = document.createElement("div");
    box.className = "nutri";

    let html = `<div class="nutri-title">🔥 ${nt("title")} ≈</div>
      <div class="nutri-chips">
        <span class="nchip kcal"><b>${Math.round(per.kcal)}</b> ${nt("kcal")}</span>
        <span class="nchip"><span class="dot" style="background:#ff4fa3"></span><b>${Math.round(per.p)}</b> g ${nt("protein")}</span>
        <span class="nchip"><span class="dot" style="background:#c9a0ff"></span><b>${Math.round(per.f)}</b> g ${nt("fat")}</span>
        <span class="nchip"><span class="dot" style="background:#8fd3ff"></span><b>${Math.round(per.c)}</b> g ${nt("carbs")}</span>
      </div>
      <div class="nbar">
        <span style="width:${(eP / eAll) * 100}%;background:#ff4fa3"></span>
        <span style="width:${(eF / eAll) * 100}%;background:#c9a0ff"></span>
        <span style="width:${(eC / eAll) * 100}%;background:#8fd3ff"></span>
      </div>
      <small class="nutri-total">${nt("total").replace("{n}", currentServings)}: ${Math.round(per.kcal * currentServings)} ${nt("kcal")}</small>`;

    const missing = res.unknown.concat(res.noWeight);
    if (missing.length > 0) {
      html += `<small class="nutri-warn">${nt("missing")}${missing.map(function (i) { return i.name[lang]; }).join(", ")}</small>`;
    }
    if (res.unknown.length > 0) {
      html += `<button class="link-btn" id="nutri-lookup">${nt("lookup")}</button> <small id="nutri-status"></small>`;
    }
    html += `<small class="nutri-note">${nt("note")}${res.usedOff ? " " + nt("source") : ""}</small>`;

    box.innerHTML = html;
    list.insertAdjacentElement("afterend", box);

    const btn = box.querySelector("#nutri-lookup");
    if (btn) {
      btn.addEventListener("click", function () {
        runLookup(btn, box.querySelector("#nutri-status"));
      });
    }
  }

  // подключаемся к окну рецепта
  const renderRecipeBeforeNutrition = renderRecipe;
  renderRecipe = function () {
    renderRecipeBeforeNutrition();
    addNutritionBox();
  };
})();