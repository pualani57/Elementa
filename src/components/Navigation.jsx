const VIEWS = [
  { key: 'table', label: 'Periodic Table' },
  { key: 'bondlab', label: 'Bond Lab' },
  { key: 'trends', label: 'Trends' },
  { key: 'compare', label: 'Compare' },
];

export default function Navigation({ view, setView, theme, setTheme, reducedMotion, setReducedMotion }) {
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur"
      style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--line-soft)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-nowrap items-center gap-3 px-4 py-3">
        <div className="flex flex-none items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="2.6" fill="var(--accent-amber)" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="var(--accent-cyan)" strokeWidth="1.4" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="var(--accent-cyan)" strokeWidth="1.4" transform="rotate(60 12 12)" opacity="0.6" />
            <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="var(--accent-cyan)" strokeWidth="1.4" transform="rotate(120 12 12)" opacity="0.35" />
          </svg>
          <h1 className="font-display text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Elementa
          </h1>
        </div>

        <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label="Main sections">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setView(v.key)}
              aria-current={view === v.key ? 'page' : undefined}
              className="flex-none whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none"
              style={{
                background: view === v.key ? 'var(--chip-active-bg)' : 'transparent',
                color: view === v.key ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              }}
            >
              {v.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-1.5">
          <button
            type="button"
            onClick={() => setReducedMotion((r) => !r)}
            aria-pressed={reducedMotion}
            aria-label="Toggle reduced motion"
            title="Toggle reduced motion"
            className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none"
            style={{
              background: 'var(--panel-inset)',
              color: reducedMotion ? 'var(--accent-amber)' : 'var(--text-faint)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 8v4l3 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title="Toggle dark / light mode"
            className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none"
            style={{ background: 'var(--panel-inset)', color: 'var(--text-faint)' }}
          >
            {theme === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3a6 6 0 1 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
