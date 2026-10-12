// ===== Тексты на 4 языках =====
const gameUi = {
  en: {
    title: "Mini games",
    tab_catch: "Catch the berries", tab_memory: "Memory", tab_tower: "Cake tower",
    score: "Score", best: "Best", play: "Play", again: "Play again",
    gameOver: "Game over!", newBest: "New record!",
    catchHint: "Drag to move the basket. Catch 🍓 and 💖, avoid 🔥 and 💔!",
    towerHint: "Tap to drop the layer. Stack it as neatly as you can!",
    moves: "Moves", movesWord: "moves", done: "Done in",
    solo: "Solo", duo: "Together", p1: "Me", p2: "Him",
    newGame: "New game", draw: "Draw!", winner: "Winner:"
  },
  de: {
    title: "Minispiele",
    tab_catch: "Erdbeeren fangen", tab_memory: "Memory", tab_tower: "Tortenturm",
    score: "Punkte", best: "Rekord", play: "Spielen", again: "Nochmal",
    gameOver: "Game over!", newBest: "Neuer Rekord!",
    catchHint: "Ziehe den Korb. Fange 🍓 und 💖, weiche 🔥 und 💔 aus!",
    towerHint: "Tippe, um die Schicht fallen zu lassen. Stapele sie so sauber wie möglich!",
    moves: "Züge", movesWord: "Zügen", done: "Geschafft in",
    solo: "Allein", duo: "Zu zweit", p1: "Ich", p2: "Er",
    newGame: "Neues Spiel", draw: "Unentschieden!", winner: "Sieg:"
  },
  ru: {
    title: "Мини-игры",
    tab_catch: "Ловим клубнички", tab_memory: "Мемори", tab_tower: "Собери торт",
    score: "Очки", best: "Рекорд", play: "Играть", again: "Ещё раз",
    gameOver: "Игра окончена!", newBest: "Новый рекорд!",
    catchHint: "Двигай корзинку пальцем или мышкой. Лови 🍓 и 💖, а 🔥 и 💔 обходи!",
    towerHint: "Нажми, чтобы уронить слой. Клади ровно, и башня будет расти!",
    moves: "Ходы", movesWord: "ходов", done: "Готово за",
    solo: "Одна", duo: "Вдвоём", p1: "Я", p2: "Он",
    newGame: "Новая игра", draw: "Ничья!", winner: "Победа:"
  },
  uk: {
    title: "Міні-ігри",
    tab_catch: "Ловимо полуничку", tab_memory: "Мемері", tab_tower: "Збери торт",
    score: "Бали", best: "Рекорд", play: "Грати", again: "Ще раз",
    gameOver: "Гру закінчено!", newBest: "Новий рекорд!",
    catchHint: "Рухай кошик пальцем або мишкою. Лови 🍓 і 💖, а 🔥 і 💔 обминай!",
    towerHint: "Натисни, щоб скинути шар. Клади рівно, і вежа росте!",
    moves: "Ходи", movesWord: "ходів", done: "Готово за",
    solo: "Сама", duo: "Удвох", p1: "Я", p2: "Він",
    newGame: "Нова гра", draw: "Нічия!", winner: "Перемога:"
  }
};

function gt(key) {
  return gameUi[lang][key];
}

let activeGame = "catch";
let stopGame = function () {};
let arcadeLang = null;
const gameTabs = ["catch", "memory", "tower"];

// ===== Раздел с вкладками =====
function renderArcade() {
  const box = document.getElementById("arcade");
  if (!box) return;

  stopGame();
  arcadeLang = lang;

  let html = `<h2 class="section-title">🎮 ${gt("title")}</h2><div class="game-tabs">`;
  gameTabs.forEach(function (g) {
    html += `<button class="filter ${g === activeGame ? "active" : ""}" data-game="${g}">${gt("tab_" + g)}</button>`;
  });
  html += `</div><div id="game-area" class="game-area"></div>`;
  box.innerHTML = html;

  box.querySelectorAll("[data-game]").forEach(function (b) {
    b.addEventListener("click", function () {
      activeGame = b.dataset.game;
      renderArcade();
    });
  });

  const area = document.getElementById("game-area");
  if (activeGame === "catch") gameCatch(area);
  else if (activeGame === "memory") gameMemory(area);
  else gameTower(area);
}

