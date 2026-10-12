// ===== Блёстки за курсором (и за пальцем на телефоне) =====
const sparkleChars = ["✦", "✧", "♡", "★", "✿"];
const sparkleColors = ["#ff4fa3", "#ff8cc6", "#ffffff", "#d6247f"];
let lastSparkle = 0;

function makeSparkle(x, y) {
  const now = Date.now();
  if (now - lastSparkle < 60) return;
  lastSparkle = now;

  const s = document.createElement("span");
  s.className = "sparkle";
  s.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
  s.style.left = x + "px";
  s.style.top = y + "px";
  s.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
  s.style.fontSize = 10 + Math.random() * 14 + "px";
  document.body.appendChild(s);

  setTimeout(function () {
    s.remove();
  }, 900);
}

document.addEventListener("mousemove", function (e) {
  makeSparkle(e.clientX, e.clientY);
});

document.addEventListener("touchmove", function (e) {
  const touch = e.touches[0];
  makeSparkle(touch.clientX, touch.clientY);
}, { passive: true });

// ===== Конфетти, когда таймер закончился =====
function confetti() {
  const pieces = ["🍓", "💖", "✨", "🌸", "⭐", "🦋"];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement("span");
    p.className = "confetti";
    p.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = 18 + Math.random() * 18 + "px";
    p.style.animationDuration = 2 + Math.random() * 2 + "s";
    p.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(p);

    setTimeout(function () {
      p.remove();
    }, 5000);
  }
}

// подключаемся к звуку таймера: звонок плюс конфетти
const playChimeBase = playChime;
playChime = function () {
  playChimeBase();
  confetti();
};