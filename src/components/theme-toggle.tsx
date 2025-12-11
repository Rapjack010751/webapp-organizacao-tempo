"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        disabled
      >
        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
      aria-label="Alternar tema"
      title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400 transition-all group-hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-all group-hover:-rotate-12" />
      )}
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
