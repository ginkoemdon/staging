/*
  Ginko's tropical jungle, drawn in code — a river running through it.

  Built the way Ben built his meadow (assets/js/meadow.js in
  BenEmdon/BenEmdon.GitHub.io), but the landscape is Ginko's own:
  a dense tropical jungle, not a meadow. Same method, different place.

  The method, in plain language:
  - The scene is built ONCE as a grid of numbers (one number per cell,
    each number a colour from a palette). Nothing is an image file.
  - It is built the same way on every load: one seeded random source
    places the speckles and flowers, so the jungle you critiqued is
    the jungle every visitor gets.
  - Day and night are the SAME grid lit twice: a day palette and a
    night palette over the same cells. Night follows the site theme
    (light = day, dark = night), exactly like Ben's meadow — not the
    clock. The palettes are kept in separate lists (DAY, NIGHT) on
    purpose, so dawn/dusk clock palettes can be added later by
    adding two more lists and picking by the hour. Nothing else
    in the file would need to change.
  - The pixel rule holds throughout: nothing moves, drifts, or fades.
    The scene arrives in scrambled 6x6 blocks on a 75ms tick. Clouds
    step one whole column at a time, then hold for seconds. A breeze
    is only ground cells stepping one shade brighter in place, and
    the river's shimmer is only water cells stepping one shade
    brighter in place. Butterflies step one cell at a time.
    Fireflies swap whole cells between dim, lit, and bright.
  - Reduced motion gets the finished scene in one cut, no weather,
    no clouds stepping, no butterflies, fireflies parked lit.
  - Off-screen or hidden tab: every timetable waits. Nothing runs
    while nobody is looking.

  Layers, back to front:
    sky / clouds / birds / far ridge (seen through the canopy gap)
    / canopy ceiling and masses / god rays / river and banks
    / emergent tree / left tree and vines / right palms
    / ferns / flowers / foreground silhouettes
    / butterflies (day) / fireflies (night)

  The grid is 180 x 72 cells — bigger than Ben's 144 x 60, because
  Ginko asked for more complex and more detailed. Same 2.5:1 shape.
*/

"use strict";

/* ---------- anchor ---------- */

const W = 180;
const H = 72;

// Day palette. Hue-shifting ramps, the way pixel artists build them:
// canopy shadows lean blue-green, highlights lean yellow; water cools
// toward the banks and warms to sparkle in the middle.
const PALETTE = [
  "#5b9bd9", // 0  sky zenith
  "#8ec3ea", // 1  sky mid
  "#c4e0f4", // 2  sky low
  "#eaf6ee", // 3  sky horizon
  "#ffffff", // 4  cloud
  "#d5e7f3", // 5  cloud shade
  "#8fb89a", // 6  far ridge, hazy green
  "#6d9c7d", // 7  near ridge
  "#0d3b24", // 8  canopy deep
  "#14532f", // 9  canopy dark
  "#1e6b3c", // 10 canopy mid
  "#2c8a4c", // 11 canopy lit
  "#54b364", // 12 canopy highlight
  "#8fd07a", // 13 leaf light
  "#5a3d24", // 14 trunk
  "#3a2817", // 15 trunk shade
  "#8a6238", // 16 trunk lit
  "#ffedb0", // 17 ray pale, sun through leaves
  "#ffd76a", // 18 ray gold
  "#0c5561", // 19 water deep, at the banks
  "#127d8c", // 20 water mid
  "#2aa5b2", // 21 water light
  "#bdeff2", // 22 water sparkle, sun on the river
  "#4a3220", // 23 bank, wet earth
  "#9a8f7a", // 24 rock
  "#6e6350", // 25 rock shade
  "#e2483d", // 26 flower red, heliconia
  "#f28c2e", // 27 flower orange
  "#e86ba8", // 28 flower pink, orchid
  "#f6d34d", // 29 flower yellow
  "#4fae5f", // 30 fern light
  "#ff9f1c", // 31 butterfly wing
  "#7a3b12", // 32 butterfly body
  "#cfe8a8", // 33 leaf pale
];

// Night palette: same indices, re-lit. The moon's rays (17, 18) turn
// pale and cool — the sunbeams become moonbeams on the same cells.
// Four slots exist only at night: moon rim, moon face, starlight,
// and the fireflies' three-rung glow ladder (dim, lit, bright).
const NIGHT_PALETTE = [
  "#050d1f", // 0  sky zenith, deep blue
  "#0a1830", // 1  sky mid
  "#122540", // 2  sky low
  "#1c3554", // 3  sky horizon, the last glow
  "#33465f", // 4  cloud, a faint shape
  "#22344e", // 5  cloud shade
  "#16302c", // 6  far ridge, silhouetted
  "#12261f", // 7  near ridge
  "#071a12", // 8  canopy deep, near silhouette
  "#0a2418", // 9  canopy dark
  "#0e3322", // 10 canopy mid
  "#14452e", // 11 canopy lit
  "#1d5c3c", // 12 canopy highlight, moonlit
  "#2c6b44", // 13 leaf light
  "#241a2e", // 14 trunk, cooled toward plum
  "#171121", // 15 trunk shade
  "#3d2c4a", // 16 trunk lit
  "#e8d9a0", // 17 moonbeam pale
  "#c9b478", // 18 moonbeam gold
  "#082a33", // 19 water deep
  "#0d4550", // 20 water mid
  "#14606b", // 21 water light
  "#7fc4cc", // 22 water sparkle
  "#241a14", // 23 bank, wet earth
  "#5c554a", // 24 rock
  "#403a30", // 25 rock shade
  "#8a2f2a", // 26 flower red, asleep
  "#8a5424", // 27 flower orange, asleep
  "#8a4a68", // 28 flower pink, asleep
  "#8a7a2e", // 29 flower yellow, asleep
  "#1d4a28", // 30 fern light
  "#3a2a1a", // 31 butterfly, at rest
  "#241610", // 32 butterfly body
  "#3a5a34", // 33 leaf pale
  "#e6eefb", // 34 moon rim
  "#7f97bd", // 35 moon face
  "#cfe0f7", // 36 star
  "#8a6a1a", // 37 firefly dim
  "#f2c14e", // 38 firefly lit
  "#ffe9a8", // 39 firefly bright
];

// Shade ladders, brightest first. The breeze steps a canopy cell one
// rung up or down and later one rung back; the river shimmer does the
// same for water. Neither ever invents a colour.
const CANOPY_LADDER = [12, 11, 10, 9];
const WATER_LADDER = [22, 21, 20, 19];
const LADDERS = [CANOPY_LADDER, WATER_LADDER];

/* ---------- seeded randomness ---------- */

// Mulberry32, Ben's choice. One seed for the whole scene, so the
// jungle a visitor gets is the jungle that was critiqued.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20261124);

/* ---------- the scene as data ---------- */

const base = new Uint8Array(W * H); // palette index per cell
const rung = new Int8Array(W * H).fill(-1); // ladder rung for weather cells
const ladderOf = new Uint8Array(W * H); // which ladder a weather cell climbs

