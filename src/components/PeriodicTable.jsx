import { useCallback, useMemo, useRef, useState } from 'react';
import ElementCard from './ElementCard';
import { matchesFilters, matchesSearch } from '../lib/filters';

/** Markers sitting where the f-block is lifted out of the main table. */
const PLACEHOLDER_CELLS = [
  { x: 3, y: 6, label: '57\u201371' },
  { x: 3, y: 7, label: '89\u2013103' },
];

export default function PeriodicTable({ elements, search, filters, selected, onSelect }) {
  const containerRef = useRef(null);
  const [roving, setRoving] = useState('H');

  const visibleSet = useMemo(() => {
    const s = new Set();
    for (const el of elements) {
      if (matchesSearch(el, search) && matchesFilters(el, filters)) s.add(el.sym);
    }
    return s;
  }, [elements, search, filters]);

  /**
   * Arrow keys walk the grid. The table is sparse, so we keep stepping in the
   * same direction until we land on a real tile or run off the edge.
   */
  const handleKeyDown = useCallback((e) => {
    const { target } = e;
    if (!target?.dataset || target.dataset.x === undefined) return;

    const dirMap = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowDown: [0, 1],
      ArrowUp: [0, -1],
    };
    const dir = dirMap[e.key];
    if (!dir) return;
    e.preventDefault();

    let x = parseInt(target.dataset.x, 10);
    let y = parseInt(target.dataset.y, 10);

    for (let step = 0; step < 20; step += 1) {
      x += dir[0];
      y += dir[1];
      if (x < 1 || x > 18 || y < 1 || y > 10) return;
      const btn = containerRef.current?.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      if (btn) {
        btn.focus();
        return;
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Periodic table of the elements. Use arrow keys to move between elements and Enter to open one."
      onKeyDown={handleKeyDown}
      className="grid gap-[3px] sm:gap-1.5"
      style={{
        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(7, minmax(30px, 1fr)) 10px repeat(2, minmax(30px, 1fr))',
      }}
    >
      {PLACEHOLDER_CELLS.map((p) => (
        <div
          key={p.label}
          aria-hidden="true"
          style={{ gridColumn: p.x, gridRow: p.y }}
          className="flex items-center justify-center rounded-md"
        >
          <span className="font-mono text-[8px] sm:text-[10px]" style={{ color: 'var(--text-faint)' }}>
            {p.label}
          </span>
        </div>
      ))}

      {elements.map((el) => (
        <ElementCard
          key={el.sym}
          el={el}
          dimmed={!visibleSet.has(el.sym)}
          isSelected={selected === el.sym}
          onSelect={onSelect}
          roving={roving}
          onFocusTile={setRoving}
        />
      ))}
    </div>
  );
}
