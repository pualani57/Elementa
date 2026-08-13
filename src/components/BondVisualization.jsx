import { useId } from 'react';
import { BOND_LABELS, categoryMeta } from '../data';

/**
 * Animates the actual bonding mechanism rather than decorating it:
 * a travelling electron for ionic transfer, shared pairs sitting between
 * the atoms for covalent, a delocalized field for metallic.
 */
export default function BondVisualization({ result, elA, elB, reducedMotion }) {
  const rawId = useId();
  const glowId = `bond-glow-${rawId.replace(/:/g, '')}`;

  const w = 420;
  const h = 190;
  const ax = 110;
  const bx = w - 110;
  const cy = h / 2;
  const type = result.bondType;
  const metaA = categoryMeta(elA.category);
  const metaB = categoryMeta(elB.category);
  const sharedPairs = result.pairs ? Math.min(result.pairs, 3) : 0;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="auto"
      role="img"
      aria-label={`${BOND_LABELS[type]} between ${elA.name} and ${elB.name}.${
        result.formula ? ` Result: ${result.formula}.` : ''
      }`}
    >
      <defs>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {type === 'metallic' && (
        <g opacity="0.35" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <circle
              key={i}
              cx={20 + (i % 8) * 52}
              cy={20 + Math.floor(i / 8) * 60}
              r="3"
              fill="var(--accent-cyan)"
              style={reducedMotion ? undefined : { animation: `pulse 2.4s ease-in-out ${(i % 5) * 0.3}s infinite` }}
            />
          ))}
        </g>
      )}

      {(type === 'covalent' || type === 'polar-covalent') && (
        <line x1={ax + 34} y1={cy} x2={bx - 34} y2={cy} stroke="var(--line-strong)" strokeWidth="3" />
      )}

      {type === 'network-covalent' && (
        <g stroke="var(--line-strong)" strokeWidth="1.5" opacity="0.6">
          <line x1={ax + 34} y1={cy} x2={bx - 34} y2={cy} />
          <line x1={ax} y1={cy - 40} x2={bx} y2={cy - 40} />
          <line x1={ax} y1={cy + 40} x2={bx} y2={cy + 40} />
          <line x1={ax} y1={cy - 40} x2={ax} y2={cy + 40} />
          <line x1={bx} y1={cy - 40} x2={bx} y2={cy + 40} />
        </g>
      )}

      {type === 'ionic' && (
        <line
          x1={ax + 34}
          y1={cy}
          x2={bx - 34}
          y2={cy}
          stroke="var(--line-soft)"
          strokeWidth="2"
          strokeDasharray="4 5"
        />
      )}

      {type === 'none' && (
        <g>
          <line
            x1={ax + 34}
            y1={cy}
            x2={bx - 34}
            y2={cy}
            stroke="var(--text-faint)"
            strokeWidth="2"
            strokeDasharray="3 6"
            opacity="0.5"
          />
          <text x={w / 2} y={cy - 14} textAnchor="middle" fontSize="13" fill="var(--text-faint)">
            no bond
          </text>
        </g>
      )}

      {/* Shared electron pairs — one row per bond order, so a double bond
          visibly shows two pairs and a triple shows three. */}
      {(type === 'covalent' || type === 'polar-covalent') &&
        Array.from({ length: sharedPairs }).map((_, i) => {
          const offset = (i - (sharedPairs - 1) / 2) * 10;
          return (
            <g key={i}>
              <circle cx={w / 2 - 6} cy={cy + offset} r="3.2" fill="var(--accent-amber)" filter={`url(#${glowId})`} />
              <circle cx={w / 2 + 6} cy={cy + offset} r="3.2" fill="var(--accent-cyan)" filter={`url(#${glowId})`} />
            </g>
          );
        })}

      {/* Ionic transfer: an electron physically crossing from metal to nonmetal. */}
      {type === 'ionic' && (
        <circle r="4" fill="var(--accent-amber)" filter={`url(#${glowId})`}>
          <animateMotion
            dur={reducedMotion ? '0.01s' : '1.8s'}
            repeatCount={reducedMotion ? '1' : 'indefinite'}
            fill={reducedMotion ? 'freeze' : 'remove'}
            path={`M ${ax + 30} ${cy} L ${bx - 30} ${cy}`}
          />
        </circle>
      )}

      {[
        [ax, elA, metaA, type === 'ionic' ? '+' : null],
        [bx, elB, metaB, type === 'ionic' ? '\u2212' : null],
      ].map(([x, el, meta, charge]) => (
        <g key={el.sym}>
          <circle
            cx={x}
            cy={cy}
            r="30"
            fill={`${meta.color}26`}
            stroke={meta.color}
            strokeWidth="1.6"
            filter={`url(#${glowId})`}
          />
          <text
            x={x}
            y={cy + 5}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill={meta.color}
            className="font-display"
          >
            {el.sym}
          </text>
          {charge && (
            <text x={x + 24} y={cy - 22} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--accent-amber)">
              {charge}
            </text>
          )}
          <text x={x} y={cy + 46} textAnchor="middle" fontSize="10" fill="var(--text-faint)">
            {el.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