const at = (x, y) => y * W + x;
const inside = (x, y) => x >= 0 && x < W && y >= 0 && y < H;

function set(x, y, colour) {
  if (inside(x, y)) base[at(x, y)] = colour;
}

function setGround(x, y, ladder, r) {
  if (!inside(x, y)) return;
  base[at(x, y)] = LADDERS[ladder][r];
  rung[at(x, y)] = r;
  ladderOf[at(x, y)] = ladder;
}

// A subject drawn over the ground: trunks, rocks, flowers, rays. Its
// colour is final, and the cell leaves the weather's bookkeeping
// (rung -1), so a breeze or a shimmer passes behind the subject and
// never repaints its wood or its petals in ladder colours.
function setStill(x, y, colour) {
  if (!inside(x, y)) return;
  base[at(x, y)] = colour;
  rung[at(x, y)] = -1;
}

// Filled ellipse with stepped edges; the only curve the scene knows.
function stamp(cx, cy, rx, ry, paint) {
  for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y += 1) {
    for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x += 1) {
      const dx = (x - cx) / (rx + 0.5);
      const dy = (y - cy) / (ry + 0.5);
      if (dx * dx + dy * dy <= 1) paint(x, y);
    }
  }
}

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/* ----- sky ----- */

// Four flat bands, like Ben's: dither in the seams read as dotted
// rules at this scale, so the bands meet flat, with one faint mixed
// seam at the top. The canopy covers most of the sky anyway; what
// shows is the bright gap in the middle, where the river springs.
const SKY_BANDS = [
  [0, 0], // rows 0-3: zenith
  [4, 1],
  [8, 2],
  [12, 3],
];

const skyBoundary = (x, b) => SKY_BANDS[b][0] + Math.round(1.1 * Math.sin(x / 23 + b * 2.1));

function skyColour(x, y) {
  let b = 0;
  for (let i = 1; i < SKY_BANDS.length; i += 1) {
    if (y >= skyBoundary(x, i)) b = i;
  }
  const colour = SKY_BANDS[b][1];
  if (b !== 1) return colour;
  const paired = BAYER_4[y % 4][(x >> 1) % 4];
  if (y === skyBoundary(x, 1) && paired < 5) return SKY_BANDS[0][1];
  return colour;
}

for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) set(x, y, skyColour(x, y));
}

/* ----- clouds ----- */

// Flat clusters built from overlapping ellipses, shaded underneath:
// any cloud cell with open sky two rows below takes the shade, so the
// shade hugs the underside the way a shadow would. Each cloud is kept
// as its own cell map and composited over the sky at whatever column
// the timetable has stepped it to — same as Ben's.
const cloudShapes = [];
const cloudMasks = [];

function cloud(cx, cy, interval, parts) {
  const mask = new Uint8Array(W * H);
  for (const [ox, oy, rx, ry] of parts) {
    stamp(cx + ox, cy + oy, rx, ry, (x, y) => {
      if (inside(x, y)) mask[at(x, y)] = 1;
    });
  }
  cloudMasks.push(mask);
  cloudShapes.push({ cx, cy, interval, cells: [], minDx: W, maxDx: -1 });
}

// Two small clouds in the bright gap, where the sky actually shows.
cloud(88, 5, 2600, [
  [0, 0, 9, 2.4],
  [-7, 1, 6, 1.8],
  [7, 1, 6, 1.8],
]);
cloud(52, 3, 4200, [
  [0, 0, 6, 1.8],
  [-5, 1, 4, 1.4],
  [5, 1, 4, 1.4],
]);

{
  const merged = new Uint8Array(W * H);
  for (const mask of cloudMasks) {
    for (let i = 0; i < W * H; i += 1) if (mask[i]) merged[i] = 1;
  }
  const claimed = new Uint8Array(W * H);
  cloudShapes.forEach((shape, s) => {
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        const i = at(x, y);
        if (!cloudMasks[s][i] || claimed[i]) continue;
        claimed[i] = 1;
        const openBelow = !inside(x, y + 2) || !merged[at(x, y + 2)];
        const dx = x - shape.cx;
        shape.cells.push({ dx, dy: y - shape.cy, colour: openBelow ? 5 : 4 });
        if (dx < shape.minDx) shape.minDx = dx;
        if (dx > shape.maxDx) shape.maxDx = dx;
      }
    }
  });
}

// Two birds in the bright gap, three cells each: a cluster, not a speck.
for (const [bx, by] of [
  [80, 9],
  [99, 12],
]) {
  set(bx, by + 1, 8);
  set(bx + 1, by, 8);
  set(bx + 2, by + 1, 8);
}

/* ----- the canopy gap ----- */

// The canopy ceiling is high at the sides and opens in the middle:
// a bright slot where the sky shows through and the river springs
// from. slotFactor is 1 inside the gap, 0 outside it, and smooth in
// between, so the ceiling dips instead of stepping.
function slotFactor(x) {
  const edge = (v) => {
    const t = Math.min(1, Math.max(0, v));
    return t * t * (3 - 2 * t);
  };
  return edge((x - 76) / 10) * (1 - edge((x - 94) / 10));
}

// Where the canopy ceiling starts, per column. About y 8-12 at the
// sides, dipping to about y 26 inside the gap, so the far ridge shows
// through the slot and the river can spring from it.
const canopyTop = (x) =>
  Math.round(
    6 +
      2.5 * Math.sin(x / 29 + 0.6) +
      1.5 * Math.sin(x / 11 + 2) +
      18 * slotFactor(x)
  );

/* ----- far ridge, seen through the gap ----- */

// Distance, the cheap way: one more silhouette behind the canopy, in
// a colour mixed toward the sky, so the eye stacks pale ridge, near
// ridge, near canopy and calls it deep jungle. It only shows inside
// the gap; the canopy covers it everywhere else. Off the ladders:
// the weather belongs to the near jungle and leaves it alone.
const farCrest = (x) =>
  Math.round(19 - 1.5 * Math.sin(x / 47 + 0.8) - 1.0 * Math.sin(x / 19 + 2.2));
const nearCrest = (x) =>
  Math.round(23 - 1.8 * Math.sin(x / 33) - 1.0 * Math.sin(x / 15 + 1));

for (let x = 0; x < W; x += 1) {
  if (slotFactor(x) <= 0) continue;
  for (let y = farCrest(x); y < H; y += 1) set(x, y, 6);
  for (let y = nearCrest(x); y < H; y += 1) set(x, y, 7);
}

/* ----- canopy ceiling and masses ----- */

// Everything below the ceiling is jungle: a ground of canopy rungs,
// darker deep inside, lighter toward the top where the light catches
// it, and lighter again toward the viewer at the bottom.
for (let x = 0; x < W; x += 1) {
  const top = canopyTop(x);
  for (let y = top; y < H; y += 1) {
    const t = (y - top) / (H - 1 - top);
    const r = t < 0.22 ? 1 : t < 0.5 ? 2 : 3;
    setGround(x, y, 0, r);
  }
}

