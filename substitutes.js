// ===== Тексты для панели замен =====
const subUi = {
  en: { swap: "What can I use instead?", best: "Best for", baking: "Baking", dough: "Dough", sauce: "Sauce", topping: "Sprinkling" },
  de: { swap: "Was kann ich stattdessen nehmen?", best: "Am besten für", baking: "Backen", dough: "Teig", sauce: "Soße", topping: "Zum Bestreuen" },
  ru: { swap: "Чем можно заменить?", best: "Лучше для", baking: "Выпечка", dough: "Тесто", sauce: "Соус", topping: "Посыпка" },
  uk: { swap: "Чим можна замінити?", best: "Краще для", baking: "Випічка", dough: "Тісто", sauce: "Соус", topping: "Посипка" }
};

function st(key) {
  return subUi[lang][key];
}

// ===== Таблица замен (ключ = английское название ингредиента маленькими буквами) =====
const subs = {
  milk: [
    {
      uses: ["baking", "dough"],
      name: { en: "Oat drink", de: "Haferdrink", ru: "Овсяное молоко", uk: "Вівсяне молоко" },
      note: {
        en: "Use 1:1. Slightly sweet and creamy, so pancakes and dough come out soft. In sauces it makes them a little thinner.",
        de: "1:1 verwenden. Leicht süß und cremig, Pfannkuchen und Teig werden schön weich. In Soßen wird es etwas dünner.",
        ru: "Заменяйте 1 к 1. Чуть сладковатое и сливочное, поэтому панкейки и тесто получаются мягкими. В соусах делает их немного жиже.",
        uk: "Замінюйте 1 до 1. Трохи солодкувате та вершкове, тому панкейки й тісто виходять м'якими. У соусах робить їх трохи рідшими."
      }
    },
    {
      uses: ["sauce", "baking"],
      name: { en: "Unsweetened soy drink", de: "Ungesüßter Sojadrink", ru: "Соевое молоко без сахара", uk: "Соєве молоко без цукру" },
      note: {
        en: "Use 1:1. Neutral taste and more protein, so it suits savory sauces. Add acidic ingredients slowly, because soy can curdle.",
        de: "1:1 verwenden. Neutraler Geschmack und mehr Eiweiß, passt gut zu herzhaften Soßen. Säure langsam zugeben, denn Soja kann ausflocken.",
        ru: "Заменяйте 1 к 1. Нейтральный вкус и больше белка, хорошо подходит для несладких соусов. Кислые продукты добавляйте постепенно: соя может свернуться.",
        uk: "Замінюйте 1 до 1. Нейтральний смак і більше білка, добре підходить для несолодких соусів. Кислі продукти додавайте поступово: соя може звернутися."
      }
    }
  ],

  eggs: [
    {
      uses: ["baking"],
      name: { en: "Mashed banana", de: "Zerdrückte Banane", ru: "Банановое пюре", uk: "Бананове пюре" },
      note: {
        en: "Half a banana (about 50 g) per egg. Adds a banana taste, sweetness and a denser, moister crumb. It will not whip, so it does not work for a whipped sponge.",
        de: "Eine halbe Banane (ca. 50 g) pro Ei. Gibt Bananengeschmack, Süße und einen dichteren, saftigeren Teig. Lässt sich nicht aufschlagen, daher nicht für Biskuit geeignet.",
        ru: "Половина банана (около 50 г) на одно яйцо. Добавит вкус банана, сладость и сделает мякиш плотнее и влажнее. Не взбивается, поэтому для бисквита не подходит.",
        uk: "Половина банана (близько 50 г) на одне яйце. Додасть смак банана, солодкість і зробить м'якуш щільнішим і вологішим. Не збивається, тому для бісквіту не підходить."
      }
    },
    {
      uses: ["dough", "baking"],
      name: { en: "Flax egg", de: "Leinsamen-Ei", ru: "Льняное «яйцо»", uk: "Лляне «яйце»" },
      note: {
        en: "Per egg, stir 1 tbsp ground flaxseed with 3 tbsp water and let it rest for 5 minutes. Binds well in pancakes and dough, with a light nutty taste. It will not whip either.",
        de: "Pro Ei 1 EL gemahlene Leinsamen mit 3 EL Wasser verrühren und 5 Minuten quellen lassen. Bindet gut in Pfannkuchen und Teig, leicht nussiger Geschmack. Lässt sich ebenfalls nicht aufschlagen.",
        ru: "На одно яйцо смешайте 1 ст. л. молотого льна с 3 ст. л. воды и оставьте на 5 минут. Хорошо связывает панкейки и тесто, даёт лёгкий ореховый вкус. Тоже не взбивается.",
        uk: "На одне яйце змішайте 1 ст. л. меленого льону з 3 ст. л. води та залиште на 5 хвилин. Добре зв'язує панкейки й тісто, дає легкий горіховий смак. Теж не збивається."
      }
    }
  ],

  cream: [
    {
      uses: ["sauce"],
      name: { en: "Oat or soy cooking cream", de: "Hafer- oder Soja-Kochcreme", ru: "Овсяные или соевые сливки для готовки", uk: "Вівсяні або соєві вершки для готування" },
      note: {
        en: "Use 1:1. Mild and slightly sweet, it keeps sauces smooth and creamy. It thickens a bit less, so simmer a minute longer.",
        de: "1:1 verwenden. Mild und leicht süßlich, hält Soßen schön cremig. Bindet etwas weniger, daher eine Minute länger köcheln lassen.",
        ru: "Заменяйте 1 к 1. Мягкий, чуть сладковатый вкус, соус остаётся гладким и сливочным. Загущает слабее, поэтому томите на минуту дольше.",
        uk: "Замінюйте 1 до 1. М'який, трохи солодкуватий смак, соус залишається гладким і вершковим. Загущує слабше, тому томіть на хвилину довше."
      }
    },
    {
      uses: ["sauce"],
      name: { en: "Cream cheese + milk", de: "Frischkäse + Milch", ru: "Сливочный сыр + молоко", uk: "Вершковий сир + молоко" },
      note: {
        en: "Mix about 100 g cream cheese with 50 ml milk for 150 ml cream. Gives a thick, rich sauce with a light tangy note.",
        de: "Etwa 100 g Frischkäse mit 50 ml Milch mischen, ergibt 150 ml Sahne-Ersatz. Die Soße wird dick und reichhaltig mit leicht säuerlicher Note.",
        ru: "Смешайте около 100 г сливочного сыра с 50 мл молока, получится замена 150 мл сливок. Соус выйдет густым и насыщенным с лёгкой кислинкой.",
        uk: "Змішайте близько 100 г вершкового сиру з 50 мл молока, вийде заміна 150 мл вершків. Соус вийде густим і насиченим з легкою кислинкою."
      }
    }
  ],

  sugar: [
    {
      uses: ["baking"],
      name: { en: "Honey", de: "Honig", ru: "Мёд", uk: "Мед" },
      note: {
        en: "Use about ¾ of the sugar amount and reduce the other liquid slightly. Gives a honey aroma and a moister crumb, and browns faster, so watch the oven.",
        de: "Etwa ¾ der Zuckermenge verwenden und die andere Flüssigkeit leicht reduzieren. Gibt Honigaroma und einen saftigeren Teig, bräunt schneller, also im Ofen beobachten.",
        ru: "Берите около ¾ от количества сахара и немного уменьшите другую жидкость. Даёт аромат мёда и более влажный мякиш, быстрее румянится, так что следите за духовкой.",
        uk: "Беріть близько ¾ від кількості цукру та трохи зменште іншу рідину. Дає аромат меду й вологіший м'якуш, швидше підрум'янюється, тож стежте за духовкою."
      }
    },
    {
      uses: ["baking", "dough"],
      name: { en: "Coconut sugar", de: "Kokosblütenzucker", ru: "Кокосовый сахар", uk: "Кокосовий цукор" },
      note: {
        en: "Use 1:1. Slightly less sweet with caramel notes; the pancakes or cake come out a bit darker.",
        de: "1:1 verwenden. Etwas weniger süß mit Karamellnote; Pfannkuchen oder Kuchen werden etwas dunkler.",
        ru: "Заменяйте 1 к 1. Чуть менее сладкий, с карамельными нотками; панкейки или торт получатся немного темнее.",
        uk: "Замінюйте 1 до 1. Трохи менш солодкий, з карамельними нотками; панкейки або торт вийдуть трохи темнішими."
      }
    }
  ],

  flour: [
    {
      uses: ["baking", "dough"],
      name: { en: "Whole wheat flour", de: "Vollkornmehl", ru: "Цельнозерновая мука", uk: "Цільнозернове борошно" },
      note: {
        en: "Replace up to half of the flour. Nuttier taste and a denser texture; add a splash more liquid because it absorbs more.",
        de: "Bis zur Hälfte des Mehls ersetzen. Nussigerer Geschmack und dichtere Konsistenz; etwas mehr Flüssigkeit zugeben, da es mehr aufsaugt.",
        ru: "Можно заменить до половины муки. Вкус более ореховый, текстура плотнее; добавьте чуть больше жидкости, ведь она впитывает больше.",
        uk: "Можна замінити до половини борошна. Смак більш горіховий, текстура щільніша; додайте трохи більше рідини, бо воно вбирає більше."
      }
    },
    {
      uses: ["baking"],
      name: { en: "Oat flour", de: "Hafermehl", ru: "Овсяная мука", uk: "Вівсяне борошно" },
      note: {
        en: "Use 1:1 (blend rolled oats into a powder). Soft and slightly sweet, great for pancakes and cakes. It has no gluten, so it is not suited for yeast dough.",
        de: "1:1 verwenden (Haferflocken fein mahlen). Weich und leicht süß, ideal für Pfannkuchen und Kuchen. Enthält kein Gluten, daher nicht für Hefeteig geeignet.",
        ru: "Заменяйте 1 к 1 (измельчите овсяные хлопья в порошок). Мягкая и слегка сладковатая, отлично для панкейков и пирогов. В ней нет глютена, поэтому для дрожжевого теста не подходит.",
        uk: "Замінюйте 1 до 1 (змелюйте вівсяні пластівці в порошок). М'яке й трохи солодкувате, чудово для панкейків і пирогів. У ньому немає глютену, тому для дріжджового тіста не підходить."
      }
    }
  ],

  parmesan: [
    {
      uses: ["sauce", "topping"],
      name: { en: "Pecorino", de: "Pecorino", ru: "Пекорино", uk: "Пекоріно" },
      note: {
        en: "Use 1:1. Saltier and sharper, so taste the dish before adding extra salt.",
        de: "1:1 verwenden. Salziger und würziger, daher vor dem Nachsalzen abschmecken.",
        ru: "Заменяйте 1 к 1. Солёнее и острее, поэтому перед досаливанием попробуйте блюдо.",
        uk: "Замінюйте 1 до 1. Солонше й гостріше, тому перед досолюванням скуштуйте страву."
      }
    },
    {
      uses: ["topping"],
      name: { en: "Nutritional yeast", de: "Nährhefe", ru: "Пищевые дрожжи", uk: "Харчові дріжджі" },
      note: {
        en: "About 2 tbsp for 50 g parmesan. Cheesy and nutty flavor, dairy-free, but it does not melt, so use it for sprinkling.",
        de: "Etwa 2 EL für 50 g Parmesan. Käsig-nussiger Geschmack, milchfrei, schmilzt aber nicht, daher zum Bestreuen nutzen.",
        ru: "Около 2 ст. л. на 50 г пармезана. Сырно-ореховый вкус, без молока, но не плавится, поэтому подходит для посыпки.",
        uk: "Близько 2 ст. л. на 50 г пармезану. Сирно-горіховий смак, без молока, але не плавиться, тому підходить для посипання."
      }
    }
  ]
};

