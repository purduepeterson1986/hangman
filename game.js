/* ================= Snowman =================
   A word-guessing game for 2 players, with five levels from picture
   words for young children to a challenge for adults. Plain JavaScript. */
(function () {
  'use strict';

  var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  var COLORS = ['#4db5ff', '#ff5c8a', '#ffd23f', '#5fe3a1'];
  var ROUNDS = 5;        // words per game
  var BONUS = 5;         // extra points for finishing a word
  var LEVELS = {
    1: { name: 'Easy', lives: 8, size: '3 to 5 letters', hint: 'category', sample: '🐱 CAT',
         desc: 'Short words with a category to help. Each letter is read aloud.' },
    2: { name: 'Medium', lives: 7, size: '4 to 6 letters', hint: 'none', sample: 'FROG',
         desc: 'A little longer, with no hint. Each letter is read aloud.' },
    3: { name: 'Tricky', lives: 6, size: '5 to 7 letters', hint: 'none', sample: 'TURTLE',
         desc: 'No hints. Just the letters.' },
    4: { name: 'Hard', lives: 5, size: '7 to 9 letters', hint: 'none', sample: 'GRAVITY',
         desc: 'Longer words, and fewer wrong guesses to spare.' },
    5: { name: 'Expert', lives: 4, size: '8 to 13 letters', hint: 'none', sample: 'SERENDIPITY',
         desc: 'Long, tricky words with no hint, and only four wrong guesses.' }
  };
  var DIFFS = [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']];
  // How long a computer player "thinks" (ms) before it guesses.
  var THINK = { easy: [2800, 3200], medium: [2800, 3200], hard: [2800, 3200] };
  var STORE_KEY = 'hangman.settings.v1';
  var ROUND_PAUSE = 5000; // ms to pause after a word ends, before its result message appears
  var WIN_PAUSE = 6000;   // the same, after a solved word: a little longer, so the hero's attack can finish
  var RING = 276.46;     // circumference of the timer ring (2 x pi x 44)

  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function miniDisc(i, cls) { return '<span class="pdisc' + (cls ? ' ' + cls : '') + '" style="--pc:' + COLORS[i] + '">' + (i + 1) + '</span>'; }

  /* ================= Settings ================= */
  var settings = {
    count: 2,          // 1 or 2 players
    seats: [
      { name: '', type: 'human', level: 'medium' },
      { name: '', type: 'human', level: 'medium' },
      { name: '', type: 'human', level: 'medium' },
      { name: '', type: 'human', level: 'medium' }
    ],
    level: 1,
    sound: true,
    timer: 30,         // seconds per turn: 30, 15, or 0 for no turn timer
    together: false    // 2 players: true = play together (both get every point), false = against each other
  };

  function loadSettings() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!s) return;
      if (LEVELS[s.level]) settings.level = s.level;
      if (typeof s.sound === 'boolean') settings.sound = s.sound;
      if (s.timer === true) settings.timer = 30;          // older saved setting
      else if (s.timer === false) settings.timer = 0;
      else if (s.timer === 30 || s.timer === 15 || s.timer === 0) settings.timer = s.timer;
      if (s.count === 1 || s.count === 2) settings.count = s.count;
      if (typeof s.together === 'boolean') settings.together = s.together;
      if (Array.isArray(s.seats)) {
        for (var i = 0; i < 4; i++) {
          var a = s.seats[i]; if (!a) continue;
          settings.seats[i].name = typeof a.name === 'string' ? a.name.slice(0, 12) : '';
          settings.seats[i].type = a.type === 'cpu' ? 'cpu' : 'human';
          settings.seats[i].level = (a.level === 'easy' || a.level === 'hard') ? a.level : 'medium';
        }
      }
    } catch (e) { /* storage blocked: use defaults */ }
  }
  function saveSettings() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch (e) { /* ignore */ }
  }
  function seatNames() {
    var cpus = 0, i, out = [];
    for (i = 0; i < settings.count; i++) if (settings.seats[i].type === 'cpu') cpus++;
    var k = 0;
    for (i = 0; i < settings.count; i++) {
      var s = settings.seats[i], nm = s.name.trim();
      if (s.type === 'cpu') { k++; if (!nm) nm = cpus > 1 ? 'Computer ' + k : 'Computer'; }
      else if (!nm) nm = 'Player ' + (i + 1);
      out.push(nm);
    }
    return out;
  }

  function renderSeats() {
    var h = '';
    for (var i = 0; i < settings.count; i++) {
      var s = settings.seats[i];
      h += '<div class="seat" style="--pc:' + COLORS[i] + '" data-i="' + i + '">' + miniDisc(i) +
        '<input type="text" maxlength="12" autocomplete="off" autocapitalize="words" spellcheck="false" aria-label="Name for player ' + (i + 1) + '" placeholder="' + (s.type === 'cpu' ? 'Computer' : 'Player ' + (i + 1)) + '" value="' + esc(s.name) + '">' +
        '<div class="seat-opts">' +
        '<div class="segmented small type" role="radiogroup" aria-label="Who plays seat ' + (i + 1) + '">' +
        '<button type="button" class="seg' + (s.type === 'human' ? ' on' : '') + '" data-type="human">Person</button>' +
        '<button type="button" class="seg' + (s.type === 'cpu' ? ' on' : '') + '" data-type="cpu">Computer</button></div>' +
        '<div class="segmented small diff" role="radiogroup" aria-label="Computer skill"' + (s.type === 'cpu' ? '' : ' hidden') + '>' +
        DIFFS.map(function (d) { return '<button type="button" class="seg' + (s.level === d[0] ? ' on' : '') + '" data-diff="' + d[0] + '">' + d[1] + '</button>'; }).join('') +
        '</div></div></div>';
    }
    $('#seats').innerHTML = h;
  }
  function renderLevels() {
    $('#levels').innerHTML = [1, 2, 3, 4, 5].map(function (k) {
      var lv = LEVELS[k], on = settings.level === k;
      return '<button type="button" class="tile' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-level="' + k + '">' +
        '<span class="tile-num">Level ' + k + '</span>' +
        '<span class="tile-name">' + lv.name + '</span>' +
        '<span class="tile-sample">' + esc(lv.sample) + '</span>' +
        '<span class="tile-desc">' + lv.desc + '</span>' +
        '<span class="tile-size">' + lv.lives + ' wrong guesses &middot; ' + lv.size + '</span></button>';
    }).join('');
  }
  function renderCount() {
    $('#count').innerHTML = [1, 2].map(function (k) {
      var on = settings.count === k;
      return '<button type="button" class="seg' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-count="' + k + '">' +
        (k === 1 ? '1 player' : '2 players') + '</button>';
    }).join('');
  }
  function renderTimer() {
    $('#timer-opt').innerHTML = [[30, '30 seconds'], [15, '15 seconds'], [0, 'Off']].map(function (o) {
      var on = settings.timer === o[0];
      return '<button type="button" class="seg' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-timer="' + o[0] + '">' + o[1] + '</button>';
    }).join('');
  }
  function renderMode() {
    $('#mode-panel').hidden = settings.count !== 2;   // only means something with 2 players
    $('#mode-opt').innerHTML = [[false, 'Against each other'], [true, 'Together']].map(function (o) {
      var on = settings.together === o[0];
      return '<button type="button" class="seg' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-mode="' + o[0] + '">' + o[1] + '</button>';
    }).join('');
  }
  function renderSummary() {
    var cpu = 0, i;
    for (i = 0; i < settings.count; i++) if (settings.seats[i].type === 'cpu') cpu++;
    var who = (settings.count === 1 ? '1 player' : '2 players') + (cpu ? ' (' + (cpu === settings.count ? 'all computer' : cpu + ' computer') + ')' : '') +
      (settings.count === 2 ? (settings.together ? ', together' : ', against each other') : '');
    $('#summary').innerHTML = '<b>' + who + '</b> &middot; Level ' + settings.level + ' ' + LEVELS[settings.level].name + ' &middot; ' + ROUNDS + ' words' +
      ' &middot; ' + (settings.timer ? settings.timer + '-second turns' : 'No turn timer');
  }
  function renderSetup() { renderCount(); renderMode(); renderTimer(); renderSeats(); renderLevels(); renderSummary(); }

  function bindSetup() {
    $('#seats').addEventListener('input', function (e) {
      var row = e.target.closest('.seat'); if (!row || e.target.tagName !== 'INPUT') return;
      settings.seats[+row.dataset.i].name = e.target.value.slice(0, 12); saveSettings();
    });
    $('#seats').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var row = b.closest('.seat'), s = settings.seats[+row.dataset.i];
      if (b.dataset.type) s.type = b.dataset.type;
      if (b.dataset.diff) s.level = b.dataset.diff;
      saveSettings(); Sound.play('tick'); renderSeats(); renderSummary();
    });
    $('#count').addEventListener('click', function (e) {
      var b = e.target.closest('[data-count]'); if (!b) return;
      settings.count = +b.dataset.count; saveSettings(); Sound.play('tick'); renderSetup();
    });
    $('#mode-opt').addEventListener('click', function (e) {
      var b = e.target.closest('[data-mode]'); if (!b) return;
      settings.together = b.dataset.mode === 'true'; saveSettings(); Sound.play('tick'); renderSetup();
    });
    $('#timer-opt').addEventListener('click', function (e) {
      var b = e.target.closest('[data-timer]'); if (!b) return;
      settings.timer = +b.dataset.timer; saveSettings(); Sound.play('tick'); renderSetup();
    });
    $('#levels').addEventListener('click', function (e) {
      var b = e.target.closest('[data-level]'); if (!b) return;
      settings.level = +b.dataset.level; saveSettings(); Sound.play('tick'); renderLevels(); renderSummary();
    });
    $('#start-btn').addEventListener('click', function () { startGame(); });
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (el) { el.classList.toggle('active', el.id === id); });
  }

  /* ================= Sound ================= */
  var Sound = (function () {
    var ctx = null;
    function init() {
      if (ctx) return;
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* not supported */ } // iPhone/iPad: play sound even with the silent switch on
      try { var AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); } catch (e) { ctx = null; }
    }
    ['pointerdown', 'touchend', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, function () {
        init();
        if (ctx && ctx.state !== 'running') { try { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); } catch (e) { /* ignore */ } }
      }, true);
    });
    function tone(freq, dur, o) {
      if (!settings.sound || !ctx) return;
      o = o || {};
      try {
        var t0 = ctx.currentTime + (o.at || 0);
        var osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = o.type || 'triangle';
        osc.frequency.setValueAtTime(freq, t0);
        if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t0); osc.stop(t0 + dur + 0.05);
      } catch (e) { /* ignore */ }
    }
    var fx = {
      tick:  function () { tone(660, 0.06, { vol: 0.12 }); },
      start: function () { tone(392, 0.12, { vol: 0.2 }); tone(523, 0.12, { vol: 0.2, at: 0.09 }); tone(784, 0.22, { vol: 0.22, at: 0.18 }); },
      hit:   function () { tone(660, 0.12, { vol: 0.2 }); tone(990, 0.18, { vol: 0.2, at: 0.09 }); },
      miss:  function () { tone(180, 0.25, { type: 'square', to: 110, vol: 0.08 }); },
      out:   function () { [392, 330, 262].forEach(function (f, i) { tone(f, 0.25, { type: 'square', vol: 0.09, at: i * 0.16 }); }); },
      solve: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.2, { vol: 0.2, at: i * 0.1 }); }); },
      win:   function () { [523, 659, 784, 1047, 784, 1047, 1319].forEach(function (f, i) { tone(f, 0.22, { vol: 0.22, at: i * 0.11 }); }); },
      lose:  function () { [392, 330, 262].forEach(function (f, i) { tone(f, 0.3, { vol: 0.18, at: i * 0.18 }); }); }
    };
    return {
      init: init,
      play: function (name) { if (fx[name]) fx[name](); }
    };
  })();

  /* Reads a letter or word aloud (for young players). Silent when sound is off. */
  function speak(text) {
    if (!settings.sound) return;
    try {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85; u.pitch = 1.1; u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  /* ================= Confetti ================= */
  var Confetti = (function () {
    var cv = $('#confetti'), cx = cv.getContext('2d'), parts = [], raf = 0;
    function size() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    window.addEventListener('resize', size); size();
    function burst() {
      for (var i = 0; i < 140; i++) {
        parts.push({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 240, y: window.innerHeight * 0.35,
          vx: (Math.random() - 0.5) * 10, vy: -Math.random() * 11 - 3, g: 0.26,
          s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
          c: pick(COLORS.concat(['#ffe08a', '#ffffff'])), life: 1
        });
      }
      if (!raf) raf = requestAnimationFrame(step);
    }
    function step() {
      cx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(function (p) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.007;
        cx.save(); cx.globalAlpha = Math.max(p.life, 0); cx.translate(p.x, p.y); cx.rotate(p.r);
        cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore();
      });
      parts = parts.filter(function (p) { return p.life > 0 && p.y < cv.height + 30; });
      raf = parts.length ? requestAnimationFrame(step) : 0;
    }
    return { burst: burst };
  })();

  /* ================= Modal ================= */
  function openModal(html, buttons) {
    var m = $('#modal');
    m.innerHTML = html + '<div class="modal-actions">' + buttons.map(function (b, i) {
      return '<button type="button" class="btn ' + (b.cls || 'ghost') + '" data-b="' + i + '">' + b.label + '</button>';
    }).join('') + '</div>';
    m.onclick = function (e) {
      var b = e.target.closest('[data-b]'); if (!b) return;
      var fn = buttons[+b.dataset.b].fn; closeModal(); if (fn) fn();
    };
    $('#modal-layer').hidden = false;
    var first = m.querySelector('.btn.primary') || m.querySelector('.btn'); if (first) first.focus();
  }
  function closeModal() { $('#modal-layer').hidden = true; $('#modal').innerHTML = ''; }
  function modalOpen() { return !$('#modal-layer').hidden; }
  function confirmModal(ico, title, text, yes, fn) {
    openModal('<div class="modal-ico">' + ico + '</div><h3>' + title + '</h3><p>' + text + '</p>',
      [{ label: 'Keep playing', cls: 'ghost' }, { label: yes, cls: 'danger', fn: fn }]);
  }

  var toastTimer = 0;
  // The word is solved: stays up while the hero beats the creature.
  function winToast() {
    toast('🏹', 'Hooray! ' + SCENE.hero().name + ' beat ' + SCENE.foe().name + '!', 4000);
  }
  // ms: how long the message stays up (most stay up for just under a second)
  function toast(ico, text, ms) {
    var el = $('#toast');
    el.innerHTML = '<span class="toast-ico">' + ico + '</span><span>' + text + '</span>';
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 950);
  }

  /* ================= Game state ================= */
  var G = null;   // the current game, or null on the settings screen
  var gen = 0;    // bumped whenever the flow changes, so stale timers do nothing

  function inProgress() { return !!G && G.phase !== 'over' && G.round > 0; }

  function startGame() {
    closeModal();
    stopClock();
    var names = seatNames();
    gen++;
    G = {
      level: settings.level, lv: LEVELS[settings.level], n: settings.count, round: 0, used: {},
      seats: names.map(function (nm, i) {
        return { name: nm, type: settings.seats[i].type, level: settings.seats[i].level, score: 0, wrong: 0, out: false };
      }),
      entry: null, w: '', guessed: {}, cur: 0, phase: 'busy', last: '', solvedBy: -1,
      solving: false, typed: '', wrong: 0,
      together: settings.together && settings.count === 2   // both players get every point
    };
    $('#players').setAttribute('style', '--n: ' + G.n);
    showScreen('game');
    Sound.play('start');
    nextRound();
  }

  function pickEntry() {
    var bank = window.HANGMAN_WORDS[G.level];
    var free = bank.filter(function (e) { return !G.used[e.w]; });
    if (!free.length) { G.used = {}; free = bank; }
    return pick(free);
  }

  function nextRound() {
    if (!G) return;
    var token = ++gen;
    G.round++;
    if (G.round > ROUNDS) { gameOver(); return; }
    G.entry = pickEntry();
    G.w = G.entry.w;
    G.used[G.w] = true;
    G.guessed = {};
    G.last = '';
    G.solvedBy = -1;
    G.solving = false;
    G.typed = '';
    G.wrong = 0;   // misses for this word, shared by all players
    G.snap = true; // the creature starts at its place without walking
    $('#scene').innerHTML = SCENE.html();   // a new hero and creature, paired at random, for every word
    G.cur = (G.round - 1) % G.n;       // the starting player rotates each word
    G.phase = 'busy';
    G.note = 'Word ' + G.round + ' starts';
    render();
    setTimeout(function () { if (token === gen) beginTurn(); }, 700);
  }

  function beginTurn() {
    if (!G || G.phase !== 'busy') return;
    G.phase = 'turn';
    render();
    startClock();
    var seat = G.seats[G.cur];
    if (seat.type === 'cpu') {
      var token = ++gen, p = G.cur, t = THINK[seat.level];
      setTimeout(function () {
        if (token !== gen || !G || G.phase !== 'turn' || G.cur !== p) return;
        guess(p, AI.choose(p));
      }, t[0] + rnd(t[1] - t[0]));
    }
  }

  // Points go to the player who earned them, or to every player when playing together.
  function addPoints(p, n) {
    G.seats.forEach(function (s, i) { if (G.together || i === p) s.score += n; });
  }

  function countIn(letter) {
    var n = 0;
    for (var i = 0; i < G.w.length; i++) if (G.w[i] === letter) n++;
    return n;
  }
  function isSolved() {
    for (var i = 0; i < G.w.length; i++) if (!G.guessed[G.w[i]]) return false;
    return true;
  }

  /* ---------- Turn timer ---------- */
  var clockTimer = 0, clockEnd = 0;
  function startClock() {
    stopClock();
    if (!G || !settings.timer) { renderClock(); return; }
    clockEnd = Date.now() + settings.timer * 1000;
    clockTimer = setInterval(tickClock, 200);
    renderClock();
  }
  function stopClock() {
    if (clockTimer) { clearInterval(clockTimer); clockTimer = 0; }
  }
  function tickClock() {
    if (!G || G.phase !== 'turn') { stopClock(); renderClock(); return; }
    if (Date.now() >= clockEnd) { stopClock(); renderClock(); timeUp(); return; }
    renderClock();
  }
  // The ring shows the time left in this turn. Idle between turns it shows a full 30.
  // After Solve is pressed the clock stops, shown as a dash.
  function renderClock() {
    var el = $('#clock'); if (!el) return;
    el.hidden = !settings.timer;
    if (!G || !settings.timer) return;
    var running = !!clockTimer && G.phase === 'turn';
    var left = running ? Math.max(0, Math.ceil((clockEnd - Date.now()) / 1000)) : settings.timer;
    el.classList.toggle('warn', running && left <= 10 && left > 5);
    el.classList.toggle('hot', running && left <= 5);
    el.classList.toggle('idle', !running);
    $('#ring').style.strokeDashoffset = (RING * (1 - left / settings.timer)).toFixed(1);
    $('#clock-num').textContent = G.phase === 'turn' && !running ? '—' : left;
  }
  // A miss (wrong letter, time out, or wrong answer) moves the creature one stone closer to the hero.
  // When it reaches the hero the word is over and nobody gets the bonus; points already earned stay.
  function missed(p, note, ico, text) {
    G.wrong++;
    G.note = note;
    G.phase = 'busy';
    var token = ++gen;
    Sound.play('miss');
    var lost = G.wrong >= G.lv.lives;
    if (lost) {
      setTimeout(function () { Sound.play('out'); }, 300);
      var fn = SCENE.foe().name;
      toast(SCENE.foe().emoji, 'Oh no! ' + fn.charAt(0).toUpperCase() + fn.slice(1) + ' got ' + SCENE.hero().name + '!', 4000);   // stays up while the creature catches the hero
    } else {
      toast(ico, text);
    }
    render();
    if (lost) {
      setTimeout(function () { if (token === gen) endRound(-1); }, 1000);
      return;
    }
    setTimeout(function () { if (token === gen) passTurn(p); }, 950);
  }

  // Out of time before a letter or Solve: it counts as a miss and the turn passes.
  function timeUp() {
    if (!G || G.phase !== 'turn') return;
    G.solving = false;
    G.typed = '';
    missed(G.cur, "Time's up", '⏰', "Time's up");
  }

  function guess(p, letter) {
    if (!G || G.phase !== 'turn' || p !== G.cur || G.guessed[letter]) return;
    stopClock();
    G.guessed[letter] = true;
    G.last = letter;
    G.phase = 'busy';
    var token = ++gen;
    var hits = countIn(letter);
    if (!hits) {
      missed(p, 'Not in the word', '❌', 'No ' + letter);
      return;
    }
    addPoints(p, hits);
    G.note = 'Good guess! Go again';
    Sound.play('hit');
    if (G.level <= 2) speak(letter.toLowerCase());   // lowercase, so the voice says just the letter
    if (isSolved()) winToast();
    else toast('✅', 'Yes! ' + letter + (hits > 1 ? ' &times;' + hits : ''));
    render();
    if (isSolved()) {
      addPoints(p, BONUS);
      G.solvedBy = p;
      endRound(p);   // the 5-second pause in endRound is the only wait
      return;
    }
    // A correct letter earns another turn for the same player (the clock starts over).
    setTimeout(function () { if (token === gen) beginTurn(); }, 950);
  }

  /* ---------- Solve the whole word (one turn) ---------- */
  function startSolve() {
    if (!G || G.phase !== 'turn' || G.seats[G.cur].type !== 'human') return;
    stopClock();   // pressing Solve counts as the player's move, so the clock stops
    G.solving = true;
    G.typed = '';
    render();
  }
  function cancelSolve() {
    if (!G || !G.solving) return;
    G.solving = false;
    G.typed = '';
    render();
  }
  function typeLetter(l) {
    if (!G || !G.solving || G.phase !== 'turn') return;
    if (G.typed.length < G.w.length) { G.typed += l; render(); }
  }
  function eraseLetter() {
    if (!G || !G.solving || G.phase !== 'turn') return;
    G.typed = G.typed.slice(0, -1);
    render();
  }
  function submitSolve() {
    if (!G || !G.solving || G.phase !== 'turn' || G.typed.length !== G.w.length) return;
    stopClock();
    var p = G.cur;
    var answer = G.typed;
    G.solving = false;
    G.typed = '';
    G.phase = 'busy';
    if (answer === G.w) {
      // Points for every letter that was still hidden, plus the finishing bonus.
      var newly = 0, i;
      for (i = 0; i < G.w.length; i++) if (!G.guessed[G.w[i]]) newly++;
      for (i = 0; i < G.w.length; i++) G.guessed[G.w[i]] = true;
      addPoints(p, newly + BONUS);
      G.solvedBy = p;
      G.last = '';
      G.note = 'Solved!';
      Sound.play('solve');
      winToast();
      render();
      endRound(p);   // the 5-second pause in endRound is the only wait
      return;
    }
    // A wrong answer costs one chance and the turn, the same as a wrong letter.
    missed(p, 'Not that word', '❌', 'Not that word');
  }

  function passTurn(p) {
    if (!G) return;
    var next = (p + 1) % G.n;   // no one is ever out now, so the turn just goes to the next seat
    G.cur = next;
    G.phase = 'busy';
    G.note = 'Next up: ' + esc(G.seats[next].name);
    render();
    var token = ++gen;
    setTimeout(function () { if (token === gen) beginTurn(); }, 650);
  }

  function endRound(solver) {
    if (!G) return;
    stopClock();
    G.phase = 'roundover';
    G.solvedBy = solver;
    var token = ++gen;
    render();
    SCENE.end($('#scene'), solver >= 0);   // the hero wins, or the creature gets the hero
    // Pause so the players can see the finished word on the board before the message appears.
    setTimeout(function () { if (token === gen && G && G.phase === 'roundover') showRoundEnd(solver, token); }, solver >= 0 ? WIN_PAUSE : ROUND_PAUSE);
  }

  function showRoundEnd(solver, token) {
    var solved = solver >= 0;
    var last = G.round >= ROUNDS;
    var title = solved ? (G.together ? 'You got it together!' : esc(G.seats[solver].name) + ' got it!') : 'Out of chances!';
    var text = solved ? 'Bonus +' + BONUS + ' points for finishing the word.' : 'Nobody finished this word. Here it is:';
    openModal('<div class="modal-ico">' + (solved ? '🎉' : '🙁') + '</div><h3>' + title + '</h3><p>' + text + '</p>' +
      '<div class="answer">' + G.w + '</div>',
      [{ label: last ? 'See results' : 'Next word', cls: 'primary', fn: advance }]);
    Sound.play(solved ? 'solve' : 'lose');
    // Wait a moment so the reading of the last letter is not cut off by the whole word.
    setTimeout(function () { if (token === gen) speak(G.w.toLowerCase()); }, 2000);
    if (G.seats.every(function (s) { return s.type === 'cpu'; })) {
      setTimeout(function () { if (token === gen && G && G.phase === 'roundover') advance(); }, 3200);
    }
  }

  function advance() {
    if (!G || G.phase !== 'roundover') return;
    closeModal();
    nextRound();
  }

  function gameOver() {
    stopClock();
    G.phase = 'over';
    ++gen;
    render();
    var ranked = G.seats.map(function (s, i) { return { s: s, i: i }; })
      .sort(function (a, b) { return b.s.score - a.s.score || a.i - b.i; });
    var top = ranked[0].s.score;
    var winners = ranked.filter(function (r) { return r.s.score === top; });
    var title = G.together ? 'Great teamwork!' : G.n === 1 ? 'Game over' : winners.length === 1 ? esc(winners[0].s.name) + ' wins!' : 'It is a tie!';
    var rows = ranked.map(function (r) {
      return '<div class="score-row' + (r.s.score === top ? ' lead' : '') + '">' + miniDisc(r.i, 'sm') +
        '<span class="nm">' + esc(r.s.name) + '</span><span class="sc">' + r.s.score + '</span></div>';
    }).join('');
    openModal('<div class="modal-ico">🏆</div><h3>' + title + '</h3><p>' + (G.together ? 'You scored ' + top + ' points together in ' + ROUNDS + ' words' : 'After ' + ROUNDS + ' words') + '</p><div class="scores">' + rows + '</div>', [
      { label: 'Play again', cls: 'primary', fn: startGame },
      { label: 'Change settings', cls: 'ghost', fn: toSettings }
    ]);
    Sound.play('win');
    Confetti.burst();
    setTimeout(function () { Confetti.burst(); }, 900);
  }

  function toSettings() {
    if (inProgress()) {
      confirmModal('⚙️', 'Leave this game?', 'The scores for this game will be lost.', 'Go to settings', doSettings);
    } else {
      doSettings();
    }
  }
  function doSettings() {
    gen++;
    stopClock();
    G = null;
    closeModal();
    renderSetup();
    showScreen('setup');
  }

  /* ================= Rendering ================= */
  function render() {
    if (!G) return;
    renderRound();
    renderHint();
    renderPlayers();
    renderStatus();
    renderScene();
    renderClock();
    renderWord();
    renderKeys();
  }

  function renderRound() {
    $('#round-info').innerHTML = '<b>Word ' + Math.min(G.round, ROUNDS) + ' of ' + ROUNDS + '</b> &middot; Level ' + G.level +
      '<span class="long"> ' + G.lv.name + '</span>';
  }

  function renderHint() {
    var e = G.entry, h;
    if (!e) { $('#hint').innerHTML = ''; return; }
    if (G.lv.hint === 'picture') h = '<div class="picture" aria-hidden="true">' + e.e + '</div>';
    else if (G.lv.hint === 'category') h = '<div class="chip">Category: <b>' + esc(e.c) + '</b></div>';
    else h = '';   // Levels 2 to 5: no hint, so this area is left empty
    $('#hint').innerHTML = h;
  }

  function seatTag(s, i) {
    var active = (G.phase === 'turn' || G.phase === 'busy') && i === G.cur;
    if (active && G.phase === 'turn') return s.type === 'cpu' ? 'Thinking…' : 'Your turn';
    if (active) return 'Up next';
    return s.type === 'cpu' ? s.level.charAt(0).toUpperCase() + s.level.slice(1) + ' computer' : 'Person';
  }

  function renderPlayers() {
    $('#players').innerHTML = G.seats.map(function (s, i) {
      var active = (G.phase === 'turn' || G.phase === 'busy') && i === G.cur;
      return '<div class="pcard' + (active ? ' active' : '') + '" style="--pc:' + COLORS[i] + '">' +
        miniDisc(i) +
        '<div class="pcard-text"><div class="pcard-name">' + esc(s.name) + '</div>' +
        '<div class="pcard-tag">' + seatTag(s, i) + '</div></div>' +
        '<div class="pcard-score"><b>' + s.score + '</b><span>pts</span></div></div>';
    }).join('');
  }

  function renderStatus() {
    var seat = G.seats[G.cur], html;
    if (G.phase === 'turn' && seat.type === 'cpu') {
      html = esc(seat.name) + ' is thinking<span class="dots"></span>';
    } else if (G.phase === 'turn' && G.solving) {
      html = esc(seat.name) + ', spell the whole word <span class="sub">' + G.typed.length + ' of ' + G.w.length + '</span>';
    } else if (G.phase === 'turn') {
      html = esc(seat.name) + ', your turn <span class="sub">tap a letter</span>';
    } else if (G.phase === 'busy') {
      html = G.note || '';
    } else if (G.phase === 'roundover') {
      html = 'Word over';
    } else {
      html = 'Game over';
    }
    $('#status-main').innerHTML = miniDisc(G.cur, 'sm') + '<span class="txt">' + html + '</span>';
  }

  // How many stones the creature has walked: 8 minus the chances for this level, plus the misses so far.
  // So the stones still ahead of it always equal the chances left.
  function scenePos() { return Math.max(0, Math.min(SCENE.STEPS, SCENE.STEPS - G.lv.lives + G.wrong)); }
  function renderScene() {
    var root = $('#scene'); if (!root) return;
    SCENE.update(root, scenePos(), !!G.snap);
    G.snap = false;
    var left = Math.max(0, G.lv.lives - G.wrong);
    root.setAttribute('aria-label', left + ' ' + (left === 1 ? 'step' : 'steps') + ' left before ' +
      SCENE.foe().name + ' reaches ' + SCENE.hero().name);
  }

  function renderWord() {
    var reveal = G.phase === 'roundover' || G.phase === 'over';
    var h = '';
    for (var i = 0; i < G.w.length; i++) {
      var ch = G.w[i], found = !!G.guessed[ch];
      var typed = G.solving && i < G.typed.length ? G.typed[i] : '';
      var cls = 'wl' + (found ? ' found' : '') + (found && ch === G.last ? ' pop' : '') +
        (reveal && !found ? ' missed' : '') + (typed ? ' typed' : '');
      var shown = reveal ? ch : (typed || (found ? ch : ''));
      h += '<span class="' + cls + '">' + shown + '</span>';
    }
    $('#word').innerHTML = h;
    // Lets the CSS size every letter box so the whole word fits on one line.
    $('#word').style.setProperty('--n', G.w.length);
  }

  function renderKeys() {
    var myTurn = G.phase === 'turn' && G.seats[G.cur].type === 'human';
    var alpha = true;   // Every level: A to Z order with big letter buttons
    function key(l) {
      var used = !!G.guessed[l], inWord = G.w.indexOf(l) >= 0;
      var cls = 'key' + (alpha ? ' big' : '') + (used ? (inWord ? ' hit' : ' miss') : '');
      // While spelling the whole word, every letter can be typed, even one already guessed.
      var off = G.solving ? !myTurn : (used || !myTurn);
      return '<button type="button" class="' + cls + '" data-l="' + l + '"' +
        (off ? ' disabled' : '') + ' aria-label="Letter ' + l + '">' + l + '</button>';
    }
    // An empty bar keeps the same space when it is not your turn, so nothing above the keyboard jumps.
    var bar = '<div class="solve-bar solve-empty" aria-hidden="true"></div>';
    if (myTurn && !G.solving) {
      bar = '<div class="solve-bar"><button type="button" class="btn solve-go" data-act="start">Solve the word</button></div>';
    } else if (myTurn && G.solving) {
      bar = '<div class="solve-bar">' +
        '<button type="button" class="btn ghost" data-act="erase">&#9003; Erase</button>' +
        '<button type="button" class="btn ghost" data-act="cancel">Cancel</button>' +
        '<button type="button" class="btn primary" data-act="submit"' + (G.typed.length === G.w.length ? '' : ' disabled') + '>Check my answer</button>' +
        '</div>';
    }
    $('#keys').classList.toggle('qwerty', !alpha);   // Levels 3 to 5: larger letter boxes
    $('#solve').innerHTML = bar;
    $('#keys').innerHTML = (alpha
      ? '<div class="kb-alpha">' + ALPHA.map(function (l) { return key(l); }).join('') + '</div>'
      : QWERTY.map(function (row) {
          return '<div class="kb-row">' + row.split('').map(function (l) { return key(l); }).join('') + '</div>';
        }).join(''));
  }

  /* ================= Computer players ================= */
  var AI = (function () {
    var everyWord = null;
    function allWords() {
      if (!everyWord) {
        everyWord = [];
        Object.keys(window.HANGMAN_WORDS).forEach(function (k) {
          window.HANGMAN_WORDS[k].forEach(function (e) { everyWord.push(e.w); });
        });
      }
      return everyWord;
    }
    function levelWords() { return window.HANGMAN_WORDS[G.level].map(function (e) { return e.w; }); }
    function unusedLetters() { return ALPHA.filter(function (l) { return !G.guessed[l]; }); }
    // What a player can see: the revealed letters, with null for each blank.
    function shownPattern() {
      var pat = [];
      for (var i = 0; i < G.w.length; i++) pat.push(G.guessed[G.w[i]] ? G.w[i] : null);
      return pat;
    }
    // Could this word be the answer, given only what has been revealed so far?
    function fits(w, pat) {
      if (w.length !== pat.length) return false;
      for (var i = 0; i < w.length; i++) {
        if (pat[i] ? w[i] !== pat[i] : G.guessed[w[i]]) return false;
      }
      return true;
    }
    function choose(p) {
      var diff = G.seats[p].level, unused = unusedLetters();
      if (!unused.length) return null;
      // Easy: a random letter, so a child can beat it.
      if (diff === 'easy') return pick(unused);
      var pat = shownPattern();
      var pool = diff === 'hard' ? allWords() : levelWords();
      var cands = pool.filter(function (w) { return fits(w, pat); });
      if (!cands.length) return pick(unused);
      // Count how many possible words each unused letter appears in.
      var score = {};
      unused.forEach(function (l) { score[l] = 0; });
      cands.forEach(function (w) {
        var seen = {};
        for (var i = 0; i < w.length; i++) {
          var c = w[i];
          if (score[c] !== undefined && !seen[c]) { seen[c] = true; score[c]++; }
        }
      });
      var ranked = unused.slice().sort(function (a, b) { return score[b] - score[a] || (Math.random() - 0.5); });
      // Hard always takes the best letter; Medium picks among its top three.
      return diff === 'hard' ? ranked[0] : pick(ranked.slice(0, 3));
    }
    return { choose: choose };
  })();

  /* ================= Wiring ================= */
  function bindGame() {
    function onKeyClick(e) {
      if (!G) return;
      var a = e.target.closest('[data-act]');
      if (a) {
        if (a.disabled) return;
        var act = a.dataset.act;
        if (act === 'start') startSolve();
        else if (act === 'erase') eraseLetter();
        else if (act === 'cancel') cancelSolve();
        else if (act === 'submit') submitSolve();
        return;
      }
      var b = e.target.closest('.key'); if (!b || b.disabled) return;
      if (G.solving) typeLetter(b.dataset.l);
      else guess(G.cur, b.dataset.l);
    }
    $('#keys').addEventListener('click', onKeyClick);
    $('#solve').addEventListener('click', onKeyClick);
    document.addEventListener('keydown', function (e) {
      if (!G || G.phase !== 'turn' || modalOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
      if (G.seats[G.cur].type !== 'human') return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (G.solving) {
        if (e.key === 'Enter') { e.preventDefault(); submitSolve(); }
        else if (e.key === 'Backspace') { e.preventDefault(); eraseLetter(); }
        else if (e.key === 'Escape') { cancelSolve(); }
        else if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); typeLetter(e.key.toUpperCase()); }
        return;
      }
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      e.preventDefault();
      guess(G.cur, e.key.toUpperCase());
    });
    $('#sound-btn').addEventListener('click', function () {
      settings.sound = !settings.sound; saveSettings(); updateSoundButton();
      if (settings.sound) Sound.play('tick');
    });
    $('#fs-btn').addEventListener('click', function () {
      try {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      } catch (e) { /* not supported */ }
    });
    $('#restart-btn').addEventListener('click', function () {
      if (!G) return;
      if (inProgress()) confirmModal('🔄', 'Start over?', 'This game starts again from word 1.', 'Start over', startGame);
      else startGame();
    });
    $('#menu-btn').addEventListener('click', toSettings);
  }

  function updateSoundButton() {
    var b = $('#sound-btn');
    b.classList.toggle('off', !settings.sound);
    b.setAttribute('aria-label', settings.sound ? 'Sound on' : 'Sound off');
    b.title = settings.sound ? 'Sound on' : 'Sound off';
  }

  loadSettings();
  bindSetup();
  bindGame();
  updateSoundButton();
  renderSetup();
  showScreen('setup');
})();
