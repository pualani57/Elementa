import { useEffect, useState } from 'react';
import AtomVisualization from './AtomVisualization';
import ElectronShell from './ElectronShell';
import ElectronConfiguration from './ElectronConfiguration';
import { categoryMeta } from '../data';
import { fmtNum, kelvinToC, neutronCount } from '../lib/format';

const TABS = ['Overview', 'Atomic Structure', 'Properties', 'Uses', 'History'];

function InfoRow({ label, value }) {
  const missing = value === 'Not yet measured' || value === 'Information unavailable';
  return (
    <div
      className="flex items-baseline justify-between gap-3 border-b py-2 text-sm"
      style={{ borderColor: 'var(--line-soft)' }}
    >
      <span style={{ color: 'var(--text-faint)' }}>{label}</span>
      <span
        className="text-right font-mono"
        style={{ color: missing ? 'var(--text-faint)' : 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}

function tempValue(k) {
  if (k === null || k === undefined) return 'Not yet measured';
  return `${fmtNum(kelvinToC(k), 0)} \u00b0C (${fmtNum(k, 0)} K)`;
}

export default function ElementExplorer({
  element,
  onClose,
  onOpenBondLab,
  onAddCompare,
  econfigMode,
  setEconfigMode,
  reducedMotion,
  isMobile,
}) {
  const [tab, setTab] = useState('Overview');

  useEffect(() => {
    setTab('Overview');
  }, [element?.sym]);

  if (!element) return null;

  const meta = categoryMeta(element.category);
  const neutrons = neutronCount(element);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${element.name} details`}
      className={`explorer-panel ${
        isMobile
          ? 'fixed inset-0 z-40 flex flex-col'
          : 'fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col shadow-2xl'
      }`}
      style={{
        background: 'var(--panel-bg)',
        borderLeft: isMobile ? 'none' : '1px solid var(--line-soft)',
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 pb-3 pt-4"
        style={{ borderBottom: '1px solid var(--line-soft)' }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 flex-none items-center justify-center rounded-lg font-display text-lg font-bold"
            style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}66` }}
          >
            {element.sym}
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {element.name}
            </h2>
            <p className="truncate text-xs" style={{ color: meta.color }}>
              #{element.z} &middot; {meta.label}
              {element.predicted ? ' \u00b7 predicted' : ''}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close element details"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full focus:outline-none"
          style={{ color: 'var(--text-faint)', background: 'var(--panel-inset)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto px-3 pb-1 pt-3" role="tablist" aria-label="Element sections">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className="flex-none whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none"
            style={{
              background: tab === t ? 'var(--chip-active-bg)' : 'transparent',
              color: tab === t ? 'var(--accent-cyan)' : 'var(--text-faint)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {tab === 'Overview' && (
          <>
            <div className="mx-auto aspect-square w-full max-w-[240px]">
              <AtomVisualization element={element} reducedMotion={reducedMotion} />
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {element.blurb}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg p-2" style={{ background: 'var(--panel-inset)' }}>
                <div className="font-mono text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {element.z}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                  Protons
                </div>
              </div>
              <div className="rounded-lg p-2" style={{ background: 'var(--panel-inset)' }}>
                <div className="font-mono text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {neutrons ?? '\u2014'}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                  Neutrons (approx.)
                </div>
              </div>
              <div className="rounded-lg p-2" style={{ background: 'var(--chip-amber-bg)' }}>
                <div className="font-mono text-base font-semibold" style={{ color: 'var(--accent-amber)' }}>
                  {element.valence ?? '\u2014'}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--accent-amber)' }}>
                  Valence electrons
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenBondLab(element.sym)}
                className="rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                style={{ background: 'var(--accent-cyan)', color: 'var(--bg-deep)' }}
              >
                Open in Bond Lab
              </button>
              <button
                type="button"
                onClick={() => onAddCompare(element.sym)}
                className="rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                style={{
                  background: 'var(--panel-inset)',
                  border: '1px solid var(--line-soft)',
                  color: 'var(--text-secondary)',
                }}
              >
                Add to Compare
              </button>
            </div>
          </>
        )}

        {tab === 'Atomic Structure' && (
          <>
            <div className="mx-auto aspect-square w-full max-w-[260px]">
              <AtomVisualization element={element} size={340} reducedMotion={reducedMotion} />
            </div>

            <div>
              <div className="mb-1.5 text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                Shell-by-shell distribution
              </div>
              <ElectronShell element={element} />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                Electron configuration
              </span>
              <div className="ml-auto flex rounded-full p-0.5" style={{ background: 'var(--panel-inset)' }}>
                {['beginner', 'detailed'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setEconfigMode(m)}
                    aria-pressed={econfigMode === m}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium capitalize focus:outline-none"
                    style={{
                      background: econfigMode === m ? 'var(--accent-cyan)' : 'transparent',
                      color: econfigMode === m ? 'var(--bg-deep)' : 'var(--text-faint)',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <ElectronConfiguration element={element} mode={econfigMode} />
          </>
        )}

        {tab === 'Properties' && (
          <div>
            <InfoRow label="Atomic mass" value={fmtNum(element.mass, 3, 'u')} />
            <InfoRow label="Phase at room temp." value={element.phase} />
            <InfoRow label="Density" value={fmtNum(element.density, 3, 'g/cm\u00b3')} />
            <InfoRow label="Melting point" value={tempValue(element.melt)} />
            <InfoRow label="Boiling point" value={tempValue(element.boil)} />
            <InfoRow label="Electronegativity" value={fmtNum(element.en, 2)} />
            <InfoRow label="Ionization energy" value={fmtNum(element.ie1, 1, 'kJ/mol')} />
            <InfoRow label="Electron affinity" value={fmtNum(element.ea, 1, 'kJ/mol')} />
            <InfoRow label="Appearance" value={element.appearance || 'Information unavailable'} />
            <InfoRow label="Radioactive" value={element.radioactive ? 'Yes' : 'No'} />
            <InfoRow label="Synthetic" value={element.synthetic ? 'Yes' : 'No'} />
          </div>
        )}

        {tab === 'Uses' && (
          <div className="space-y-4">
            {element.uses?.length ? (
              <ul className="space-y-2">
                {element.uses.map((u) => (
                  <li key={u} className="flex gap-2 text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                      style={{ background: meta.color }}
                    />
                    {u}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
                Information unavailable &mdash; this element has no significant applications outside
                research settings.
              </p>
            )}

            {element.facts?.length > 0 && (
              <div>
                <div className="mb-1.5 text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                  Good to know
                </div>
                <ul className="space-y-1.5">
                  {element.facts.map((f) => (
                    <li key={f} className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      &bull; {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === 'History' && (
          <div className="space-y-3">
            <InfoRow label="Discovered by" value={element.discoveredBy || 'Information unavailable'} />
            <InfoRow label="Named by" value={element.namedBy || 'Information unavailable'} />
            <p className="pt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {element.blurb}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
