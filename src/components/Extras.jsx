import { useMemo } from 'react';
import { ELEMENTS, categoryMeta } from '../data';

/** Deterministic per-day index so everyone sees the same element on a date. */
function dayOfYearIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return day % ELEMENTS.length;
}

export function ElementOfDay({ onExplore }) {
  const el = useMemo(() => ELEMENTS[dayOfYearIndex()], []);
  const meta = categoryMeta(el.category);

  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{ background: 'var(--panel-inset)', border: '1px solid var(--line-soft)' }}
    >
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg font-display font-bold"
        style={{ background: `${meta.color}22`, color: meta.color }}
      >
        {el.sym}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
          Element of the day
        </div>
        <div className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {el.name}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onExplore(el.sym)}
        className="flex-none rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
        style={{ background: 'var(--accent-cyan)', color: 'var(--bg-deep)' }}
      >
        Explore
      </button>
    </div>
  );
}

export function SurpriseMe({ onExplore }) {
  return (
    <button
      type="button"
      onClick={() => onExplore(ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)].sym)}
      className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
      style={{
        background: 'var(--panel-inset)',
        border: '1px solid var(--line-soft)',
        color: 'var(--text-secondary)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.7 4.3L19 9l-4.3 1.7L13 15l-1.7-4.3L7 9l4.3-1.7L13 3Z" />
      </svg>
      Surprise Me
    </button>
  );
}
