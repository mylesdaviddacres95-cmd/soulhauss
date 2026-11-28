"""Cosy Club, drawn as bold-outline flat-colour art (poster style), traced from the venue photo's layout.
Furniture, plants and the lamp tables only: no ceiling, no windows.
Usage: draw_venue.py <out.svg> [trace]   (trace = lay the photo over the drawing for checking)"""
import math
import random
import sys

random.seed(7)
INK = '#21160F'
out = []
defs = []
VB = (-130, 30, 1330, 1412)


def f(v):
    return f'{v:.1f}'


def jit(p, a):
    return (p[0] + random.uniform(-a, a), p[1] + random.uniform(-a, a))


def cr(points, closed=True, a=1.0, k=1 / 6):
    """Smooth hand-drawn curve through the points."""
    pts = [jit(p, a) for p in points]
    n = len(pts)
    d = [f'M{f(pts[0][0])},{f(pts[0][1])}']
    last = n if closed else n - 1
    for i in range(last):
        p0 = pts[(i - 1) % n] if (closed or i > 0) else pts[i]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if (closed or i + 2 < n) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k)
        c2 = (p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k)
        d.append(f'C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(p2[0])},{f(p2[1])}')
    if closed:
        d.append('Z')
    return ''.join(d)


def pl(points, closed=False, a=0.8):
    pts = [jit(p, a) for p in points]
    return 'M' + 'L'.join(f'{x:.0f},{y:.0f}' for x, y in pts) + ('Z' if closed else '')


def P(d, fill='none', sw=5.5, stroke=INK, extra=''):
    s = f'<path d="{d}" fill="{fill}"'
    if sw and stroke != 'none':
        s += f' stroke="{stroke}" stroke-width="{sw}"'
    return s + (' ' + extra if extra else '') + '/>'


def add(*a, **k):
    out.append(P(*a, **k))


def ell(cx, cy, rx, ry, n=24, a0=0, a1=360):
    m = n if (a1 - a0) >= 360 else n + 1
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(m)]


def clip(cid, d):
    defs.append(f'<clipPath id="{cid}"><path d="{d}"/></clipPath>')


def lens(b, e, w):
    """A leaf blade from b to e, w wide."""
    mx, my = (b[0] + e[0]) / 2, (b[1] + e[1]) / 2
    dx, dy = e[0] - b[0], e[1] - b[1]
    L = math.hypot(dx, dy) or 1
    nx, ny = -dy / L * w, dx / L * w
    return f'M{f(b[0])},{f(b[1])}Q{f(mx + nx)},{f(my + ny)} {f(e[0])},{f(e[1])}Q{f(mx - nx)},{f(my - ny)} {f(b[0])},{f(b[1])}Z'


# ------------------------------------------------------------------ sun and rug
SUN = (380, 335, 250)
out.append(f'<circle cx="{SUN[0]}" cy="{SUN[1]}" r="{SUN[2]}" fill="#F3D684"/>')
out.append(f'<circle cx="{SUN[0]}" cy="{SUN[1]}" r="{SUN[2] + 16}" fill="none" stroke="#E9B454" stroke-width="3"/>')
RUG = (530, 1128, 650, 300)
rug_d = cr(ell(*RUG, n=20), a=2.5)
clip('rug', rug_d)
add(rug_d, fill='#F0C573', sw=0)
zz = []
row = 0
y = RUG[1] - RUG[3] + 26
while y < RUG[1] + RUG[3]:
    amp, per = 13 + row * 0.5, 50 + row * 2
    pts = []
    x = RUG[0] - RUG[2] - 20 + (row % 2) * per / 2
    up = True
    while x < RUG[0] + RUG[2] + 40:
        pts.append((x, y + (-amp if up else amp)))
        up = not up
        x += per / 2
    zz.append((pl(pts, a=1.5), row))
    y += 40 + row * 2
    row += 1
g = ['<g clip-path="url(#rug)">']
g.append(f'<ellipse cx="385" cy="1268" rx="372" ry="62" fill="#FBE7A6"/>')        # the glow of the floor light under the seat
for d, r in zz:
    g.append(P(d, sw=6 if r % 2 else 4, stroke='#DE7B35' if r % 2 else '#FAE9BC'))
g.append('</g>')
out.append(''.join(g))
add(rug_d, sw=5.5)

