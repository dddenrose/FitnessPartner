"use client";

import { useState, useEffect } from "react";

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
