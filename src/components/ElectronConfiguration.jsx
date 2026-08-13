import { formatConfig } from '../lib/format';

function ConfigRow({ label, value }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'var(--panel-inset)', border: '1px solid var(--line-soft)' }}
    >
      <div
        className="mb-1 text-[11px] uppercase tracking-wider"
        style={{ color: 'var(--text-faint)' }}
      >
        {label}
      </div>
      <div
        className="break-words font-mono text-base sm:text-lg"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Full and shorthand electron configuration, with a beginner/detailed
 * explanation toggle handled by the parent.
 */
export default function ElectronConfiguration({ element, mode }) {
  const shells = element.shells || [];
  return (
    <div className="space-y-3">
      <ConfigRow label="Full configuration" value={formatConfig(element.econfig)} />
      <ConfigRow label="Noble-gas shorthand" value={formatConfig(element.econfigSemantic)} />
      <ConfigRow label="Shell form" value={shells.join(', ') || '\u2014'} />

      {mode === 'beginner' ? (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {element.name}&rsquo;s {element.z} electrons sit in {shells.length} shell
          {shells.length === 1 ? '' : 's'} around the nucleus, filling from the inside out. The
          outermost shell holds{' '}
          <strong style={{ color: 'var(--accent-amber)' }}>
            {element.valence} valence electron{element.valence === 1 ? '' : 's'}
          </strong>{' '}
          &mdash; these are the ones that form bonds with other atoms. Electrons in inner shells
          are held more tightly and rarely take part in reactions.
        </p>
      ) : (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Superscripts give the electron count in each subshell, following the Aufbau filling
          order. The noble-gas shorthand replaces filled inner shells with the preceding noble gas
          in brackets, leaving only the outer, chemically active subshells written out. Some
          elements deviate from strict Aufbau order &mdash; chromium and copper are the classic
          exceptions.
        </p>
      )}
    </div>
  );
}
