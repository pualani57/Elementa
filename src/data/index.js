import elementsRaw from './elements.json';
import compoundsRaw from './compounds.json';

/**
 * All 118 elements, sorted by atomic number.
 * Base data derived from Bowserinator/Periodic-Table-JSON (CC BY-SA 3.0).
 * See ATTRIBUTION.md.
 */
export const ELEMENTS = [...elementsRaw].sort((a, b) => a.z - b.z);

/** Curated set of well-known compounds used by the Bond Lab. */
export const COMPOUND_DB = compoundsRaw;

export const CATEGORY_META = {
  'alkali-metal': { label: 'Alkali Metal', color: '#c9a6ee' },
  'alkaline-earth': { label: 'Alkaline Earth Metal', color: '#f0a877' },
  'transition-metal': { label: 'Transition Metal', color: '#5fc3cf' },
  'post-transition': { label: 'Post-Transition Metal', color: '#8fa3d6' },
  metalloid: { label: 'Metalloid', color: '#d6b862' },
  nonmetal: { label: 'Reactive Nonmetal', color: '#5fce9a' },
  'noble-gas': { label: 'Noble Gas', color: '#d089ef' },
  lanthanide: { label: 'Lanthanide', color: '#f188b3' },
  actinide: { label: 'Actinide', color: '#ef6e6a' },
  unknown: { label: 'Unknown / Predicted', color: '#93a1b8' },
};

export const SHELL_LABELS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
export const SHELL_CAPACITY = [2, 8, 18, 32, 32, 18, 8];

export const BOND_LABELS = {
  ionic: 'Ionic bond',
  covalent: 'Covalent bond',
  'polar-covalent': 'Polar covalent bond',
  metallic: 'Metallic bond',
  'network-covalent': 'Giant covalent network',
  none: 'No bond',
};

export const bySym = new Map(ELEMENTS.map((e) => [e.sym, e]));
export const byZ = new Map(ELEMENTS.map((e) => [e.z, e]));

export function categoryMeta(cat) {
  return CATEGORY_META[cat] || CATEGORY_META.unknown;
}
