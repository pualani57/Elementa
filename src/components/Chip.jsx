/** Small toggleable pill used by filters and trend selection. */
export default function Chip({ active, color, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 focus:outline-none"
      style={{
        background: active ? (color ? `${color}2a` : 'var(--chip-active-bg)') : 'var(--chip-bg)',
        border: `1px solid ${active ? color || 'var(--accent-cyan)' : 'var(--line-soft)'}`,
        color: active ? color || 'var(--accent-cyan)' : 'var(--text-secondary)',
      }}
    >
      {children}
    </button>
  );
}
