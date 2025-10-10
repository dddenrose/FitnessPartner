"use client";
import { useAppSelector } from "@/lib/hooks/index";
import { selectTheme } from "@/lib/features/theme/themeSlice";
import { useEffect } from "react";

/**
 * ThemeProvider component that applies the theme class to the document
 * This allows CSS variables to be switched between light and dark themes
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    // Apply theme to document element
    const root = document.documentElement;
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [theme]);

  return <>{children}</>;
}
