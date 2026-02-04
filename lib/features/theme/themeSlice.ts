import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeState {
  mode: ThemeMode;
  systemPreference: "light" | "dark";
}

// 從 localStorage 讀取主題設定
const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";

  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }
  return "dark"; // Default to dark theme for SpaceX-inspired design
};

// 偵測系統主題偏好
const getSystemPreference = (): "light" | "dark" => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  systemPreference: getSystemPreference(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      // 持久化到 localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    },
    toggleTheme: (state) => {
      // auto 模式下不切換，需手動設定
      if (state.mode === "auto") return;

      const newMode = state.mode === "light" ? "dark" : "light";
      state.mode = newMode;
      // 持久化到 localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newMode);
      }
    },
    setSystemPreference: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemPreference = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setSystemPreference } =
  themeSlice.actions;

// 選擇器：取得當前主題模式
export const selectTheme = (state: RootState) => state.theme.mode;

// 選擇器：取得實際應用的主題（auto 模式下使用系統偏好）
export const selectEffectiveTheme = (state: RootState): "light" | "dark" => {
  if (state.theme.mode === "auto") {
    return state.theme.systemPreference;
  }
  return state.theme.mode;
};

// 選擇器：取得系統偏好
export const selectSystemPreference = (state: RootState) =>
  state.theme.systemPreference;

export default themeSlice.reducer;
