import { SHELL_LABELS, SHELL_CAPACITY } from '../data';

/** Shell-by-shell occupancy, e.g. "K: 2/2   L: 6/8". */
export default function ElectronShell({ element }) {
  const shells = element.shells || [];
  return (
    <div className="flex flex-wrap gap-2">
      {shells.map((count, i) => {
        const cap = SHELL_CAPACITY[i] ?? count;
        const isValence = i === shells.length - 1;
        return (
          <div
            key={i}
            className="rounded-lg px-2.5 py-1.5 text-xs"
            style={{
              background: isValence ? 'var(--chip-amber-bg)' : 'var(--chip-bg)',
              border: `1px solid ${isValence ? 'var(--accent-amber)' : 'var(--line-soft)'}`,
              color: isValence ? 'var(--accent-amber)' : 'var(--text-secondary)',
            }}
          >
            <span className="font-mono font-semibold">{SHELL_LABELS[i] ?? `n${i + 1}`}</span>
            <span className="opacity-70">
              : {count}/{cap}
            </span>
            {isValence && <span className="sr-only"> (valence shell)</span>}
          </div>
        );
      })}
    </div>
  );
}
