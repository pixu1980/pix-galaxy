/**
 * _color.js — Color conversion library
 *
 * Zero-dependency color conversions between sRGB, HEX, HSL, and OKLCH.
 * Based on the Oklab color space by Björn Ottosson (https://bottosson.github.io/posts/oklab/).
 *
 * Exports:
 *   Color class — parse any format, access rgb/hex/hsl/oklch getters
 *   toHEXString(rgb), ok: convert to string
 *   formatValue(format, color): format for display
 */

/* ── Helpers ────────────────────────────────────────────────────── */

function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

/* ── sRGB linearization ─────────────────────────────────────────── */

function srgbTransfer(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function srgbTransferInv(channel) {
  const c = clamp(channel, 0, 1);
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(clamp(v, 0, 1) * 255);
}

/* ── RGB ↔ HEX ──────────────────────────────────────────────────── */

function rgbToHex(r, g, b) {
  return '#' +
    Math.round(r).toString(16).padStart(2, '0').toUpperCase() +
    Math.round(g).toString(16).padStart(2, '0').toUpperCase() +
    Math.round(b).toString(16).padStart(2, '0').toUpperCase();
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/* ── RGB ↔ HSL ──────────────────────────────────────────────────── */

function rgbToHsl(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const mx = Math.max(rn, gn, bn), mn = Math.min(rn, gn, bn);
  const d = mx - mn;
  let h = 0;
  if (d !== 0) {
    if (mx === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (mx === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  const l = (mx + mn) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h * 10) / 10, s: Math.round(s * 100 * 10) / 10, l: Math.round(l * 100 * 10) / 10 };
}

function hslToRgb(h, s, l) {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

/* ── RGB ↔ OKLCH ────────────────────────────────────────────────── */

// Oklab M1: linear sRGB → LMS
const M1 = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
];

// Oklab M2: cube-root LMS → Oklab
const M2 = [
  [0.2104542553, 0.7936177850, 0.0040726468],
  [1.9779984951, -2.4285922050, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.8086757660],
];

// Inverse M2: Oklab → cube-root LMS
const M2I = [
  [1.0, 0.3963377774, 0.2158037573],
  [1.0, -0.1055613458, -0.0638541728],
  [1.0, -0.0894841775, -1.2914855480],
];

// Inverse M1: linear sRGB → LMS
const M1I = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.7076147010],
];

function rgbToOklab(r, g, b) {
  const rl = srgbTransfer(r), gl = srgbTransfer(g), bl = srgbTransfer(b);

  // Linear sRGB → LMS
  let l = M1[0][0] * rl + M1[0][1] * gl + M1[0][2] * bl;
  let m = M1[1][0] * rl + M1[1][1] * gl + M1[1][2] * bl;
  let s = M1[2][0] * rl + M1[2][1] * gl + M1[2][2] * bl;

  // Cube root
  l = Math.cbrt(l);
  m = Math.cbrt(m);
  s = Math.cbrt(s);

  // LMS → Oklab
  const L = M2[0][0] * l + M2[0][1] * m + M2[0][2] * s;
  const a = M2[1][0] * l + M2[1][1] * m + M2[1][2] * s;
  const b_ = M2[2][0] * l + M2[2][1] * m + M2[2][2] * s;

  return { L, a, b: b_ };
}

function oklabToRgb(L, a, b) {
  // Oklab → cube-root LMS
  const l_ = M2I[0][0] * L + M2I[0][1] * a + M2I[0][2] * b;
  const m_ = M2I[1][0] * L + M2I[1][1] * a + M2I[1][2] * b;
  const s_ = M2I[2][0] * L + M2I[2][1] * a + M2I[2][2] * b;

  // Cube (undo cube root)
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS → linear sRGB
  const rl = M1I[0][0] * l + M1I[0][1] * m + M1I[0][2] * s;
  const gl = M1I[1][0] * l + M1I[1][1] * m + M1I[1][2] * s;
  const bl = M1I[2][0] * l + M1I[2][1] * m + M1I[2][2] * s;

  return { r: srgbTransferInv(rl), g: srgbTransferInv(gl), b: srgbTransferInv(bl) };
}

function oklabToOklch(L, a, b) {
  const C = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);
  if (h < 0) h += 360;
  return { L: clamp(L, 0, 1) * 100, C: clamp(C, 0, 0.4) * 100, h: h };
}

