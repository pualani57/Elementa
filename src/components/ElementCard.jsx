import { categoryMeta } from '../data';
import { formatConfig } from '../lib/format';

/**
 * A single tile in the periodic table.
 * Uses roving tabindex: only one tile is tabbable, arrow keys move focus.
 */
export default function ElementCard({ el, dimmed, isSelected, onSelect, roving, onFocusTile }) {
  const meta = categoryMeta(el.category);

  /**
   * The tooltip is centred under the tile by default, but that runs it off
   * the viewport for tiles near the left/right edge of the 18-column grid.
   */
  const edgeAlign = el.x <= 3 ? 'left' : el.x >= 16 ? 'right' : 'center';
  const tooltipPositionClass =
    edgeAlign === 'left'
      ? 'left-0'
      : edgeAlign === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  // The lanthanide/actinide rows sit at the bottom of the table, so a
  // downward tooltip runs off the container; open it upward instead.
  const openUpward = el.y >= 9;
  const tooltipSideClass = openUpward ? 'bottom-full mb-2' : 'top-full mt-2';

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
      className="group relative z-0 flex flex-col items-start justify-between rounded-md px-1 py-1 text-left transition-all duration-200 hover:z-20 focus-visible:z-20 focus:outline-none"
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
        className={`pointer-events-none absolute z-30 hidden w-48 rounded-lg p-3 text-left text-[12px] shadow-2xl group-hover:block group-focus-visible:block ${tooltipPositionClass} ${tooltipSideClass}`}
        style={{
          background: 'var(--tooltip-bg)',
          border: `1px solid ${meta.color}88`,
          boxShadow: `0 8px 24px -4px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color}22`,
          color: 'var(--text-secondary)',
        }}
      >
        <span className="block font-display text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          {el.name} &middot; #{el.z}
        </span>
        <span className="mt-1 block font-mono">{formatConfig(el.econfig)}</span>
        <span className="mt-1 block" style={{ color: meta.color }}>
          {meta.label}
          {el.predicted ? ' (predicted)' : ''}
        </span>
      </span>
    </button>
  );
}
