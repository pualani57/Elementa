export function emptyFilters() {
  return {
    category: new Set(),
    phase: new Set(),
    block: new Set(),
    metalClass: new Set(),
    radioactive: false,
    synthetic: false,
  };
}

export function filtersActive(f) {
  return Boolean(
    f.category.size ||
      f.phase.size ||
      f.block.size ||
      f.metalClass.size ||
      f.radioactive ||
      f.synthetic
  );
}

export function toggleSetValue(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/** Matches on name, symbol, or atomic number. */
export function matchesSearch(el, q) {
  if (!q) return true;
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    el.name.toLowerCase().includes(s) ||
    el.sym.toLowerCase() === s ||
    el.sym.toLowerCase().startsWith(s) ||
    String(el.z) === s
  );
}

export function matchesFilters(el, filters) {
  if (filters.category.size && !filters.category.has(el.category)) return false;
  if (filters.phase.size && !filters.phase.has(el.phase)) return false;
  if (filters.block.size && !filters.block.has(el.block)) return false;
  if (filters.metalClass.size && !filters.metalClass.has(el.metalClass)) return false;
  if (filters.radioactive && !el.radioactive) return false;
  if (filters.synthetic && !el.synthetic) return false;
  return true;
}
