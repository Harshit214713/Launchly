'use client';

import { useEffect } from 'react';

/** Applies the saved/system theme after hydration without rendering a raw script tag. */
export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', saved === 'dark' || (!saved && prefersDark));
    } catch {
      // Storage and matchMedia can be unavailable in privacy-restricted browsers.
    }
  }, []);

  return null;
}
