import { useEffect, useState } from 'react';

const STORAGE_KEY = 'elementa:theme';

/**
 * Theme is persisted to localStorage and mirrored onto <html data-theme>
 * so the CSS variables in index.css apply to the whole document.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      /* localStorage unavailable (private mode, blocked cookies) */
    }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* non-fatal */
    }
  }, [theme]);

  return [theme, setTheme];
}