// ===== Какая панель сейчас открыта (например "pancakes:2") =====
let openSub = null;

function buildSubPanel(key) {
  const box = document.createElement("div");
  box.className = "sub-panel";

  let html = `<b>${st("swap")}</b>`;
  subs[key].forEach(function (option) {
    const chips = option.uses
      .map(function (u) { return `<span class="use-chip">${st(u)}</span>`; })
      .join("");
    html += `<div class="sub-option">
      <div class="sub-name">${option.name[lang]}</div>
      <small>${st("best")}:</small> ${chips}
      <p>${option.note[lang]}</p>
    </div>`;
  });

  box.innerHTML = html;
  return box;
}

function toggleSubPanel(id) {
  openSub = (openSub === id) ? null : id;
  renderRecipe();
}

// ===== Добавляем кнопки 🔄 к ингредиентам после отрисовки рецепта =====
function addSubstituteButtons() {
  const r = recipes[currentId];
  const items = modalContent.querySelectorAll(".ing-list li");

  items.forEach(function (li, i) {
    const key = r.ingredients[i].name.en.toLowerCase();
    if (!subs[key]) return; // для этого продукта замен пока нет

    const id = currentId + ":" + i;
    const btn = document.createElement("button");
    btn.className = "sub-btn";
    btn.textContent = "🔄";
    btn.title = st("swap");
    btn.addEventListener("click", function () {
      toggleSubPanel(id);
    });
    li.appendChild(btn);

    if (openSub === id) {
      li.appendChild(buildSubPanel(key));
    }
  });
}

// Подключаемся к уже существующей функции renderRecipe
const renderRecipeBase = renderRecipe;
renderRecipe = function () {
  renderRecipeBase();
  addSubstituteButtons();
};