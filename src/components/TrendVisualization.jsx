import { useState } from 'react';
import Chip from './Chip';
import { TREND_DEFS, heatColor, valueToHeat } from '../lib/trends';

/** Recolors the whole table into a heat map for the selected trend. */
export default function TrendVisualization({ elements }) {
  const [trendKey, setTrendKey] = useState('en');
  const def = TREND_DEFS[trendKey];

  const values = elements.map(def.get).filter((v) => v !== null && v !== undefined);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Periodic Trends
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          These are general tendencies, not absolute rules &mdash; real chemistry has plenty of
          exceptions.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(TREND_DEFS).map(([key, d]) => (
          <Chip key={key} active={trendKey === key} onClick={() => setTrendKey(key)}>
            {d.label}
          </Chip>
        ))}
      </div>

      <div
        className="flex flex-wrap items-center gap-3 rounded-xl p-3"
        style={{ background: 'var(--panel-inset)', border: '1px solid var(--line-soft)' }}
      >
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="h-2.5 w-32 rounded-full"
            style={{ background: 'linear-gradient(90deg, rgb(79,216,224), rgb(192,138,232), rgb(240,168,60))' }}
          />
          <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
            low &rarr; high
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {def.arrow}
        </span>
      </div>

      <p className="text-xs italic" style={{ color: 'var(--text-faint)' }}>
        {def.note}
      </p>

      <div
        className="grid gap-[3px] sm:gap-1.5"
        style={{
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(7, minmax(22px, 1fr)) 8px repeat(2, minmax(22px, 1fr))',
        }}
      >
        {elements.map((el) => {
          const v = def.get(el);
          const t = valueToHeat(v, min, max);
          const unmeasured = t === null;
          return (
            <div
              key={el.sym}
              title={`${el.name}: ${unmeasured ? 'Not yet measured' : `${v}${def.unit ? ` ${def.unit}` : ''}`}`}
              className="flex items-center justify-center rounded-[3px] font-mono text-[8px] font-semibold sm:text-[10px]"
              style={{
                gridColumn: el.x,
                gridRow: el.y,
                background: unmeasured ? 'var(--panel-inset)' : heatColor(t),
                color: unmeasured ? 'var(--text-faint)' : '#0a0d14',
                opacity: unmeasured ? 0.5 : 1,
              }}
            >
              {el.sym}
            </div>
          );
        })}
      </div>
    </div>
  );
}
