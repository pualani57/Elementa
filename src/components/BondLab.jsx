import { useEffect, useState } from 'react';
import BondVisualization from './BondVisualization';
import { BOND_LABELS, ELEMENTS, bySym, categoryMeta } from '../data';
import { bondBetween } from '../lib/bonding';

function ElementPicker({ value, onChange, label }) {
  return (
    <label className="flex min-w-[140px] flex-1 flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
        {label}
      </span>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg px-2.5 py-2 text-sm focus:outline-none"
        style={{
          background: 'var(--panel-inset)',
          border: '1px solid var(--line-soft)',
          color: 'var(--text-primary)',
        }}
      >
        <option value="">Choose element&hellip;</option>
        {ELEMENTS.map((el) => (
          <option key={el.sym} value={el.sym}>
            {el.z}. {el.name} ({el.sym})
          </option>
        ))}
      </select>
    </label>
  );
}

function TendencyCard({ el }) {
  const tendency =
    el.metalClass === 'metal'
      ? 'Tends to lose electrons'
      : el.category === 'noble-gas'
        ? 'Rarely gains, loses, or shares electrons'
        : 'Tends to gain or share electrons';

  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'var(--panel-inset)', border: '1px solid var(--line-soft)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display font-semibold" style={{ color: categoryMeta(el.category).color }}>
          {el.name}
        </span>
        <span className="flex-none font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
          {el.valence} valence e&minus;
        </span>
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {tendency}
        {el.en !== null ? ` \u00b7 EN ${el.en.toFixed(2)}` : ''}
      </p>
    </div>
  );
}

export default function BondLab({ elA, elB, setElA, setElB, reducedMotion }) {
  const a = elA ? bySym.get(elA) : null;
  const b = elB ? bySym.get(elB) : null;
  const [result, setResult] = useState(null);

  // Clear a stale result whenever the inputs change.
  useEffect(() => {
    setResult(null);
  }, [elA, elB]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Bond Lab
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Pick two elements to see how &mdash; or whether &mdash; they bond.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <ElementPicker label="Element A" value={elA} onChange={setElA} />
        <div className="hidden pb-2.5 font-mono text-lg sm:block" style={{ color: 'var(--text-faint)' }}>
          +
        </div>
        <ElementPicker label="Element B" value={elB} onChange={setElB} />
        <button
          type="button"
          onClick={() => a && b && setResult(bondBetween(a.sym, b.sym))}
          disabled={!a || !b}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity focus:outline-none disabled:opacity-40"
          style={{ background: 'var(--accent-cyan)', color: 'var(--bg-deep)' }}
        >
          Combine Elements
        </button>
      </div>

      {a && b && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TendencyCard el={a} />
          <TendencyCard el={b} />
        </div>
      )}

      {result && a && b && (
        <div
          className="space-y-4 rounded-2xl p-4 sm:p-5"
          style={{ background: 'var(--panel-bg)', border: '1px solid var(--line-soft)' }}
        >
          <BondVisualization result={result} elA={a} elB={b} reducedMotion={reducedMotion} />

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'var(--chip-active-bg)', color: 'var(--accent-cyan)' }}
            >
              {BOND_LABELS[result.bondType]}
            </span>
            {result.formula && (
              <span className="font-mono text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {result.formula}
              </span>
            )}
            {result.geometry && (
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                {result.geometry} geometry
              </span>
            )}
          </div>

          <p className="font-display text-base font-medium" style={{ color: 'var(--text-primary)' }}>
            {result.headline}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {result.note}
          </p>

          {result.heuristic && (
            <p className="text-xs italic" style={{ color: 'var(--text-faint)' }}>
              Formula predicted from each element&rsquo;s most common oxidation state and standard
              charge-balancing rules, not from a verified compound record.
            </p>
          )}
        </div>
      )}

      {(!a || !b) && (
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
          Choose two elements to get started &mdash; try sodium and chlorine, or hydrogen and oxygen.
        </p>
      )}
    </div>
  );
}