// Sunlit and shadowed patches, one rung off the base they cover:
// light pooling where a gap lets the sun in, deep shade under the
// thickest masses, a cloud's shadow mid-jungle.
function patch(cx, cy, rx, ry, r) {
  stamp(cx, cy, rx, ry, (x, y) => {
    if (inside(x, y) && rung[at(x, y)] >= 0 && ladderOf[at(x, y)] === 0) setGround(x, y, 0, r);
  });
}

patch(28, 30, 18, 5, 1); // sunlit pool, upper left
patch(148, 26, 16, 4.5, 1); // sunlit pool, upper right
patch(120, 44, 18, 4, 3); // deep shade, mid right
patch(40, 50, 16, 4, 3); // deep shade, low left
patch(70, 22, 12, 2.5, 0); // bright break just left of the gap

// Leaf speckle: small clusters one rung off the ground they sit on,
// so the canopy reads as leaves, not flat paint. Denser and larger
// toward the viewer, the cheapest perspective there is.
const SPECKS = [
  [[0, 0], [1, 0]],
  [[0, 0], [1, 1], [2, 0]],
  [[1, 0], [0, 1], [2, 1]],
];
for (let y = 10; y < H; y += 1) {
  const count = 1 + Math.floor(((y - 10) / (H - 10)) * 7);
  for (let n = 0; n < count; n += 1) {
    const x = 1 + Math.floor(rng() * (W - 6));
    if (y < canopyTop(x) + 1) continue;
    const shape = SPECKS[Math.floor(rng() * SPECKS.length)];
    const here = rung[at(x, y)];
    if (here < 0) continue;
    const r = here >= 3 ? here - 1 : here + 1;
    for (const [dx, dy] of shape) {
      const gx = x + dx;
      const gy = y + dy;
      if (inside(gx, gy) && rung[at(gx, gy)] >= 0 && ladderOf[at(gx, gy)] === 0) {
        setGround(gx, gy, 0, r);
      }
    }
  }
}

// Rim light on the canopy ceiling: cells on the top edge, where the
// sky opens above, take the lit greens — the light catching the top
// of the jungle. It stops partway across, where the light gives up.
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    if (rung[at(x, y)] < 0 || ladderOf[at(x, y)] !== 0) continue;
    const openAbove = !inside(x, y - 1) || rung[at(x, y - 1)] < 0 || ladderOf[at(x, y - 1)] !== 0;
    if (openAbove && y < canopyTop(x) + 2) setGround(x, y, 0, 0);
  }
}

/* ----- mid-ground canopy masses ----- */

// The flat fill alone reads as a lawn, not a jungle. Three big lobed
// masses stand in front of it, left and right of the river, each
// shaded like the emergent crown — deep at the lower right, lit at
// the upper left, rim light on the top edge — so the jungle stacks
// in layers: far ridge, near ridge, these masses, the river banks,
// the foreground. They are subjects, off the ladders, the way Ben's
// tree is: the breeze passes behind them.
function canopyMass(cx, cy, rx, ry, lobes) {
  const mask = new Uint8Array(W * H);
  stamp(cx, cy, rx, ry, (x, y) => {
    if (inside(x, y)) mask[at(x, y)] = 1;
  });
  for (const [lx, ly, lrx, lry] of lobes) {
    stamp(lx, ly, lrx, lry, (x, y) => {
      if (inside(x, y)) mask[at(x, y)] = 1;
    });
  }
  const massStamp = (sx, sy, srx, sry, colour) => {
    stamp(sx, sy, srx, sry, (x, y) => {
      if (inside(x, y) && mask[at(x, y)]) setStill(x, y, colour);
    });
  };
  for (let i = 0; i < W * H; i += 1) {
    if (mask[i]) {
      base[i] = 8;
      rung[i] = -1;
    }
  }
  massStamp(cx + 2, cy + 1, rx * 0.8, ry * 0.75, 9);
  massStamp(cx - 2, cy, rx * 0.7, ry * 0.7, 10);
  massStamp(cx - 4, cy - 2, rx * 0.45, ry * 0.5, 11);
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (!mask[at(x, y)]) continue;
      const openAbove = !inside(x, y - 1) || !mask[at(x, y - 1)];
      if (openAbove) setStill(x, y, x < cx + 2 ? 12 : 11);
    }
  }
}
canopyMass(28, 32, 20, 7, [[14, 35, 9, 5], [42, 29, 9, 5]]);
canopyMass(152, 36, 18, 6.5, [[138, 33, 8, 4.5], [164, 33, 8, 4.5]]);
canopyMass(58, 48, 14, 5.5, [[48, 50, 7, 4], [68, 46, 7, 4]]);
canopyMass(168, 18, 12, 4.5, [[158, 20, 7, 3.5]]);


/* ----- the emergent tree ----- */

// One tree taller than the rest, rising out of the ceiling on the
// left of the gap, the way emergent trees poke above a real canopy.
// Trunk first, then a crown built from overlapping ellipses and
// shaded in stamps: deep at the lower right, lit at the upper left.
const emergentX = 52;
for (let y = 14; y <= 34; y += 1) {
  const cx = emergentX - Math.round((34 - y) * 0.03);
  setStill(cx, y, 14);
  setStill(cx + 1, y, 15);
}
function branch(x0, y0, x1, y1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(x0 + ((x1 - x0) * i) / steps);
    const y = Math.round(y0 + ((y1 - y0) * i) / steps);
    setStill(x, y, 14);
    setStill(x, y + 1, 15);
  }
}
branch(52, 16, 42, 9);
branch(52, 15, 62, 8);

const crownMask = new Uint8Array(W * H);
for (const [cx, cy, rx, ry] of [
  [52, 8, 15, 5.5],
  [40, 10, 9, 4],
  [64, 10, 9, 4],
  [46, 4, 8, 3.5],
  [58, 4, 8, 3.5],
]) {
  stamp(cx, cy, rx, ry, (x, y) => {
    if (inside(x, y)) crownMask[at(x, y)] = 1;
  });
}
function crownStamp(cx, cy, rx, ry, colour) {
  stamp(cx, cy, rx, ry, (x, y) => {
    if (inside(x, y) && crownMask[at(x, y)]) setStill(x, y, colour);
  });
}
for (let i = 0; i < W * H; i += 1) {
  if (crownMask[i]) {
    base[i] = 8;
    rung[i] = -1;
  }
}
crownStamp(55, 9, 11, 4, 9);
crownStamp(48, 10, 9, 3.5, 9);
crownStamp(50, 7, 10, 3.5, 10);
crownStamp(44, 6, 6, 2.5, 10);
crownStamp(48, 4, 7, 2.5, 11);
crownStamp(58, 4, 5, 2, 11);
// Rim light on the crown's top edge, where the sky opens above.
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    if (!crownMask[at(x, y)]) continue;
    const openAbove = !inside(x, y - 1) || !crownMask[at(x, y - 1)];
    if (openAbove) setStill(x, y, x < 56 ? 12 : 11);
  }
}
crownStamp(46, 3, 1.6, 0.8, 13);
crownStamp(56, 2, 1.4, 0.7, 13);

/* ----- the right palm ----- */

