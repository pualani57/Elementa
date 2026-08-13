import { CATEGORY_META } from '../data';

export default function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {Object.entries(CATEGORY_META)
        .filter(([key]) => key !== 'unknown')
        .map(([key, meta]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: meta.color }}
            />
            <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
              {meta.label}
            </span>
          </div>
        ))}
    </div>
  );
}
