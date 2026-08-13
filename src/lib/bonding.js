import { COMPOUND_DB, bySym } from '../data';
import { subscriptFormula, toSubFormula } from './format';

/**
 * Most common ionic charges. Deliberately limited to elements with a single
 * dominant oxidation state — anything with variable valency (most transition
 * metals) must come from the curated compound database instead, so we never
 * invent a plausible-looking but wrong formula.
 */
const METAL_CHARGE = {
  Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Fr: 1,
  Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2, Ra: 2,
  Al: 3, Ga: 3, In: 3,
  Zn: 2, Cd: 2, Ag: 1,
};

const NONMETAL_CHARGE = { F: -1, Cl: -1, Br: -1, I: -1, O: -2, S: -2, N: -3, P: -3 };

const DIATOMIC = new Set(['H', 'N', 'O', 'F', 'Cl', 'Br', 'I']);
const DIATOMIC_PAIRS = { H: 1, N: 3, O: 2, F: 1, Cl: 1, Br: 1, I: 1 };

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

function compoundKey(a, b) {
  return [a, b].sort().join('-');
}

const COMPOUND_LOOKUP = new Map(COMPOUND_DB.map((c) => [compoundKey(c.a, c.b), c]));

const NO_COMPOUND_MESSAGE =
  'This combination doesn\u2019t form a common stable compound in this simplified model.';

/**
 * Determines the bond between two elements.
 *
 * Resolution order:
 *   1. Same element (diatomic / metallic / network / inert)
 *   2. Curated known-compound database
 *   3. Noble gas -> inert
 *   4. Metal + metal -> alloy, no discrete formula
 *   5. Charge-balanced ionic prediction (flagged `heuristic: true`)
 *   6. Honest refusal
 *
 * @returns {{formula: string|null, bondType: string, pairs: number|null,
 *   headline: string, note: string, geometry?: string, known: boolean,
 *   heuristic?: boolean}}
 */