// A palm leaning in from the right, its fronds arching over the
// river. Trunk in stepped diagonals, fronds as long thin lobes.
const palmBaseX = 168;
for (let i = 0; i <= 26; i += 1) {
  const x = Math.round(palmBaseX - i * 0.45);
  const y = 52 - i;
  setStill(x, y, 14);
  setStill(x + 1, y, 16);
}
for (const [cx, cy, rx, ry, colour] of [
  [150, 24, 16, 3.2, 9],
  [142, 20, 13, 2.8, 9],
  [158, 20, 12, 2.8, 10],
  [136, 27, 11, 2.6, 9],
  [162, 25, 10, 2.4, 10],
]) {
  stamp(cx, cy, rx, ry, (x, y) => {
    if (inside(x, y)) setStill(x, y, colour);
  });
}
// Frond tips catch the light.
for (const [fx, fy] of [[134, 22], [146, 18], [166, 23]]) {
  setStill(fx, fy, 12);
  setStill(fx + 1, fy, 12);
}

/* ----- god rays ----- */

// Light beaming down through the gap, in two slanting bands: one
// falling left toward the ferns, one falling right toward the palms.
// The bands are drawn over the canopy in pale gold, their edges
// broken on a fixed Bayer threshold so they read as light through
// leaves, not ruled bars. Off the ladders: the breeze passes behind
// them, and at night the same cells read as moonbeams.
function rayBand(x0, y0, x1, y1, halfW) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i += 1) {
    const cx = x0 + ((x1 - x0) * i) / steps;
    const cy = y0 + ((y1 - y0) * i) / steps;
    for (let w = -halfW; w <= halfW; w += 1) {
      const x = Math.round(cx + w);
      const y = Math.round(cy);
      if (!inside(x, y)) continue;
      // Dappled, not solid: the beam is broken by leaves all the
      // way across, denser in its heart than at its edges, so it
      // reads as light falling through a canopy, not a painted bar.
      const bayer = (BAYER_4[y % 4][x % 4] + 0.5) / 16;
      const gate = Math.abs(w) <= 1 ? 0.75 : 0.45;
      if (bayer >= gate) continue;
      // Only where the canopy is: rays do not paint the sky or
      // the river, which are drawn over or under them already.
      if (rung[at(x, y)] >= 0 && ladderOf[at(x, y)] === 0) {
        setStill(x, y, Math.abs(w) <= 1 ? 18 : 17);
      }
    }
  }
}
rayBand(86, 22, 52, 52, 3);
rayBand(96, 22, 132, 50, 3);

/* ----- the river ----- */

// The body of water streaming through the middle. It springs from
// the bright gap at the top, winds gently as it comes toward the
// viewer, and widens as it comes — narrow at the source, broad where
// it leaves at the bottom, the cheapest perspective there is.
// Water is darkest at the banks and lightest in the middle, where
// the sun hits it; seeded sparkle cells catch the brightest rung.
const riverCx = (y) => 90 + 6 * Math.sin((y - 24) / 15) + 2.5 * Math.sin(y / 6 + 1);
const riverHw = (y) => 4.5 + Math.max(0, y - 24) * 0.19;

// The spring pool, where the river is born in the light.
stamp(90, 27, 7, 3, (x, y) => {
  if (inside(x, y)) setGround(x, y, 1, 1);
});
stamp(90, 27, 4.5, 2, (x, y) => {
  if (inside(x, y)) setGround(x, y, 1, 0);
});

for (let y = 26; y < H; y += 1) {
  const cx = riverCx(y);
  const hw = riverHw(y);
  for (let x = Math.floor(cx - hw); x <= Math.ceil(cx + hw); x += 1) {
    if (!inside(x, y)) continue;
    const d = Math.abs(x - cx) / hw; // 0 in the middle, 1 at the bank
    const r = d < 0.35 ? 1 : d < 0.7 ? 2 : 3;
    setGround(x, y, 1, r);
  }
}

// Sparkle: seeded cells in the middle of the river take the
// brightest rung, sun glinting on moving water.
for (let n = 0; n < 26; n += 1) {
  const y = 28 + Math.floor(rng() * (H - 30));
  const cx = riverCx(y);
  const x = Math.round(cx + (rng() - 0.5) * riverHw(y));
  if (inside(x, y) && ladderOf[at(x, y)] === 1) setGround(x, y, 1, 0);
  if (inside(x + 1, y) && ladderOf[at(x + 1, y)] === 1 && rng() < 0.5) {
    setGround(x + 1, y, 1, 0);
  }
}

// Banks: wet earth along both edges of the river, with rocks sitting
// in and beside the water, and roots gripping the near bank.
for (let y = 26; y < H; y += 1) {
  const cx = riverCx(y);
  const hw = riverHw(y);
  for (const side of [-1, 1]) {
    const edge = Math.round(cx + side * hw);
    for (let b = 1; b <= 3; b += 1) {
      const x = edge + side * b;
      if (!inside(x, y)) continue;
      if (rung[at(x, y)] >= 0 && ladderOf[at(x, y)] === 0) {
        setStill(x, y, 23);
      }
    }
  }
}
const ROCKS = [
  [76, 34, 3, 2], [104, 40, 3.5, 2.2], [82, 48, 2.5, 1.8],
  [108, 55, 4, 2.4], [74, 58, 3, 2], [100, 63, 3, 2],
];
for (const [rx, ry, rw, rh] of ROCKS) {
  stamp(rx, ry, rw, rh, (x, y) => {
    if (inside(x, y)) setStill(x, y, 24);
  });
  stamp(rx, ry + 0.8, rw * 0.7, rh * 0.6, (x, y) => {
    if (inside(x, y)) setStill(x, y, 25);
  });
  setStill(Math.round(rx - rw * 0.5), Math.round(ry - rh * 0.5), 22);
}

/* ----- the big left tree ----- */

// An old tree on the left bank, its trunk thick, its buttress roots
// spreading wide at the base the way rainforest trees brace
// themselves, its branches reaching over the river.
const leftTrunkX = 20;
for (let y = 30; y <= 60; y += 1) {
  const cx = leftTrunkX - Math.round((60 - y) * 0.05);
  const half = y >= 52 ? 3 : 2;
  for (let x = cx - half; x <= cx + half; x += 1) {
    setStill(x, y, x === cx + half ? 15 : 14);
  }
  if (y >= 56) setStill(cx - half - 1, y, 16);
}
// Buttress roots, stepped fins spreading from the trunk's foot.
for (const [rx0, ry0, rx1, ry1] of [
  [17, 60, 8, 66],
  [23, 60, 32, 66],
  [20, 60, 20, 67],
]) {
  branch(rx0, ry0, rx1, ry1);
}
branch(19, 36, 10, 28);
branch(20, 34, 30, 26);