function oklchToOklab(L, C, h) {
  const Ln = L / 100, Cn = C / 100, hr = h * (Math.PI / 180);
  return { L: Ln, a: Cn * Math.cos(hr), b: Cn * Math.sin(hr) };
}

/* ── RGB → OKLCH → RGB ─────────────────────────────────────────── */

function rgbToOklch(r, g, b) {
  const lab = rgbToOklab(r, g, b);
  return oklabToOklch(lab.L, lab.a, lab.b);
}

function oklchToRgb(L, C, h) {
  const lab = oklchToOklab(L, C, h);
  return oklabToRgb(lab.L, lab.a, lab.b);
}

/* ── Color class ────────────────────────────────────────────────── */

export class Color {
  constructor(value) {
    this.r = 0; this.g = 0; this.b = 0;
    if (value) this.parse(value);
  }

  parse(value) {
    if (typeof value === 'object' && value !== null) {
      if ('r' in value && 'g' in value && 'b' in value) {
        this.r = clamp(Math.round(value.r), 0, 255);
        this.g = clamp(Math.round(value.g), 0, 255);
        this.b = clamp(Math.round(value.b), 0, 255);
        return;
      }
    }
    const s = String(value).trim();
    if (s.startsWith('#')) {
      const h = hexToRgb(s);
      this.r = h.r; this.g = h.g; this.b = h.b;
    } else if (s.startsWith('rgb')) {
      const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) { this.r = clamp(+m[1], 0, 255); this.g = clamp(+m[2], 0, 255); this.b = clamp(+m[3], 0, 255); }
    } else if (s.startsWith('hsl')) {
      const m = s.match(/hsla?\(([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?/);
      if (m) { const c = hslToRgb(+m[1], +m[2], +m[3]); this.r = c.r; this.g = c.g; this.b = c.b; }
    } else if (s.startsWith('oklch')) {
      const m = s.match(/oklch\(([\d.]+)%?\s+([\d.]+)%?\s+([\d.]+)/);
      if (m) { const c = oklchToRgb(+m[1], +m[2], +m[3]); this.r = c.r; this.g = c.g; this.b = c.b; }
    }
  }

  /* ── Getters ──────────────────────────────────────────────────── */

  get hex() { return rgbToHex(this.r, this.g, this.b); }
  get rgb() { return { r: this.r, g: this.g, b: this.b }; }
  get hsl() { return rgbToHsl(this.r, this.g, this.b); }
  get oklch() { return rgbToOklch(this.r, this.g, this.b); }

  toHEXString() { return this.hex; }
  toRGBString() { return `rgb(${this.r}, ${this.g}, ${this.b})`; }
  toHSLString() { const h = this.hsl; return `hsl(${h.h}, ${h.s}%, ${h.l}%)`; }
  toOKLCHString() { const o = this.oklch; return `oklch(${o.L.toFixed(1)}% ${o.C.toFixed(1)}% ${o.h.toFixed(1)})`; }

  /* ── Utilities ────────────────────────────────────────────────── */

  static WCAGContrast(fg, bg) {
    const f = new Color(fg), b = new Color(bg);
    const lum1 = Color.luminance(f.r, f.g, f.b);
    const lum2 = Color.luminance(b.r, b.g, b.b);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  static luminance(r, g, b) {
    const rs = srgbTransfer(r), gs = srgbTransfer(g), bs = srgbTransfer(b);
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  static ratioPassesAA(ratio, large) { return ratio >= (large ? 3 : 4.5); }
  static ratioPassesAAA(ratio, large) { return ratio >= (large ? 4.5 : 7); }
}

/* ── Format display helpers ─────────────────────────────────────── */

export function formatValue(format, color) {
  switch (format) {
    case 'HEX': return color.toHEXString();
    case 'RGB': {
      const o = color.rgb;
      return `${o.r}, ${o.g}, ${o.b}`;
    }
    case 'HSL': {
      const o = color.hsl;
      return `${o.h}° ${o.s}% ${o.l}%`;
    }
    case 'OKLCH': {
      const o = color.oklch;
      return `${o.L.toFixed(1)}% ${o.C.toFixed(2)} ${o.h.toFixed(1)}°`;
    }
    default: return color.toHEXString();
  }
}
