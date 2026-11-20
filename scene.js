/* ================= The path scene =================
   A hero stands on the left. A bad creature starts on the right and walks one stepping
   stone closer with every miss. There are 8 stones, coloured green, then yellow, then red.
   On harder levels (fewer chances) the creature starts part of the way along, so the
   stones still ahead of it always equal the chances left.
   Last miss: the creature catches the hero (in a fun way). Word solved: the hero wins with
   his own weapon: Legolas shoots an arrow, Gimli throws his axe, Gandalf casts a bolt of light
   from his staff, and a hobbit charges in with a sword.
   A hero and a creature are paired at random for every word.
   All the drawings come from Hobbit Land. */
(function () {
  'use strict';

  var STEPS = 8;
  var GROUND = 210;          // y of the ground line in the scene
  var HERO_X = 120;          // where the hero stands
  var FOE_START = 915;       // where the creature waits before its first step (its whole body stays on screen)
  function stoneX(k) { return 860 - (k - 1) * 82; }   // stone 1 is nearest the creature, stone 8 nearest the hero
  function foeX(pos) { return pos <= 0 ? FOE_START : stoneX(Math.min(pos, STEPS)); }

  /* ---------- Drawing helpers (from Hobbit Land) ---------- */
  function limb(cls, d, col, w, end) {
    return '<g class="' + cls + '"><path d="' + d + '" stroke="' + col + '" stroke-width="' + w + '" fill="none" stroke-linecap="round"/>' + (end || '') + '</g>';
  }
  function hand(x, y, c) { return '<circle cx="' + x + '" cy="' + y + '" r="1.25" fill="' + (c || '#ecc29c') + '"/>'; }
  function shadow(rx) { return '<ellipse cx="2" cy="1" rx="' + rx + '" ry="3.5" fill="rgba(0,0,0,.28)"/>'; }

  /* ---------- Heroes. Each is drawn facing the viewer with the feet at (0,0). ---------- */

  // Legolas, an elf of Lórien: tall and slim, long hair, grey-green cloak, a bow across the back.
  function elfArt() {
    var h = '#e9cf72', skin = '#f2dcbc';
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

  // Gimli, a stocky dwarf: iron helm, braided beard, mail under a red tunic, an axe on his shoulder.
  function dwarfArt() {
    var b = '#8a5a32', skin = '#f0c9a3';
    return '' +
      limb('leg-a', 'M-2.6,-9 L-3,-3.4', '#4a3a2a', 3.2, '<path d="M-5.6,-3.6 h4.8 v3.6 h-6 q0,-2 1.2,-3.6 Z" fill="#3b2a1e"/>') +
      limb('leg-b', 'M2.6,-9 L3,-3.4', '#4a3a2a', 3.2, '<path d="M0.8,-3.6 h4.8 q1.2,1.6 1.2,3.6 h-6 Z" fill="#3b2a1e"/>') +
      limb('arm-b', 'M-5.4,-23 Q-8.8,-18 -7.8,-13', '#7a2e1e', 3.4, hand(-7.8, -12.4, skin)) +
      '<path d="M-7,-8 C-8.4,-14 -7.6,-21 -4.6,-24.6 L4.6,-24.6 C7.6,-21 8.4,-14 7,-8 Z" fill="#7a2e1e" stroke="#4a1a10" stroke-width=".7"/>' +
      '<path d="M-7.2,-10.6 L7.2,-10.6 L6.6,-7.6 L-6.6,-7.6 Z" fill="#8a8f96" stroke="#5f646a" stroke-width=".4"/>' +
      '<path d="M-6.4,-9.1 H6.4" stroke="#5f646a" stroke-width=".9" stroke-dasharray=".8 .8"/>' +
      '<path d="M-7.6,-14.2 Q0,-13 7.6,-14.2" stroke="#3a2614" stroke-width="2.2" fill="none"/><rect x="-1.4" y="-15.4" width="2.8" height="2.4" rx=".3" fill="#d8a838"/>' +
      '<ellipse cx="0" cy="-29.4" rx="4.8" ry="4.9" fill="' + skin + '"/>' +
      '<path d="M-5.2,-29 C-6.6,-22 -4.6,-17 -2,-14.6 L-0.5,-17.4 L0.5,-17.4 L2,-14.6 C4.6,-17 6.6,-22 5.2,-29 C3.6,-27 2,-26.6 0,-27.2 C-2,-26.6 -3.6,-27 -5.2,-29 Z" fill="' + b + '" stroke="rgba(0,0,0,.25)" stroke-width=".4"/>' +
      '<path d="M-2.6,-24 L-2,-16.6 M2.6,-24 L2,-16.6 M0,-26 V-19" stroke="rgba(0,0,0,.22)" stroke-width=".5"/>' +
      '<circle cx="-2" cy="-15.4" r=".8" fill="#d8a838"/><circle cx="2" cy="-15.4" r=".8" fill="#d8a838"/>' +
      '<path d="M-3.2,-27 Q0,-28.6 3.2,-27" stroke="rgba(0,0,0,.35)" stroke-width="1" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="0.3" cy="-28.6" rx="1.4" ry="1.7" fill="#e0a888"/>' +
      '<path d="M-3.2,-31.4 L-0.8,-31 M3.2,-31.4 L0.8,-31" stroke="' + b + '" stroke-width="1" stroke-linecap="round"/>' +
      '<circle cx="-1.8" cy="-30.2" r=".55" fill="#1a1208"/><circle cx="1.8" cy="-30.2" r=".55" fill="#1a1208"/>' +
      '<path d="M-5.6,-31.4 C-5.6,-36.8 -3,-38.8 0,-38.8 C3,-38.8 5.6,-36.8 5.6,-31.4 Z" fill="#8a8f96"/>' +
      '<path d="M-6.2,-31.4 H6.2" stroke="#5f646a" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M-3,-36 Q-1,-37.8 1.4,-37.8" stroke="#c8ccd2" stroke-width=".7" fill="none"/>' +
      limb('arm-a', 'M5,-23 Q8.4,-19 7.8,-15', '#7a2e1e', 3.4, hand(7.8, -14.4, skin)) +
      '<g class="held">' +   // the axe he holds; it hides while the thrown axe is in the air
        '<path d="M7.2,-11 L9.8,-34" stroke="#6b4a2b" stroke-width="1.3" stroke-linecap="round"/>' +
        '<path d="M9.4,-33.6 C12.8,-35 14.8,-31.8 14.6,-28.6 C12.8,-29.6 10.8,-29.4 9.8,-28.4 Z" fill="#b4bcc2" stroke="#5f6870" stroke-width=".5"/>' +
      '</g>';
  }

  // Gandalf the Grey: long robe, bent pointed hat, long white beard, a glowing staff.
  function gandalfArt() {
    var grey = '#8e9097', skin = '#e9c4a0';
    return '' +
      '<path class="leg-a" d="M-3.4,-3 L-5.6,0.8 L-0.6,0.8 Z" fill="#3a2a1a"/>' +
      '<path class="leg-b" d="M3,-3 L5.4,0.8 L0.6,0.8 Z" fill="#3a2a1a"/>' +
      limb('arm-b', 'M-4,-38 Q-8,-31 -7,-25', '#7d7f88', 3.4, hand(-7, -24.2, skin)) +
      '<path d="M-5,-41 C-7,-30 -10,-14 -12,0 L11.4,0 C9.4,-14 7.4,-30 5,-41 Z" fill="' + grey + '" stroke="#4f5058" stroke-width=".7"/>' +
      '<path d="M2,-38 C4,-26 7,-12 9,0 L11.4,0 C9.4,-14 7.4,-30 5,-41 Z" fill="#787a82"/>' +
      '<path d="M-2.6,-30 Q-4.6,-16 -6,-1 M0.6,-28 Q1.4,-14 2,-1" stroke="#686a72" stroke-width=".6" fill="none"/>' +
      '<path d="M-6.4,-42 Q0,-44.6 6.4,-42 L7,-34.6 Q0,-32 -7,-34.6 Z" fill="#7d7f88" stroke="#4f5058" stroke-width=".5"/>' +
      '<path d="M8.6,-23 L12.4,-63" stroke="#6b4a2b" stroke-width="1.7" stroke-linecap="round"/>' +
      '<path d="M12.4,-63 C10.6,-65 11.6,-67.4 13.6,-67 C15.4,-66.4 14.6,-64 13,-64" stroke="#6b4a2b" stroke-width="1.2" fill="none"/>' +
      '<g class="staff-glow"><circle cx="12.6" cy="-64.6" r="5" fill="#fff3b0" opacity=".3"/><circle cx="12.6" cy="-64.6" r="1.8" fill="#fff8d0"/></g>' +
      '<path d="M4,-39 Q8.2,-33 8.6,-27" stroke="#7d7f88" stroke-width="3.4" fill="none" stroke-linecap="round"/>' + hand(8.6, -26, skin) +
      '<rect x="-1.2" y="-43" width="2.4" height="3" fill="' + skin + '"/>' +
      '<path d="M-4,-47 C-5,-42 -4.6,-38 -4,-36 L-3,-44 Z M4,-47 C5,-42 4.6,-38 4,-36 L3,-44 Z" fill="#c9c9c2"/>' +
      '<circle cx="0" cy="-46.4" r="4" fill="' + skin + '"/>' +
      '<path d="M-3.8,-45.6 C-4,-40 -2.2,-35 0.4,-31.6 C2.4,-35 4,-40 3.8,-45.6 Q0,-42.6 -3.8,-45.6 Z" fill="#eeeeea" stroke="#c9c9c2" stroke-width=".4"/>' +
      '<path d="M-2.8,-44.4 Q0,-45.8 2.8,-44.4" stroke="#dcdcd6" stroke-width="1" fill="none" stroke-linecap="round"/>' +
      '<path d="M-2.8,-48.4 L-0.6,-47.8 M2.8,-48.4 L0.6,-47.8" stroke="#dcdcd6" stroke-width=".9" stroke-linecap="round"/>' +
      '<circle cx="-1.4" cy="-47.2" r=".5" fill="#1a1208"/><circle cx="1.4" cy="-47.2" r=".5" fill="#1a1208"/>' +
      '<ellipse cx="0" cy="-50.6" rx="7.6" ry="1.7" fill="#6a6c74"/>' +
      '<path d="M-4.8,-51 C-3.8,-58 -1.6,-64 0.6,-67 C2,-69 4.6,-70.4 7,-69 C4.4,-68.2 3.4,-63 4.8,-51 Z" fill="#7d7f88" stroke="#4f5058" stroke-width=".6"/>';
  }

  // A hobbit: short, curly-haired, big bare feet, a coloured waistcoat, and a little sword that glows blue.
  function hobbitArt(vest) {
    var skin = '#f0c9a3', hair = '#6a4426', shirt = '#f1e6c8';
    function leg(cls, x, f) {
      return '<g class="' + cls + '"><path d="M' + x + ',-11 L' + (x + f * 0.4) + ',-6" stroke="#6b4a2b" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M' + (x + f * 0.4) + ',-6.4 L' + (x + f * 0.6) + ',-1.4" stroke="' + skin + '" stroke-width="2" stroke-linecap="round"/>' +
        '<ellipse cx="' + (x + f * 1.6) + '" cy="-0.6" rx="2.9" ry="1.3" fill="#c48c5c"/><path d="M' + (x + f * 0.2) + ',-1.6 q' + f + ',-1 ' + 2 * f + ',0" stroke="#8a5a32" stroke-width=".5" fill="none"/></g>';
    }
    return '' +
      leg('leg-a', -1.8, -1) + leg('leg-b', 1.8, 1) +
      limb('arm-b', 'M-4.6,-21.4 Q-7.8,-17 -7.2,-12.6', shirt, 2.4, hand(-7.2, -12, skin)) +
      '<path d="M-5.4,-22.6 C-6.4,-17 -6,-13 -5,-10 L5,-10 C6,-13 6.4,-17 5.4,-22.6 Q0,-24.4 -5.4,-22.6 Z" fill="' + shirt + '" stroke="#8a7a5a" stroke-width=".5"/>' +
      '<path d="M-5.2,-12 L5.2,-12 L5.4,-9 L-5.4,-9 Z" fill="#6b4a2b"/>' +
      '<path d="M-5.4,-22.4 C-6.2,-17 -5.8,-13.6 -5.1,-11.4 L-1,-11.4 L-0.6,-17.4 L-2.4,-22.9 Z M5.4,-22.4 C6.2,-17 5.8,-13.6 5.1,-11.4 L1,-11.4 L0.6,-17.4 L2.4,-22.9 Z" fill="' + vest + '"/>' +
      '<circle cx="-1.2" cy="-15.6" r=".55" fill="#e8c860"/><circle cx="-1.1" cy="-13" r=".55" fill="#e8c860"/>' +
      // the sword, held up and forward in the right hand
      '<g class="sword">' +
        '<path d="M8.2,-13.6 L14.6,-27.4" stroke="#bfe3ff" stroke-width="3" stroke-linecap="round" opacity=".35"/>' +
        '<path d="M8.2,-13.6 L14.6,-27.4" stroke="#e8f4ff" stroke-width="1.3" stroke-linecap="round"/>' +
        '<path d="M5.8,-14.2 L9.8,-12.4" stroke="#8a6a3a" stroke-width="1.2" stroke-linecap="round"/>' +
        '<path d="M7.2,-12.8 L6.4,-11" stroke="#6b4a2b" stroke-width="1.2" stroke-linecap="round"/>' +
      '</g>' +
      limb('arm-a', 'M4.6,-21.4 Q7.8,-17 7.2,-12.6', shirt, 2.4, hand(7.2, -12, skin)) +
      '<path d="M-4.2,-28.6 L-6.6,-31.4 L-4,-26.6 Z M4.2,-28.6 L6.6,-31.4 L4,-26.6 Z" fill="' + skin + '" stroke="#c89a70" stroke-width=".3"/>' +
      '<circle cx="0" cy="-27.4" r="4.5" fill="' + skin + '"/>' +
      '<circle cx="-2.8" cy="-26" r="1" fill="#e88a7a" opacity=".5"/><circle cx="2.8" cy="-26" r="1" fill="#e88a7a" opacity=".5"/>' +
      '<g fill="' + hair + '"><circle cx="-3.4" cy="-30.6" r="2"/><circle cx="-1.2" cy="-32" r="2.1"/><circle cx="1.4" cy="-32" r="2.1"/><circle cx="3.6" cy="-30.4" r="1.9"/>' +
      '<circle cx="-4.3" cy="-28.6" r="1.3"/><circle cx="4.4" cy="-28.4" r="1.3"/></g>' +
      '<circle cx="-1.5" cy="-27.6" r=".55" fill="#1a1208"/><circle cx="1.5" cy="-27.6" r=".55" fill="#1a1208"/>' +
      '<path d="M-1.4,-25 Q0,-23.9 1.4,-25" stroke="#8a4a2a" stroke-width=".6" fill="none" stroke-linecap="round"/>';
  }

  /* ---------- Creatures. Each is drawn facing right with the feet at (0,0); the scene flips them to face the hero. ---------- */

  // The spider (Shelob): a big round body, long jointed legs, a cluster of eyes.
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

  // An orc: hunched, grey-green, in rough leather and scraps of iron, with a jagged spear.
  // (goblin: a goblin instead — paler green, big bat ears, empty-handed)
  function orcArt(dx, s, helm, goblin) {
    var skin = goblin ? '#8fa05a' : '#6e7d4a';
    function foot(x) { return '<path d="M' + (x - 2.6) + ',-3 h4.4 l.6,3 h-5.4 Z" fill="#2a221a"/>'; }
    return '<g transform="translate(' + dx + ',0) scale(' + s + ')">' +
      limb('leg-a', 'M-3,-12 L-3.6,-2.6', '#3d2f22', 3.2, foot(-3.6)) + limb('leg-b', 'M3,-12 L3.6,-2.6', '#33271c', 3.2, foot(3.6)) +
      limb('leg-a', 'M-4,-28 Q-8.4,-22 -7.4,-15.4', skin, 3, hand(-7.4, -14.6, skin)) +
      '<path d="M-7.4,-12 C-9,-20 -6.6,-28 -1.6,-31 C3,-32.6 8,-29 8.4,-24 C8.8,-19 8,-15 7,-12 Z" fill="#5a4a32" stroke="#2c2418" stroke-width=".7"/>' +
      '<path d="M-7.4,-12.4 L-5.6,-9.4 L-3.6,-12 L-1.4,-9.2 L1,-12 L3.2,-9.4 L5.2,-12 L7,-9.6 L7.2,-12.4 Z" fill="#4a3c28"/>' +
      '<path d="M-7.6,-17 Q0,-15.6 8,-17.4" stroke="#2a1d10" stroke-width="1.8" fill="none"/><rect x="-0.6" y="-18" width="2.6" height="2.4" fill="#8a7a5a"/>' +
      '<path d="M-1,-26 L4,-26.6 M-1.4,-22 L5,-22.4" stroke="#3e3222" stroke-width=".7"/>' +
      '<path d="M-4,-31.2 C-1,-34.2 4.2,-33.8 6.8,-30 L4.8,-26.8 C2,-29.4 -1,-29.2 -3.4,-27.4 Z" fill="#6d7278" stroke="#3a3e42" stroke-width=".6"/>' +
      limb('leg-b', 'M5,-27 Q10,-22 9,-14.6', skin, 3, hand(9, -14, skin)) +
      (goblin ? '' : '<path d="M7.6,-6 L15,-46" stroke="#5a3d22" stroke-width="1.3"/>' +
        '<path d="M15,-46.4 L12.2,-39.2 L14.2,-40 L15.2,-37.4 L17.4,-39.8 Z" fill="#9aa2a8" stroke="#4f585e" stroke-width=".5"/>') +
      '<ellipse cx="2.6" cy="-34.6" rx="5.8" ry="5.2" fill="' + skin + '" stroke="#2c3520" stroke-width=".7"/>' +
      (goblin ? '<path d="M-2.4,-36 L-13.6,-44 L-9,-37.4 L-11.4,-35 L-3,-32.6 Z" fill="' + skin + '" stroke="#2c3520" stroke-width=".5"/><path d="M-4,-35.4 L-10.6,-40" stroke="#c98a7a" stroke-width="1" opacity=".7"/>'
        : '<path d="M-2.4,-35.6 L-9.4,-40.6 L-3,-32.6 Z" fill="' + skin + '" stroke="#2c3520" stroke-width=".5"/>') +
      (helm ? '<path d="M-3.4,-36.4 C-3,-41.4 1,-42.4 3.4,-42.2 C6.6,-42 8.8,-39.6 8.4,-36.4 Q2.6,-38.4 -3.4,-36.4 Z" fill="#4a4e54" stroke="#2a2e32" stroke-width=".5"/>' : '') +
      '<path d="M-0.6,-38 L7.4,-37.2" stroke="#2c3520" stroke-width="1.4" stroke-linecap="round"/>' +
      '<circle cx="1.4" cy="-36.2" r="1" fill="#ffd34d"/><circle cx="5" cy="-36" r="1" fill="#ffd34d"/>' +
      '<circle cx="1.6" cy="-36.2" r=".4" fill="#1a1208"/><circle cx="5.2" cy="-36" r=".4" fill="#1a1208"/>' +
      '<path d="M0,-31.6 Q3.6,-30.4 7.4,-32" stroke="#2c3520" stroke-width=".7" fill="none"/>' +
      '<path d="M1,-31.6 L0.6,-29.2 L2,-31.2 Z M5.8,-31.8 L6.6,-29.4 L5,-31.2 Z" fill="#f3ecd2"/></g>';
  }
  function oneOrc() { return shadow(12) + orcArt(0, 1, true, false); }
  function twoGoblins() { return shadow(18) + orcArt(-9, 0.8, false, true) + orcArt(8, 0.86, false, true); }

  // A warg: a big shaggy wolf with a heavy head and a bushy tail.
  function wargArt() {
    var fur = '#6d665d', dark = '#4e4841';
    function fore(x, col, cls) { return '<g class="' + cls + '"><path d="M' + x + ',-14 h3 l-.6,7 l.6,6 h-1.7 l-.9,-6 Z" fill="' + col + '"/><ellipse cx="' + (x + 2.4) + '" cy="-0.7" rx="1.8" ry=".8" fill="' + col + '"/></g>'; }
    function hind(x, col, cls) { return '<g class="' + cls + '"><path d="M' + x + ',-15 h5 l-1.2,6 l-1.6,4 l.6,4 h-1.6 l-.8,-4 l.1,-4 Z" fill="' + col + '"/><ellipse cx="' + (x + 2.2) + '" cy="-0.7" rx="1.8" ry=".8" fill="' + col + '"/></g>'; }
    return shadow(22) +
      fore(11, dark, 'leg-b') + hind(-11, dark, 'leg-a') +
      '<path d="M-11,-17 C-17,-19 -21,-16 -23,-10.6 C-20.4,-12.6 -18,-13 -15.4,-13 C-17,-11.6 -17.6,-9.6 -17.4,-7.6 C-14.6,-10.6 -12.4,-12 -11,-14 Z" fill="' + fur + '" stroke="#3a3430" stroke-width=".5"/>' +
      fore(8, fur, 'leg-a') + hind(-8, fur, 'leg-b') +
      '<path d="M-12,-15 C-12,-20 -8,-22 -2,-21 C4,-21 8,-25 13,-25.4 C17,-25.4 18.4,-21 17,-16 C16,-12.4 13,-11 10,-11.6 C6,-13 2,-13.6 -3,-12.6 C-7,-11.6 -12,-11 -12,-15 Z" fill="' + fur + '" stroke="#3a3430" stroke-width=".6"/>' +
      '<path d="M2,-21.4 L4.6,-25.6 L6.4,-23.6 L8.4,-27 L10.4,-24.8 L12.4,-27.6 L14,-24.4 L11,-21 Z" fill="' + dark + '"/>' +
      '<path d="M-3,-12.8 C2,-13.6 6,-13 10,-11.8 C6,-14.6 2,-15 -3,-12.8 Z" fill="#8a8378"/>' +
      '<path d="M15,-24 C17,-28.4 21,-28.4 23,-25.4 L29,-22 C30.2,-21 29.8,-19.2 28.2,-19 L23.2,-18 C20,-17 16,-18 15,-21 Z" fill="' + fur + '" stroke="#3a3430" stroke-width=".6"/>' +
      '<path d="M16.6,-26.4 L16.6,-31.6 L19.8,-27.4 Z M19.4,-27 L20.6,-31.8 L22.2,-26.4 Z" fill="' + dark + '"/>' +
      '<path d="M18.6,-24.6 L22.4,-23.6" stroke="#2a2620" stroke-width=".7"/><circle cx="21" cy="-23.2" r=".9" fill="#f0c040"/>' +
      '<circle cx="29" cy="-21.2" r=".9" fill="#1a1612"/>' +
      '<path d="M23,-19.4 L28.4,-19.6" stroke="#2a1612" stroke-width=".7"/><path d="M24.4,-19.4 l.4,1 l.4,-1 M26.4,-19.5 l.4,1 l.4,-1" stroke="#f3ecd2" stroke-width=".4" fill="none"/>';
  }

  /* ---------- What the heroes throw or cast. Each is drawn with its point (or middle) at (0,0). ---------- */
  var SHOTS = {
    arrow: '<path d="M-58,0 H-12" class="arrow-shaft"/><path d="M-12,-6 L0,0 L-12,6 Z" class="arrow-head"/>' +
           '<path d="M-58,0 l-8,-6 M-58,0 l-8,6 M-52,0 l-8,-6 M-52,0 l-8,6" class="arrow-fletch"/>',
    axe: '<g class="spin"><path d="M-3,22 L3,-20" stroke="#6b4a2b" stroke-width="5" stroke-linecap="round"/>' +
         '<path d="M1,-22 C14,-28 22,-16 21,-4 C14,-8 7,-8 3,-4 Z" fill="#c4ccd2" stroke="#5f6870" stroke-width="1.6"/></g>',
    bolt: '<circle r="26" fill="#fff3b0" opacity=".25"/><circle r="15" fill="#fff8d0" opacity=".6"/><circle r="7" fill="#ffffff"/>'
  };

  /* ---------- Who can appear. One hero and one creature are paired at random for every word. ---------- */
  // s: drawing scale. h: drawing height. hand: where the weapon leaves from (in drawing units).
  var HOBBITS = [
    { name: 'Frodo', vest: '#2f6fc0' }, { name: 'Sam', vest: '#d49a22' },
    { name: 'Merry', vest: '#2e9657' }, { name: 'Pippin', vest: '#c8433a' }
  ];
  var HEROES = [
    { id: 'legolas', name: 'Legolas', weapon: 'arrow', s: 2.8, h: 59, hand: { x: 18, y: -29 }, art: elfArt },
    { id: 'gimli', name: 'Gimli', weapon: 'axe', s: 3.2, h: 39, hand: { x: 12, y: -31 }, art: dwarfArt },
    { id: 'gandalf', name: 'Gandalf', weapon: 'staff', s: 2.4, h: 70, hand: { x: 12.6, y: -64.6 }, art: gandalfArt },
    { id: 'hobbit', name: 'Frodo', weapon: 'sword', s: 3.4, h: 34, hand: { x: 14, y: -26 }, art: hobbitArt }
  ];
  // face: the middle of the creature's face (in drawing units, facing right), where the hero's weapon hits it.
  var FOES = [
    { id: 'spider', name: 'the spider', emoji: '🕷️', s: 1.8, face: { x: 18, y: -22 }, art: spiderArt },
    { id: 'orc', name: 'the orc', emoji: '👹', s: 2.6, face: { x: 4, y: -35 }, art: oneOrc },
    { id: 'goblins', name: 'the goblins', emoji: '👺', s: 2.9, face: { x: 10, y: -30 }, art: twoGoblins },
    { id: 'warg', name: 'the warg', emoji: '🐺', s: 3.1, face: { x: 24, y: -22 }, art: wargArt }
  ];

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

  // Where the weapon leaves the hero, and where it hits the creature standing at x.
  function shotStart(h) { return { x: HERO_X + h.hand.x * h.s, y: GROUND + h.hand.y * h.s }; }
  function shotEnd(f, x) { return { x: x - f.face.x * f.s, y: GROUND + f.face.y * f.s }; }
  function byId(list, id) { return list.filter(function (o) { return o.id === id; })[0]; }

  // Builds the whole scene with a hero and a creature picked at random.
  // (heroId / foeId pick a particular one instead; used for testing.)
  function html(heroId, foeId) {
    hero = byId(HEROES, heroId) || pick(HEROES);
    foe = byId(FOES, foeId) || pick(FOES);
    var art = hero.art();
    if (hero.id === 'hobbit') {   // one of the four hobbits, at random
      var hb = pick(HOBBITS);
      hero.name = hb.name;
      art = hobbitArt(hb.vest);
    }
    var stones = '';
    for (var k = 1; k <= STEPS; k++) {
      stones += '<ellipse class="stone ' + stoneClass(k) + '" data-k="' + k + '" cx="' + stoneX(k) + '" cy="' + (GROUND + 4) + '" rx="30" ry="8"/>';
    }
    var top = hero.h * hero.s;            // height of the hero in the scene
    var s0 = shotStart(hero);
    return '<svg viewBox="0 30 1000 215" class="scene-svg w-' + hero.weapon + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true"' +
      ' data-hero="' + hero.id + '" data-foe="' + foe.id + '"' +   // each scene knows its own pair, so several can be on one page
      ' style="--bonk: ' + (-top * 0.66).toFixed(0) + 'px; --hop: ' + (-Math.max(36, top * 0.3)).toFixed(0) + 'px">' +
      '<rect x="0" y="' + GROUND + '" width="1000" height="40" rx="14" class="ground"/>' +
      '<g class="tufts">' + tufts() + '</g>' +
      '<g class="stones">' + stones + '</g>' +
      // The hero, with stars that circle his head when he is bonked
      '<g transform="translate(' + HERO_X + ',' + GROUND + ')">' +
        '<g class="hero-act"><g transform="scale(' + hero.s + ')">' + shadow(12) + art + '</g></g>' +
        '<g class="stars" transform="translate(0,' + (-(top * 0.66 + 24)).toFixed(0) + ')">' +
          '<g class="stars-spin">' +
            '<text x="-34" y="0">⭐</text><text x="16" y="-10">⭐</text><text x="-6" y="14">✨</text>' +
          '</g>' +
        '</g>' +
      '</g>' +
      // What the hero throws or casts when the word is solved (the sword fighter runs in instead)
      (SHOTS[hero.weapon === 'staff' ? 'bolt' : hero.weapon] ?
        '<g transform="translate(' + s0.x.toFixed(0) + ',' + s0.y.toFixed(0) + ')"><g class="shot"><g class="shot-aim">' +
          SHOTS[hero.weapon === 'staff' ? 'bolt' : hero.weapon] + '</g></g></g>' : '') +
      // A flash where the hero's weapon hits the creature
      '<g class="hit"><g class="hit-in"><circle r="20" class="hit-ring"/><path d="M-16,-16 L16,16 M16,-16 L-16,16 M0,-22 V22 M-22,0 H22" class="hit-burst"/></g></g>' +
      // The creature: the outer group walks (CSS transform), the inner one does the jumps and flips.
      // It is flipped to face left, toward the hero.
      '<g class="foe" style="transform: translateX(' + FOE_START + 'px)">' +
        '<g class="foe-act"><g transform="translate(0,' + GROUND + ') scale(' + (-foe.s) + ',' + foe.s + ')">' + foe.art() + '</g></g>' +
      '</g>' +
      '</svg>';
  }

  // pos = how many stones the creature has walked (0 to 8). snap = jump there with no walking (a new word).
  function update(root, pos, snap) {
    var svg = root && root.querySelector('.scene-svg'); if (!svg) return;
    var f = svg.querySelector('.foe');
    var h = byId(HEROES, svg.getAttribute('data-hero')), cr = byId(FOES, svg.getAttribute('data-foe'));
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
      clearTimeout(f.walkTimer);
      f.walkTimer = setTimeout(function () { f.classList.remove('walking'); }, 950);
    }
    f.setAttribute('data-pos', pos);
    // Aim the weapon: how far it flies, and the angle of the arrow.
    var a = shotStart(h), b = shotEnd(cr, x);
    svg.style.setProperty('--fx', (b.x - a.x).toFixed(0) + 'px');
    svg.style.setProperty('--fy', (b.y - a.y).toFixed(0) + 'px');
    svg.style.setProperty('--back', (FOE_START - x) + 'px');                     // how far the creature slides back when beaten
    svg.style.setProperty('--reach', (b.x - HERO_X - 72).toFixed(0) + 'px');   // how far the sword fighter runs: the sword tip just reaches the face
    var aim = svg.querySelector('.shot-aim');
    if (aim && h.weapon === 'arrow') {
      aim.setAttribute('transform', 'rotate(' + (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1) + ')');
    }
    var hit = svg.querySelector('.hit');
    if (hit) hit.setAttribute('transform', 'translate(' + b.x.toFixed(0) + ',' + b.y.toFixed(0) + ')');
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