# ------------------------------------------------------------------ helpers for the furniture
def table(cx, cy, rx, ry, th, seed, cid):
    rnd = random.Random(seed)
    add(cr(ell(cx, cy + th, rx, ry, n=18), a=0.8), fill='#24120F')
    top = cr(ell(cx, cy, rx, ry, n=18), a=0.8)
    clip(cid, top)
    add(top, fill='#4C2A27', sw=0)
    g = [f'<g clip-path="url(#{cid})">']
    g.append(P(cr([(cx - rx * 0.9, cy - ry * 0.2), (cx - rx * 0.3, cy - ry * 0.95), (cx + rx * 0.35, cy - ry), (cx + rx * 0.1, cy - ry * 0.3), (cx - rx * 0.5, cy + ry * 0.25)], a=1), fill='#6E4944', sw=0))
    g.append(P(cr([(cx + rx * 0.35, cy + ry * 0.2), (cx + rx * 0.8, cy - ry * 0.25), (cx + rx * 0.95, cy + ry * 0.1), (cx + rx * 0.6, cy + ry * 0.7)], a=1), fill='#5E3B37', sw=0))
    for _ in range(int(7 + rx / 30)):
        a = rnd.uniform(0, 6.283)
        r = rnd.uniform(0.1, 0.92)
        x, y = cx + rx * r * math.cos(a), cy + ry * r * math.sin(a)
        ang = rnd.uniform(-0.5, 0.5)
        pts = [(x, y)]
        for _k in range(rnd.randint(2, 4)):
            ang += rnd.uniform(-0.9, 0.9)
            x += math.cos(ang) * rnd.uniform(16, 40)
            y += math.sin(ang) * rnd.uniform(4, 11)
            pts.append((x, y))
        g.append(P(pl(pts, a=0), sw=rnd.choice([2, 2.5, 3.2]), stroke='#EAD5C4'))
    g.append('</g>')
    out.append(''.join(g))
    add(top, sw=5.5)


def dome(cx, base, w, h, sw=4.2):
    """The little amber table lamp under its glass dome."""
    x0, x1, top = cx - w / 2, cx + w / 2, base - h
    out.append(f'<ellipse cx="{cx}" cy="{base + h * 0.2}" rx="{w * 0.62}" ry="{h * 0.1}" fill="#2A1512" opacity=".45"/>')
    add(cr(ell(cx, base + h * 0.07, w * 0.66, h * 0.13, n=12), a=0.4), fill='#8A4F22', sw=sw)
    add(cr(ell(cx, base, w * 0.66, h * 0.12, n=12), a=0.4), fill='#B8743A', sw=sw)
    d = f'M{f(x0)},{f(base)}L{f(x0)},{f(top + w * 0.5)}Q{f(x0)},{f(top)} {f(cx)},{f(top)}Q{f(x1)},{f(top)} {f(x1)},{f(top + w * 0.5)}L{f(x1)},{f(base)}Q{f(cx)},{f(base + h * 0.09)} {f(x0)},{f(base)}Z'
    add(d, fill='#E79E34', sw=sw)
    add(cr([(cx - w * 0.2, base - h * 0.12), (cx - w * 0.26, base - h * 0.5), (cx - w * 0.05, base - h * 0.8), (cx + w * 0.2, base - h * 0.6), (cx + w * 0.22, base - h * 0.2), (cx, base - h * 0.06)], a=0.6), fill='#F8D57A', sw=0)
    add(cr([(cx - w * 0.08, base - h * 0.2), (cx - w * 0.1, base - h * 0.48), (cx + w * 0.04, base - h * 0.62), (cx + w * 0.1, base - h * 0.3)], a=0.5), fill='#FFF3CC', sw=0)
    add(f'M{f(x0 + w * 0.17)},{f(base - h * 0.2)}L{f(x0 + w * 0.17)},{f(top + w * 0.5)}', sw=2.6, stroke='#FFF6DC')


def card(tl, tr, br, bl, split, sw=4, label=True):
    """The tall drinks menu: red above, pink below."""
    ml = (bl[0] + (tl[0] - bl[0]) * (1 - split), tl[1] + (bl[1] - tl[1]) * split)
    mr = (br[0] + (tr[0] - br[0]) * (1 - split), tr[1] + (br[1] - tr[1]) * split)
    add(pl([ml, mr, br, bl], closed=True, a=0.5), fill='#F3BBA8', sw=0)
    add(pl([tl, tr, mr, ml], closed=True, a=0.5), fill='#A62C33', sw=0)
    add(pl([tl, tr, br, bl], closed=True, a=0.5), sw=sw)
    w = tr[0] - tl[0]
    cx = (ml[0] + mr[0]) / 2
    if label:
        fs = w * 0.25
        out.append(f'<text x="{f(cx)}" y="{f(ml[1] - fs * 0.35)}" font-family="Georgia, \'Times New Roman\', serif" font-size="{f(fs)}" letter-spacing=".5" text-anchor="middle" fill="#F6E3D2">DRINKS</text>')
        out.append(P(f'M{f(cx - w * 0.28)},{f(ml[1] + (bl[1] - ml[1]) * 0.42)}h{f(w * 0.56)}M{f(cx - w * 0.22)},{f(ml[1] + (bl[1] - ml[1]) * 0.55)}h{f(w * 0.44)}', sw=2.2, stroke='#A8584E'))
        out.append(f'<rect x="{f(cx - w * 0.07)}" y="{f(tl[1] + w * 0.12)}" width="{f(w * 0.14)}" height="{f(w * 0.16)}" fill="#F6E3D2" opacity=".85"/>')


