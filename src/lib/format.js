const SUPERSCRIPT_DIGITS = {
  0: '\u2070', 1: '\u00b9', 2: '\u00b2', 3: '\u00b3', 4: '\u2074',
  5: '\u2075', 6: '\u2076', 7: '\u2077', 8: '\u2078', 9: '\u2079',
};

export const SUBSCRIPT_DIGITS = {
  0: '\u2080', 1: '\u2081', 2: '\u2082', 3: '\u2083', 4: '\u2084',
  5: '\u2085', 6: '\u2086', 7: '\u2087', 8: '\u2088', 9: '\u2089',
};

export function superscript(str) {
  return String(str).replace(/[0-9]/g, (d) => SUPERSCRIPT_DIGITS[d]);
}

/** "1s2 2s2 2p4" -> "1s²  2s²  2p⁴" */
export function formatConfig(cfg) {
  if (!cfg) return '\u2014';
  return cfg
    .split(' ')
    .map((part) => {
      const m = part.match(/^([0-9]+[a-z])([0-9]+)$/);
      return m ? m[1] + superscript(m[2]) : part;
    })
    .join('  ');
}

/** Build a formula like "Al₂O₃" from symbols and counts. */
export function subscriptFormula(sym1, n1, sym2, n2) {
  const sub = (n) =>
    n === 1 ? '' : String(n).split('').map((d) => SUBSCRIPT_DIGITS[d]).join('');
  return sym1 + sub(n1) + sym2 + sub(n2);
}

/** "Fe2O3" -> "Fe₂O₃" */
export function toSubFormula(f) {
  return f.replace(/[0-9]+/g, (m) =>
    m.split('').map((d) => SUBSCRIPT_DIGITS[d]).join('')
  );
}

/**
 * Formats a numeric property, falling back to an explicit
 * "Not yet measured" rather than a blank or an invented value.
 */
export function fmtNum(v, digits = 2, unit = '') {
  if (v === null || v === undefined) return 'Not yet measured';
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (Number.isNaN(n)) return 'Not yet measured';
  const rounded =
    Math.abs(n) >= 100
      ? Math.round(n)
      : Math.round(n * 10 ** digits) / 10 ** digits;
  return rounded + (unit ? ` ${unit}` : '');
}

export function kelvinToC(k) {
  if (k === null || k === undefined) return null;
  return k - 273.15;
}

/** Approximate neutron count for the most common isotope. */
export function neutronCount(el) {
  if (el.mass === null || el.mass === undefined) return null;
  return Math.max(0, Math.round(el.mass) - el.z);
}
