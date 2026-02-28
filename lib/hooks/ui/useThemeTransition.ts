import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/useRedux";
import {
  toggleTheme,
  setTheme,
  selectTheme,
  selectEffectiveTheme,
  setSystemPreference,
  ThemeMode,
} from "@/lib/features/theme/themeSlice";

/**
 * 主題切換 Hook，支援平滑過渡動畫
 *
 * 使用 View Transition API（Chrome 111+）實現無閃爍主題切換
 * 支援 localStorage 持久化和系統主題偵測
 *
 * @example
 * ```tsx
 * const { theme, effectiveTheme, toggleWithTransition, setThemeWithTransition } = useThemeTransition();
 *
 * <button onClick={toggleWithTransition}>
 *   {effectiveTheme === 'dark' ? '☀️' : '🌙'}
 * </button>
 * ```
 */
export function useThemeTransition() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const effectiveTheme = useAppSelector(selectEffectiveTheme);

  /**
   * 檢查瀏覽器是否支援 View Transition API
   */
  const supportsViewTransition = useCallback(() => {
    return (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  /**
   * 執行主題切換，帶有平滑過渡動畫
   */
  const executeThemeChange = useCallback(
    (changeTheme: () => void) => {
      if (supportsViewTransition()) {
        // 使用 View Transition API
        (document as any).startViewTransition(() => {
          changeTheme();
        });
      } else {
        // 降級：直接切換
        changeTheme();
      }
    },
    [supportsViewTransition]
  );

  /**
   * 切換主題（深色 ↔ 淺色）
   */
  const toggleWithTransition = useCallback(() => {
    executeThemeChange(() => {
      dispatch(toggleTheme());
    });
  }, [dispatch, executeThemeChange]);

  /**
   * 設定特定主題
   */
  const setThemeWithTransition = useCallback(
    (mode: ThemeMode) => {
      executeThemeChange(() => {
        dispatch(setTheme(mode));
      });
    },
    [dispatch, executeThemeChange]
  );

  /**
   * 同步 Redux state 到 DOM
   */
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", effectiveTheme);
    }
  }, [effectiveTheme]);

  /**
   * 監聽系統主題變化
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setSystemPreference(e.matches ? "dark" : "light"));
    };

    // 現代瀏覽器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // 舊版瀏覽器（Safari < 14）
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [dispatch]);

  return {
    theme,
    effectiveTheme,
    toggleWithTransition,
    setThemeWithTransition,
    supportsViewTransition: supportsViewTransition(),
  };
}