// Broad leaves overhanging the river from the left tree: big lobed
// stamps, lit on their upper left edges.
const leafMask = new Uint8Array(W * H);
for (const [cx, cy, rx, ry] of [
  [30, 26, 10, 4.5],
  [38, 30, 8, 4],
  [24, 22, 7, 3.5],
]) {
  stamp(cx, cy, rx, ry, (x, y) => {
    if (inside(x, y)) leafMask[at(x, y)] = 1;
  });
}
function leafStamp(cx, cy, rx, ry, colour) {
  stamp(cx, cy, rx, ry, (x, y) => {
    if (inside(x, y) && leafMask[at(x, y)]) setStill(x, y, colour);
  });
}
for (let i = 0; i < W * H; i += 1) {
  if (leafMask[i]) {
    base[i] = 9;
    rung[i] = -1;
  }
}
leafStamp(32, 27, 8, 3.5, 10);
leafStamp(28, 24, 6, 3, 11);
leafStamp(38, 29, 5, 2.5, 10);
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    if (!leafMask[at(x, y)]) continue;
    const openAbove = !inside(x, y - 1) || !leafMask[at(x, y - 1)];
    if (openAbove) setStill(x, y, 12);
  }
}

/* ----- vines ----- */

// Vines hanging from the canopy ceiling, each a thin stepped line
// with a leaf blob at its end. They hang over the river and the
// banks, never over the sky.
function vine(x, topY, len) {
  let y = topY;
  let vx = x;
  for (let i = 0; i < len; i += 1) {
    setStill(vx, y, 9);
    if (i % 3 === 2) setStill(vx + 1, y, 8);
    y += 1;
    if (i % 4 === 3) vx += rng() < 0.5 ? -1 : 1;
    if (y >= H - 2) break;
  }
  stamp(vx, y, 2.2, 1.6, (lx, ly) => {
    if (inside(lx, ly)) setStill(lx, ly, 10);
  });
  setStill(vx, y, 12);
}
vine(34, 16, 12);
vine(66, 18, 9);
vine(118, 16, 13);
vine(142, 14, 8);
vine(56, 20, 7);

/* ----- banana leaves, right bank ----- */

// Big banana leaves arching over the river from the right, each a
// long lobe with a pale midrib down its middle.
function bananaLeaf(cx, cy, rx, ry, tilt) {
  // Dark body so the leaf reads against the mid-green canopy, a
  // lit upper surface, and a pale midrib down its middle.
  stamp(cx, cy, rx, ry, (x, y) => {
    if (!inside(x, y)) return;
    setStill(x, y, 9);
  });
  stamp(cx - 2, cy - 1, rx * 0.7, ry * 0.6, (x, y) => {
    if (!inside(x, y)) return;
    setStill(x, y, 11);
  });
  // The midrib: a stepped line along the leaf's tilt.
  const steps = Math.round(rx * 1.6);
  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(cx - rx + (2 * rx * i) / steps);
    const y = Math.round(cy + tilt * (i / steps) * ry * 0.4);
    if (inside(x, y)) setStill(x, y, 33);
  }
}
bananaLeaf(128, 34, 14, 3.5, -1);
bananaLeaf(134, 42, 12, 3.2, 1);
bananaLeaf(122, 48, 10, 3, -1);
// Bamboo stems, far right, a quiet vertical rhythm.
for (const bx of [160, 165, 171, 176]) {
  for (let y = 30; y <= 62; y += 1) {
    setStill(bx, y, y % 6 === 0 ? 30 : 10);
  }
}

/* ----- ferns ----- */

// Ferns are clusters, never a lone cell, growing thick along both
// banks and thinning toward the back. They keep a rung, so the
// breeze moves through them like any other ground.
const FERN = [
  [[1, 0], [0, 1], [2, 1]],
  [[0, 0], [2, 0], [1, 1], [3, 1], [0, 2], [2, 2]],
  [[2, 0], [1, 1], [3, 1], [0, 2], [2, 2], [4, 2]],
];
for (let y = 28; y < H; y += 1) {
  const nearRiver = (x) => Math.abs(x - riverCx(y)) < riverHw(y) + 14;
  const count = 1 + Math.floor(((y - 28) / (H - 28)) * 5);
  for (let n = 0; n < count; n += 1) {
    const x = 2 + Math.floor(rng() * (W - 8));
    if (!nearRiver(x)) continue;
    if (y < canopyTop(x) + 1) continue;
    const shape = FERN[y < 48 ? 0 : y < 58 ? 1 : 2];
    const here = rung[at(x, y)];
    if (here < 0 || ladderOf[at(x, y)] !== 0) continue;
    const r = here >= 3 ? here - 1 : here + 1;
    const depth = shape.reduce((m, [, d]) => Math.max(m, d), 0);
    for (const [dx, dy] of shape) {
      const gx = x + dx;
      const gy = y - depth + dy;
      if (inside(gx, gy) && rung[at(gx, gy)] >= 0 && ladderOf[at(gx, gy)] === 0) {
        setGround(gx, gy, 0, r);
      }
    }
    // A pale tip on the tallest fronds.
    if (rng() < 0.4) setStill(x + 1, y - depth, 30);
  }
}

// Flowers: heliconia red and orange on the left bank, orchid pink on
// the right, small yellow clusters near the water. Three-cell
// clusters, above the ferns, so the breeze passes under them and
// they stay lit. Their positions are recorded so the night scene can
// put most of them to sleep.
const flowerClusters = [];
function flowers(x, y, colour) {
  set(x, y, colour);
  set(x + 1, y, colour);
  set(x, y + 1, colour);
  // Flowers are subjects, not ground: clear the weather rung on their
  // cells, so a breeze passes under them and they stay lit.
  for (const [dx, dy] of [[0, 0], [1, 0], [0, 1]]) {
    if (inside(x + dx, y + dy)) rung[at(x + dx, y + dy)] = -1;
  }
  flowerClusters.push([x, y]);
}
for (let n = 0; n < 7; n += 1) {
  const y = 34 + Math.floor(rng() * 24);
  const x = Math.round(riverCx(y) - riverHw(y) - 8 - rng() * 10);
  if (inside(x, y) && rung[at(x, y)] >= 0) flowers(x, y, rng() < 0.6 ? 26 : 27);
}
for (let n = 0; n < 6; n += 1) {
  const y = 32 + Math.floor(rng() * 26);
  const x = Math.round(riverCx(y) + riverHw(y) + 6 + rng() * 10);
  if (inside(x, y) && rung[at(x, y)] >= 0) flowers(x, y, rng() < 0.6 ? 28 : 29);
}

/* ----- foreground ----- */

// A dark near bank closes the bottom of the scene, the way a dark
// bank frames a view: a wavy top edge at the canopy's deepest rung,
// and the last two rows in canopy deep, off the ladder entirely so
// the weather never lifts them. The river keeps its gap through the
// middle, flowing out of the frame toward the viewer.
const fgTop = (x) =>
  Math.round(66.5 - 1.2 * Math.sin(x / 19 + 1) - 0.8 * Math.sin(x / 7.3));

for (let x = 0; x < W; x += 1) {
  if (Math.abs(x - riverCx(H - 1)) < riverHw(H - 1) + 1) continue;
  for (let y = fgTop(x); y < H; y += 1) {
    if (y >= H - 2) {
      set(x, y, 8);
      rung[at(x, y)] = -1;
    } else {
      setGround(x, y, 0, 3);
    }
  }
}

