/* SoulHauss art. Original drawings, made here in code.
   Each woman is one ink profile with flat colour laid slightly off-register behind it,
   a rim of light along her face and a halo that slowly turns. Height, shape, skin,
   hair, tattoos and piercings are all set per woman, so no two are alike. */
(() => {
  const INK = '#2A2413';
  const LIGHT = '#F6EEDD';
  const P = { pop: '#BF4317', amber: '#D08838', gold: '#E9B454', sand: '#EBD3A4', sage: '#B9BC8F', sageDeep: '#7C8450', olive: '#3A3D1F', paper: '#F3EFDD', wine: '#4E1D18' };
  const n = (v) => Number(v).toFixed(1);

  /* Three different profiles. All start at the hairline (176,96) and end under the ear (250,262). */
  const FACES = {
    a: {
      profile: 'M176,96C152,112 138,146 140,176C141,184 146,190 146,196C140,212 122,226 112,238C106,246 116,254 132,250C130,256 126,260 122,262C114,264 106,268 108,274C110,277 113,278 116,278C108,282 104,290 110,296C114,300 120,302 126,302C120,308 114,320 120,330C124,338 132,342 142,342C166,342 196,336 214,322C232,308 244,286 250,262',
      seam: 'M116,278C128,281 142,279 153,270', nostril: 'M140,238C132,234 128,244 136,250', stud: [137, 240], ring: 'M118,251a8,8 0 0 0 14,3',
      lips: 'M122,262C114,264 106,268 108,274C110,277 113,278 116,278C108,282 104,290 110,296C114,300 120,302 126,302C140,300 150,288 152,272C142,268 130,264 122,262Z'
    },
    b: {
      profile: 'M176,96C154,112 142,146 144,178C144,186 148,192 148,198C140,214 124,232 116,244C112,250 120,256 134,254C132,260 128,264 126,266C120,268 116,272 118,277C120,279 122,280 124,280C116,284 114,290 118,294C122,298 126,300 130,300C124,308 120,322 126,334C130,342 140,346 150,344C174,340 204,330 222,314C238,300 246,282 250,262',
      seam: 'M124,280C134,282 146,280 155,272', nostril: 'M142,242C136,240 132,248 138,254', stud: [139, 245], ring: 'M121,255a8,8 0 0 0 14,3',
      lips: 'M126,266C120,268 116,272 118,277C120,279 122,280 124,280C116,284 114,290 118,294C122,298 126,300 130,300C142,298 152,288 154,274C144,270 134,266 126,266Z'
    },
    c: {
      profile: 'M176,96C150,110 136,148 138,178C138,186 144,192 144,198C140,210 126,222 120,232C114,240 122,248 134,246C132,252 128,258 124,260C116,262 108,268 110,274C112,277 116,278 118,278C110,282 106,290 112,296C116,300 122,302 128,302C120,310 116,326 124,338C132,350 148,354 162,352C188,352 216,340 232,320C244,304 250,284 250,262',
      seam: 'M118,278C130,281 144,279 155,270', nostril: 'M142,232C134,228 130,238 138,244', stud: [139, 235], ring: 'M122,247a8,8 0 0 0 14,3',
      lips: 'M124,260C116,262 108,268 110,274C112,277 116,278 118,278C110,282 106,290 112,296C116,300 122,302 128,302C142,300 152,288 154,272C144,268 132,262 124,260Z',
      extra: 'M152,354C172,368 206,360 228,338'
    }
  };
  const C = {
    eye: 'M160,202C171,212 189,212 200,202',
    crease: 'M161,194C172,187 190,187 201,195',
    lash: 'M199,203l9,1M196,207l9,5M191,210l6,8',
    brow: 'M152,180C166,166 192,164 208,175',
    ear: 'M252,230C270,220 282,238 272,256C268,266 258,268 256,260M260,238C266,241 266,250 262,254',
    neckF: 'M152,344C156,372 150,402 128,432C116,448 100,460 84,468',
    neckB: 'M268,302C270,340 282,376 322,398C354,414 378,438 388,470',
    neckline: 'M128,432C176,462 262,452 318,398',
    skull: 'C300,240 332,170 300,110C276,64 204,60 176,96Z',
    neckFill: 'M150,338C156,372 150,402 128,432C116,448 100,460 84,468L84,480L388,480L388,470C378,438 354,414 322,398C282,376 270,340 268,302L250,262Z',
    topFill: 'M84,468C100,460 116,448 128,432C176,462 262,452 318,398C354,414 378,438 388,470L388,482L84,482Z',
    hairline: 'L268,302C262,270 256,250 252,232C236,214 226,180 214,160C204,134 190,112 176,96Z',
    cap: 'M176,96C196,58 276,46 318,96C348,132 346,200 312,252C298,274 282,290 268,302C262,270 256,250 252,232C236,214 226,180 214,160C204,134 190,112 176,96Z'
  };
  const TATS = {
    sprig: 'M0,64C5,42 3,20 0,0M0,48C-13,42 -18,30 -15,18M0,34C13,28 18,16 15,4M0,18C-9,13 -11,4 -8,-3',
    moon: 'M0,0a13,13 0 1 0 15,15a10,10 0 1 1 -15,-15zM26,-6l0,8M22,-2l8,0M32,16l0,6M29,19l6,0',
    sun: 'M0,-9a9,9 0 1 0 0.1,0zM0,-22v-8M0,22v8M-22,0h-8M22,0h8M-16,-16l-6,-6M16,16l6,6M-16,16l-6,6M16,-16l6,-6',
    band: 'M-20,0l8,-9l8,9l8,-9l8,9l8,-9M-20,10h40'
  };

  function scallopArc(cx, cy, rx, ry, a1, a2, count, r) {
    let d = '';
    for (let i = 0; i <= count; i++) {
      const a = (a1 + (a2 - a1) * i / count) * Math.PI / 180;
      d += `${i === 0 ? 'L' : `A${r},${r} 0 0 1 `}${n(cx + rx * Math.cos(a))},${n(cy + ry * Math.sin(a))}`;
    }
    return d;
  }
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ink = (d, fine, light, extra = '') => `<path class="ink${fine ? ' ink--fine' : ''}${light ? ' ink--light' : ''} draw" d="${d}"${extra}/>`;
  const goldLine = (d, w = 1.6, extra = '') => `<path d="${d}" fill="none" stroke="${P.gold}" stroke-width="${w}" stroke-linecap="round" vector-effect="non-scaling-stroke"${extra}/>`;
  const star = (x, y, r, i) => `<path class="twinkle" style="--tw:${(i * 0.9).toFixed(1)}s" d="M${x},${y - r}Q${x},${y} ${x + r},${y}Q${x},${y} ${x},${y + r}Q${x},${y} ${x - r},${y}Q${x},${y} ${x},${y - r}Z" fill="${P.gold}"/>`;
  const strands = (d) => `<path d="${d}" fill="none" stroke="${LIGHT}" stroke-width="1.3" stroke-linecap="round" opacity=".5" vector-effect="non-scaling-stroke"/>`;

  /* A fine botanical line: a stem that wanders, with small leaves that shrink towards the tip
     and the odd bud on a short stalk. part: 'stem', 'leaves' or both. */
  function vine(pts, opts = {}) {
    const [x0, y0, x1, y1, x2, y2, x3, y3] = pts;
    const leaf = opts.leaf || 8;
    const count = opts.count || 7;
    const part = opts.part || 'all';
    let d = part === 'leaves' ? '' : `M${x0},${y0}C${x1},${y1} ${x2},${y2} ${x3},${y3}`;
    if (part === 'stem') return d;
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 0.6);
      const m = 1 - t;
      const x = m * m * m * x0 + 3 * m * m * t * x1 + 3 * m * t * t * x2 + t * t * t * x3;
      const y = m * m * m * y0 + 3 * m * m * t * y1 + 3 * m * t * t * y2 + t * t * t * y3;
      const a = Math.atan2(3 * m * m * (y1 - y0) + 6 * m * t * (y2 - y1) + 3 * t * t * (y3 - y2), 3 * m * m * (x1 - x0) + 6 * m * t * (x2 - x1) + 3 * t * t * (x3 - x2));
      const side = i % 2 ? 1 : -1;
      const la = a + side * 0.95;
      const sz = leaf * (1 - 0.35 * t);
      const tx = x + Math.cos(la) * sz * 2;
      const ty = y + Math.sin(la) * sz * 2;
      const nx = Math.cos(la + Math.PI / 2) * sz * 0.55;
      const ny = Math.sin(la + Math.PI / 2) * sz * 0.55;
      d += `M${n(x)},${n(y)}Q${n((x + tx) / 2 + nx)},${n((y + ty) / 2 + ny)} ${n(tx)},${n(ty)}Q${n((x + tx) / 2 - nx)},${n((y + ty) / 2 - ny)} ${n(x)},${n(y)}`;
      if (i % 3 === 0 && part === 'all') {
        const ba = a - side * 1.2;
        const bx = x + Math.cos(ba) * sz * 1.6;
        const by = y + Math.sin(ba) * sz * 1.6;
        d += `M${n(x)},${n(y)}L${n(bx)},${n(by)}M${n(bx + 1.7)},${n(by)}a1.7,1.7 0 1 0 -3.4,0a1.7,1.7 0 1 0 3.4,0`;
      }
    }
    return d;
  }
  // an eight-point star as one fine outline: long points up, down and across, shorter ones between
  function starLine(cx, cy, r1, r2, ri) {
    let d = '';
    for (let k = 0; k < 16; k++) {
      const a = k * Math.PI / 8 - Math.PI / 2;
      const rr = k % 2 ? ri : (k % 4 === 0 ? r1 : r2);
      d += `${k ? 'L' : 'M'}${n(cx + rr * Math.cos(a))},${n(cy + rr * Math.sin(a))}`;
    }
    return `${d}Z`;
  }
  const tattoo = (d, dark) => `<path class="ink ink--hair${dark ? ' ink--light' : ''} draw" d="${d}"/>`;

  function hair(o) {
    const col = o.hairCol || '#2B1D14';
    let fill = '';
    let lines = '';
    if (o.hair === 'afro') {
      fill += `<path d="M176,96${scallopArc(262, 150, 132, 128, 212, 440, 12, 34)}${C.hairline}" fill="${col}"/>`;
      let tex = '';
      for (let k = 0; k < 16; k++) {
        const a = (222 + k * 13.5) * Math.PI / 180;
        const rr = 0.52 + ((k * 7) % 5) * 0.075;
        tex += `M${n(262 + 132 * rr * Math.cos(a))},${n(150 + 128 * rr * Math.sin(a))}q${n(9 * Math.cos(a + 1.2))},${n(9 * Math.sin(a + 1.2))} ${n(16 * Math.cos(a + 1.9))},${n(16 * Math.sin(a + 1.9))}`;
      }
      fill += strands(tex);
    }
    if (o.hair === 'wrap') {
      const wrap = 'M158,132C148,84 196,40 256,36C318,34 372,84 366,160C362,214 330,262 284,286C276,268 268,246 258,228C232,210 196,172 158,132Z';
      fill += `<path d="${wrap}" fill="${o.wrapCol || P.amber}" transform="translate(8,6)"/>`;
      lines += ink(wrap) + ink('M166,116C222,98 300,112 352,192', true) + ink('M198,68C252,80 312,132 332,232', true) + ink('M240,40C292,60 340,110 354,168', true);
    }
    if (o.hair === 'hijab') {
      const outer = 'M160,126C154,70 214,36 270,44C340,54 374,130 358,222C348,292 372,402 392,470';
      const inner = 'M150,344C176,344 200,336 214,322C236,300 240,236 196,170C184,152 172,138 160,126';
      fill += `<path d="${outer}L84,470C104,452 126,428 142,392C150,368 152,352 150,344C176,344 200,336 214,322C236,300 240,236 196,170C184,152 172,138 160,126Z" fill="${o.scarf || '#CFCFAA'}" transform="translate(8,6)"/>`;
      lines += ink(outer) + ink(inner) + ink('M214,322C232,372 222,422 192,468', true) + ink('M300,92C332,162 322,250 302,330C292,380 302,430 322,468', true) + ink('M150,344C140,392 116,440 84,468');
    }
    if (o.hair === 'crop') {
      fill += `<path d="${C.cap}" fill="${col}"/>` + strands('M206,84q30,-16 64,-8M230,112q34,-12 66,6M252,146q30,-4 54,22M262,186q24,6 38,32');
    }
    if (o.hair === 'shaved') {
      fill += `<path d="${C.cap}" fill="${col}" opacity=".42"/>`;
    }
    if (o.hair === 'bun') {
      fill += `<path d="M258,74${scallopArc(314, 78, 56, 54, 180, 540, 10, 20)}Z" fill="${col}"/><path d="${C.cap}" fill="${col}"/>` + strands('M204,90q34,-22 76,-12M226,118q40,-14 74,8M282,60q26,-18 52,-2M290,92q24,8 46,-6');
    }
    if (o.hair === 'waves') {
      fill += `<path d="M176,96C196,58 276,46 318,96C352,136 356,220 374,300C392,384 424,446 412,566C406,646 436,726 418,826C380,804 352,744 350,664C348,564 302,474 288,384C282,344 274,322 268,302C262,270 256,250 252,232C236,214 226,180 214,160C204,134 190,112 176,96Z" fill="${col}"/>`;
      fill += strands('M300,116C342,220 352,332 382,432C402,522 396,622 404,764M270,96C316,170 330,280 352,380C366,450 372,520 370,640M334,300C366,400 388,500 380,620');
    }
    return { fill, lines };
  }

  /* Head and shoulders, with the halo behind and the light on her face */
  function bust(o) {
    const f = FACES[o.face || 'a'];
    const h = hair(o);
    const covered = o.hair === 'hijab';
    const dark = lum(o.skin) < 0.14; // on deep skin the inner lines are cut in light, like a lino print
    const r = o.aura || 208;
    let s = '';
    s += `<g class="aura"><circle cx="232" cy="196" r="${r}" fill="url(#aura)"/>`;
    s += `<circle class="rays" cx="232" cy="196" r="${n(r * 0.84)}" fill="none" stroke="${P.gold}" stroke-width="${n(r * 0.17)}" stroke-dasharray="1.6 ${n(r * 0.066)}" opacity=".75"/>`;
    s += `<circle cx="232" cy="196" r="${n(r * 0.7)}" fill="none" stroke="${P.gold}" stroke-width="1.3" vector-effect="non-scaling-stroke" opacity=".85"/></g>`;
    (o.stars || [[70, 120, 11], [404, 300, 8], [372, 52, 6]]).forEach((st, i) => { s += star(st[0], st[1], st[2], i); });
    // flat colour, a touch off-register
    s += `<g transform="translate(9,7)"><path d="${f.profile}${C.skull}" fill="${o.skin}"/><path d="${C.neckFill}" fill="${o.skin}"/>`;
    if (!covered) s += `<path d="${C.topFill}" fill="${o.top || P.pop}"/>`;
    s += `<path d="${f.lips}" fill="${o.lip || P.pop}" opacity=".92"/>`;
    s += `<ellipse cx="204" cy="248" rx="38" ry="22" fill="${P.gold}" opacity="${dark ? 0.2 : 0.22}"/><ellipse cx="170" cy="140" rx="20" ry="26" fill="${P.gold}" opacity="${dark ? 0.14 : 0.16}"/></g>`;
    s += h.fill;
    if (o.hoop && !covered) s += `<circle cx="262" cy="291" r="${o.hoop === 2 ? 26 : 19}" fill="none" stroke="${P.gold}" stroke-width="5" vector-effect="non-scaling-stroke" transform="translate(3,2)"/>`;
    // light catching the edge of her face
    s += goldLine(f.profile, 1.8, ' transform="translate(-6,-1)" opacity=".95"');
    s += ink(f.profile);
    if (!covered) s += ink(C.neckF) + ink(C.neckB) + ink(C.neckline) + ink(C.ear, true, dark);
    s += h.lines;
    s += ink(C.brow, true, dark) + ink(C.crease, true, dark) + ink(C.eye, false, dark) + ink(C.lash, true, dark) + ink(f.nostril, true, dark) + ink(f.seam, true, dark);
    if (f.extra) s += ink(f.extra, true, dark);
    if (o.hoop && !covered) s += `<circle class="ink ink--fine draw" cx="262" cy="291" r="${o.hoop === 2 ? 26 : 19}"/>`;
    if (o.glasses) s += `<ellipse class="ink draw" cx="178" cy="200" rx="23" ry="24"/>` + ink('M201,196L256,224', true) + ink('M155,198L146,196', true);
    // piercings and a small tattoo
    if (o.stud) s += `<circle cx="${f.stud[0]}" cy="${f.stud[1]}" r="3.6" fill="${P.gold}"/>`;
    if (o.ring) s += goldLine(f.ring, 2.4);
    if (o.earStuds && !covered) s += `<circle cx="277" cy="236" r="3" fill="${P.gold}"/><circle cx="280" cy="247" r="3" fill="${P.gold}"/><circle cx="276" cy="258" r="3" fill="${P.gold}"/>`;
    if (o.neckTat && !covered) s += tattoo(vine([258, 304, 268, 338, 246, 370, 240, 404], { count: 5, leaf: 7 }), dark) + tattoo(vine([240, 404, 268, 424, 306, 414, 346, 438], { count: 6, leaf: 7 }), dark);
    return s;
  }

  function portrait(o) {
    return `<svg class="lineart" viewBox="0 0 400 480" aria-hidden="true">${o.mirror ? '<g transform="translate(400,0) scale(-1,1)">' : '<g>'}${bust(o)}</g></svg>`;
  }

  /* A full-length figure in a long dress. L sets her height, full sets her shape. */
  function figure(o) {
    const L = o.L || 1000;
    const f = o.full || 0;
    const H = 480 + L;
    const W = 660;
    const dark = lum(o.skin) < 0.14;
    const l = (a, b) => n(a - b * f);
    const r = (a, b) => n(a + b * f);
    const left = `M84,468C60,520 ${l(60, 40)},600 ${l(70, 50)},690C${l(86, 36)},800 ${l(70, 60)},900 ${l(40, 70)},1000L${l(10, 60)},${H - 30}`;
    const right = `M388,470C420,520 ${r(424, 30)},600 ${r(410, 40)},700C${r(400, 50)},820 ${r(430, 60)},900 ${r(450, 70)},1000L${r(480, 60)},${H - 30}`;
    const hem = `M${l(10, 60)},${H - 30}Q245,${H + 12} ${r(480, 60)},${H - 30}`;
    const dress = `${left}Q245,${H + 12} ${r(480, 60)},${H - 30}L${r(450, 70)},1000C${r(430, 60)},900 ${r(400, 50)},820 ${r(410, 40)},700C${r(424, 30)},600 420,520 388,470Z`;
    const arm = `M372,452C${r(446, 34)},560 ${r(446, 34)},700 ${r(424, 24)},830C${r(420, 22)},884 ${r(404, 16)},940 ${r(388, 12)},944C${r(372, 10)},930 ${r(376, 12)},862 ${r(376, 12)},826C${r(374, 20)},720 ${r(362, 22)},600 332,506`;
    const colour = o.top || P.pop;
    let s = `<svg class="lineart fig" viewBox="0 0 ${W} ${H + 24}" aria-hidden="true">`;
    s += `<ellipse cx="${W / 2}" cy="${H - 6}" rx="${n(250 + 60 * f)}" ry="16" fill="${INK}" opacity=".1"/>`;
    s += o.mirror ? `<g transform="translate(${W - 90},0) scale(-1,1)">` : `<g transform="translate(90,0)">`;
    s += bust(Object.assign({ aura: 190 }, o));
    s += `<path d="${dress}" fill="${colour}" transform="translate(9,7)"/>`;
    s += `<path d="${arm}Z" fill="${o.sleeve ? colour : o.skin}" transform="translate(9,7)"/>`;
    s += ink(left) + ink(right) + ink(hem) + ink(arm);
    s += ink(`M200,700C192,900 150,${H - 220} ${l(124, 40)},${H - 22}`, true) + ink(`M300,760C320,940 360,${H - 240} ${r(384, 40)},${H - 20}`, true) + ink(`M250,900C252,1000 250,${H - 200} 246,${H - 8}`, true);
    if (o.belt) s += goldLine(`M${l(72, 50)},700Q245,740 ${r(410, 40)},704`, 2.2);
    if (o.armTat && !o.sleeve) {
      s += `<path class="ink ink--fine${dark ? ' ink--light' : ''} draw" d="${TATS[o.armTat]}" transform="translate(${r(408, 28)},600)"/>`;
      if (o.armTat2) s += `<path class="ink ink--fine${dark ? ' ink--light' : ''} draw" d="${TATS[o.armTat2]}" transform="translate(${r(404, 24)},750) scale(.9)"/>`;
    }
    s += `</g></svg>`;
    return s;
  }

  /* The opening piece: one woman, her halo, the line of the site curved over her like an inscription, and the SoulHauss name beneath */
  function heroArt() {
    const cx = 324;
    const cy = 286;
    const R = 240;
    const o = { face: 'a', hair: 'wrap', wrapCol: P.amber, skin: '#7A4A2E', top: P.pop, hoop: 2, earStuds: true, stud: true, neckTat: 'sun', aura: 216, stars: [[36, 150, 12], [424, 330, 9], [400, 56, 7]] };
    return `<svg class="lineart hero-icon" viewBox="0 0 648 668" aria-hidden="true">`
      + `<defs><path id="hero-arc" d="M${cx - R},${cy}A${R},${R} 0 0 1 ${cx + R},${cy}"/></defs>`
      + `<text class="arc"><textPath href="#hero-arc" startOffset="50%" text-anchor="middle">Youth club for grown ups</textPath></text>`
      + `<g transform="translate(92,90)">${bust(o)}</g>`
      + `<image href="img/wordmark.png" x="164" y="590" width="320" height="54"/>`
      + `</svg>`;
  }
  const hero = document.getElementById('hero-art');
  /* The opening piece, facing you: eyes closed, at peace, light behind her and on her face */
  function frontArt() {
    const skin = '#7A4A2E';
    const hairC = '#2B1D14';
    const li = (d, fine) => ink(d, fine, true);
    let s = `<svg class="lineart hero-icon" viewBox="-40 0 560 712" aria-hidden="true">`;
    s += `<g class="aura"><circle cx="240" cy="318" r="252" fill="url(#aura)"/><circle class="rays" cx="240" cy="318" r="212" fill="none" stroke="${P.gold}" stroke-width="42" stroke-dasharray="1.6 16.6" opacity=".78"/><circle cx="240" cy="318" r="178" fill="none" stroke="${P.gold}" stroke-width="1.3" vector-effect="non-scaling-stroke" opacity=".85"/></g>`;
    [[-8, 150, 12], [486, 420, 10], [452, 96, 7], [12, 470, 7]].forEach((st, i) => { s += star(st[0], st[1], st[2], i); });
    // flat colour, a touch off-register
    s += `<g transform="translate(8,7)">`;
    s += `<path d="M200,440L200,500C200,520 150,540 96,560L60,582C64,650 130,694 240,694C350,694 416,650 420,582L384,560C330,540 280,520 280,500L280,440Z" fill="${skin}"/>`;
    s += `<ellipse cx="146" cy="336" rx="13" ry="21" fill="${skin}"/><ellipse cx="334" cy="336" rx="13" ry="21" fill="${skin}"/>`;
    s += `<path d="M148,290C146,368 184,448 240,462C296,448 334,368 332,290C330,220 290,194 240,194C190,194 150,220 148,290Z" fill="${skin}"/>`;
    s += `<path d="M100,650C128,612 178,600 240,624C302,600 352,612 380,650C350,682 300,694 240,694C180,694 130,682 100,650Z" fill="${P.pop}"/>`;
    s += `<path d="M204,428C216,418 232,416 240,422C248,416 264,418 276,428C262,452 218,452 204,428Z" fill="${P.pop}" opacity=".95"/>`;
    s += `<ellipse cx="240" cy="258" rx="44" ry="22" fill="${P.gold}" opacity=".2"/><ellipse cx="186" cy="382" rx="26" ry="17" fill="${P.gold}" opacity=".2"/><ellipse cx="294" cy="382" rx="26" ry="17" fill="${P.gold}" opacity=".2"/><ellipse cx="240" cy="356" rx="9" ry="30" fill="${P.gold}" opacity=".16"/></g>`;
    // hair: swept up into a high puff
    s += `<path d="M240,36${scallopArc(240, 128, 94, 92, -90, 270, 13, 27)}Z" fill="${hairC}"/>`;
    s += `<path d="M144,300C136,214 188,176 240,176C292,176 344,214 336,300C322,258 292,232 240,230C188,232 158,258 144,300Z" fill="${hairC}"/>`;
    s += strands('M196,96q20,-22 48,-18M218,132q30,-14 58,2M270,84q20,6 30,26M186,196q40,-18 78,-10M176,226q14,-12 30,-16');
    [140, 340].forEach((x) => { s += `<circle cx="${x}" cy="380" r="24" fill="none" stroke="${P.gold}" stroke-width="5" vector-effect="non-scaling-stroke" transform="translate(3,2)"/><circle class="ink ink--fine draw" cx="${x}" cy="380" r="24"/>`; });
    // light under her jaw, then the ink
    s += goldLine('M148,290C146,368 184,448 240,462C296,448 334,368 332,290', 1.8, ' transform="translate(0,6)" opacity=".9"');
    s += ink('M148,290C146,368 184,448 240,462C296,448 334,368 332,290');
    s += ink('M200,446C200,486 204,506 180,522C150,540 100,552 62,582') + ink('M280,446C280,486 276,506 300,522C330,540 380,552 418,582');
    s += ink('M100,650C128,612 178,600 240,624C302,600 352,612 380,650') + ink('M62,582C66,650 132,694 240,694C348,694 414,650 418,582', true) + ink('M130,626L152,548', true) + ink('M350,626L328,548', true);
    s += li('M150,566C186,552 218,558 236,572', true) + li('M330,566C294,552 262,558 244,572', true);
    s += li('M168,306C186,292 212,292 230,302', true) + li('M250,302C268,292 294,292 312,306', true);
    s += li('M180,322C194,314 212,314 224,322', true) + li('M256,322C268,314 286,314 300,322', true);
    s += li('M178,332C192,345 212,345 226,332') + li('M254,332C268,345 288,345 302,332');
    s += li('M180,336l-7,6M189,342l-4,8M199,344l-1,9', true) + li('M300,336l7,6M291,342l4,8M281,344l1,9', true);
    s += li('M228,338C228,362 222,378 216,390C222,402 234,400 240,404C246,400 258,402 264,390', true) + li('M252,338C252,356 256,372 262,384', true);
    s += li('M204,428C220,435 260,435 276,428', true);
    // a small flower on her neck
    // a fine botanical tattoo: down her neck, along her collarbone and out over her shoulder
    // one fine eight-point star in the middle of her neck
    s += tattoo(starLine(240, 500, 20, 11, 4) + 'M240,470l0.1,0M240,530l0.1,0M240,463l0.1,0M240,537l0.1,0', true);
    s += `<circle cx="264" cy="388" r="3.4" fill="${P.gold}"/>`;
    s += `</svg>`;
    return s;
  }
  if (hero) hero.innerHTML = frontArt();

  /* Cosy Club, drawn: the round patterned seat with its palm, velvet chairs, a marble table and the hanging lamps */
  function venueArt() {
    const off = ' transform="translate(6,5)"';
    const pill = (cx, cy, rx, h) => `M${cx - rx},${cy}C${cx - rx},${cy - h} ${cx + rx},${cy - h} ${cx + rx},${cy}C${cx + rx},${cy + h} ${cx - rx},${cy + h} ${cx - rx},${cy}Z`;
    const zig = (y, x1, x2, amp) => { let d = `M${x1},${y}`; for (let x = x1, i = 0; x < x2; x += 24, i++) d += `l12,${i % 2 ? amp : -amp}l12,${i % 2 ? -amp : amp}`; return d; };
    let s = `<svg class="lineart venue" viewBox="0 0 640 610" aria-hidden="true"><defs>`;
    const tiers = [[320, 452, 200, 50], [320, 384, 156, 44], [320, 322, 114, 38]];
    tiers.forEach((t, i) => { s += `<clipPath id="tier${i}"><path d="${pill(...t)}"/></clipPath>`; });
    s += `</defs>`;
    s += `<g class="aura"><circle cx="320" cy="236" r="236" fill="url(#aura)"/><circle class="rays" cx="320" cy="236" r="198" fill="none" stroke="${P.gold}" stroke-width="40" stroke-dasharray="1.6 15.5" opacity=".7"/></g>`;
    s += star(64, 150, 10, 0) + star(590, 250, 8, 1) + star(540, 40, 6, 2);
    s += `<ellipse cx="320" cy="560" rx="300" ry="20" fill="${INK}" opacity=".1"/>`;
    // hanging lamps
    [[132, 104], [512, 138]].forEach(([x, y]) => {
      const shade = `M${x - 17},${y - 28}h34l7,42q-24,13 -48,0z`;
      s += ink(`M${x},0V${y - 28}`, true) + `<path d="${shade}" fill="${P.gold}"${off}/>` + ink(shade);
    });
    // the palm
    const fronds = [[320, 236, 300, 160, 250, 104, 172, 92], [320, 236, 316, 150, 300, 78, 258, 34], [320, 236, 330, 150, 354, 74, 396, 36], [320, 236, 346, 170, 404, 112, 474, 104], [320, 236, 290, 192, 224, 160, 146, 172], [320, 236, 352, 196, 420, 170, 498, 188]];
    fronds.forEach((fr) => {
      s += `<path d="${vine(fr, { count: 11, leaf: 15, part: 'leaves' })}" fill="${P.sageDeep}"${off}/>`;
      s += `<path class="ink ink--fine draw" d="${vine(fr, { count: 11, leaf: 15, part: 'leaves' })}"/>` + ink(vine(fr, { part: 'stem' }), true);
    });
    s += `<path d="M274,236h92l-13,62h-66z" fill="${P.amber}"${off}/>` + ink('M274,236h92l-13,62h-66z');
    // the stacked round seat, with its maze pattern
    tiers.forEach((t, i) => {
      const [cx, cy, rx, h] = t;
      s += `<path d="${pill(cx, cy, rx, h)}" fill="${P.wine}"${off}/>`;
      s += `<path d="${zig(cy - 16, cx - rx, cx + rx, 9)}${zig(cy + 2, cx - rx, cx + rx, 9)}${zig(cy + 20, cx - rx, cx + rx, 9)}" fill="none" stroke="${P.sand}" stroke-width="3.2" stroke-linejoin="round" clip-path="url(#tier${i})"/>`;
      s += ink(pill(cx, cy, rx, h));
    });
    // velvet chairs either side
    const chairL = 'M40,566C26,476 54,430 110,426C166,430 190,476 178,566Z';
    const chairR = 'M462,566C450,476 476,430 532,426C588,430 612,476 600,566Z';
    s += `<path d="${chairL}" fill="${P.pop}"${off}/>` + ink(chairL) + ink('M62,506C94,488 128,488 158,506', true);
    s += `<path d="${chairR}" fill="#A8442A"${off}/>` + ink(chairR) + ink('M484,506C516,488 550,488 580,506', true);
    // a marble table, a little lamp and the drinks card
    s += `<ellipse cx="412" cy="520" rx="92" ry="22" fill="${INK}"${off}/><ellipse class="ink draw" cx="412" cy="520" rx="92" ry="22"/>`;
    s += `<path d="M346,516q30,-10 58,2M408,528q34,6 70,-10" fill="none" stroke="${LIGHT}" stroke-width="1.2" opacity=".55" vector-effect="non-scaling-stroke"/>`;
    s += `<circle cx="398" cy="498" r="34" fill="url(#aura)"/><path d="M384,512a14,19 0 0 1 28,0z" fill="${P.gold}"/>` + ink('M384,512a14,19 0 0 1 28,0z', true);
    s += `<path d="M436,462h24v52h-24z" fill="${P.pop}"${off}/>` + ink('M436,462h24v52h-24z', true);
    // the tag
    s += `<g transform="translate(204,566) rotate(-3)"><rect x="0" y="0" width="232" height="40" rx="10" fill="${P.paper}"/><rect class="ink ink--fine" x="0" y="0" width="232" height="40" rx="10"/><path d="M22,12a7,7 0 1 1 0.1,0zM22,26l-5,-8h10z" fill="${P.pop}" transform="translate(0,2)"/><text class="venue__tag" x="40" y="27">Cosy Club, Leeds</text></g>`;
    s += `</svg>`;
    return s;
  }
  const venue = document.getElementById('venue-art');
  if (venue) venue.innerHTML = venueArt();

  const big = document.getElementById('portrait');
  if (big) {
    big.innerHTML = portrait({ face: 'a', hair: 'afro', skin: '#7A4A2E', top: P.pop, hoop: 2, stud: true, earStuds: true, aura: 214, stars: [[52, 96, 12], [392, 330, 9], [356, 20, 7], [30, 300, 6]] });
  }

  /* Full-length women, each dressed her own way: a crop top and trousers, a short dress,
     shorts, a long skirt, a gown. fit sets the outfit, flare how far the hem swings out. */
  let figCount = 0;
  function figure2(o) {
    const L = o.L || 1000;
    const f = o.full || 0;
    const H = 480 + L;
    const W = 660;
    const fit = o.fit || 'gown';
    const fl = o.flare === undefined ? 1 : o.flare;
    const dark = lum(o.skin) < 0.14;
    const id = `fig${figCount += 1}`;
    const l = (a, b) => n(a - b * f);
    const r = (a, b) => n(a + b * f);
    const hipL = 70 - 60 * f;
    const hipR = 430 + 60 * f;
    const kL = hipL - 30 * fl;
    const kR = hipR + 20 * fl;
    const bL = hipL - 60 * fl + 26 * (1 - fl);
    const bR = hipR + 50 * fl - 26 * (1 - fl);
    const left = `M84,468C60,520 ${l(60, 40)},600 ${l(70, 50)},690C${l(86, 36)},800 ${n(hipL)},900 ${n(kL)},1000L${n(bL)},${H - 30}`;
    const right = `M388,470C420,520 ${r(424, 30)},600 ${r(410, 40)},700C${r(400, 50)},820 ${n(hipR)},900 ${n(kR)},1000L${n(bR)},${H - 30}`;
    const hem = `M${n(bL)},${H - 30}Q245,${H + 12} ${n(bR)},${H - 30}`;
    const body = `${left}Q245,${H + 12} ${n(bR)},${H - 30}L${n(kR)},1000C${n(hipR)},900 ${r(400, 50)},820 ${r(410, 40)},700C${r(424, 30)},600 420,520 388,470Z`;
    const arm = `M372,452C${r(446, 34)},560 ${r(446, 34)},700 ${r(424, 24)},830C${r(420, 22)},884 ${r(404, 16)},940 ${r(388, 12)},944C${r(372, 10)},930 ${r(376, 12)},862 ${r(376, 12)},826C${r(374, 20)},720 ${r(362, 22)},600 332,506`;
    const colour = o.top || P.pop;
    const clip = ` clip-path="url(#${id})"`;
    const band = (y1, y2, c) => `<rect x="-300" y="${y1}" width="1200" height="${y2 - y1}" fill="${c}"${clip}/>`;
    const seam = (y) => `<path class="ink ink--fine draw" d="M-200,${y}Q245,${y + 20} 700,${y}"${clip}/>`;
    const topEnd = o.topEnd || 650;
    const waist = o.waist || 770;
    const hemAt = o.hemAt || 1010;
    const bare = fit === 'mini' || fit === 'shorts';
    let s = `<svg class="lineart fig" viewBox="0 0 ${W} ${H + 24}" aria-hidden="true">`;
    s += `<defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs>`;
    s += `<ellipse cx="${W / 2}" cy="${H - 6}" rx="${n(250 + 60 * f)}" ry="16" fill="${INK}" opacity=".1"/>`;
    s += o.mirror ? `<g transform="translate(${W - 90},0) scale(-1,1)">` : `<g transform="translate(90,0)">`;
    s += bust(Object.assign({ aura: 190 }, o));
    s += `<g transform="translate(9,7)">`;
    if (fit === 'gown') {
      s += `<path d="${body}" fill="${colour}"/>`;
    } else {
      s += `<path d="${body}" fill="${o.skin}"/>`;
      if (fit === 'mini') s += band(420, hemAt, colour);
      else s += band(420, topEnd, colour);
      if (fit === 'two') s += band(waist, H + 40, o.bottom || P.olive);
      if (fit === 'shorts') s += band(waist, hemAt, o.bottom || P.pop);
    }
    s += `<path d="${arm}Z" fill="${o.sleeve ? colour : o.skin}"/></g>`;
    if (bare) {
      // two legs, and shoes
      s += `<path d="M245,${hemAt + 24}L231,${H + 14}L259,${H + 14}Z" style="fill:var(--band,var(--bg))"/>`;
      s += `<rect x="${n(bL - 10)}" y="${H - 46}" width="${n(241 - bL)}" height="20" rx="9" fill="${INK}"/><rect x="259" y="${H - 46}" width="${n(bR - 249)}" height="20" rx="9" fill="${INK}"/>`;
      s += ink(`M245,${hemAt + 24}L231,${H - 30}`, true, dark) + ink(`M245,${hemAt + 24}L259,${H - 30}`, true, dark);
    }
    s += ink(left) + ink(right) + (bare ? '' : ink(hem)) + ink(arm);
    if (fit === 'gown' || fit === 'two') {
      s += ink(`M200,${fit === 'gown' ? 700 : waist + 40}C192,900 150,${H - 220} ${n(bL + 110)},${H - 22}`, true) + ink(`M300,${fit === 'gown' ? 760 : waist + 60}C320,940 360,${H - 240} ${n(bR - 96)},${H - 20}`, true) + ink(`M250,900C252,1000 250,${H - 200} 246,${H - 8}`, true);
    }
    if (fit === 'mini') s += seam(hemAt);
    if (fit === 'two' || fit === 'shorts') s += seam(topEnd) + seam(waist);
    if (fit === 'shorts') s += seam(hemAt);
    if (o.belt) s += goldLine(`M${l(72, 50)},700Q245,740 ${r(410, 40)},704`, 2.2);
    if (o.armTat && !o.sleeve) {
      // a botanical line that runs from her shoulder down her arm
      const ax = Number(r(404, 26));
      s += tattoo(vine([ax - 14, 500, ax + 16, 590, ax - 6, 690, ax - 4, 800], { count: 10, leaf: 9 }), dark);
      if (o.armTat2) s += tattoo(vine([ax - 4, 800, ax - 2, 840, ax - 16, 870, ax - 14, 906], { count: 4, leaf: 6 }), dark);
    }
    if (o.legTat && bare) s += tattoo(vine([hipL + 60, hemAt + 34, hipL + 92, hemAt + 120, hipL + 40, hemAt + 200, hipL + 64, hemAt + 290], { count: 8, leaf: 9 }), dark);
    if (o.henna && !o.sleeve) {
      // henna on her hand and forearm: a flower on the back of the hand, bands at the wrist, a chain of leaves above
      const hx = Number(r(398, 16));
      let d = `M${hx + 4},902a4,4 0 1 0 -8,0a4,4 0 1 0 8,0`;
      for (let k = 0; k < 8; k++) {
        const a = k * Math.PI / 4;
        d += `M${n(hx + 5 * Math.cos(a))},${n(902 + 5 * Math.sin(a))}Q${n(hx + 14 * Math.cos(a + 0.4))},${n(902 + 14 * Math.sin(a + 0.4))} ${n(hx + 12 * Math.cos(a))},${n(902 + 12 * Math.sin(a))}`;
      }
      d += `M${hx - 16},872q16,8 32,0M${hx - 16},864q16,8 32,0`;
      for (let k = 0; k < 6; k++) {
        const y = 850 - k * 22;
        d += `M${hx},${y}q7,-9 0,-18q-7,9 0,18M${hx - 11},${y - 9}l0.1,0M${hx + 11},${y - 9}l0.1,0`;
      }
      s += `<path class="ink ink--hair draw" style="stroke:#5A1F12" d="${d}"/>`;
    }
    if (o.starTat && !o.sleeve) {
      const sx = Number(r(402, 26));
      s += tattoo(starLine(sx, 566, 14, 8, 3) + starLine(sx - 7, 596, 6, 3.6, 1.6) + `M${sx + 9},606l0.1,0`, dark);
    }
    if (o.bellyTat && fit !== 'gown' && fit !== 'mini') s += `<path class="ink ink--fine${dark ? ' ink--light' : ''} draw" d="${TATS[o.bellyTat]}" transform="translate(180,${topEnd + 44}) scale(.8)"/>`;
    s += `</g></svg>`;
    return s;
  }

  const WOMEN = [
    { face: 'b', hair: 'shaved', skin: '#5B3722', top: P.pop, bottom: P.olive, fit: 'two', flare: 0.75, topEnd: 640, L: 1180, full: 0, hoop: 2, ring: true },
    { face: 'c', hair: 'afro', skin: '#7A4A2E', top: P.gold, fit: 'mini', flare: 0.2, hemAt: 1000, L: 820, full: 1, mirror: true, hoop: true, stud: true },
    { face: 'a', hair: 'hijab', scarf: '#CFCFAA', skin: '#C8946A', top: P.sageDeep, sleeve: true, fit: 'gown', L: 1000, full: 0.35, belt: true },
    { face: 'a', hair: 'wrap', wrapCol: P.amber, henna: true, skin: '#8B5A3C', top: P.wine, bottom: P.amber, fit: 'two', flare: 0.9, topEnd: 620, L: 1120, full: 0.8, mirror: true, hoop: true, earStuds: true },
    { face: 'c', hair: 'crop', hairCol: '#BDB8A6', skin: '#E3B58C', top: P.sage, bottom: P.sand, fit: 'two', flare: 1, topEnd: 780, waist: 770, L: 940, full: 0.45, glasses: true, stud: true },
    { face: 'b', hair: 'waves', starTat: true, hairCol: '#3A2416', skin: '#A9714B', top: P.sand, bottom: P.pop, fit: 'shorts', flare: 0.15, topEnd: 660, hemAt: 950, L: 880, full: 0.15, mirror: true, ring: true }
  ];

  const row = document.getElementById('procession');
  if (row) {
    row.innerHTML = WOMEN.map(figure2).join('');
    const legacy = () => [
      { face: 'b', hair: 'shaved', hairCol: '#2B1D14', skin: '#5B3722', top: P.pop, L: 1180, full: 0, hoop: 2, ring: true, neckTat: 'sun', armTat: 'sprig', belt: true },
      { face: 'c', hair: 'afro', skin: '#7A4A2E', top: P.gold, L: 820, full: 1, mirror: true, hoop: true, stud: true, armTat: 'moon' },
      { face: 'a', hair: 'hijab', scarf: '#CFCFAA', skin: '#C8946A', top: P.sageDeep, sleeve: true, L: 1000, full: 0.35, belt: true },
      { face: 'a', hair: 'wrap', wrapCol: P.amber, skin: '#8B5A3C', top: P.wine, L: 1120, full: 0.8, mirror: true, hoop: true, earStuds: true, armTat: 'band', armTat2: 'sprig' },
      { face: 'c', hair: 'crop', hairCol: '#BDB8A6', skin: '#E3B58C', top: P.sage, L: 940, full: 0.45, glasses: true, stud: true },
      { face: 'b', hair: 'waves', hairCol: '#3A2416', skin: '#A9714B', top: P.sand, L: 880, full: 0.15, mirror: true, ring: true, neckTat: 'moon', armTat: 'sun', armTat2: 'band' }
    ].map(figure).join('');
  }

  // The ink draws itself in when a drawing scrolls into view
  const arts = [...document.querySelectorAll('.lineart')];
  arts.forEach((svg) => {
    [...svg.querySelectorAll('.draw')].forEach((p, i) => {
      let len = 600;
      try { len = Math.ceil(p.getTotalLength() * 1.25) + 10; } catch (e) {}
      p.style.setProperty('--len', len);
      p.style.setProperty('--delay', `${Math.min(i * 0.07, 1.4).toFixed(2)}s`);
    });
  });
  const show = () => {
    if (document.documentElement.classList.contains('door-closed')) return; // wait until she is let in
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    arts.forEach((svg) => {
      if (svg.classList.contains('in')) return;
      const b = svg.getBoundingClientRect();
      if (b.top < vh * 0.88 && b.left < vw * 0.95) svg.classList.add('in');
    });
  };
  window.addEventListener('scroll', show, { passive: true });
  window.addEventListener('resize', show);
  if (row) row.addEventListener('scroll', show, { passive: true });
  setTimeout(show, 60);
})();
