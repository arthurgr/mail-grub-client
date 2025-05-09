import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="px-2.5 py-1.5 text-sm border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
