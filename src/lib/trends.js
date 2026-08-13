/**
 * Metallic character is not a single measured number, so it's scored
 * qualitatively by category rather than pulled from the dataset.
 */
const METALLIC_SCORE = {
  'alkali-metal': 9,
  'alkaline-earth': 8,
  lanthanide: 7,
  actinide: 7,
  'transition-metal': 6,
  'post-transition': 5,
  metalloid: 3,
  nonmetal: 1,
  'noble-gas': 0,
};

export const TREND_DEFS = {
  en: {
    label: 'Electronegativity',
    unit: '',
    get: (e) => e.en,
    arrow: 'Generally increases \u2192 across a period, decreases \u2193 down a group.',
    note: 'Fluorine is the most electronegative element; francium among the least. Noble gases are usually excluded, as they rarely form bonds.',
  },
  ie1: {
    label: 'Ionization Energy',
    unit: 'kJ/mol',
    get: (e) => e.ie1,
    arrow: 'Generally increases \u2192 across a period, decreases \u2193 down a group.',
    note: 'It takes more energy to remove an electron from a small, tightly-held atom near the top-right of the table.',
  },
  ea: {
    label: 'Electron Affinity',
    unit: 'kJ/mol',
    get: (e) => e.ea,
    arrow: 'Generally strengthens \u2192 across a period, toward the halogens.',
    note: 'Values are irregular near filled or half-filled subshells \u2014 this trend has more exceptions than most.',
  },
  metallic: {
    label: 'Metallic Character',
    unit: '',
    get: (e) => METALLIC_SCORE[e.category] ?? null,
    arrow: 'Generally increases \u2190 toward the left of a period, and \u2193 down a group.',
    note: 'Shown qualitatively by element category rather than a single measured number \u2014 metallic character blends several properties at once.',
  },
};

export function valueToHeat(v, min, max) {
  if (v === null || v === undefined || min === max) return null;
  return (v - min) / (max - min);
}

/** Interpolates cyan (low) -> violet -> amber (high). */
export function heatColor(t) {
  const stops = [
    [79, 216, 224],
    [192, 138, 232],
    [240, 168, 60],
  ];
  const pos = t * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(pos));
  const frac = pos - i;
  const c = stops[i].map((v, idx) => Math.round(v + (stops[i + 1][idx] - v) * frac));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