def velvet(d, fill, streaks, streak_fill, cid):
    clip(cid, d)
    add(d, fill=fill, sw=0)
    g = [f'<g clip-path="url(#{cid})">']
    for s, col in streaks:
        g.append(P(cr(s, a=2), fill=col or streak_fill, sw=0))
    g.append('</g>')
    out.append(''.join(g))
    add(d, sw=5.5)


# ------------------------------------------------------------------ far-left little table
add(pl([(44, 800), (82, 800), (86, 925), (40, 925)], closed=True), fill='#B14A30', sw=5)
add(cr(ell(63, 926, 40, 9, n=12), a=0.5), fill='#8F3622', sw=5)
table(62, 788, 104, 18, 7, 3, 't0')
card((20, 690), (58, 688), (59, 783), (21, 785), 0.62, sw=3.6, label=False)
dome(104, 786, 28, 42, sw=3.4)

# ------------------------------------------------------------------ bird of paradise, ferns and the floor lamp (behind the chairs)
def paddle(base, tip, w, fill, rib='#2F4424', lean=0.0):
    bx, by = base
    tx, ty = tip
    dx, dy = tx - bx, ty - by
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    nx, ny = -uy, ux
    pts = [(bx, by), (bx + ux * L * 0.22 + nx * w * 0.75, by + uy * L * 0.22 + ny * w * 0.75), (bx + ux * L * 0.6 + nx * w * (1 + lean), by + uy * L * 0.6 + ny * w * (1 + lean)),
           (tx + nx * w * 0.12, ty + ny * w * 0.12), (tx, ty), (bx + ux * L * 0.62 - nx * w * (1 - lean), by + uy * L * 0.62 - ny * w * (1 - lean)), (bx + ux * L * 0.2 - nx * w * 0.7, by + uy * L * 0.2 - ny * w * 0.7)]
    add(cr(pts, a=1.2), fill=fill, sw=4.6)
    add(f'M{f(bx)},{f(by)}L{f(bx + dx * 0.9)},{f(by + dy * 0.9)}', sw=2.6, stroke=rib)


ROOT = (722, 712)
stems = [((640, 522), '#5B7A3C'), ((672, 484), '#3F5A30'), ((712, 524), '#5B7A3C'), ((750, 566), '#7F9457'), ((784, 506), '#5B7A3C'), ((806, 474), '#3F5A30'), ((700, 600), '#5B7A3C'), ((760, 610), '#3F5A30')]
for (sx, sy), col in stems:
    mid = ((ROOT[0] + sx) / 2 + (sx - ROOT[0]) * 0.12, (ROOT[1] + sy) / 2)
    d = f'M{ROOT[0] + (sx - ROOT[0]) * 0.08:.0f},{ROOT[1]}Q{f(mid[0])},{f(mid[1])} {sx},{sy}'
    add(d, sw=8.5)
    add(d, sw=4, stroke='#8FA65C')
paddle((806, 474), (902, 392), 20, '#3F5A30')
paddle((672, 484), (654, 364), 19, '#3F5A30')
paddle((640, 522), (596, 398), 22, '#7C9750')
paddle((784, 506), (818, 370), 22, '#5B7A3C')
paddle((712, 524), (724, 376), 25, '#6B8A45')
paddle((750, 566), (762, 402), 19, '#A9B88A', rib='#5B7A3C')
paddle((700, 600), (664, 520), 15, '#6B8A45')
paddle((760, 610), (800, 548), 15, '#5B7A3C')
for fx, fy, rot in [(744, 498, -20), (792, 484, 25)]:                 # the orange flowers
    pts = [(fx - 16, fy + 8), (fx - 6, fy - 4), (fx - 10, fy - 22), (fx, fy - 8), (fx + 8, fy - 26), (fx + 9, fy - 6), (fx + 24, fy - 14), (fx + 12, fy + 4)]
    add(pl(pts, closed=True, a=0.8), fill='#E8702A', sw=3.4, extra=f'transform="rotate({rot} {fx} {fy})"')


