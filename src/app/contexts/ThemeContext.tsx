import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "toonframe_theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Prioridade: escolha salva pelo usuário > preferência do sistema operacional
  const [theme, setTheme] = useState<Theme>(() => savedTheme() ?? systemTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Enquanto o usuário não escolher manualmente, acompanha o sistema
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const onChange = () => {
      if (!savedTheme()) setTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // modo privado / sem espaço: o tema só vale nesta sessão
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