// Silhouette ferns standing on the foreground band's edge, in canopy
// deep and off the ladder: the nearest leaves in the scene, unlit.
for (let n = 0; n < 26; n += 1) {
  const x = 2 + Math.floor(rng() * (W - 8));
  if (Math.abs(x - riverCx(H - 1)) < riverHw(H - 1) + 4) continue;
  const shape = FERN[rng() < 0.5 ? 1 : 2];
  const depth = shape.reduce((m, [, d]) => Math.max(m, d), 0);
  const baseY = fgTop(x) + 1;
  for (const [dx, dy] of shape) {
    const gx = x + dx;
    const gy = baseY - depth + dy;
    if (!inside(gx, gy)) continue;
    set(gx, gy, 8);
    rung[at(gx, gy)] = -1;
  }
}

// The tree, the palm, the leaves and the rocks were drawn over ground,
// and the cells they cover keep the ground's weather rung, so a passing
// breeze used to repaint them in ladder greens. Their colours belong
// to no ladder, so any cell wearing one is a subject, not ground:
// clear its rung and the weather passes behind it.
for (let i = 0; i < W * H; i += 1) {
  if (base[i] === 8 || base[i] === 14 || base[i] === 15 || base[i] === 16) rung[i] = -1;
}

// The ridge pieces get the same protection, and one more besides:
// they were drawn over sky, so their cells should already be
// rung-free; this pass makes it certain, and records them in
// vistaMask so the clouds pass behind them too.
const vistaMask = new Uint8Array(W * H);
for (let i = 0; i < W * H; i += 1) {
  if (base[i] === 6 || base[i] === 7) {
    rung[i] = -1;
    vistaMask[i] = 1;
  }
}

/* ----- butterflies and fireflies ----- */

// Butterflies are not baked into the scene: they are kept as small
// cell maps and composited over it, like the clouds, so at night they
// simply are not drawn — they have gone to rest, and the jungle
// underneath is untouched. Each one drifts inside its own box near
// the river, stepping one cell at a time on its own timetable.
const BUTTERFLY_CELLS = [
  [0, 0, 31],
  [2, 0, 31],
  [1, 0, 32],
  [1, 1, 32],
];
const butterflies = [
  { x: 66, y: 44, box: [58, 78, 38, 52] },
  { x: 112, y: 38, box: [102, 124, 32, 46] },
];

// Fireflies live in the undergrowth and only show after dark. Each
// one has a phase on the same slow cycle — dim, lit, bright, lit —
// so they blink out of step with each other, like a real jungle
// at night. Under reduced motion they park at lit, steady.
const FIREFLY_CYCLE = [
  [0, 1800], // dim
  [1, 900], // lit
  [2, 600], // bright
  [1, 800], // lit again, on the way down
];
const FIREFLY_RUNGS = [37, 38, 39];
const fireflies = [];
{
  const frng = mulberry32(20261125);
  const spots = [
    [30, 58], [48, 62], [70, 56], [88, 60],
    [112, 58], [130, 62], [148, 56], [162, 60],
  ];
  for (const [fx, fy] of spots) {
    fireflies.push({ x: fx, y: fy, step: Math.floor(frng() * FIREFLY_CYCLE.length) });
  }
}

/* ----- the night scene ----- */

// The same geometry, re-lit. nightBase starts as a copy of the day
// cells; most of the night is then just the night palette reading the
// same indices. A few things are drawn differently: the flowers
// sleep, the birds go home, a moon hangs in the bright gap, and a
// sparse set of star clusters lights in the sky the clouds leave
// empty. The butterflies need no work — they are overlays, drawn
// only by day. The fireflies are overlays too, drawn only by night.
const nightBase = Uint8Array.from(base);

// All but the first two flower clusters fold back into the canopy's
// deepest shade. The two that stay keep their slots, paled by the
// night palette like everything else.
flowerClusters.forEach(([fx, fy], i) => {
  if (i < 2) return;
  for (const [dx, dy] of [
    [0, 0],
    [1, 0],
    [0, 1],
  ]) {
    if (inside(fx + dx, fy + dy)) nightBase[at(fx + dx, fy + dy)] = 8;
  }
});

// The two birds go home at night: their cells take back the sky
// colour they were drawn over, so the gap is empty of them after dark.
for (const [bx, by] of [
  [80, 9],
  [99, 12],
]) {
  for (const [dx, dy] of [
    [0, 1],
    [1, 0],
    [2, 1],
  ]) {
    if (inside(bx + dx, by + dy)) nightBase[at(bx + dx, by + dy)] = skyColour(bx + dx, by + dy);
  }
}

// The moon: a small disc in the face colour, with the cells on its top
// and left edge, where the light would catch a rim, in the lit colour.
const moonCells = new Set();
stamp(96, 4, 2.9, 2.9, (x, y) => {
  if (!inside(x, y)) return;
  nightBase[at(x, y)] = 35;
  moonCells.add(at(x, y));
});
for (const i of moonCells) {
  const x = i % W;
  const y = Math.floor(i / W);
  const openAbove = !moonCells.has(at(x, y - 1));
  const openLeft = !moonCells.has(at(x - 1, y));
  if (openAbove || openLeft) nightBase[i] = 34;
}

// Stars, sparse and clustered, placed only where every cell of the
// cluster lands on open sky inside the gap: a cluster that would
// touch the canopy or the moon is skipped whole rather than clipped.
const nrng = mulberry32(20261126);
const STAR_SHAPES = {
  triple: [[0, 0], [1, 0], [0, 1]],
  dot: [[0, 0]],
};
for (const [sx, sy, shape] of [
  [78, 2, "triple"],
  [84, 7, "dot"],
  [100, 6, "triple"],
  [92, 10, "dot"],
  [76, 12, "dot"],
  [104, 3, "dot"],
]) {
  const cx = sx + Math.floor(nrng() * 3) - 1;
  const cy = sy + Math.floor(nrng() * 3) - 1;
  const cells = STAR_SHAPES[shape].map(([dx, dy]) => [cx + dx, cy + dy]);
  const open = cells.every(([x, y]) => inside(x, y) && nightBase[at(x, y)] <= 3);
  if (!open) continue;
  for (const [x, y] of cells) nightBase[at(x, y)] = 36;
}

/* ---------- painting ---------- */

const toRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const DAY_RGB = PALETTE.map(toRgb);
const NIGHT_RGB = NIGHT_PALETTE.map(toRgb);

// What paint() reads: the day cells under the day palette, or the night
// cells under the night palette. The wiring swaps the pair together
// whenever the resolved theme changes.
let scene = base;
let RGB = DAY_RGB;

// Where the clouds are right now: an origin column per cloud, and a
// gap flag for a cloud that has stepped off the right edge and is
// waiting out its empty-sky pause before stepping in from the left.
const cloudState = cloudShapes.map((shape) => ({ shape, x: shape.cx, gap: false }));

