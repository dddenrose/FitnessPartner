"use client";

// 步頻相關常量
export const DEFAULT_BPM = 180;
export const MIN_BPM = 160;
export const MAX_BPM = 200;
export const BPM_STEP = 2;

// Tab 相關常量
export const WORKOUT_MODE_TABS = {
  SLOWRUN: "slowrun",
  HIIT: "hiit",
} as const;

export const TAB_LABELS = {
  [WORKOUT_MODE_TABS.SLOWRUN]: "超慢跑訓練",
  [WORKOUT_MODE_TABS.HIIT]: "HIIT 訓練",
} as const;