// ===== Общий каркас для игр на холсте =====
function setupCanvasGame(area, key, hint, extra) {
  const best = loadJson("best_" + key, 0);
  area.innerHTML = `
    <div class="game-info">
      <span id="g-score">${gt("score")}: 0</span>
      <span id="g-best">${gt("best")}: ${best}</span>
      <span id="g-extra">${extra || ""}</span>
    </div>
    <div class="game-wrap">
      <canvas id="g-canvas" width="360" height="480"></canvas>
      <div class="game-overlay" id="g-over">
        <p id="g-msg">${hint}</p>
        <button class="share-btn" id="g-play">${gt("play")}</button>
      </div>
    </div>`;

  const g = {
    canvas: document.getElementById("g-canvas"),
    over: document.getElementById("g-over"),
    msg: document.getElementById("g-msg"),
    play: document.getElementById("g-play"),
    best: best,
    setScore: function (n) {
      document.getElementById("g-score").textContent = gt("score") + ": " + n;
    },
    setExtra: function (text) {
      document.getElementById("g-extra").textContent = text;
    },
    finish: function (score, text) {
      if (score > g.best) {
        g.best = score;
        saveJson("best_" + key, score);
        document.getElementById("g-best").textContent = gt("best") + ": " + score;
        text += " 🎉 " + gt("newBest");
      }
      g.msg.textContent = text;
      g.play.textContent = gt("again");
      g.over.classList.remove("hidden");
    }
  };
  g.ctx = g.canvas.getContext("2d");
  return g;
}

// пересчёт положения пальца в координаты холста
function canvasX(g, e) {
  const r = g.canvas.getBoundingClientRect();
  return (e.clientX - r.left) * (g.canvas.width / r.width);
}

// ===== ИГРА 1: ЛОВИМ КЛУБНИЧКИ =====
function gameCatch(area) {
  const g = setupCanvasGame(area, "catch", gt("catchHint"), "❤️❤️❤️");
  const ctx = g.ctx;
  const W = 360;
  const H = 480;

  let basketX = W / 2;
  let items = [];
  let score = 0;
  let lives = 3;
  let running = false;
  let raf = 0;
  let last = 0;
  let spawn = 0;

  const good = [
    { e: "🍓", p: 1 }, { e: "🍓", p: 1 }, { e: "🥚", p: 1 },
    { e: "🍋", p: 1 }, { e: "💖", p: 3 }
  ];
  const bad = ["🔥", "💔"];

  function hearts() {
    return "❤️".repeat(lives) + "🖤".repeat(3 - lives);
  }

  function draw() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#ffe6f3");
    grad.addColorStop(1, "#ffb3dc");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "32px serif";
    items.forEach(function (it) {
      ctx.fillText(it.e, it.x, it.y);
    });
    ctx.font = "52px serif";
    ctx.fillText("🧺", basketX, 440);
  }

  function frame(ts) {
    if (!running) return;
    const dtt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    const level = 1 + Math.floor(score / 8);

    spawn -= dtt;
    if (spawn <= 0) {
      spawn = Math.max(0.35, 0.95 - level * 0.07);
      const isBad = Math.random() < Math.min(0.35, 0.15 + level * 0.02);
      const base = isBad
        ? { e: bad[Math.floor(Math.random() * bad.length)], p: 0, bad: true }
        : good[Math.floor(Math.random() * good.length)];
      items.push({
        e: base.e,
        p: base.p,
        bad: !!base.bad,
        x: 24 + Math.random() * (W - 48),
        y: -30,
        v: 130 + level * 18 + Math.random() * 40
      });
    }

    items = items.filter(function (it) {
      it.y += it.v * dtt;
      if (it.y > 410 && it.y < 470 && Math.abs(it.x - basketX) < 44) {
        if (it.bad) {
          lives--;
          g.setExtra(hearts());
        } else {
          score += it.p;
          g.setScore(score);
        }
        return false;
      }
      return it.y < H + 40;
    });

    draw();

    if (lives <= 0) {
      running = false;
      g.finish(score, gt("gameOver") + " " + gt("score") + ": " + score);
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    items = [];
    score = 0;
    lives = 3;
    spawn = 0.3;
    running = true;
    last = performance.now();
    g.setScore(0);
    g.setExtra(hearts());
    g.over.classList.add("hidden");
    raf = requestAnimationFrame(frame);
  }

  function move(e) {
    basketX = Math.max(30, Math.min(W - 30, canvasX(g, e)));
    if (!running) draw();
  }

  g.canvas.addEventListener("pointermove", move);
  g.canvas.addEventListener("pointerdown", move);
  g.play.addEventListener("click", start);

  stopGame = function () {
    running = false;
    cancelAnimationFrame(raf);
  };

  draw();
}

