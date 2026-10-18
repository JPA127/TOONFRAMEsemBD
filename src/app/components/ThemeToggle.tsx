import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label="Modo escuro"
      title={isDark ? "Mudar para o modo claro" : "Mudar para o modo escuro"}
      className={`inline-flex items-center justify-center w-11 h-11 border-2 border-black dark:border-neutral-400 bg-white dark:bg-neutral-900 text-black dark:text-neutral-100 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors ${className}`}
    >
      {isDark ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
    </button>
  );
}
