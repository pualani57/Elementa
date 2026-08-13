import { useId } from 'react';
import { neutronCount } from '../lib/format';

/**
 * Nucleus plus orbiting electron shells. Valence electrons are drawn larger
 * and in amber so they read as distinct from the cyan core electrons —
 * colour is never the only signal, since they also differ in size and the
 * outer ring is solid rather than dashed.
 */
export default function AtomVisualization({ element, size = 320, reducedMotion }) {
  // Gradient/filter ids must be unique if two atoms are ever on screen at once.
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');
  const gradId = `nucleus-${uid}`;
  const glowId = `glow-${uid}`;

  const shells = element.shells || [];
  const cx = size / 2;
  const cy = size / 2;
  const nucleusR = Math.max(16, Math.min(30, 14 + element.z * 0.04));
  const maxShellR = size / 2 - 18;
  const shellGap = shells.length > 0 ? maxShellR / shells.length : maxShellR;
  const neutrons = neutronCount(element);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={`Atomic model of ${element.name}: ${element.z} protons, about ${
        neutrons ?? 'an unknown number of'
      } neutrons, and ${element.z} electrons arranged in ${shells.length} shell${
        shells.length === 1 ? '' : 's'
      }. The outer shell holds ${element.valence} valence electrons.`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="var(--accent-amber)" />
          <stop offset="100%" stopColor="var(--accent-amber-dark)" />
        </radialGradient>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {shells.map((count, i) => {
        const r = shellGap * (i + 1);
        const isValence = i === shells.length - 1;
        const duration = 14 - i * 2.2;
        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={isValence ? 'var(--accent-amber)' : 'var(--line-soft)'}
              strokeWidth={isValence ? 1.4 : 1}
              strokeDasharray={isValence ? '0' : '2 4'}
              opacity={isValence ? 0.55 : 0.35}
            />
            <g
              style={
                reducedMotion
                  ? undefined
                  : {
                      transformOrigin: `${cx}px ${cy}px`,
                      animation: `spin ${duration}s linear infinite`,
                    }
              }
            >
              {Array.from({ length: count }).map((_, eIdx) => {
                const angle = (2 * Math.PI * eIdx) / count;
                return (
                  <circle
                    key={eIdx}
                    cx={cx + r * Math.cos(angle)}
                    cy={cy + r * Math.sin(angle)}
                    r={isValence ? 4.6 : 3.4}
                    fill={isValence ? 'var(--accent-amber)' : 'var(--accent-cyan)'}
                    filter={`url(#${glowId})`}
                  />
                );
              })}
            </g>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={nucleusR} fill={`url(#${gradId})`} filter={`url(#${glowId})`} />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize={nucleusR * 0.62}
        fontWeight="700"
        fill="var(--bg-deep)"
        className="font-display"
      >
        {element.sym}
      </text>
    </svg>
  );
}
