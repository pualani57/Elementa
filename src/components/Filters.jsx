import { useState } from 'react';
import Chip from './Chip';
import { CATEGORY_META } from '../data';
import { emptyFilters, filtersActive, toggleSetValue } from '../lib/filters';

const METAL_CLASSES = [
  ['metal', 'Metal'],
  ['metalloid', 'Metalloid'],
  ['nonmetal', 'Nonmetal'],
];

function FilterGroup({ label, children }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export default function Filters({ search, setSearch, filters, setFilters, resultCount }) {
  const [open, setOpen] = useState(false);
  const active = filtersActive(filters);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-faint)"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, symbol, or atomic number&hellip;"
            aria-label="Search elements by name, symbol, or atomic number"
            className="w-full rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none"
            style={{
              background: 'var(--panel-inset)',
              border: '1px solid var(--line-soft)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none"
          style={{
            background: active ? 'var(--chip-active-bg)' : 'var(--panel-inset)',
            border: `1px solid ${active ? 'var(--accent-cyan)' : 'var(--line-soft)'}`,
            color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {active ? ` \u00b7 ${resultCount}` : ''}
        </button>
      </div>

      {open && (
        <div
          className="space-y-2.5 rounded-xl p-3"
          style={{ background: 'var(--panel-inset)', border: '1px solid var(--line-soft)' }}
        >
          <FilterGroup label="Category">
            {Object.entries(CATEGORY_META)
              .filter(([key]) => key !== 'unknown')
              .map(([key, meta]) => (
                <Chip
                  key={key}
                  active={filters.category.has(key)}
                  color={meta.color}
                  onClick={() => setFilters((f) => ({ ...f, category: toggleSetValue(f.category, key) }))}
                >
                  {meta.label}
                </Chip>
              ))}
          </FilterGroup>

          <FilterGroup label="State of matter">
            {['Solid', 'Liquid', 'Gas'].map((p) => (
              <Chip
                key={p}
                active={filters.phase.has(p)}
                onClick={() => setFilters((f) => ({ ...f, phase: toggleSetValue(f.phase, p) }))}
              >
                {p}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="Block">
            {['s', 'p', 'd', 'f'].map((p) => (
              <Chip
                key={p}
                active={filters.block.has(p)}
                onClick={() => setFilters((f) => ({ ...f, block: toggleSetValue(f.block, p) }))}
              >
                {p}-block
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="Type">
            {METAL_CLASSES.map(([key, label]) => (
              <Chip
                key={key}
                active={filters.metalClass.has(key)}
                onClick={() => setFilters((f) => ({ ...f, metalClass: toggleSetValue(f.metalClass, key) }))}
              >
                {label}
              </Chip>
            ))}
            <Chip
              active={filters.radioactive}
              onClick={() => setFilters((f) => ({ ...f, radioactive: !f.radioactive }))}
            >
              Radioactive
            </Chip>
            <Chip
              active={filters.synthetic}
              onClick={() => setFilters((f) => ({ ...f, synthetic: !f.synthetic }))}
            >
              Synthetic
            </Chip>
          </FilterGroup>

          {active && (
            <button
              type="button"
              onClick={() => setFilters(emptyFilters())}
              className="text-xs font-medium underline underline-offset-2"
              style={{ color: 'var(--accent-amber)' }}
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
