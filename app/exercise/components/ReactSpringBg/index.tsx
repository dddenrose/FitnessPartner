import React, { useEffect, ReactNode, useMemo, useRef } from "react";
import { useAppSelector } from "@/lib/hooks/index";
import { selectTheme } from "@/lib/features/theme/themeSlice";

interface ReactSpringBgProps {
  children?: ReactNode;
}

/**
 * 高效能背景動畫組件
 * 使用 CSS 動畫和變數直接操作 DOM，避免 React 重新渲染
 * 支援亮色/暗色主題切換
 */
const ReactSpringBg: React.FC<ReactSpringBgProps> = ({ children }) => {
  const theme = useAppSelector(selectTheme);
  const containerRef = useRef<HTMLDivElement>(null);

  // 定義顏色 - 根據主題使用不同的顏色系統
  const colors = useMemo(() => {
    if (theme === "dark") {
      // Dark theme: SpaceX-inspired deep space colors
      return {
        color1: "#000814", // Deep space black-blue
        color2: "#001d3d", // Dark navy
        color3: "#003566", // Medium blue
        color4: "#001122", // Very dark blue
        color5: "#004080", // Accent blue
      };
    } else {
      // Light theme: Clean, sophisticated light colors
      return {
        color1: "#e3f2fd", // Light blue
        color2: "#bbdefb", // Sky blue
        color3: "#90caf9", // Bright blue
        color4: "#d6eaff", // Very light blue
        color5: "#64b5f6", // Medium bright blue
      };
    }
  }, [theme]);

  // 僅在主題變化時更新背景
  useEffect(() => {
    if (containerRef.current) {
      // 直接設置 CSS 變數，讓 CSS 動畫處理動畫效果
      const container = containerRef.current;
      container.style.setProperty("--bg-color-1", colors.color1);
      container.style.setProperty("--bg-color-2", colors.color2);
      container.style.setProperty("--bg-color-3", colors.color3);
      container.style.setProperty("--bg-color-5", colors.color5);
      container.style.backgroundColor =
        theme === "dark" ? "#000814" : "#e3f2fd";
    }
  }, [theme, colors]);

  // 高效能的靜態樣式，使用純 CSS 動畫
  const staticStyle: React.CSSProperties = {
    position: "fixed",
    top: "-5%",
    left: "-5%",
    right: "-5%",
    bottom: "-5%",
    width: "110vw",
    height: "110vh",
    zIndex: -1,
    opacity: 1,
    overflow: "hidden",
    margin: 0,
    padding: 0,
    pointerEvents: "none",
    // 使用 CSS 動畫代替 JavaScript 動畫
    background: `
      linear-gradient(45deg, var(--bg-color-1, ${colors.color1}) 0%, var(--bg-color-2, ${colors.color2}) 50%, var(--bg-color-3, ${colors.color3}) 100%),
      radial-gradient(circle at 60% 40%, var(--bg-color-5, ${colors.color5}), transparent 60%)
    `,
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
    transform: "translateZ(0)", // 啟用GPU加速
    backfaceVisibility: "hidden",
    willChange: "background-position",
  };

  // 創建動畫樣式字符串
  const animationStyle = useMemo(
    () => `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .gradient-bg {
      animation: gradientShift 15s ease infinite;
    }
  `,
    []
  );

  // 在組件掛載時注入樣式
  useEffect(() => {
    const styleId = "gradient-bg-animation";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = animationStyle;

    return () => {
      // 清理樣式（可選）
    };
  }, [animationStyle]);

  return (
    <div
      ref={containerRef}
      className="gradient-bg"
      style={staticStyle}
      aria-hidden={!children}
    >
      {children && (
        <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
      )}
    </div>
  );
};

export default ReactSpringBg;
