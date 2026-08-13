import { useEffect, useState } from 'react';

const STORAGE_KEY = 'elementa:reduced-motion';

/**
 * Defaults to the OS-level preference, but stays user-overridable in-app.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') return true;
      if (stored === 'false') return false;
    } catch {
      /* localStorage unavailable */
    }
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(reduced));
    } catch {
      /* non-fatal */
    }
  }, [reduced]);

  return [reduced, setReduced];
}
