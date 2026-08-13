import { categoryMeta } from '../data';
import { formatConfig } from '../lib/format';

/**
 * A single tile in the periodic table.
 * Uses roving tabindex: only one tile is tabbable, arrow keys move focus.
 */
export default function ElementCard({ el, dimmed, isSelected, onSelect, roving, onFocusTile }) {
  const meta = categoryMeta(el.category);

  return (
    <button
      type="button"
      data-x={el.x}
      data-y={el.y}
      data-sym={el.sym}
      tabIndex={roving === el.sym ? 0 : -1}
      onFocus={() => onFocusTile(el.sym)}
      onClick={() => onSelect(el.sym)}
      aria-label={`${el.name}, atomic number ${el.z}, ${meta.label}${
        el.predicted ? ', properties predicted' : ''
      }`}
      className="group relative flex flex-col items-start justify-between rounded-md px-1 py-1 text-left transition-all duration-200 focus:outline-none"
      style={{
        gridColumn: el.x,
        gridRow: el.y,
        background: isSelected ? 'var(--tile-selected-bg)' : 'var(--tile-bg)',
        border: `1px solid ${isSelected ? meta.color : 'var(--line-soft)'}`,
        opacity: dimmed ? 0.22 : 1,
        transform: dimmed ? 'scale(0.9)' : 'scale(1)',
        pointerEvents: dimmed ? 'none' : 'auto',
        boxShadow: isSelected ? `0 0 0 2px ${meta.color}55, 0 0 16px ${meta.color}40` : 'none',
        minWidth: 0,
      }}
    >
      {/* Category stripe: colour is paired with the label in the tooltip/legend,
          so category is never communicated by colour alone. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-md"
        style={{ background: meta.color }}
      />

      <span className="flex w-full items-start justify-between pl-1">
        <span className="font-mono text-[9px] sm:text-[10px]" style={{ color: 'var(--text-faint)' }}>
          {el.z}
        </span>
        {el.predicted && (
          <span
            className="font-mono text-[8px] sm:text-[9px]"
            style={{ color: 'var(--text-faint)' }}
            title="Properties predicted, not yet measured"
          >
            ?
          </span>
        )}
      </span>

      <span
        className="w-full pl-1 font-display text-[13px] font-semibold leading-none sm:text-base"
        style={{ color: 'var(--text-primary)' }}
      >
        {el.sym}
      </span>

      <span
        className="w-full truncate pl-1 text-[7px] leading-tight sm:text-[9px]"
        style={{ color: 'var(--text-faint)' }}
      >
        {el.name}
      </span>

      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-44 -translate-x-1/2 rounded-lg p-2 text-left text-[11px] shadow-xl group-hover:block group-focus-visible:block"
        style={{
          background: 'var(--tooltip-bg)',
          border: '1px solid var(--line-soft)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="block font-display text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          {el.name} &middot; #{el.z}
        </span>
        <span className="mt-0.5 block font-mono">{formatConfig(el.econfig)}</span>
        <span className="mt-0.5 block" style={{ color: meta.color }}>
          {meta.label}
          {el.predicted ? ' (predicted)' : ''}
        </span>
      </span>
    </button>
  );
}