// ===== ИГРА 2: МЕМОРИ =====
function gameMemory(area) {
  const emojis = ["🍓", "🥑", "🍋", "🧀", "🥚", "🥕", "🍞", "🍒"];
  let mode = "solo";
  let cards = [];
  let opened = [];
  let lock = false;
  let moves = 0;
  let player = 0;
  let scores = [0, 0];
  let finished = false;
  let message = "";
  let timer = null;

  stopGame = function () {
    clearTimeout(timer);
  };

  function newGame() {
    clearTimeout(timer);
    const list = emojis.concat(emojis);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    cards = list.map(function (e) {
      return { e: e, open: false, done: false };
    });
    opened = [];
    lock = false;
    moves = 0;
    player = 0;
    scores = [0, 0];
    finished = false;
    message = "";
    render();
  }

  function checkWin() {
    if (!cards.every(function (c) { return c.done; })) return;
    finished = true;

    if (mode === "solo") {
      const best = loadJson("best_memory", 0);
      message = gt("done") + " " + moves + " " + gt("movesWord") + " 🎉";
      if (!best || moves < best) {
        saveJson("best_memory", moves);
        message += " " + gt("newBest");
      }
    } else if (scores[0] === scores[1]) {
      message = gt("draw");
    } else {
      const winner = scores[0] > scores[1] ? gt("p1") : gt("p2");
      message = gt("winner") + " " + winner + " 🏆";
    }
  }

  function flip(i) {
    const c = cards[i];
    if (lock || finished || c.open || c.done) return;

    c.open = true;
    opened.push(i);
    if (opened.length < 2) {
      render();
      return;
    }

    moves++;
    const a = opened[0];
    const b = opened[1];

    if (cards[a].e === cards[b].e) {
      cards[a].done = true;
      cards[b].done = true;
      cards[a].open = false;
      cards[b].open = false;
      scores[player]++;
      opened = [];
      checkWin();
      render();
    } else {
      lock = true;
      render();
      timer = setTimeout(function () {
        cards[a].open = false;
        cards[b].open = false;
        opened = [];
        lock = false;
        if (mode === "duo") player = 1 - player;
        render();
      }, 800);
    }
  }

  function render() {
    const best = loadJson("best_memory", 0);
    let info;
    if (mode === "solo") {
      info = gt("moves") + ": " + moves + (best ? " · " + gt("best") + ": " + best : "");
    } else {
      info = [0, 1].map(function (i) {
        const mark = i === player && !finished ? "👉 " : "";
        return mark + gt(i === 0 ? "p1" : "p2") + ": " + scores[i];
      }).join("   ");
    }

    let grid = "";
    cards.forEach(function (c, i) {
      const up = c.open || c.done;
      grid += `<button class="mem-card ${up ? "up" : ""} ${c.done ? "done" : ""}" data-i="${i}">${up ? c.e : "💗"}</button>`;
    });

    area.innerHTML = `
      <div class="mem-modes">
        <button class="filter ${mode === "solo" ? "active" : ""}" id="m-solo">${gt("solo")}</button>
        <button class="filter ${mode === "duo" ? "active" : ""}" id="m-duo">${gt("duo")}</button>
      </div>
      <div class="game-info"><span>${info}</span></div>
      <div class="mem-grid">${grid}</div>
      <p class="mem-msg">${message}</p>
      <button class="share-btn" id="m-new">${gt("newGame")}</button>`;

    area.querySelectorAll(".mem-card").forEach(function (b) {
      b.addEventListener("click", function () {
        flip(Number(b.dataset.i));
      });
    });
    document.getElementById("m-solo").addEventListener("click", function () {
      mode = "solo";
      newGame();
    });
    document.getElementById("m-duo").addEventListener("click", function () {
      mode = "duo";
      newGame();
    });
    document.getElementById("m-new").addEventListener("click", newGame);
  }

  newGame();
}