export function bondBetween(symA, symB) {
  const a = bySym.get(symA);
  const b = bySym.get(symB);
  if (!a || !b) return null;

  // 1. Same element chosen twice
  if (symA === symB) {
    if (DIATOMIC.has(symA)) {
      const pairs = DIATOMIC_PAIRS[symA];
      const bondWord = pairs === 1 ? 'single' : pairs === 2 ? 'double' : 'triple';
      return {
        formula: `${symA}\u2082`,
        bondType: 'covalent',
        pairs,
        headline: `${a.name} exists naturally as a diatomic molecule.`,
        note: `Two ${a.name.toLowerCase()} atoms share ${pairs} electron pair${
          pairs > 1 ? 's' : ''
        } (a ${bondWord} bond), each completing its outer shell.`,
        known: true,
      };
    }
    if (a.metalClass === 'metal') {
      return {
        formula: `${symA} (s)`,
        bondType: 'metallic',
        pairs: null,
        headline: `Pure ${a.name} is held together by metallic bonding, not a molecule.`,
        note: `${a.name} atoms release their valence electrons into a shared, delocalized "sea" of electrons that moves freely between fixed metal cations \u2014 this is why metals conduct electricity and can be reshaped.`,
        known: true,
      };
    }
    if (symA === 'C') {
      return {
        formula: 'C (s)',
        bondType: 'network-covalent',
        pairs: null,
        headline: 'Carbon atoms link into a giant covalent network, not a small molecule.',
        note: 'Depending on how the bonds are arranged, pure carbon forms diamond (rigid 3D lattice) or graphite (stacked sheets) \u2014 same element, very different structures.',
        known: true,
      };
    }
    if (a.category === 'noble-gas') {
      return {
        formula: symA,
        bondType: 'none',
        pairs: null,
        headline: `${a.name} does not bond with itself.`,
        note: `Noble gases already have a full outer shell, so ${a.name} exists as single, unbonded atoms.`,
        known: false,
      };
    }
    return {
      formula: null,
      bondType: 'none',
      pairs: null,
      headline: `${a.name} doesn\u2019t form a simple, stable two-atom compound with itself in this model.`,
      note: NO_COMPOUND_MESSAGE,
      known: false,
    };
  }

  // 2. Curated known compounds take priority over any heuristic
  const dbHit = COMPOUND_LOOKUP.get(compoundKey(symA, symB));
  if (dbHit) {
    return {
      formula: toSubFormula(dbHit.formula),
      bondType: dbHit.bondType,
      pairs: dbHit.pairs,
      headline: `${a.name} and ${b.name} form ${toSubFormula(dbHit.formula)}.`,
      note: dbHit.note,
      geometry: dbHit.geometry,
      known: true,
    };
  }

  // 3. Noble gases are inert unless explicitly listed above
  if (a.category === 'noble-gas' || b.category === 'noble-gas') {
    const noble = a.category === 'noble-gas' ? a : b;
    return {
      formula: null,
      bondType: 'none',
      pairs: null,
      headline: `${noble.name} is chemically inert here.`,
      note: `Noble gases have a full outer electron shell, so they almost never share or transfer electrons. ${NO_COMPOUND_MESSAGE}`,
      known: false,
    };
  }

  // 4. Two metals form an alloy, not a fixed-formula compound
  if (a.metalClass === 'metal' && b.metalClass === 'metal') {
    return {
      formula: null,
      bondType: 'metallic',
      pairs: null,
      headline: `${a.name} and ${b.name} would form a metallic alloy, not a molecular compound.`,
      note: 'Two metals don\u2019t transfer or share electrons in discrete pairs \u2014 both contribute electrons to a shared electron "sea." The result is a mixture/alloy rather than a fixed-formula compound.',
      known: false,
    };
  }

  // 5. Charge-balanced ionic prediction for unambiguous metal + nonmetal pairs
  const metalSym = a.metalClass === 'metal' ? symA : b.metalClass === 'metal' ? symB : null;
  if (metalSym && METAL_CHARGE[metalSym] !== undefined) {
    const otherSym = metalSym === symA ? symB : symA;
    const metalEl = bySym.get(metalSym);
    const otherEl = bySym.get(otherSym);
    let otherCharge = NONMETAL_CHARGE[otherSym];
    if (otherCharge === undefined && otherSym === 'H') otherCharge = -1; // saline hydride

    if (otherCharge !== undefined) {
      const mCharge = METAL_CHARGE[metalSym];
      const g = gcd(mCharge, Math.abs(otherCharge));
      const formula = subscriptFormula(
        metalSym,
        Math.abs(otherCharge) / g,
        otherSym,
        mCharge / g
      );
      const enDiff =
        a.en !== null && b.en !== null ? Math.abs(a.en - b.en) : null;
      return {
        formula,
        bondType: 'ionic',
        pairs: null,
        headline: `${metalEl.name} and ${otherEl.name} form the ionic compound ${formula}.`,
        note:
          `${metalEl.name} loses electron${mCharge > 1 ? 's' : ''} to become a +${mCharge} ion, while ` +
          `${otherEl.name} gains electron${Math.abs(otherCharge) > 1 ? 's' : ''} to become a ${otherCharge} ion. ` +
          'The oppositely charged ions attract to form a crystal lattice.' +
          (enDiff !== null
            ? ` The electronegativity gap (\u0394EN \u2248 ${enDiff.toFixed(1)}) supports a full electron transfer.`
            : ''),
        known: false,
        heuristic: true,
      };
    }
  }

  // 6. Nothing grounded to say — say so rather than inventing a compound
  return {
    formula: null,
    bondType: 'none',
    pairs: null,
    headline: `${a.name} and ${b.name} don\u2019t form a common, simple stable compound in this model.`,
    note: `${NO_COMPOUND_MESSAGE} Try a metal with a halogen or oxygen, or two nonmetals from the list of known molecules.`,
    known: false,
  };
}
