"use client";

import { useState, useEffect } from "react";

/**
 * 響應式媒體查詢 Hook，用於檢測是否符合特定媒體查詢條件
 *
 * @param query 媒體查詢語句，例如 "(max-width: 768px)"
 * @returns 布爾值，表示當前視口是否符合查詢條件
 *
 * @example
 * // 檢查是否為手機螢幕
 * const isMobile = useMediaQuery("(max-width: 768px)");
 *
 * // 根據螢幕尺寸使用不同樣式
 * const buttonSize = isMobile ? "small" : "large";
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 避免在伺服器端執行
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);

    // 初始設定
    updateMatch();

    // 添加監聽事件
    media.addEventListener("change", updateMatch);

    // 清理監聽器
    return () => {
      media.removeEventListener("change", updateMatch);
    };
  }, [query]);

  return matches;
};
