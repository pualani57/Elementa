import { useState } from 'react';
import { ELEMENTS, bySym } from '../data';
import { fmtNum } from '../lib/format';

const COMPARE_PROPS = [
  { key: 'mass', label: 'Atomic Mass', unit: 'u', get: (e) => e.mass },
  { key: 'en', label: 'Electronegativity', unit: '', get: (e) => e.en },
  { key: 'ie1', label: 'Ionization Energy', unit: 'kJ/mol', get: (e) => e.ie1 },
  { key: 'ea', label: 'Electron Affinity', unit: 'kJ/mol', get: (e) => e.ea },
  { key: 'melt', label: 'Melting Point', unit: 'K', get: (e) => e.melt },
  { key: 'boil', label: 'Boiling Point', unit: 'K', get: (e) => e.boil },
  { key: 'density', label: 'Density', unit: 'g/cm\u00b3', get: (e) => e.density },
];

const SERIES_COLORS = ['var(--accent-cyan)', 'var(--accent-amber)', '#e86ba0', '#5fce9a'];

function CompareBar({ prop, els }) {
  const values = els.map(prop.get).filter((v) => v !== null && v !== undefined);
  const max = values.length ? Math.max(...values) : 0;

  return (
    <div className="space-y-1.5">
      <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
        {prop.label}
        {prop.unit ? ` (${prop.unit})` : ''}
      </div>
      {els.map((el, i) => {
        const v = prop.get(el);
        const missing = v === null || v === undefined;
        const pct = missing || max === 0 ? 0 : (v / max) * 100;
        return (
          <div key={el.sym} className="flex items-center gap-2">
            <span className="w-10 flex-none font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              {el.sym}
            </span>
            <div className="h-2.5 flex-1 rounded-full" style={{ background: 'var(--panel-inset)' }}>
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: SERIES_COLORS[i % SERIES_COLORS.length] }}
              />
            </div>
            <span
              className="w-20 flex-none text-right font-mono text-[11px]"
              style={{ color: 'var(--text-faint)' }}
            >
              {missing ? 'no data' : fmtNum(v, 2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ComparisonPanel({ selected, setSelected }) {
  const els = selected.map((s) => bySym.get(s)).filter(Boolean);
  const [picker, setPicker] = useState('');

  const addEl = (sym) => {
    if (sym && !selected.includes(sym) && selected.length < 4) {
      setSelected([...selected, sym]);
    }
    setPicker('');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Compare Elements
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Choose up to four elements to compare side by side.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {els.map((el) => (
          <span
            key={el.sym}
            className="flex items-center gap-1.5 rounded-full py-1 pl-3 pr-1.5 text-xs font-medium"
            style={{ background: 'var(--chip-active-bg)', color: 'var(--accent-cyan)' }}
          >
            {el.name}
            <button
              type="button"
              onClick={() => setSelected(selected.filter((s) => s !== el.sym))}
              aria-label={`Remove ${el.name} from comparison`}
              className="flex h-4 w-4 items-center justify-center rounded-full focus:outline-none"
              style={{ background: 'var(--panel-inset)' }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}

        {selected.length < 4 && (
          <select
            value={picker}
            onChange={(e) => addEl(e.target.value)}
            aria-label="Add an element to the comparison"
            className="rounded-full px-3 py-1.5 text-xs focus:outline-none"
            style={{
              background: 'var(--panel-inset)',
              border: '1px solid var(--line-soft)',
              color: 'var(--text-secondary)',
            }}
          >
            <option value="">+ Add element&hellip;</option>
            {ELEMENTS.filter((e) => !selected.includes(e.sym)).map((e) => (
              <option key={e.sym} value={e.sym}>
                {e.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {els.length >= 2 ? (
        <div
          className="space-y-5 rounded-2xl p-4 sm:p-5"
          style={{ background: 'var(--panel-bg)', border: '1px solid var(--line-soft)' }}
        >
          {COMPARE_PROPS.map((p) => (
            <CompareBar key={p.key} prop={p} els={els} />
          ))}
          <p className="text-xs italic" style={{ color: 'var(--text-faint)' }}>
            Bars are scaled against the largest value shown. Properties marked &ldquo;no data&rdquo;
            have not been measured for that element.
          </p>
        </div>
      ) : (
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
          Add at least two elements to see a comparison.
        </p>
      )}
    </div>
  );
}
