import React, { useState, useEffect, ReactNode, useMemo } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { useAppSelector } from "@/lib/hooks/index";
import { selectTheme } from "@/lib/features/theme/themeSlice";

interface ReactSpringBgProps {
  children?: ReactNode;
}

/**
 * 使用 React Spring 創建的互動式漸變背景動畫
 * 具有自動流動的漸層效果和滑鼠互動功能
 * 支援亮色/暗色主題切換
 */
const ReactSpringBg: React.FC<ReactSpringBgProps> = ({ children }) => {
  const theme = useAppSelector(selectTheme);
  // 使用狀態控制動畫階段
  const [animationPhase, setAnimationPhase] = useState(0);

  // 追踪漸層流動位置
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

  // 追踪滑鼠位置
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // 設置自動流動動畫
  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const animateGradient = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000; // 轉換為秒

      // 使用簡單的正弦和餘弦函數，增加頻率係數使動畫更快但保持平滑
      const x = 0.5 + 0.25 * Math.sin(elapsedTime * 0.3);
      const y = 0.5 + 0.25 * Math.cos(elapsedTime * 0.25);

      // 只在數值有足夠變化時才更新狀態，減少重繪
      setGradientPosition({ x, y });

      // 每 10 秒改變一次動畫階段，增加變化頻率
      setAnimationPhase(Math.floor((elapsedTime % 20) / 10));

      animationFrameId = requestAnimationFrame(animateGradient);
    };

    animationFrameId = requestAnimationFrame(animateGradient);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 處理滑鼠移動 - 使用節流來減少更新頻率
  useEffect(() => {
    let lastUpdateTime = 0;
    const throttleDelay = 50; // 每50毫秒才更新一次，減少狀態更新頻率

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();

      // 節流實現：只有當經過足夠時間才處理事件
      if (now - lastUpdateTime > throttleDelay) {
        // 計算滑鼠在視窗中的相對位置 (0-1)
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
        lastUpdateTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 創建流暢的背景動畫 - 優化反應速度和效能
  const springProps = useSpring({
    // 持續更新以創建流動效果
    from: { gradX: 0, gradY: 0, rotation: 0 },
    to: {
      gradX: gradientPosition.x * 100,
      gradY: gradientPosition.y * 100,
      rotation: animationPhase % 2 === 0 ? -0.8 : 0.8, // 微小旋轉以節省計算資源
    },
    config: {
      tension: 120, // 提高張力使反應更快速
      friction: 40, // 降低摩擦力使動畫更流暢
      mass: 1, // 降低質量使動畫更輕盈
      clamp: false, // 允許自然運動
      precision: 0.05, // 降低精確度以提高效能
    },
  });

  // 將 spring 值轉換為樣式屬性，進一步優化計算
  const combinedStyle = useMemo(() => {
    return {
      transform: to(
        [springProps.rotation, springProps.gradX, springProps.gradY],
        (rotation, gradX, gradY) => {
          // 減少滑鼠影響以提高效能
          const mouseInfluenceX = (mousePosition.x - 0.5) * 3;
          const mouseInfluenceY = (mousePosition.y - 0.5) * 3;

          return `
            scale(1.15)
            rotate(${rotation}deg)
            translateX(${mouseInfluenceX}px)
            translateY(${mouseInfluenceY}px)
          `;
        }
      ),

      background: to([springProps.gradX, springProps.gradY], (gradX, gradY) => {
        // 進一步簡化漸變效果，使用整數計算減少浮點運算
        const angle = Math.round(gradX * 3.6);

        // 使用更簡單的漸變，降低渲染複雜度
        return `
            linear-gradient(${angle}deg, ${colors.color1} 0%, ${
          colors.color2
        } 50%, ${colors.color3} 100%),
            radial-gradient(circle at ${Math.round(gradX)}% ${Math.round(
          gradY * 0.5
        )}%, ${colors.color5}, transparent 60%)
          `;
      }),
    };
  }, [
    springProps.gradX,
    springProps.gradY,
    springProps.rotation,
    mousePosition,
    colors,
  ]);

  // 靜態樣式 - 針對效能優化
  const staticStyle = {
    position: "fixed" as const,
    top: "-5%", // 向上延伸5%避免旋轉時出現白邊
    left: "-5%", // 向左延伸5%避免旋轉時出現白邊
    right: "-5%", // 向右延伸5%避免旋轉時出現白邊
    bottom: "-5%", // 向下延伸5%避免旋轉時出現白邊
    width: "110vw", // 增加寬度確保覆蓋
    height: "110vh", // 增加高度確保覆蓋
    zIndex: -1,
    backgroundSize: "200% 200%", // 減小背景大小以降低GPU負擔
    backgroundBlendMode: "soft-light", // 進一步簡化混合模式
    backgroundColor: theme === "dark" ? "#000814" : "#e3f2fd", // 主題相關底色
    opacity: 1,
    overflow: "hidden" as const,
    margin: 0,
    padding: 0,
    pointerEvents: "none" as const,
    boxShadow:
      theme === "dark"
        ? "inset 0 0 100px rgba(0, 0, 0, 0.5)"
        : "inset 0 0 100px rgba(0, 0, 0, 0.05)", // 減輕陰影效果以提高效能
    willChange: "transform, background", // 明確告訴瀏覽器優化這些屬性
    transform: "translateZ(0)", // 啟用GPU加速
    backfaceVisibility: "hidden" as const, // 優化渲染效能
  };

  return (
    <animated.div
      style={{ ...staticStyle, ...combinedStyle }}
      aria-hidden={!children}
    >
      {children && (
        <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
      )}
    </animated.div>
  );
};

export default ReactSpringBg;
