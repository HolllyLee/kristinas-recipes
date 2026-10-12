(function () {
  // маленькие помощники, чтобы не писать всё по 4 раза длинно
  function tx(en, de, ru, uk) {
    return { en: en, de: de, ru: ru, uk: uk };
  }
  function ing(amount, unit, en, de, ru, uk) {
    return { amount: amount, unit: unit, name: tx(en, de, ru, uk) };
  }
  function stp(en, de, ru, uk, minutes) {
    const s = { text: tx(en, de, ru, uk) };
    if (minutes) s.minutes = minutes;
    return s;
  }

  Object.assign(recipes, {

    // ===== СУШИ «ФИЛАДЕЛЬФИЯ» =====
    sushi: {
      emoji: "🍣", servings: 2, time: 60, tags: ["protein"],
      title: tx("Philadelphia Sushi Rolls", "Philadelphia-Sushi-Rollen", "Суши «Филадельфия»", "Суші «Філадельфія»"),
      ingredients: [
        ing(200, "g", "Sushi rice", "Sushi-Reis", "Рис для суши", "Рис для суші"),
        ing(240, "ml", "Water", "Wasser", "Вода", "Вода"),
        ing(3, "tbsp", "Rice vinegar", "Reisessig", "Рисовый уксус", "Рисовий оцет"),
        ing(1, "tbsp", "Sugar", "Zucker", "Сахар", "Цукор"),
        ing(1, "tsp", "Salt", "Salz", "Соль", "Сіль"),
        ing(2, "", "Nori sheets", "Nori-Blätter", "Листы нори", "Листи норі"),
        ing(150, "g", "Salmon (fit for eating raw)", "Lachs (roh genießbar)", "Лосось (для сырого употребления)", "Лосось (для вживання в сирому вигляді)"),
        ing(80, "g", "Cream cheese", "Frischkäse", "Сливочный сыр", "Вершковий сир"),
        ing(1, "", "Cucumber", "Gurke", "Огурец", "Огірок"),
        ing(1, "tbsp", "Sesame seeds", "Sesam", "Кунжут", "Кунжут"),
        ing(2, "tbsp", "Soy sauce", "Sojasoße", "Соевый соус", "Соєвий соус"),
        ing(1, "tsp", "Wasabi", "Wasabi", "Васаби", "Васабі")
      ],
      steps: [
        stp("Rinse the rice in cold water several times until the water runs almost clear.",
            "Den Reis mehrmals in kaltem Wasser waschen, bis das Wasser fast klar ist.",
            "Промойте рис в холодной воде несколько раз, пока вода не станет почти прозрачной.",
            "Промийте рис у холодній воді кілька разів, поки вода не стане майже прозорою."),
        stp("Bring the rice and water to a boil, cover and cook on low heat for 12 minutes. Leave covered for 10 more minutes.",
            "Reis und Wasser aufkochen, zugedeckt bei niedriger Hitze 12 Minuten garen. Danach noch 10 Minuten zugedeckt ruhen lassen.",
            "Доведите рис с водой до кипения, накройте крышкой и варите на слабом огне 12 минут. Затем оставьте под крышкой ещё на 10 минут.",
            "Доведіть рис із водою до кипіння, накрийте кришкою та варіть на слабкому вогні 12 хвилин. Потім залиште під кришкою ще на 10 хвилин.", 12),
        stp("Mix vinegar, sugar and salt, fold it gently into the warm rice and let the rice cool to room temperature.",
            "Essig, Zucker und Salz verrühren, vorsichtig unter den warmen Reis heben und den Reis auf Zimmertemperatur abkühlen lassen.",
            "Смешайте уксус, сахар и соль, аккуратно вмешайте в тёплый рис и дайте ему остыть до комнатной температуры.",
            "Змішайте оцет, цукор і сіль, обережно вмішайте в теплий рис і дайте йому охолонути до кімнатної температури.", 15),
        stp("Cut the salmon and cucumber into long strips about 1 cm thick. Use only salmon that is labelled as suitable for eating raw.",
            "Lachs und Gurke in lange, etwa 1 cm dicke Streifen schneiden. Nur Lachs verwenden, der für den Rohverzehr geeignet ist.",
            "Нарежьте лосось и огурец длинными брусочками толщиной около 1 см. Берите только лосось, пригодный для употребления в сыром виде.",
            "Наріжте лосось і огірок довгими брусочками завтовшки близько 1 см. Беріть лише лосось, придатний до вживання в сирому вигляді."),
        stp("Cover a bamboo mat with cling film. Place a nori sheet on it, spread rice over it with wet hands, sprinkle with sesame, then flip the sheet so the rice is on the bottom.",
            "Eine Bambusmatte mit Frischhaltefolie bedecken. Ein Nori-Blatt darauflegen, mit nassen Händen Reis darauf verteilen, mit Sesam bestreuen und das Blatt umdrehen, sodass der Reis unten liegt.",
            "Накройте бамбуковый коврик пищевой плёнкой. Положите лист нори, мокрыми руками распределите по нему рис, посыпьте кунжутом и переверните лист так, чтобы рис оказался снизу.",
            "Накрийте бамбуковий килимок харчовою плівкою. Покладіть аркуш норі, мокрими руками розподіліть по ньому рис, посипте кунжутом і переверніть аркуш так, щоб рис опинився знизу."),
        stp("Lay a strip of cream cheese, salmon and cucumber along the nori edge closest to you. Roll up tightly using the mat and press the roll gently.",
            "Frischkäse, Lachs und Gurke als Streifen an den vorderen Rand des Nori legen. Mit der Matte fest aufrollen und die Rolle leicht andrücken.",
            "Выложите полоски сливочного сыра, лосося и огурца вдоль ближнего к вам края нори. Плотно скрутите рулет с помощью коврика и слегка придавите.",
            "Викладіть смужки вершкового сиру, лосося й огірка вздовж найближчого до вас краю норі. Щільно скрутіть рулет за допомогою килимка та злегка притисніть."),
        stp("Wet a sharp knife and cut each roll into 8 pieces. Serve with soy sauce and wasabi.",
            "Ein scharfes Messer befeuchten und jede Rolle in 8 Stücke schneiden. Mit Sojasoße und Wasabi servieren.",
            "Смочите острый нож и нарежьте каждый ролл на 8 частей. Подавайте с соевым соусом и васаби.",
            "Змочіть гострий ніж і наріжте кожен рол на 8 частин. Подавайте з соєвим соусом і васабі.")
      ]
    },

    // ===== ПЕЛЬМЕНИ =====
    pelmeni: {
      emoji: "🥟", servings: 4, time: 90, tags: ["protein"],
      title: tx("Pelmeni (Russian dumplings)", "Pelmeni (russische Teigtaschen)", "Пельмени", "Пельмені"),
      ingredients: [
        ing(400, "g", "Flour", "Mehl", "Мука", "Борошно"),
        ing(200, "ml", "Water", "Wasser", "Вода", "Вода"),
        ing(1, "", "Eggs", "Eier", "Яйца", "Яйця"),
        ing(2, "tsp", "Salt", "Salz", "Соль", "Сіль"),
        ing(400, "g", "Minced meat (beef and pork)", "Hackfleisch (Rind und Schwein)", "Фарш (говядина со свининой)", "Фарш (яловичина зі свининою)"),
        ing(1, "", "Onion", "Zwiebel", "Лук", "Цибуля"),
        ing(0.5, "tsp", "Black pepper", "Schwarzer Pfeffer", "Чёрный перец", "Чорний перець"),
        ing(2, "", "Bay leaves", "Lorbeerblätter", "Лавровый лист", "Лавровий лист"),
        ing(30, "g", "Butter", "Butter", "Сливочное масло", "Вершкове масло"),
        ing(100, "g", "Sour cream", "Saure Sahne", "Сметана", "Сметана")
      ],
      steps: [
        stp("Mix the flour with half of the salt, the egg and cold water. Knead the dough for 10 minutes until smooth and elastic.",
            "Mehl mit der Hälfte des Salzes, dem Ei und kaltem Wasser vermengen. Den Teig 10 Minuten glatt und elastisch kneten.",
            "Смешайте муку с половиной соли, яйцом и холодной водой. Замесите гладкое эластичное тесто, примерно 10 минут.",
            "Змішайте борошно з половиною солі, яйцем і холодною водою. Замісіть гладеньке еластичне тісто, приблизно 10 хвилин.", 10),
        stp("Wrap the dough in cling film and let it rest for 30 minutes.",
            "Den Teig in Frischhaltefolie wickeln und 30 Minuten ruhen lassen.",
            "Заверните тесто в плёнку и оставьте отдохнуть на 30 минут.",
            "Загорніть тісто в плівку та залиште відпочити на 30 хвилин.", 30),
        stp("Mix the minced meat with the finely grated onion, the remaining salt, pepper and 3 tablespoons of cold water until fluffy.",
            "Das Hackfleisch mit der fein geriebenen Zwiebel, dem restlichen Salz, Pfeffer und 3 Esslöffeln kaltem Wasser locker verrühren.",
            "Смешайте фарш с мелко натёртым луком, оставшейся солью, перцем и 3 ст. л. холодной воды до пышности.",
            "Змішайте фарш із дрібно натертою цибулею, рештою солі, перцем і 3 ст. л. холодної води до пишності."),
        stp("Roll out the dough thinly (about 2 mm) and cut out circles with a glass.",
            "Den Teig dünn ausrollen (etwa 2 mm) und mit einem Glas Kreise ausstechen.",
            "Раскатайте тесто тонко (около 2 мм) и вырежьте стаканом кружки.",
            "Розкачайте тісто тонко (близько 2 мм) і виріжте склянкою кружечки."),
        stp("Put a teaspoon of filling on each circle, fold in half, pinch the edge firmly and join the two corners.",
            "Auf jeden Kreis einen Teelöffel Füllung geben, zur Hälfte falten, den Rand fest zusammendrücken und die beiden Ecken verbinden.",
            "Положите на каждый кружок чайную ложку начинки, сложите пополам, плотно защипните край и соедините два уголка.",
            "Покладіть на кожне кружечок чайну ложку начинки, складіть навпіл, щільно защипніть край і з'єднайте два куточки."),
        stp("Boil plenty of salted water with the bay leaves, add the pelmeni and stir. Once they float, cook for about 6 minutes.",
            "Reichlich Salzwasser mit den Lorbeerblättern aufkochen, die Pelmeni hineingeben und umrühren. Sobald sie oben schwimmen, etwa 6 Minuten garen.",
            "Вскипятите много подсоленной воды с лавровым листом, опустите пельмени и помешайте. Когда они всплывут, варите около 6 минут.",
            "Закип'ятіть багато підсоленої води з лавровим листом, опустіть пельмені та помішайте. Коли вони спливуть, варіть близько 6 хвилин.", 6),
        stp("Serve with butter and sour cream, if you like with dill, vinegar or mustard.",
            "Mit Butter und saurer Sahne servieren, nach Belieben mit Dill, Essig oder Senf.",
            "Подавайте со сливочным маслом и сметаной, по желанию с укропом, уксусом или горчицей.",
            "Подавайте з вершковим маслом і сметаною, за бажанням з кропом, оцтом або гірчицею.")
      ]
    },

    // ===== ХИНКАЛИ =====
    khinkali: {
      emoji: "🍲", servings: 4, time: 120, tags: ["protein"],
      title: tx("Khinkali (Georgian soup dumplings)", "Chinkali (georgische Brühe-Teigtaschen)", "Хинкали", "Хінкалі"),
      ingredients: [
        ing(500, "g", "Flour", "Mehl", "Мука", "Борошно"),
        ing(250, "ml", "Water (for the dough)", "Wasser (für den Teig)", "Вода (для теста)", "Вода (для тіста)"),
        ing(500, "g", "Minced meat (beef and pork)", "Hackfleisch (Rind und Schwein)", "Фарш (говядина со свининой)", "Фарш (яловичина зі свининою)"),
        ing(2, "", "Onion", "Zwiebel", "Лук", "Цибуля"),
        ing(30, "g", "Fresh cilantro", "Frischer Koriander", "Свежая кинза", "Свіжа кінза"),
        ing(150, "ml", "Cold water or broth (for the filling)", "Kaltes Wasser oder Brühe (für die Füllung)", "Холодная вода или бульон (для начинки)", "Холодна вода або бульйон (для начинки)"),
        ing(3, "tsp", "Salt", "Salz", "Соль", "Сіль"),
        ing(1, "tsp", "Black pepper", "Schwarzer Pfeffer", "Чёрный перец", "Чорний перець")
      ],
      steps: [
        stp("Knead a stiff dough from the flour, the water and 1 teaspoon of salt for about 10 minutes.",
            "Aus Mehl, Wasser und 1 Teelöffel Salz etwa 10 Minuten einen festen Teig kneten.",
            "Замесите крутое тесто из муки, воды и 1 ч. л. соли, около 10 минут.",
            "Замісіть круте тісто з борошна, води та 1 ч. л. солі, близько 10 хвилин.", 10),
        stp("Cover the dough and let it rest for 30 minutes.",
            "Den Teig abdecken und 30 Minuten ruhen lassen.",
            "Накройте тесто и оставьте отдохнуть на 30 минут.",
            "Накрийте тісто та залиште відпочити на 30 хвилин.", 30),
        stp("Mix the minced meat with finely chopped onion and cilantro, the remaining salt and the pepper. Add the cold water or broth bit by bit and stir until the filling is very juicy.",
            "Das Hackfleisch mit fein gehackter Zwiebel und Koriander, dem restlichen Salz und dem Pfeffer vermengen. Kaltes Wasser oder Brühe nach und nach zugeben und rühren, bis die Füllung sehr saftig ist.",
            "Смешайте фарш с мелко нарезанными луком и кинзой, оставшейся солью и перцем. Понемногу вливайте холодную воду или бульон и перемешивайте, пока начинка не станет очень сочной.",
            "Змішайте фарш із дрібно нарізаними цибулею та кінзою, рештою солі й перцем. Потроху вливайте холодну воду або бульйон і перемішуйте, поки начинка не стане дуже соковитою."),
        stp("Divide the dough into about 20 pieces and roll each into a thin circle, thicker in the middle and thinner at the edges.",
            "Den Teig in etwa 20 Stücke teilen und jedes zu einem dünnen Kreis ausrollen, in der Mitte dicker und am Rand dünner.",
            "Разделите тесто на 20 частей и раскатайте каждую в тонкий круг: в центре потолще, по краям потоньше.",
            "Розділіть тісто на 20 частин і розкачайте кожну в тонке коло: у центрі товстіше, по краях тонше."),
        stp("Put about 1.5 tablespoons of filling in the center. Gather the edges into small pleats toward the middle, twist to close and pinch the top together.",
            "Etwa 1,5 Esslöffel Füllung in die Mitte geben. Den Rand in kleinen Falten zur Mitte hin zusammenraffen, zudrehen und oben zusammendrücken.",
            "Положите в центр около 1,5 ст. л. начинки. Соберите края в мелкие складки к середине, закрутите и защипните сверху.",
            "Покладіть у центр близько 1,5 ст. л. начинки. Зберіть краї в дрібні складки до середини, закрутіть і защипніть зверху."),
        stp("Carefully lower the khinkali into boiling salted water, a few at a time, and cook for about 12 minutes, stirring gently.",
            "Die Chinkali vorsichtig in kochendes Salzwasser geben, einige auf einmal, und etwa 12 Minuten garen. Dabei sanft umrühren.",
            "Осторожно опускайте хинкали в кипящую подсоленную воду по несколько штук и варите около 12 минут, аккуратно помешивая.",
            "Обережно опускайте хінкалі в киплячу підсолену воду по кілька штук і варіть близько 12 хвилин, акуратно помішуючи.", 12),
        stp("Serve hot with plenty of black pepper. Hold a khinkali by the knob, bite a small hole, drink the broth first, then eat the rest. The knob stays on the plate.",
            "Heiß mit reichlich schwarzem Pfeffer servieren. Eine Chinkali am Zipfel halten, ein kleines Loch hineinbeißen, zuerst die Brühe trinken und dann den Rest essen. Der Zipfel bleibt auf dem Teller.",
            "Подавайте горячими с большим количеством чёрного перца. Берите хинкали за хвостик, откусите маленькое отверстие, сначала выпейте бульон, затем съешьте остальное. Хвостик остаётся на тарелке.",
            "Подавайте гарячими з великою кількістю чорного перцю. Беріть хінкалі за хвостик, відкусіть маленький отвір, спершу випийте бульйон, потім з'їжте решту. Хвостик залишається на тарілці.")
      ]
    },

    // ===== ХАЧАПУРИ ПО-АДЖАРСКИ =====
    khachapuri: {
      emoji: "🧀", servings: 2, time: 120, tags: [],
      title: tx("Khachapuri (Georgian cheese boats)", "Chatschapuri (georgische Käse-Schiffchen)", "Хачапури по-аджарски", "Хачапурі по-аджарськи"),
      ingredients: [
        ing(300, "g", "Flour", "Mehl", "Мука", "Борошно"),
        ing(180, "ml", "Milk", "Milch", "Молоко", "Молоко"),
        ing(5, "g", "Dry yeast", "Trockenhefe", "Сухие дрожжи", "Сухі дріжджі"),
        ing(1, "tsp", "Sugar", "Zucker", "Сахар", "Цукор"),
        ing(1, "tsp", "Salt", "Salz", "Соль", "Сіль"),
        ing(2, "tbsp", "Vegetable oil", "Pflanzenöl", "Растительное масло", "Рослинна олія"),
        ing(200, "g", "Mozzarella", "Mozzarella", "Моцарелла", "Моцарела"),
        ing(150, "g", "Feta", "Feta", "Фета", "Фета"),
        ing(2, "", "Eggs", "Eier", "Яйца", "Яйця"),
        ing(30, "g", "Butter", "Butter", "Сливочное масло", "Вершкове масло")
      ],
      steps: [
        stp("Stir the yeast and sugar into the warm milk and wait about 10 minutes until it gets foamy.",
            "Hefe und Zucker in die lauwarme Milch rühren und etwa 10 Minuten warten, bis sie schäumt.",
            "Размешайте дрожжи и сахар в тёплом молоке и подождите около 10 минут, пока не появится пена.",
            "Розмішайте дріжджі та цукор у теплому молоці й зачекайте близько 10 хвилин, поки не з'явиться піна.", 10),
                stp("Add the flour, salt and oil and knead for about 8 minutes into a soft dough. Cover it and let it rise for 1 hour.",
            "Mehl, Salz und Öl dazugeben und etwa 8 Minuten zu einem weichen Teig kneten. Abdecken und 1 Stunde gehen lassen.",
            "Добавьте муку, соль и масло и замесите мягкое тесто, около 8 минут. Накройте и оставьте подниматься на 1 час.",
            "Додайте борошно, сіль і олію та замісіть м'яке тісто, близько 8 хвилин. Накрийте та залиште підніматися на 1 годину.", 60),
        stp("Preheat the oven to 250 °C (or as hot as it goes). Grate the mozzarella, crumble the feta, separate the eggs and mix the egg whites into the cheese. Keep the yolks for later.",
            "Den Ofen auf 250 °C vorheizen (oder so heiß wie möglich). Mozzarella reiben, Feta zerbröseln, die Eier trennen und das Eiweiß unter den Käse mischen. Die Eigelbe für später aufheben.",
            "Разогрейте духовку до 250 °C (или до максимума). Натрите моцареллу, раскрошите фету, разделите яйца и смешайте белки с сыром. Желтки оставьте на потом.",
            "Розігрійте духовку до 250 °C (або до максимуму). Настружте моцарелу, покрошіть фету, розділіть яйця та змішайте білки із сиром. Жовтки залиште на потім."),
        stp("Divide the dough into 2 pieces and roll each into an oval about 25 cm long. Roll the edges toward the center to form a boat and pinch the ends.",
            "Den Teig in 2 Stücke teilen und jedes zu einem Oval von etwa 25 cm Länge ausrollen. Die Ränder zur Mitte hin einrollen, sodass ein Schiffchen entsteht, und die Enden zusammendrücken.",
            "Разделите тесто на 2 части и раскатайте каждую в овал длиной около 25 см. Подверните края к центру, чтобы получилась лодочка, и защипните концы.",
            "Розділіть тісто на 2 частини та розкачайте кожну в овал завдовжки близько 25 см. Підверніть краї до центру, щоб вийшов човник, і защипніть кінці."),
        stp("Fill the boats with the cheese mixture and bake for about 12 minutes until the crust is golden.",
            "Die Schiffchen mit der Käsemischung füllen und etwa 12 Minuten backen, bis der Rand goldbraun ist.",
            "Наполните лодочки сырной смесью и выпекайте около 12 минут, пока края не станут золотистыми.",
            "Наповніть човники сирною сумішшю та випікайте близько 12 хвилин, поки краї не стануть золотистими.", 12),
        stp("Take the boats out, make a small well in the middle, add an egg yolk and a piece of butter to each and bake for 2 more minutes.",
            "Die Schiffchen herausnehmen, in der Mitte eine kleine Mulde formen, in jede ein Eigelb und ein Stück Butter geben und noch 2 Minuten backen.",
            "Достаньте лодочки, сделайте в середине небольшое углубление, положите в каждую желток и кусочек масла и выпекайте ещё 2 минуты.",
            "Дістаньте човники, зробіть посередині невелике заглиблення, покладіть у кожен жовток і шматочок масла та випікайте ще 2 хвилини.", 2),
        stp("Serve right away: stir the yolk and butter into the hot cheese, tear off pieces of the crust and dip them in.",
            "Sofort servieren: Eigelb und Butter in den heißen Käse rühren, Stücke vom Rand abreißen und eintauchen.",
            "Подавайте сразу: размешайте желток и масло с горячим сыром, отрывайте кусочки края и макайте в начинку.",
            "Подавайте одразу: розмішайте жовток і масло з гарячим сиром, відривайте шматочки краю та вмочайте в начинку.")
      ]
    }

  });

  applyLanguage(); // перерисовываем сайт, чтобы новые карточки появились
})();