// Reveal blocks of 6 x 6 cells, scrambled once with the same seed, so
// the scene arrives in the same order on every load. An unopened block
// shows a pale mist: horizon colour dithered with the band above it.
const BLOCK = 6;
const BW = W / BLOCK;
const BH = H / BLOCK;
const blockOrder = [];
for (let i = 0; i < BW * BH; i += 1) blockOrder.push(i);
for (let i = blockOrder.length - 1; i > 0; i -= 1) {
  const j = Math.floor(rng() * (i + 1));
  [blockOrder[i], blockOrder[j]] = [blockOrder[j], blockOrder[i]];
}
const blockRank = new Int16Array(BW * BH);
blockOrder.forEach((block, rank) => (blockRank[block] = rank));

function coverColour(x, y) {
  return BAYER_4[y % 4][x % 4] < 4 ? 2 : 3;
}

// Weather geometry. A breeze is a band whose front is a row of the
// jungle: it starts above the canopy and advances toward the viewer,
// so the high leaves light first and the low ferns last. The front
// is not a ruler: a wobble holds it a row or two early here and late
// there, so it rolls rather than descends. The river's shimmer is the
// same idea on the water: a band rolling down the river, the water
// cells inside it stepping one rung brighter, like sun moving on
// the surface.
const breezeWobble = (x) => 1.5 * Math.sin(x / 16 + 0.7) + 0.8 * Math.sin(x / 6.3 + 2.0);
const BREEZE_FRINGE = 1.4; // rows of broken edge at the band's front and tail

function paint(ctx, frame, revealed, fx) {
  const px = frame.data;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = at(x, y);
      const block = Math.floor(y / BLOCK) * BW + Math.floor(x / BLOCK);
      let colour;
      if (blockRank[block] >= revealed) {
        colour = coverColour(x, y);
      } else {
        colour = scene[i];
        // The weather: canopy inside the breeze's band steps one rung
        // brighter, water inside the shimmer's band steps one rung
        // brighter, and the two compose where a band crosses the
        // river's edge. Everything else keeps its colour exactly.
        if (rung[i] >= 0 && fx !== null) {
          let r = rung[i];
          if (fx.breeze !== null && ladderOf[i] === 0) {
            const d = fx.breeze.row + breezeWobble(x + fx.breeze.phase) - y;
            if (d >= 0 && d <= fx.breeze.depth) {
              const edge = Math.min(d, fx.breeze.depth - d);
              const bayer = (BAYER_4[y % 4][x % 4] + 0.5) / 16;
              if (edge >= BREEZE_FRINGE || bayer < edge / BREEZE_FRINGE) r -= 1;
            }
          }
          if (fx.shimmer !== null && ladderOf[i] === 1) {
            const d = fx.shimmer.row - y;
            if (d >= 0 && d <= fx.shimmer.depth) {
              const edge = Math.min(d, fx.shimmer.depth - d);
              const bayer = (BAYER_4[y % 4][x % 4] + 0.5) / 16;
              if (edge >= BREEZE_FRINGE || bayer < edge / BREEZE_FRINGE) r -= 1;
            }
          }
          if (r !== rung[i]) {
            const ladder = LADDERS[ladderOf[i]];
            colour = ladder[Math.min(ladder.length - 1, Math.max(0, r))];
          }
        }
      }
      const o = i * 4;
      const [r, g, b] = RGB[colour];
      px[o] = r;
      px[o + 1] = g;
      px[o + 2] = b;
      px[o + 3] = 255;
    }
  }
  // Butterflies, by day only: their cells ride over the scene at
  // whatever step the timetable has reached. An unopened reveal
  // block covers them the way it covers everything else.
  if (scene === base) {
    for (const fly of butterflies) {
      for (const [dx, dy, colour] of BUTTERFLY_CELLS) {
        const x = fly.x + dx;
        const y = fly.y + dy;
        if (!inside(x, y)) continue;
        const i = at(x, y);
        const block = Math.floor(y / BLOCK) * BW + Math.floor(x / BLOCK);
        if (blockRank[block] >= revealed) continue;
        const o = i * 4;
        const [r, g, b] = RGB[colour];
        px[o] = r;
        px[o + 1] = g;
        px[o + 2] = b;
        px[o + 3] = 255;
      }
    }
  }
  // Fireflies, after dark only: each one shows the rung its cycle
  // has reached, dim, lit, or bright. Whole-cell swaps, like
  // everything else here.
  if (scene === nightBase) {
    for (const firefly of fireflies) {
      const i = at(firefly.x, firefly.y);
      const block =
        Math.floor(firefly.y / BLOCK) * BW + Math.floor(firefly.x / BLOCK);
      if (blockRank[block] >= revealed) continue;
      const o = i * 4;
      // The rung below is the cycle's current step: dim (0), lit (1),
      // bright (2). The step index is the cycle position, not the rung.
      const rungNow = FIREFLY_CYCLE[firefly.step][0];
      const [fr, fg, fb] = RGB[FIREFLY_RUNGS[rungNow]];
      px[o] = fr;
      px[o + 1] = fg;
      px[o + 2] = fb;
      px[o + 3] = 255;
    }
  }
  // The clouds ride over the sky and under everything else: a cell a
  // cloud covers takes the cloud's colour only when what lies beneath
  // it belongs to the sky — the day bands by day, and at night also
  // the moon and the stars, which a passing cloud duly eclipses for
  // a while. The canopy, the birds, the ground, and the ridge pieces
  // are subjects, not sky, so the clouds pass behind them.
  for (const cloud of cloudState) {
    if (cloud.gap) continue;
    for (const cell of cloud.shape.cells) {
      const x = cloud.x + cell.dx;
      const y = cloud.shape.cy + cell.dy;
      if (!inside(x, y)) continue;
      const i = at(x, y);
      const block = Math.floor(y / BLOCK) * BW + Math.floor(x / BLOCK);
      if (blockRank[block] >= revealed) continue;
      const under = scene[i];
      const sky =
        !vistaMask[i] &&
        (under <= 3 || (scene === nightBase && under >= 34 && under <= 36));
      if (!sky) continue;
      const o = i * 4;
      const [r, g, b] = RGB[cell.colour];
      px[o] = r;
      px[o + 1] = g;
      px[o + 2] = b;
      px[o + 3] = 255;
    }
  }
  ctx.putImageData(frame, 0, 0);
}

/* ---------- wiring ---------- */

// Seven steps on the site's 75 ms tick: the scene generates in about
// half a second.
const REVEAL_STEPS = 7;
const STEP_MS = 75; // the site's --motion-step
const WEATHER_TICK_MS = 120;
const REST_MS = 2500; // the pause before the first breeze
const BREEZE_START_ROW = 8; // above the canopy ceiling
const SHIMMER_START_ROW = 26; // where the river springs

