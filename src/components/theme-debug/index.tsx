"use client";

import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";

const ThemeDebug: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, theme, setTheme, systemTheme } = useTheme();
  const [isDarkClass, setIsDarkClass] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if document has 'dark' class
    const checkDarkClass = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      setIsDarkClass(hasDarkClass);
    };

    checkDarkClass();

    // Set up an observer to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkClass();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const toggleDarkClass = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="mt-8 p-4 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900">
      <h2 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
        Theme Debug Panel
      </h2>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-red-700 dark:text-red-300">resolvedTheme:</div>
        <div className="font-mono">{resolvedTheme}</div>

        <div className="text-red-700 dark:text-red-300">theme:</div>
        <div className="font-mono">{theme}</div>

        <div className="text-red-700 dark:text-red-300">systemTheme:</div>
        <div className="font-mono">{systemTheme}</div>

        <div className="text-red-700 dark:text-red-300">
          dark class on html:
        </div>
        <div className="font-mono">{isDarkClass ? "Yes" : "No"}</div>
      </div>

      <div className="mt-4 space-x-2">
        <button
          onClick={toggleDarkClass}
          className="px-3 py-1 bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded text-xs"
        >
          Toggle &apos;dark&apos; class manually
        </button>

        <button
          onClick={() => setTheme("dark")}
          className="px-3 py-1 bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded text-xs"
        >
          Force Dark
        </button>

        <button
          onClick={() => setTheme("light")}
          className="px-3 py-1 bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded text-xs"
        >
          Force Light
        </button>
      </div>
    </div>
  );
};

export { ThemeDebug };
