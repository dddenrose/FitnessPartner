"use client";

import { useState, useEffect } from "react";
import { MEDIA_QUERIES, MediaQuery } from "@/lib/constants/breakpoints";

/**
 * 響應式媒體查詢 Hook，用於檢測是否符合特定媒體查詢條件
 *
 * @param query 媒體查詢語句，可以是：
 *   - 自定義字串，例如 "(max-width: 768px)"
 *   - 預定義的 breakpoint key，例如 "mobile", "tablet", "desktop"
 * @returns 布爾值，表示當前視口是否符合查詢條件
 *
 * @example
 * // 使用預定義的 breakpoint
 * const isMobile = useMediaQuery("mobile");
 * const isTabletUp = useMediaQuery("tabletUp");
 *
 * // 使用自定義查詢
 * const isMobile = useMediaQuery("(max-width: 768px)");
 *
 * // 根據螢幕尺寸使用不同樣式
 * const buttonSize = isMobile ? "small" : "large";
 */
export const useMediaQuery = (query: MediaQuery | string): boolean => {
  // 如果是預定義的 breakpoint key，使用對應的查詢字串
  const mediaQuery =
    query in MEDIA_QUERIES ? MEDIA_QUERIES[query as MediaQuery] : query;

  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 避免在伺服器端執行
    if (typeof window === "undefined") return;

    const media = window.matchMedia(mediaQuery);
    const updateMatch = () => setMatches(media.matches);

    // 初始設定
    updateMatch();

    // 添加監聽事件
    media.addEventListener("change", updateMatch);

    // 清理監聽器
    return () => {
      media.removeEventListener("change", updateMatch);
    };
  }, [mediaQuery]);

  return matches;
};
