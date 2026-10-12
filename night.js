(function () {
  // ===== Кнопки над языками: тема, музыка, следующий трек =====
  const heroEl = document.querySelector(".hero");
  const tools = document.createElement("div");
  tools.className = "top-tools";
  tools.innerHTML = `
    <button class="tool-btn" id="tool-theme" title="Night / Day">🌙</button>
    <button class="tool-btn" id="tool-music" title="Music">🎵</button>
    <button class="tool-btn hidden" id="tool-next" title="Next track">⏭️</button>`;
  heroEl.insertBefore(tools, heroEl.firstChild);

  const themeBtn = document.getElementById("tool-theme");
  const musicBtn = document.getElementById("tool-music");
  const nextBtn = document.getElementById("tool-next");

  // ===== Ночная тема =====
  function setNight(on) {
    document.body.classList.toggle("night", on);
    themeBtn.textContent = on ? "☀️" : "🌙";
    saveJson("night", on);
  }

  themeBtn.addEventListener("click", function () {
    setNight(!document.body.classList.contains("night"));
  });
  setNight(loadJson("night", false));

  // ===== Музыка: сайт сам играет ноты =====
  // три "трека": аккорды, ноты-колокольчики, длина аккорда в секундах
  const tracks = [
    {
      name: "🍓 Pink Sunday", dur: 4, bellsPerChord: 4,
      chords: [
        [130.81, 164.81, 196.00, 246.94],
        [110.00, 130.81, 164.81, 196.00],
        [87.31, 110.00, 130.81, 164.81],
        [98.00, 123.47, 146.83, 164.81]
      ],
      bells: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]
    },
    {
      name: "🌙 Midnight Kitchen", dur: 5, bellsPerChord: 3,
      chords: [
        [110.00, 130.81, 164.81, 196.00],
        [73.42, 110.00, 130.81, 174.61],
        [87.31, 110.00, 130.81, 164.81],
        [82.41, 123.47, 146.83, 196.00]
      ],
      bells: [440.00, 523.25, 587.33, 659.25, 783.99, 880.00]
    },
    {
      name: "✨ Strawberry Pop", dur: 3, bellsPerChord: 5,
      chords: [
        [87.31, 110.00, 130.81, 164.81],
        [98.00, 123.47, 146.83, 164.81],
        [82.41, 123.47, 146.83, 196.00],
        [110.00, 130.81, 164.81, 196.00]
      ],
      bells: [659.25, 783.99, 880.00, 987.77, 1174.66, 1318.51]
    }
  ];

  let trackIdx = 0;
  let musicOn = false;
  let timer = null;
  let chordIdx = 0;
  let nextTime = 0;
  let bus = null;

  // "эхо комнаты": шум, который постепенно затихает
  function makeImpulse(seconds, decay) {
    const rate = audioCtx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = audioCtx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  // цепочка звука: вход → мягкий фильтр → сухой звук и эхо → громкость → колонки
  function buildBus() {
    const input = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;

    const dry = audioCtx.createGain();
    dry.gain.value = 0.7;
    const wet = audioCtx.createGain();
    wet.gain.value = 0.5;
    const conv = audioCtx.createConvolver();
    conv.buffer = makeImpulse(2.6, 3);
    const master = audioCtx.createGain();
    master.gain.value = 0;

    input.connect(filter);
    filter.connect(dry);
    filter.connect(conv);
    conv.connect(wet);
    dry.connect(master);
    wet.connect(master);
    master.connect(audioCtx.destination);
    return { input: input, master: master };
  }

  // мягкий аккорд: медленно нарастает и затихает
  function playChord(freqs, t, dur, dest) {
    freqs.forEach(function (f, i) {
      [f, f * 2].forEach(function (ff, k) {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = k === 0 ? "triangle" : "sine";
        osc.frequency.value = ff;
        osc.detune.value = (i - 1.5) * 4;
        const peak = k === 0 ? 0.07 : 0.025;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(peak, t + 1.4);
        g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.2);
        osc.connect(g);
        g.connect(dest);
        osc.start(t);
        osc.stop(t + dur + 1.3);
      });
    });
  }

  // одна нота-колокольчик
  function playBell(f, t, dest) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.9);
  }

  // раз в секунду заранее расписываем музыку на 16 секунд вперёд
  function tick() {
    if (!musicOn || !bus) return;
    const tr = tracks[trackIdx];

    while (nextTime < audioCtx.currentTime + 16) {
      playChord(tr.chords[chordIdx % tr.chords.length], nextTime, tr.dur, bus.input);
      for (let k = 0; k < tr.bellsPerChord; k++) {
        const f = tr.bells[Math.floor(Math.random() * tr.bells.length)];
        playBell(f, nextTime + 0.5 + Math.random() * (tr.dur - 1), bus.input);
      }
      nextTime += tr.dur;
      chordIdx++;
    }
    timer = setTimeout(tick, 1000);
  }

  function startMusic() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    bus = buildBus();
    bus.master.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0.6);

    musicOn = true;
    chordIdx = 0;
    nextTime = audioCtx.currentTime + 0.2;
    tick();

    musicBtn.classList.add("on");
    nextBtn.classList.remove("hidden");
    if (typeof showToast === "function") showToast(tracks[trackIdx].name);
  }

  function stopMusic() {
    musicOn = false;
    clearTimeout(timer);
    musicBtn.classList.remove("on");
    nextBtn.classList.add("hidden");

    if (bus) {
      const old = bus;
      bus = null;
      old.master.gain.cancelScheduledValues(audioCtx.currentTime);
      old.master.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
      setTimeout(function () {
        try { old.master.disconnect(); } catch (e) {}
      }, 1800);
    }
  }

  musicBtn.addEventListener("click", function () {
    if (musicOn) stopMusic();
    else startMusic();
  });

  nextBtn.addEventListener("click", function () {
    trackIdx = (trackIdx + 1) % tracks.length;
    stopMusic();
    startMusic();
  });
})();