def spray(root, tips, leaf_fill, n=5, lw=11, ll=30, sw=3.4):
    """Stems with paired oval leaves (the dark glossy plants and the ferns)."""
    for tx, ty in tips:
        mid = ((root[0] + tx) / 2 + (tx - root[0]) * 0.2, (root[1] + ty) / 2 - 8)
        add(f'M{root[0]},{root[1]}Q{f(mid[0])},{f(mid[1])} {tx},{ty}', sw=3.4, stroke='#2A3A1E')
        for i in range(n):
            t = 0.3 + 0.7 * i / (n - 1)
            px = (1 - t) ** 2 * root[0] + 2 * (1 - t) * t * mid[0] + t * t * tx
            py = (1 - t) ** 2 * root[1] + 2 * (1 - t) * t * mid[1] + t * t * ty
            dx = 2 * (1 - t) * (mid[0] - root[0]) + 2 * t * (tx - mid[0])
            dy = 2 * (1 - t) * (mid[1] - root[1]) + 2 * t * (ty - mid[1])
            L = math.hypot(dx, dy) or 1
            ux, uy = dx / L, dy / L
            for side in (1, -1):
                ang = math.radians(48) * side
                lx = ux * math.cos(ang) - uy * math.sin(ang)
                ly = ux * math.sin(ang) + uy * math.cos(ang)
                l = ll * (1 - 0.35 * t)
                add(lens((px, py), (px + lx * l, py + ly * l), lw * (1 - 0.3 * t)), fill=leaf_fill, sw=sw)
        add(lens((tx, ty), (tx + (tx - mid[0]) * 0.22, ty + (ty - mid[1]) * 0.22), lw * 0.6), fill=leaf_fill, sw=sw)


spray((905, 730), [(862, 590), (892, 566), (930, 590), (946, 646)], '#3E5E36', n=6, lw=8, ll=24, sw=3)
spray((618, 730), [(548, 640), (562, 588), (598, 566), (642, 578), (684, 612)], '#2F4D2C', n=5, lw=11, ll=30)

# floor lamp
add(pl([(832, 512), (857, 512), (858, 740), (831, 740)], closed=True), fill='#E6A868', sw=5)
out.append(P('M838,560l12,6M838,610l12,6M838,660l12,6M838,700l12,6', sw=2.4, stroke='#B9743A'))
out.append('<ellipse cx="845" cy="517" rx="50" ry="7" fill="#F9DE92"/>')
add(cr([(828, 461), (862, 460), (884, 486), (906, 512), (845, 518), (785, 513), (806, 487)], a=0.8, k=0.09), fill='#D98A5B', sw=5.5)
out.append(P('M806,500l10,-3M830,480l9,-2M852,496l10,-2M872,502l9,-1M843,472l8,-1M822,506l8,-1M862,482l7,-1', sw=2.4, stroke='#A9562F'))

# ------------------------------------------------------------------ the palm
CROWN = (378, 482)


