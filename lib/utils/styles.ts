import classNames from "classnames";

/**
 * 組合 class names 的工具函數
 * 使用 classnames 處理條件邏輯和組合
 *
 * @example
 * ```tsx
 * cn('px-4 py-2', isActive && 'bg-primary-500', 'rounded-lg')
 * // => 'px-4 py-2 bg-primary-500 rounded-lg'
 *
 * cn({ 'text-white': isActive, 'text-black': !isActive })
 * // => 'text-white' (when isActive is true)
 * ```
 */
export function cn(...inputs: any[]) {
  return classNames(inputs);
}

/**
 * 條件性加入 class name
 *
 * @example
 * ```tsx
 * conditionalClass(isActive, 'bg-primary-500')
 * // => isActive ? 'bg-primary-500' : ''
 * ```
 */
export function conditionalClass(
  condition: boolean,
  className: string
): string {
  return condition ? className : "";
}

/**
 * 根據變體返回對應的 class name
 *
 * @example
 * ```tsx
 * variantClass('primary', {
 *   primary: 'bg-primary-500 text-white',
 *   secondary: 'bg-secondary-500 text-white',
 * })
 * // => 'bg-primary-500 text-white'
 * ```
 */
export function variantClass<T extends string>(
  variant: T,
  variants: Record<T, string>
): string {
  return variants[variant] || "";
}

/**
 * 從 CSS Module 物件中安全取得 class name
 *
 * @example
 * ```tsx
 * const styles = { card: 'card_abc123' };
 * getModuleClass(styles, 'card')
 * // => 'card_abc123'
 * ```
 */
export function getModuleClass(
  styles: Record<string, string>,
  className: string
): string {
  return styles[className] || "";
}

/**
 * 組合多個 CSS Module class names
 *
 * @example
 * ```tsx
 * const styles = { card: 'card_abc', active: 'active_def' };
 * combineModuleClasses(styles, 'card', isActive && 'active')
 * // => 'card_abc active_def'
 * ```
 */
export function combineModuleClasses(
  styles: Record<string, string>,
  ...classNames: (string | boolean | undefined)[]
): string {
  return classNames
    .filter(
      (name): name is string => typeof name === "string" && name in styles
    )
    .map((name) => styles[name])
    .join(" ");
}

/**
 * 響應式 utility：根據 breakpoint 返回不同值
 * 用於需要根據螢幕尺寸動態計算的情況
 *
 * @example
 * ```tsx
 * const columns = responsive({ mobile: 1, tablet: 2, desktop: 3 }, currentBreakpoint);
 * ```
 */
export function responsive<T>(
  values: { mobile: T; tablet?: T; desktop?: T },
  currentBreakpoint: "mobile" | "tablet" | "desktop"
): T {
  if (currentBreakpoint === "desktop" && values.desktop !== undefined) {
    return values.desktop;
  }
  if (currentBreakpoint === "tablet" && values.tablet !== undefined) {
    return values.tablet;
  }
  return values.mobile;
}
