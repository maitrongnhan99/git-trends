"use client";

import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";

const ThemeTest: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [key, setKey] = useState(0);

  // Force refresh component when theme changes
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Directly manipulate the class for immediate visual feedback
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    }
    // Force re-render after theme change
    setTimeout(() => setKey((prev) => prev + 1), 150);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div key={key} className="mt-8 space-y-6">
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Theme Test Component
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Current theme:
            </span>
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-gray-800 dark:text-gray-200">
              {resolvedTheme}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Theme setting:
            </span>
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-gray-800 dark:text-gray-200">
              {theme}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => handleThemeChange("light")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Light
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Dark
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            System
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            Background Colors
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="h-12 bg-white dark:bg-gray-900 rounded"></div>
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            Text Colors
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-black dark:text-white">Black / White</p>
            <p className="text-gray-700 dark:text-gray-300">Gray 700 / 300</p>
            <p className="text-gray-500 dark:text-gray-400">Gray 500 / 400</p>
            <p className="text-blue-600 dark:text-blue-400">Blue 600 / 400</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ThemeTest };