def frond(p1, p2, col, n=13, L0=62, w=6.5):
    c = CROWN
    blades = []
    for i in range(n):
        t = 0.2 + 0.8 * i / (n - 1)
        px = (1 - t) ** 2 * c[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]
        py = (1 - t) ** 2 * c[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
        dx = 2 * (1 - t) * (p1[0] - c[0]) + 2 * t * (p2[0] - p1[0])
        dy = 2 * (1 - t) * (p1[1] - c[1]) + 2 * t * (p2[1] - p1[1])
        L = math.hypot(dx, dy) or 1
        ux, uy = dx / L, dy / L
        for side in (1, -1):
            ang = math.radians(58 - 26 * t + random.uniform(-6, 6)) * side
            lx = ux * math.cos(ang) - uy * math.sin(ang)
            ly = ux * math.sin(ang) + uy * math.cos(ang)
            l = L0 * (1 - 0.5 * t) * random.uniform(0.86, 1.1)
            ex, ey = px + lx * l, py + ly * l + l * 0.2
            blades.append(lens((px, py), (ex, ey), w * (1 - 0.35 * t)))
    out.append(P(''.join(blades), fill=col, sw=2.6))
    d = f'M{c[0]},{c[1]}Q{p1[0]},{p1[1]} {p2[0]},{p2[1]}'
    add(d, sw=5.2)
    add(d, sw=2.2, stroke='#93A560')


for p1, p2, col in [((262, 262), (132, 300), '#45562A'), ((330, 168), (238, 116), '#45562A'), ((452, 218), (566, 150), '#45562A'), ((500, 332), (648, 390), '#45562A'),
                    ((250, 330), (120, 424), '#5C6E33'), ((272, 200), (160, 184), '#5C6E33'), ((366, 196), (346, 98), '#5C6E33'), ((404, 198), (474, 98), '#6B7E3A'),
                    ((482, 262), (628, 238), '#5C6E33'), ((300, 404), (212, 462), '#6B7E3A'), ((452, 404), (548, 456), '#6B7E3A')]:
    frond(p1, p2, col)
add(cr([(354, 548), (350, 500), (362, 470), (396, 470), (406, 500), (402, 548)], a=0.8), fill='#7C5833', sw=5)
out.append(P('M356,500l20,-12l22,12M354,520l22,-12l24,12M356,540l20,-12l24,12M376,488v52', sw=2.6))

# ------------------------------------------------------------------ the two chairs at the back
velvet(cr([(536, 762), (545, 728), (575, 707), (615, 699), (655, 703), (680, 720), (689, 762), (689, 835), (685, 902), (640, 908), (560, 908), (538, 880), (534, 820)], a=1.2), '#C45A3D',
       [([(546, 752), (560, 724), (602, 714), (618, 730), (620, 806), (606, 816), (546, 816)], '#8E3423'), ([(640, 730), (676, 730), (682, 800), (650, 760)], '#D98063'), ([(634, 800), (660, 830), (664, 900), (640, 900)], '#A9452D')], '#A9452D', 'c1')
out.append(P(cr([(546, 752), (560, 724), (602, 714), (618, 730), (620, 806)], closed=False, a=0.8), sw=3.6))
out.append(P('M621,806L622,900', sw=3.6))
add(pl([(600, 836), (629, 833), (631, 882), (602, 885)], closed=True), fill='#B24B33', sw=4)

velvet(cr([(768, 792), (776, 752), (800, 728), (840, 714), (885, 709), (935, 716), (975, 735), (1000, 765), (1009, 802), (1009, 882), (1003, 946), (985, 957), (790, 957), (772, 946), (767, 882)], a=1.2), '#BC4E35',
       [([(772, 838), (1005, 838), (1006, 905), (770, 905)], '#8C3220'), ([(800, 760), (830, 732), (880, 722), (850, 760), (830, 790)], '#D27A5C'), ([(940, 730), (985, 760), (1000, 800), (960, 770)], '#A44029')], '#A44029', 'c2')
out.append(P(cr([(786, 792), (800, 750), (842, 730), (888, 725), (934, 732), (968, 752), (990, 792)], closed=False, a=0.8), sw=3.6))
out.append(P(cr([(772, 906), (890, 912), (1004, 906)], closed=False, a=0.8), sw=3.6))

# potted plant on the floor between them
for tip, col in [((668, 800), '#5B7A3C'), ((686, 764), '#3F5A30'), ((708, 748), '#6B8A45'), ((736, 760), '#3F5A30'), ((762, 792), '#5B7A3C'), ((722, 790), '#7C9750'), ((694, 800), '#6B8A45')]:
    add(lens((712, 836), tip, 10), fill=col, sw=3.6)
add(cr([(674, 842), (750, 842), (744, 868), (738, 893), (688, 893), (680, 868)], a=0.7, k=0.08), fill='#E9B98F', sw=4.6)
add(cr([(671, 829), (753, 829), (754, 842), (670, 842)], a=0.5, k=0.05), fill='#F0C8A2', sw=4.6)
add(cr(ell(713, 897, 46, 7, n=12), a=0.4), fill='#D9A074', sw=4.2)
out.append(P('M736,848l-4,38', sw=2.4, stroke='#C68E62'))

# ------------------------------------------------------------------ the table behind, with its lamp and menu
table(877, 803, 176, 27, 8, 5, 't1')
card((887, 692), (927, 690), (928, 795), (888, 797), 0.66, sw=3.6)
dome(857, 795, 31, 48, sw=3.6)

# ------------------------------------------------------------------ the stacked seat
WINE, CREAM, TERRA, DARK = '#7B2418', '#F2D9B0', '#D46A3C', '#34121C'
MOTIF_A = dict(line=[(0.08, 1.02), (0.08, 0.62), (0.27, 0.62), (0.27, 0.36), (0.43, 0.36), (0.43, 0.14), (0.57, 0.14), (0.57, 0.36), (0.73, 0.36), (0.73, 0.62), (0.92, 0.62), (0.92, 1.02)],
               fill=[(0.24, 1.02), (0.24, 0.8), (0.4, 0.8), (0.4, 0.56), (0.6, 0.56), (0.6, 0.8), (0.76, 0.8), (0.76, 1.02)], core=[(0.455, 1.02), (0.455, 0.72), (0.545, 0.72), (0.545, 1.02)])


def sample(pts, closed, step=0.06):
    res = []
    n = len(pts)
    for i in range(n if closed else n - 1):
        a, b = pts[i], pts[(i + 1) % n]
        k = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / step))
        for s in range(k):
            res.append((a[0] + (b[0] - a[0]) * s / k, a[1] + (b[1] - a[1]) * s / k))
    if not closed:
        res.append(pts[-1])
    return res