for (const figure of document.querySelectorAll("[data-jungle]")) {
  const canvas = figure.querySelector("[data-jungle-canvas]");
  if (!canvas) continue;
  const ctx = canvas.getContext("2d");
  const frame = ctx.createImageData(W, H);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let revealed = reduced.matches ? BW * BH : 0;
  // The weather in flight: a breeze band by its front row and depth,
  // a shimmer band by its front row and depth. Either may be null,
  // and most of the time both are: stillness is the jungle's default
  // state, the way it is in a real forest between gusts.
  const fx = { breeze: null, shimmer: null };
  let onScreen = false;
  let started = false;

  // The scene follows the resolved theme the way Ben's meadow does:
  // the pinned [data-theme] when one is set, and the OS preference
  // in system mode, where the attribute is removed. On this landing
  // page there is no theme toggle yet, so it follows the visitor's
  // device setting; the preview page sets [data-theme] with buttons,
  // and this same wiring answers it. A swap re-renders the current
  // state (same reveal, same weather) in the other palette; nothing
  // restarts.
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const resolvedTheme = () =>
    document.documentElement.dataset.theme ||
    (systemDark.matches ? "dark" : "light");
  let theme = null;

  function applyTheme() {
    const next = resolvedTheme();
    if (next === theme) return;
    theme = next;
    scene = theme === "dark" ? nightBase : base;
    RGB = theme === "dark" ? NIGHT_RGB : DAY_RGB;
    paint(ctx, frame, revealed, fx);
  }

  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  systemDark.addEventListener("change", applyTheme);

  // Reduced motion holds the fireflies at their lit rung, steady and
  // unblinking: the firefly timetable below never starts, so the rung
  // set here is the one every paint reads.
  if (reduced.matches) {
    for (const firefly of fireflies) firefly.step = 1;
  }

  applyTheme();

  // The weather's timetable: cross, rest, cross. Timeouts rather than
  // an interval for the rests, so at rest the scene costs nothing at
  // all, and a wake that finds the figure off-screen or the tab hidden
  // simply sleeps again. One interval runs only while a breeze or a
  // shimmer is actually crossing, and the weather waits, mid-jungle,
  // while the tab is hidden or the figure is off-screen.
  function schedule(delay, fn) {
    setTimeout(() => {
      if (!onScreen || document.hidden) {
        schedule(1000, fn);
        return;
      }
      fn();
    }, delay);
  }

  // The timetable's own seed, so the scene's rolls stay untouched and
  // every load breathes to the same loose rhythm.
  const trng = mulberry32(20261127);
  let ticker = null;

  function startTicker() {
    if (ticker !== null) return;
    ticker = setInterval(tick, WEATHER_TICK_MS);
  }

  function tick() {
    if (!onScreen || document.hidden) return; // the weather waits
    if (fx.breeze !== null) {
      const t = Math.min(
        1,
        Math.max(0, (fx.breeze.row - BREEZE_START_ROW) / (H - BREEZE_START_ROW))
      );
      fx.breeze.row += 0.42 + 0.3 * t;
      fx.breeze.depth = (3 + 3.8 * t) * fx.breeze.depthScale;
      if (fx.breeze.row - fx.breeze.depth > H + 2) {
        fx.breeze = null;
        scheduleNextBreeze();
      }
    }
    if (fx.shimmer !== null) {
      fx.shimmer.row += 0.55;
      fx.shimmer.depth = 4;
      if (fx.shimmer.row - fx.shimmer.depth > H + 2) {
        fx.shimmer = null;
        scheduleNextShimmer();
      }
    }
    paint(ctx, frame, revealed, fx);
    if (fx.breeze === null && fx.shimmer === null) {
      clearInterval(ticker);
      ticker = null;
    }
  }

  function startBreeze() {
    if (fx.breeze !== null) return;
    const depthScale = 0.85 + trng() * 0.35;
    fx.breeze = {
      row: BREEZE_START_ROW,
      depth: 3 * depthScale,
      phase: trng() * 60,
      depthScale,
    };
    startTicker();
  }

  function scheduleNextBreeze() {
    const rest = 3000 + trng() * 5000;
    schedule(rest, startBreeze);
  }

  function startShimmer() {
    if (fx.shimmer !== null) return;
    fx.shimmer = { row: SHIMMER_START_ROW, depth: 4 };
    startTicker();
  }

  function scheduleNextShimmer() {
    const rest = 2000 + trng() * 4000;
    schedule(rest, startShimmer);
  }

  // The fireflies' own timetable: each one steps through its cycle
  // on the same chain, offset by its starting step, so they blink
  // out of step. Only the night scene reads them, so by day the
  // cycle turns nothing visible.
  function fireflyAdvance() {
    for (const firefly of fireflies) {
      firefly.step = (firefly.step + 1) % FIREFLY_CYCLE.length;
    }
    if (theme === "dark") paint(ctx, frame, revealed, fx);
    const dwell = FIREFLY_CYCLE[fireflies[0].step][1];
    schedule(dwell, fireflyAdvance);
  }

  // The butterflies' timetable: one butterfly steps one cell, then
  // the other, each inside its own box near the river. A step is one
  // whole cell, then a hold of a second or two: the stepped order
  // applied to wings.
  function butterflyStep() {
    const fly = butterflies[Math.floor(trng() * butterflies.length)];
    const dx = Math.floor(trng() * 3) - 1;
    const dy = Math.floor(trng() * 3) - 1;
    const [x0, x1, y0, y1] = fly.box;
    fly.x = Math.min(x1, Math.max(x0, fly.x + dx));
    fly.y = Math.min(y1, Math.max(y0, fly.y + dy));
    if (theme === "light") paint(ctx, frame, revealed, fx);
    schedule(900 + trng() * 1100, butterflyStep);
  }

  // The clouds' timetable: sparse timeout chains on the same schedule
  // helper as the weather, so a step that comes due while the figure
  // is off-screen or the tab is hidden simply waits, and between
  // steps the sky costs nothing at all. A step is one whole column.
  function scheduleCloud(cloud) {
    const baseMs = cloud.shape.interval;
    schedule(baseMs * (0.75 + trng() * 0.5), () => stepCloud(cloud));
  }

  function stepCloud(cloud) {
    if (cloud.gap) {
      cloud.gap = false;
      cloud.x = -cloud.shape.maxDx - 1;
    }
    cloud.x += 1;
    paint(ctx, frame, revealed, fx);
    if (cloud.x + cloud.shape.minDx >= W) {
      cloud.gap = true;
      schedule(8000 + trng() * 12000, () => stepCloud(cloud));
      return;
    }
    scheduleCloud(cloud);
  }

  function reveal() {
    if (started) return;
    started = true;
    if (reduced.matches) {
      revealed = BW * BH;
      paint(ctx, frame, revealed, fx);
      return; // no weather: the finished scene, held still
    }
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      revealed = Math.round((BW * BH * step) / REVEAL_STEPS);
      paint(ctx, frame, revealed, fx);
      if (step >= REVEAL_STEPS) {
        clearInterval(timer);
        schedule(REST_MS, startBreeze);
        schedule(1200 + trng() * 1500, startShimmer);
        schedule(3000, fireflyAdvance);
        schedule(2000 + trng() * 1000, butterflyStep);
        for (const cloud of cloudState) scheduleCloud(cloud);
      }
    }, STEP_MS);
  }

  const watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        onScreen = entry.isIntersecting;
        if (onScreen) reveal();
      }
    },
    { threshold: 0.3 }
  );
  watcher.observe(figure);
}
