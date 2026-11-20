/* ================= The path scene =================
   A hero stands on the left. A bad creature starts on the right and walks one stepping
   stone closer with every miss. There are 8 stones, coloured green, then yellow, then red.
   On harder levels (fewer chances) the creature starts part of the way along, so the
   stones still ahead of it always equal the chances left.
   Last miss: the creature catches the hero (in a fun way). Word solved: the hero wins.
   The drawings of Legolas and the spider come from Hobbit Land. */
(function () {
  'use strict';

  var STEPS = 8;
  var GROUND = 210;          // y of the ground line in the scene
  var HERO_X = 120;          // where the hero stands
  var HERO_S = 2.8;          // hero drawing scale
  var FOE_S = 1.8;           // creature drawing scale
  var FOE_START = 940;       // where the creature waits before its first step
  function stoneX(k) { return 860 - (k - 1) * 82; }   // stone 1 is nearest the creature, stone 8 nearest the hero
  function foeX(pos) { return pos <= 0 ? FOE_START : stoneX(Math.min(pos, STEPS)); }

  /* ---------- Legolas (from Hobbit Land) ---------- */
  function limb(cls, d, col, w, end) {
    return '<g class="' + cls + '"><path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>' + (end || '') + '</g>';
  }
  function hand(x, y, c) { return '<circle cx="' + x + '" cy="' + y + '" r="1.25" fill="' + (c || '#ecc29c') + '"/>'; }
  // An elf of Lórien: tall and slim, long hair, grey-green cloak, a bow across the back. Feet at (0,0).
  function elfArt(hair) {
    var h = hair || '#e9cf72', skin = '#f2dcbc';
    function boot(x) { return '<path d="M' + (x - 1.8) + ',-4 h3.2 l.4,4 h-4.2 Z" fill="#6b5238"/>'; }
    return '' +
      '<path d="M-4,-46 C-8,-34 -11,-18 -12.6,-5 C-8.6,-3.6 -5,-3.8 -2,-5 C-3,-18 -2,-34 0,-46 Z" fill="#a9bba2" stroke="#6f8a68" stroke-width=".5"/>' +
      limb('leg-a', 'M-1.6,-16 L-1.8,-3', '#5a6a4a', 2.2, boot(-1.8)) + limb('leg-b', 'M1.6,-16 L1.8,-3', '#4e5e40', 2.2, boot(1.8)) +
      '<path d="M-6.4,-48 Q-11,-34 -5,-21" stroke="#8a6a3a" stroke-width="1.1" fill="none"/><path d="M-6.4,-48 L-5,-21" stroke="#efe6cc" stroke-width=".35"/>' +
      '<path d="M-4.6,-44.6 C-6,-36 -6.4,-24 -6.6,-14 L6.6,-14 C6.4,-24 6,-36 4.6,-44.6 Q0,-46 -4.6,-44.6 Z" fill="#9dbf96" stroke="#6f8a68" stroke-width=".6"/>' +
      '<path d="M2.4,-44 C3.6,-34 4,-24 4,-14.4 L6.6,-14 C6.4,-24 6,-36 4.6,-44.6 Z" fill="#86a880"/>' +
      '<path d="M0,-25 V-14.2" stroke="#6f8a68" stroke-width=".5"/><path d="M-6,-27.4 H6" stroke="#8a6a3a" stroke-width="1.3"/>' +
      limb('arm-b', 'M-4,-43 Q-7.4,-36 -6.6,-29.6', '#9dbf96', 2, hand(-6.6, -28.8, skin)) +
      limb('arm-a', 'M4,-43 Q7.4,-36 6.6,-29.6', '#9dbf96', 2, hand(6.6, -28.8, skin)) +
      '<path d="M-1.2,-48.4 H1.2 V-45 H-1.2 Z" fill="' + skin + '"/>' +
      '<path d="M-3.4,-51.4 L-8.4,-55 L-3.2,-49 Z M3.4,-51.4 L8.4,-55 L3.2,-49 Z" fill="' + skin + '" stroke="#c8a888" stroke-width=".3"/>' +
      '<path d="M-4.2,-53 C-6.6,-46 -6.2,-40 -4.8,-36.4 L-3,-41 L-3.2,-49 Z M4.2,-53 C6.6,-46 6.2,-40 4.8,-36.4 L3,-41 L3.2,-49 Z" fill="' + h + '"/>' +
      '<ellipse cx="0" cy="-51" rx="3.6" ry="4.3" fill="' + skin + '"/>' +
      '<path d="M-4.4,-51.6 C-4.8,-57.6 -2,-59.2 0,-59.2 C2,-59.2 4.8,-57.6 4.4,-51.6 C3.6,-54.4 1.6,-55.2 0,-55 C-1.6,-55.2 -3.6,-54.4 -4.4,-51.6 Z" fill="' + h + '"/>' +
      '<path d="M-4.2,-54.2 Q0,-55.8 4.2,-54.2" stroke="#f0dc8c" stroke-width=".55" fill="none"/>' +
      '<path d="M-2.2,-52.4 H-0.6 M0.6,-52.4 H2.2" stroke="#8a6a3a" stroke-width=".4"/>' +
      '<circle cx="-1.4" cy="-51.2" r=".5" fill="#1a3a30"/><circle cx="1.4" cy="-51.2" r=".5" fill="#1a3a30"/>' +
      '<path d="M-0.9,-48.6 Q0,-48.1 0.9,-48.6" stroke="#b07a6a" stroke-width=".4" fill="none"/>' +
      '<path d="M0,-45.6 C-1.6,-44.6 -1.6,-43 0,-42.4 C1.6,-43 1.6,-44.6 0,-45.6 Z" fill="#7fae5a" stroke="#c9a449" stroke-width=".4"/>';
  }

  /* ---------- The spider (Shelob, from Hobbit Land) ---------- */
  // Drawn facing right with her feet on the ground at (0,0): a big round body, long jointed legs, a cluster of eyes.
  function spiderArt() {
    function leg(hx, hy, kx, ky, fx, w) {
      var d = 'M' + hx + ',' + hy + ' Q' + kx + ',' + ky + ' ' + fx + ',0';
      return '<path d="' + d + '" stroke="#7a6452" stroke-width="' + (w + 1.6) + '" fill="none" stroke-linecap="round"/>' +
        '<path d="' + d + '" stroke="#2e231d" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>';
    }
    function eye(x, y, r) {
      return '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 2.4).toFixed(1) + '" fill="#c8ff7a" opacity=".25"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#d8ff8a"/>' +
        '<circle cx="' + (x + r * 0.3).toFixed(1) + '" cy="' + y + '" r="' + (r * 0.45).toFixed(1) + '" fill="#1a2208"/>';
    }
    var far = leg(4, -18, 20, -44, 40, 2.4) + leg(2, -17, 10, -42, 22, 2.4) + leg(-4, -18, -8, -42, -16, 2.4) + leg(-8, -19, -22, -40, -34, 2.4);
    var near = leg(8, -16, 30, -40, 48, 3.2) + leg(6, -15, 18, -38, 30, 3.2) + leg(-2, -16, -2, -38, -8, 3.2) + leg(-6, -17, -16, -36, -26, 3.2);
    return '<ellipse cx="2" cy="1" rx="44" ry="5" fill="rgba(20,12,8,.3)"/>' +
      '<g class="sp-legs l">' + far + '</g>' +
      '<ellipse cx="-16" cy="-26" rx="22" ry="17" fill="#3b2d25" stroke="#8a725e" stroke-width="1.6"/>' +
      '<path d="M-28,-30 Q-16,-38 -4,-30 M-26,-22 Q-16,-27 -6,-22" stroke="#9a7e62" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<ellipse cx="-22" cy="-34" rx="7" ry="3.4" fill="#6a5444" opacity=".7"/>' +
      '<ellipse cx="12" cy="-20" rx="11" ry="9" fill="#43332a" stroke="#8a725e" stroke-width="1.4"/>' +
      eye(16, -24, 1.7) + eye(20.5, -22.4, 1.7) + eye(13, -20.6, 1.2) + eye(18.4, -18.6, 1.3) + eye(22.4, -18, 1) + eye(15.2, -27, 1) +
      '<path d="M18,-12.5 q1.4,3.4 -.6,5.4 M21.4,-13 q1.6,3 0,5" stroke="#e8dcc0" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<g class="sp-legs r">' + near + '</g>';
  }

  // More heroes and creatures can be added to these lists; one of each is picked at random every game.
  var HEROES = [{ id: 'legolas', name: 'Legolas', art: function () { return elfArt(); } }];
  var FOES = [{ id: 'spider', name: 'the spider', emoji: '🕷️', art: spiderArt, facesRight: true }];

  var hero = HEROES[0], foe = FOES[0];

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function stoneClass(k) { return k <= 5 ? 'st-g' : k <= 7 ? 'st-y' : 'st-r'; }

  // Grass tufts along the ground, in fixed places so the scene looks the same each time.
  function tufts() {
    var out = '';
    for (var k = 0; k < 14; k++) {
      var x = 30 + ((k * 151) % 940), y = GROUND + 8 + (k % 3) * 9;
      out += '<path d="M' + x + ',' + y + ' l-4,-9 M' + x + ',' + y + ' l0,-11 M' + x + ',' + y + ' l4,-9" class="tuft"/>';
    }
    return out;
  }

  // Builds the whole scene with a new hero and creature picked at random.
  function html() {
    hero = pick(HEROES);
    foe = pick(FOES);
    var stones = '';
    for (var k = 1; k <= STEPS; k++) {
      stones += '<ellipse class="stone ' + stoneClass(k) + '" data-k="' + k + '" cx="' + stoneX(k) + '" cy="' + (GROUND + 4) + '" rx="30" ry="8"/>';
    }
    var flip = foe.facesRight ? -FOE_S : FOE_S;   // the creature always faces left, toward the hero
    return '<svg viewBox="0 30 1000 215" class="scene-svg" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
      '<rect x="0" y="' + GROUND + '" width="1000" height="40" rx="14" class="ground"/>' +
      '<g class="tufts">' + tufts() + '</g>' +
      '<g class="stones">' + stones + '</g>' +
      // The hero, with stars that circle his head when he is bonked
      '<g transform="translate(' + HERO_X + ',' + GROUND + ')">' +
        '<g class="hero-act"><g transform="scale(' + HERO_S + ')">' + hero.art() + '</g></g>' +
        '<g class="stars" transform="translate(0,-132)">' +
          '<g class="stars-spin">' +
            '<text x="-34" y="0">⭐</text><text x="16" y="-10">⭐</text><text x="-6" y="14">✨</text>' +
          '</g>' +
        '</g>' +
      '</g>' +
      // The arrow the hero shoots when the word is solved
      '<g transform="translate(' + (HERO_X + 24) + ',' + (GROUND - 40) + ')"><g class="arrow">' +
        '<path d="M0,0 H46" class="arrow-shaft"/><path d="M46,-6 L58,0 L46,6 Z" class="arrow-head"/>' +
        '<path d="M0,0 l-8,-6 M0,0 l-8,6 M6,0 l-8,-6 M6,0 l-8,6" class="arrow-fletch"/>' +
      '</g></g>' +
      // The creature: the outer group walks (CSS transform), the inner one does the jumps and flips
      '<g class="foe" style="transform: translateX(' + FOE_START + 'px)">' +
        '<g class="foe-act"><g transform="translate(0,' + GROUND + ') scale(' + flip + ',' + FOE_S + ')">' + foe.art() + '</g></g>' +
      '</g>' +
      '</svg>';
  }

  var walkTimer = 0;
  // pos = how many stones the creature has walked (0 to 8). snap = jump there with no walking (a new word).
  function update(root, pos, snap) {
    var svg = root && root.querySelector('.scene-svg'); if (!svg) return;
    var f = svg.querySelector('.foe');
    var x = foeX(pos);
    if (snap) {
      svg.classList.remove('won', 'lost');
      svg.classList.add('snap');
      f.style.transform = 'translateX(' + x + 'px)';
      void svg.getBoundingClientRect();   // apply the new place before turning the walk back on
      svg.classList.remove('snap');
      f.classList.remove('walking');
    } else if (+f.getAttribute('data-pos') !== pos) {
      f.style.transform = 'translateX(' + x + 'px)';
      f.classList.add('walking');
      clearTimeout(walkTimer);
      walkTimer = setTimeout(function () { f.classList.remove('walking'); }, 950);
    }
    f.setAttribute('data-pos', pos);
    svg.style.setProperty('--fx', (x - HERO_X - 112) + 'px');   // how far the arrow flies: its tip stops at the creature's face
    svg.querySelectorAll('.stone').forEach(function (el) {
      var k = +el.getAttribute('data-k');
      el.classList.toggle('passed', k <= pos);
      el.classList.toggle('next', k === pos + 1);
    });
  }

  // The word is over: won = the hero beats the creature; otherwise the creature gets the hero.
  function end(root, won) {
    var svg = root && root.querySelector('.scene-svg'); if (!svg) return;
    svg.classList.add(won ? 'won' : 'lost');
  }

  window.SCENE = {
    STEPS: STEPS,
    html: html,
    update: update,
    end: end,
    hero: function () { return hero; },
    foe: function () { return foe; }
  };
})();