def fabric(M, bounds, cid, lw):
    """The geometric velvet: a stepped motif in every panel, every other one upside down."""
    g = [f'<g clip-path="url(#{cid})">']
    for k in range(len(bounds) - 1):
        ta, tb = bounds[k], bounds[k + 1]
        flip = k % 2 == 1

        def mp(p):
            u, v = p
            if flip:
                v = 1 - v
            return M(ta + (tb - ta) * u, v)
        g.append(P(pl([mp(p) for p in sample(MOTIF_A['fill'], True)], closed=True, a=0.7), fill=TERRA, sw=0))
        g.append(P(pl([mp(p) for p in sample(MOTIF_A['core'], True)], closed=True, a=0.5), fill=DARK, sw=0))
        g.append(P(pl([mp(p) for p in sample(MOTIF_A['line'], False)], a=0.7), sw=lw, stroke=CREAM, extra='stroke-linejoin="miter"'))
        g.append(P(pl([mp(p) for p in sample([(0.0, 0.1), (0.14, 0.1), (0.14, 0.3)], False)], a=0.5) + pl([mp(p) for p in sample([(1.0, 0.1), (0.86, 0.1), (0.86, 0.3)], False)], a=0.5), sw=lw * 0.8, stroke=TERRA, extra='stroke-linejoin="miter"'))
    return g


def ring(cid, x0, x1, yt, yb, nseg=7, arch=6, sag=9):
    cx, Rx, h = (x0 + x1) / 2, (x1 - x0) / 2, yb - yt
    r = h / 2
    ht, hb = h * 0.1, h * 0.36

    def M(th, v):
        t = yt - arch + (1 - math.cos(th)) * (ht + arch)
        b = yb + sag - (1 - math.cos(th)) * (hb + sag)
        return (cx + Rx * math.sin(th), t + (b - t) * v)
    pts = [(x0 + r * 0.95, yt + 3), (cx - Rx * 0.3, yt - arch * 0.8), (cx + Rx * 0.3, yt - arch * 0.8), (x1 - r * 0.95, yt + 3), (x1 - r * 0.25, yt + h * 0.2), (x1 + 2, yt + h * 0.5), (x1 - r * 0.3, yb - h * 0.2),
           (x1 - r, yb - 4), (cx + Rx * 0.3, yb + sag * 0.7), (cx - Rx * 0.3, yb + sag * 0.7), (x0 + r, yb - 4), (x0 + r * 0.3, yb - h * 0.2), (x0 - 2, yt + h * 0.5), (x0 + r * 0.25, yt + h * 0.2)]
    d = cr(pts, a=1.0)
    clip(cid, d)
    add(d, fill=WINE, sw=0)
    lim = math.radians(78)
    bounds = [-math.pi / 2] + [-lim + 2 * lim * i / (nseg - 1) for i in range(nseg)] + [math.pi / 2]
    g = fabric(M, bounds, cid, max(5, h * 0.062))
    ths = [-math.pi / 2 + math.pi * i / 24 for i in range(25)]
    g.append(P(pl([M(t, 0.7) for t in ths] + [M(t, 1.1) for t in reversed(ths)], closed=True, a=0), fill='#2A0D0A', sw=0, extra='opacity=".3"'))
    g.append(P(pl([M(t, -0.1) for t in ths] + [M(t, 0.13) for t in reversed(ths)], closed=True, a=0), fill='#FFE2B8', sw=0, extra='opacity=".18"'))
    for th in bounds[1:-1]:
        a, m, b = M(th, 0.02), M(th, 0.5), M(th, 0.98)
        g.append(P(f'M{f(a[0])},{f(a[1])}Q{f(m[0] + math.sin(th) * 5)},{f(m[1])} {f(b[0])},{f(b[1])}', sw=3.4))
    g.append('</g>')
    out.append(''.join(g))
    add(d, sw=5.5)


# the wide round seat at the bottom
DR = (385, 1030, 352, 68, 168)
dcx, dcy, drx, dry, dH = DR
face = [(dcx - drx, dcy)] + [(dcx + drx * math.cos(math.radians(a)), dcy + dH + dry * math.sin(math.radians(a))) for a in range(180, -1, -15)] + [(dcx + drx, dcy)]
face_d = cr(face + [(dcx + drx * math.cos(math.radians(a)), dcy + dry * math.sin(math.radians(a))) for a in range(15, 180, 15)], a=1.0, k=0.12)
clip('drum', face_d)
add(face_d, fill=WINE, sw=0)


