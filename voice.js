// ===== Голосовое управление =====
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceLocales = { en: "en-US", de: "de-DE", ru: "ru-RU", uk: "uk-UA" };

const voiceUi = {
  en: {
    on: "Listening… say “next”, “back”, “read”, “timer 5 minutes”",
    unsupported: "Voice control does not work in this browser. Try Chrome, Edge or Safari.",
    denied: "No access to the microphone. Please allow it in the browser.",
    end: "That was the last step 🍓"
  },
  de: {
    on: "Ich höre zu… sage „weiter“, „zurück“, „vorlesen“, „Timer 5 Minuten“",
    unsupported: "Sprachsteuerung funktioniert in diesem Browser nicht. Probiere Chrome, Edge oder Safari.",
    denied: "Kein Zugriff auf das Mikrofon. Bitte im Browser erlauben.",
    end: "Das war der letzte Schritt 🍓"
  },
  ru: {
    on: "Слушаю… скажи «дальше», «назад», «прочитай», «таймер на 5 минут»",
    unsupported: "В этом браузере голосовое управление не работает. Попробуй Chrome, Edge или Safari.",
    denied: "Нет доступа к микрофону. Разреши его в браузере.",
    end: "Это был последний шаг 🍓"
  },
  uk: {
    on: "Слухаю… скажи «далі», «назад», «прочитай», «таймер на 5 хвилин»",
    unsupported: "У цьому браузері голосове керування не працює. Спробуй Chrome, Edge або Safari.",
    denied: "Немає доступу до мікрофона. Дозволь його в браузері.",
    end: "Це був останній крок 🍓"
  }
};

function vt(key) {
  return voiceUi[lang][key];
}

// слова-команды на всех языках сразу
const voiceWords = {
  next:  ["дальше", "далее", "следующ", "next", "weiter", "nächst", "далі", "наступн"],
  back:  ["назад", "предыдущ", "back", "previous", "zurück", "vorherig", "попередн"],
  read:  ["прочитай", "прочти", "повтор", "читай", "read", "repeat", "vorlesen", "wiederhole"],
  cook:  ["режим готов", "режим готув", "cooking mode", "kochmodus", "start cooking"],
  close: ["закрой", "закрий", "close", "schließ", "exit"],
  stop:  ["стоп", "останови", "выключи", "зупини", "вимкни", "stop", "stopp", "halt"],
  timer: ["таймер", "timer"]
};

// числа словами → цифры (браузер чаще всего сам пишет цифрами, это запасной вариант)
const numWords = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  fifteen: 15, twenty: 20, thirty: 30, forty: 40, sixty: 60,
  ein: 1, eins: 1, eine: 1, zwei: 2, drei: 3, vier: 4, "fünf": 5, sechs: 6, sieben: 7, acht: 8,
  neun: 9, zehn: 10, "fünfzehn": 15, zwanzig: 20, "dreißig": 30,
  "один": 1, "одна": 1, "одну": 1, "два": 2, "две": 2, "три": 3, "четыре": 4, "пять": 5,
  "шесть": 6, "семь": 7, "восемь": 8, "девять": 9, "десять": 10,
  "пятнадцать": 15, "двадцать": 20, "тридцать": 30,
  "дві": 2, "чотири": 4, "п'ять": 5, "шість": 6, "сім": 7, "вісім": 8, "дев'ять": 9,
  "п'ятнадцять": 15, "двадцять": 20, "тридцять": 30
};

function has(text, list) {
  return list.some(function (w) {
    return text.includes(w);
  });
}

// "таймер на 5 минут" → 5, "таймер 30 секунд" → 0.5
function parseTimer(text) {
  const t = text.split(/\s+/).map(function (w) {
    return numWords[w] !== undefined ? String(numWords[w]) : w;
  }).join(" ");

  let m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:сек|sek|sec|second)/);
  if (m) return parseFloat(m[1].replace(",", ".")) / 60;

  m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:мин|хв|min)/);
  if (m) return parseFloat(m[1].replace(",", "."));

  m = t.match(/(\d+(?:[.,]\d+)?)/);
  if (m) return parseFloat(m[1].replace(",", "."));

  return null;
}

// ===== Кнопка микрофона и подсказка =====
const micBtn = document.createElement("button");
micBtn.className = "mic-fab";
micBtn.textContent = "🎤";
document.body.appendChild(micBtn);

const voiceBubble = document.createElement("div");
voiceBubble.className = "voice-bubble";
document.body.appendChild(voiceBubble);