// ===== ИГРА 3: СОБЕРИ ТОРТ =====
function gameTower(area) {
  const g = setupCanvasGame(area, "tower", gt("towerHint"), "");
  const ctx = g.ctx;
  const W = 360;
  const H = 480;
  const BH = 28; // высота одного слоя

  let layers = [{ x: 100, w: 160, hue: 330 }];
  let cur = null;
  let score = 0;
  let running = false;
  let raf = 0;
  let last = 0;
  let cam = 0;
  let speed = 150;

  function block(x, y, w, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, BH - 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(x, y, w, 7);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, BH - 2);
  }

  function draw() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#e9f9ff");
    grad.addColorStop(1, "#ffd6ea");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    layers.forEach(function (l, i) {
      block(l.x, 440 - i * BH + cam, l.w, "hsl(" + l.hue + ", 85%, 78%)");
    });

    const showCur = running && cur;
    if (showCur) {
      const hue = (330 + layers.length * 14) % 360;
      block(cur.x, 440 - layers.length * BH + cam, cur.w, "hsl(" + hue + ", 85%, 78%)");
    }

    // вишенка на самом верху
    const topP = showCur ? cur : layers[layers.length - 1];
    const topY = showCur
      ? 440 - layers.length * BH + cam
      : 440 - (layers.length - 1) * BH + cam;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "26px serif";
    ctx.fillText("🍒", topP.x + topP.w / 2, topY - 12);
  }

  function frame(ts) {
    if (!running) return;
    const dtt = Math.min(0.05, (ts - last) / 1000);
    last = ts;

    cur.x += cur.dir * speed * dtt;
    if (cur.x <= 0) {
      cur.x = 0;
      cur.dir = 1;
    }
    if (cur.x + cur.w >= W) {
      cur.x = W - cur.w;
      cur.dir = -1;
    }

    // камера плавно едет вниз, когда башня растёт
    const target = Math.max(0, (layers.length - 9) * BH);
    cam += (target - cam) * Math.min(1, dtt * 6);

    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    layers = [{ x: 100, w: 160, hue: 330 }];
    cur = { x: 0, w: 160, dir: 1 };
    score = 0;
    cam = 0;
    speed = 150;
    running = true;
    last = performance.now();
    g.setScore(0);
    g.over.classList.add("hidden");
    raf = requestAnimationFrame(frame);
  }

  function drop() {
    if (!running) return;

    const top = layers[layers.length - 1];
    const left = Math.max(cur.x, top.x);
    const right = Math.min(cur.x + cur.w, top.x + top.w);
    const overlap = right - left;

    if (overlap <= 0) {
      running = false;
      draw();
      g.finish(score, gt("gameOver") + " " + gt("score") + ": " + score);
      return;
    }

    let nx = left;
    let nw = overlap;
    if (Math.abs(cur.x - top.x) < 5) {
      // идеально ровно: слой не уменьшается
      nx = top.x;
      nw = top.w;
    }

    layers.push({ x: nx, w: nw, hue: (330 + layers.length * 14) % 360 });
    score++;
    g.setScore(score);
    speed = Math.min(430, 150 + score * 9);

    const fromLeft = layers.length % 2 === 0;
    cur = { x: fromLeft ? 0 : W - nw, w: nw, dir: fromLeft ? 1 : -1 };
  }

  g.canvas.addEventListener("pointerdown", drop);
  g.play.addEventListener("click", start);

  stopGame = function () {
    running = false;
    cancelAnimationFrame(raf);
  };

  draw();
}

// при смене языка перерисовываем игры (только если язык реально поменялся)
const applyLanguageBeforeGames = applyLanguage;
applyLanguage = function () {
  applyLanguageBeforeGames();
  if (arcadeLang !== lang) renderArcade();
};

renderArcade();