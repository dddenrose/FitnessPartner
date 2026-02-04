/**
 * 標準 Breakpoints
 * 與 Tailwind CSS 預設值一致
 */
export const BREAKPOINTS = {
  /** Mobile: < 640px */
  mobile: 640,
  /** Tablet: 640px - 1023px */
  tablet: 1024,
  /** Desktop: >= 1024px */
  desktop: 1024,
} as const;

/**
 * Media Query 字串
 * 用於 useMediaQuery hook 或 CSS-in-JS
 */
export const MEDIA_QUERIES = {
  /** 僅 Mobile */
  mobile: "(max-width: 639px)",
  /** 僅 Tablet */
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  /** 僅 Desktop */
  desktop: "(min-width: 1024px)",
  /** Tablet 以上（含 Desktop） */
  tabletUp: "(min-width: 640px)",
  /** Mobile 與 Tablet */
  mobileTablet: "(max-width: 1023px)",
} as const;

/**
 * Tailwind Breakpoint Prefixes
 * 對應到 Tailwind CSS 的響應式前綴
 */
export const TAILWIND_BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type MediaQuery = keyof typeof MEDIA_QUERIES;