let bubbleTimer = null;

function showVoice(text) {
  voiceBubble.textContent = text;
  voiceBubble.classList.toggle("show", !!text);
  clearTimeout(bubbleTimer);
  if (text) {
    bubbleTimer = setTimeout(function () {
      voiceBubble.classList.remove("show");
    }, 6000);
  }
}

function setMic(on) {
  micBtn.classList.toggle("on", on);
}

// ===== Чтение шага вслух =====
let speaking = false;

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = voiceLocales[lang];
  speaking = true;
  u.onend = u.onerror = function () {
    // небольшая пауза, чтобы микрофон не услышал хвост собственного голоса
    setTimeout(function () {
      speaking = false;
    }, 600);
  };
  speechSynthesis.speak(u);
}

function speakStep() {
  const r = recipes[currentId];
  const s = r && r.steps[cookStep];
  if (s) speak(s.text[lang]);
}

// ===== Что делать по команде =====
function stepMove(delta) {
  if (cookView.classList.contains("open")) {
    const total = recipes[currentId].steps.length;
    const target = cookStep + delta;
    if (target < 0) return;
    if (target >= total) {
      speak(vt("end"));
      showVoice(vt("end"));
      return;
    }
    cookMove(delta);
    speakStep();
  } else if (modal.classList.contains("open") && currentId && delta > 0) {
    openCook();
    speakStep();
  }
}

function handleVoice(raw) {
  const text = raw.toLowerCase().trim();
  showVoice("🎤 " + text);

  if (has(text, voiceWords.timer)) {
    if (has(text, voiceWords.stop)) {
      document.getElementById("timer-stop").click();
      return;
    }
    const min = parseTimer(text);
    if (min && min > 0 && min <= 180) startTimer(min);
    return;
  }

  if (has(text, voiceWords.stop)) {
    document.getElementById("timer-stop").click();
  } else if (has(text, voiceWords.cook)) {
    if (modal.classList.contains("open") && currentId) openCook();
  } else if (has(text, voiceWords.read)) {
    speakStep();
  } else if (has(text, voiceWords.next)) {
    stepMove(1);
  } else if (has(text, voiceWords.back)) {
    stepMove(-1);
  } else if (has(text, voiceWords.close)) {
    if (cookView.classList.contains("open")) closeCook();
    else modal.classList.remove("open");
  }
}

// ===== Прослушивание =====
let rec = null;
let listening = false;
let voiceLang = lang;

function startVoice() {
  if (!SR) {
    alert(vt("unsupported"));
    return;
  }

  // звук таймера можно включить только после нажатия кнопки, поэтому готовим его сразу
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();

  rec = new SR();
  rec.lang = voiceLocales[lang];
  rec.continuous = true;
  rec.interimResults = false;

  rec.onresult = function (e) {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (!e.results[i].isFinal || speaking) continue;
      handleVoice(e.results[i][0].transcript);
    }
  };

  rec.onerror = function (e) {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      listening = false;
      setMic(false);
      showVoice(vt("denied"));
    }
  };

  // браузер иногда сам останавливает прослушивание: тогда запускаем снова
  rec.onend = function () {
    if (!listening) return;
    setTimeout(function () {
      if (!listening) return;
      try { rec.start(); } catch (err) {}
    }, 300);
  };

  listening = true;
  voiceLang = lang;
  try { rec.start(); } catch (err) {}
  setMic(true);
  showVoice(vt("on"));
}

function stopVoice() {
  listening = false;
  if (rec) {
    rec.onend = null;
    try { rec.stop(); } catch (e) {}
  }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  setMic(false);
  showVoice("");
}

micBtn.addEventListener("click", function () {
  if (listening) stopVoice();
  else startVoice();
});

// кнопка видна только когда открыт рецепт или режим готовки
function updateMic() {
  const open = modal.classList.contains("open") || cookView.classList.contains("open");
  micBtn.classList.toggle("show", open);
  if (!open && listening) stopVoice();
}

new MutationObserver(updateMic).observe(modal, { attributes: true, attributeFilter: ["class"] });
new MutationObserver(updateMic).observe(cookView, { attributes: true, attributeFilter: ["class"] });

// при смене языка слушаем уже на новом языке
const applyLanguageBeforeVoice = applyLanguage;
applyLanguage = function () {
  applyLanguageBeforeVoice();
  if (listening && voiceLang !== lang) {
    stopVoice();
    startVoice();
  }
};