def MD(th, v):
    return (dcx + drx * math.sin(th), dcy + dry * math.cos(th) + v * dH)


lim = math.radians(80)
db = [-math.pi / 2] + [-lim + 2 * lim * i / 8 for i in range(9)] + [math.pi / 2]
g = fabric(MD, db, 'drum', 9)
ths = [-math.pi / 2 + math.pi * i / 24 for i in range(25)]
g.append(P(pl([MD(t, 0.78) for t in ths] + [MD(t, 1.1) for t in reversed(ths)], closed=True, a=0), fill='#2A0D0A', sw=0, extra='opacity=".28"'))
for th in db[1:-1]:
    a, b = MD(th, 0.0), MD(th, 1.0)
    g.append(P(f'M{f(a[0])},{f(a[1])}L{f(b[0])},{f(b[1])}', sw=3.4))
g.append('</g>')
out.append(''.join(g))
add(face_d, sw=5.5)
top_d = cr(ell(dcx, dcy, drx, dry, n=20), a=0.8)
clip('dtop', top_d)
add(top_d, fill='#8B2C1C', sw=0)
g = ['<g clip-path="url(#dtop)">']
for rr in (0.9, 0.74):
    pts = []
    for i in range(0, 361, 6):
        a = math.radians(i)
        k = rr + (0.035 if (i // 6) % 2 else -0.035)
        pts.append((dcx + drx * k * math.cos(a), dcy + dry * k * math.sin(a)))
    g.append(P(pl(pts, a=0.6), sw=5.5 if rr > 0.8 else 4, stroke=CREAM if rr > 0.8 else TERRA))
g.append('</g>')
out.append(''.join(g))
add(top_d, sw=5.5)

out.append('<ellipse cx="380" cy="1004" rx="246" ry="26" fill="#2A0D0A" opacity=".4"/>')
ring('r3', 118, 642, 882, 1016, nseg=8, sag=10)
out.append('<ellipse cx="378" cy="896" rx="214" ry="14" fill="#2A0D0A" opacity=".4"/>')
ring('r2', 150, 606, 806, 902, nseg=7, sag=8)
out.append('<ellipse cx="380" cy="816" rx="176" ry="12" fill="#2A0D0A" opacity=".4"/>')
ring('r1', 190, 570, 716, 822, nseg=7, sag=8)
# the lit top of the seat, around the foot of the urn
add(cr(ell(380, 729, 152, 13, n=16), a=0.6), fill='#F9DC9A', sw=4)
out.append('<ellipse cx="380" cy="730" rx="112" ry="8" fill="#B9853F"/>')

# ------------------------------------------------------------------ the urn and its trailing leaves
add(cr([(336, 702), (444, 702), (449, 736), (390, 744), (331, 736)], a=0.6, k=0.07), fill='#D48A5C', sw=5)
add(cr([(316, 689), (460, 689), (463, 696), (460, 703), (316, 703), (313, 696)], a=0.5, k=0.08), fill='#E6A174', sw=5)
urn = cr([(249, 568), (253, 584), (268, 624), (298, 662), (336, 689), (392, 692), (448, 689), (482, 660), (502, 620), (508, 584), (510, 566), (380, 560)], a=0.8, k=0.13)
clip('urn', urn)
add(urn, fill='#E59D6E', sw=0)
out.append('<g clip-path="url(#urn)">' + P(cr([(246, 566), (254, 590), (268, 624), (298, 662), (336, 690), (372, 692), (326, 652), (298, 612), (290, 566)], a=0.8), fill='#C97A4C', sw=0)
           + P(cr([(450, 580), (486, 580), (476, 630), (452, 664), (440, 640)], a=0.8), fill='#F0B88E', sw=0) + '</g>')
add(urn, sw=5.5)
add(cr([(243, 556), (514, 554), (517, 565), (513, 575), (246, 577), (241, 566)], a=0.6, k=0.06), fill='#EDB088', sw=5)
mound = [(246, 560), (258, 536), (288, 526), (318, 516), (350, 526), (380, 512), (412, 524), (442, 514), (472, 526), (498, 538), (516, 558), (506, 574), (472, 566), (432, 574), (392, 566), (352, 574), (312, 566), (272, 576)]
add(cr(mound, a=1.2), fill='#48652F', sw=5)
rnd = random.Random(4)
for _ in range(20):
    x, y = rnd.uniform(262, 500), rnd.uniform(526, 566)
    a = rnd.uniform(0, 6.283)
    add(lens((x, y), (x + math.cos(a) * 19, y + math.sin(a) * 12), 6.5), fill=rnd.choice(['#7C9A4C', '#93AE62', '#5F7F3C']), sw=2.6)
for pts in [[(262, 568), (250, 598), (258, 640)], [(300, 572), (308, 612)], [(498, 568), (522, 592), (518, 614)], [(424, 572), (430, 604)], [(238, 560), (220, 584), (226, 612)]]:
    add(cr(pts, closed=False, a=1), sw=3)
    for i, (x, y) in enumerate(pts[1:]):
        s = 1 if i % 2 else -1
        add(lens((x, y), (x + s * 17, y + 13), 7), fill='#7C9A4C', sw=2.8)
        add(lens((x, y - 16), (x - s * 15, y - 4), 6), fill='#5F7F3C', sw=2.8)

# ------------------------------------------------------------------ the front table: the little table with the light
table(842, 1010, 322, 80, 13, 9, 't2')
card((846, 816), (916, 819), (916, 1005), (842, 1001), 0.5, sw=4.2)
dome(804, 987, 54, 70)

# ------------------------------------------------------------------ the two near chairs, seen from behind
def tub(cid, top, x0b, x1b, yb, fill, hi, streak, dark, streaks):
    """A velvet tub chair from behind: rolled top edge, sides that taper, a rounded base."""
    xl, xr = top[0][0], top[-1][0]
    ymid = (top[0][1] + yb) / 2
    pts = list(top) + [(xr + 2, ymid - 40), (x1b + 6, yb - 60), (x1b - 6, yb - 14), (x1b - 46, yb + 6), ((x0b + x1b) / 2, yb + 16), (x0b + 46, yb + 6), (x0b + 6, yb - 14), (x0b - 6, yb - 60), (xl - 2, ymid - 40)]
    d = cr(pts, a=1.3)
    clip(cid, d)
    add(d, fill=fill, sw=0)
    g = [f'<g clip-path="url(#{cid})">']
    roll = [(x, y + 4) for x, y in top] + [(x, y + 36) for x, y in reversed(top)]
    g.append(P(cr(roll, a=1.5), fill=hi, sw=0))
    for pts2 in streaks:
        g.append(P(cr(pts2, a=2), fill=streak, sw=0))
    g.append(P(cr([(x0b - 30, yb - 16), ((x0b + x1b) / 2, yb + 2), (x1b + 30, yb - 16), (x1b + 30, yb + 40), (x0b - 30, yb + 40)], a=1), fill=dark, sw=0))
    g.append('</g>')
    out.append(''.join(g))
    out.append(P(cr([(x, y + 38) for x, y in top[1:-1]], closed=False, a=1.2), sw=3.2))
    add(d, sw=5.5)


tub('c3', [(-58, 1092), (-46, 1060), (-10, 1046), (120, 1026), (262, 1010), (300, 1014), (320, 1040), (324, 1078)], -36, 300, 1352, '#C9664B', '#E2957A', '#AE4C33', '#5E2218',
    [[(40, 1130), (84, 1150), (104, 1250), (78, 1300), (52, 1220)], [(196, 1110), (232, 1150), (224, 1270), (194, 1210)], [(-30, 1170), (-6, 1230), (-22, 1310), (-46, 1260)]])
tub('c4', [(676, 1146), (684, 1110), (712, 1096), (830, 1090), (980, 1090), (1096, 1094), (1132, 1106), (1148, 1140)], 700, 1126, 1352, '#A9422B', '#CB6648', '#8C3120', '#4E1A12',
    [[(770, 1190), (806, 1210), (822, 1300), (790, 1280)], [(940, 1170), (984, 1214), (976, 1310), (944, 1250)], [(1056, 1180), (1092, 1230), (1084, 1310), (1054, 1270)]])

# ------------------------------------------------------------------ write
trace = len(sys.argv) > 2 and sys.argv[2] == 'trace'
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB[0]} {VB[1]} {VB[2]} {VB[3]}" width="{VB[2]}" height="{VB[3]}" role="img" aria-label="Cosy Club, Leeds">',
       '<defs>' + ''.join(defs) + '</defs>', '<g stroke-linejoin="round" stroke-linecap="round">', '\n'.join(out), '</g>']
if trace:
    svg.append('<image href="s02.jpg" x="0" y="0" width="1080" height="1350" opacity=".5"/>')
svg.append('</svg>')
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(svg))
print(len('\n'.join(svg)) // 1024, 'KB', len(out), 'elements')
