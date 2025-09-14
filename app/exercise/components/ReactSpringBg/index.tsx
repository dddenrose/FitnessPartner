import React, { useState, useEffect, ReactNode, useMemo } from "react";
import { useSpring, animated, to } from "@react-spring/web";

interface ReactSpringBgProps {
  children?: ReactNode;
}

/**
 * 使用 React Spring 創建的互動式漸變背景動畫
 * 具有自動流動的漸層效果和滑鼠互動功能
 */
const ReactSpringBg: React.FC<ReactSpringBgProps> = ({ children }) => {
  // 使用狀態控制動畫階段
  const [animationPhase, setAnimationPhase] = useState(0);

  // 追踪漸層流動位置
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

  // 追踪滑鼠位置
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 定義顏色 - 使用更鮮豔的紅色、橘色和深色系，增加運動活力和動態感
  const colors = useMemo(() => {
    return {
      color1: "#ff2a2a", // 更鮮豔的紅色
      color2: "#ff9500", // 更明亮的橙色
      color3: "#1e2a5e", // 更深的藍色，作為對比
      // 增加額外的漸變點顏色
      color4: "#ff4d4d", // 略淡的紅色，增加漸層變化
      color5: "#ffbd00", // 金黃色，增強活力感
    };
  }, []);

  // 設置自動流動動畫
  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const animateGradient = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000; // 轉換為秒

      // 使用正弦和餘弦函數創建更複雜的循環移動路徑
      // 疊加不同頻率的波，創造更自然的流動效果
      const x =
        0.5 +
        0.3 * Math.sin(elapsedTime * 0.3) +
        0.2 * Math.sin(elapsedTime * 0.1);
      const y =
        0.5 +
        0.3 * Math.cos(elapsedTime * 0.2) +
        0.2 * Math.cos(elapsedTime * 0.05);

      setGradientPosition({ x, y });

      // 每 5 秒改變一次動畫階段，使變化更頻繁
      setAnimationPhase(Math.floor((elapsedTime % 20) / 5));

      animationFrameId = requestAnimationFrame(animateGradient);
    };

    animationFrameId = requestAnimationFrame(animateGradient);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 處理滑鼠移動
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 計算滑鼠在視窗中的相對位置 (0-1)
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 創建流暢的背景動畫 - 自動流動效果
  const springProps = useSpring({
    // 持續更新以創建流動效果
    from: { gradX: 0, gradY: 0, rotation: 0 },
    to: {
      gradX: gradientPosition.x * 100,
      gradY: gradientPosition.y * 100,
      rotation: animationPhase % 2 === 0 ? -2 : 2,
    },
    config: {
      tension: 60,
      friction: 25,
    },
  });

  // 將 spring 值轉換為樣式屬性
  const combinedStyle = useMemo(() => {
    return {
      transform: to(
        [springProps.rotation, springProps.gradX, springProps.gradY],
        (rotation, gradX, gradY) => {
          // 結合自動流動與滑鼠互動
          const mouseInfluenceX = (mousePosition.x - 0.5) * 10;
          const mouseInfluenceY = (mousePosition.y - 0.5) * 10;

          return `
            scale(1.05)
            rotate(${rotation + (mousePosition.x - 0.5) * 2}deg)
            translateX(${mouseInfluenceX}px)
            translateY(${mouseInfluenceY}px)
          `;
        }
      ),

      background: to([springProps.gradX, springProps.gradY], (gradX, gradY) => {
        // 基於動畫位置創建更豐富的自動流動漸層效果
        const angle1 = (gradX / 100) * 360;
        const angle2 = ((gradX + 45) % 100) * 3.6;

        return `
            linear-gradient(${angle1}deg, ${colors.color1} 0%, ${
          colors.color4
        } 25%, ${colors.color2} 50%, ${colors.color5} 75%, ${
          colors.color3
        } 100%),
            radial-gradient(circle at ${gradX}% ${gradY * 0.3}%, ${
          colors.color1
        }, transparent 70%),
            radial-gradient(circle at ${100 - gradX}% ${gradY * 0.7}%, ${
          colors.color2
        }, transparent 70%),
            radial-gradient(circle at ${gradX * 0.5}% ${100 - gradY * 0.5}%, ${
          colors.color3
        } 10%, transparent 60%),
            radial-gradient(circle at ${gradX * 0.8}% ${gradY * 0.8}%, ${
          colors.color5
        }, transparent 70%),
            conic-gradient(from ${angle2}deg at ${gradX * 0.6}% ${
          gradY * 0.6
        }%, ${colors.color1} 0deg, ${colors.color2} 120deg, ${
          colors.color3
        } 240deg, ${colors.color1} 360deg)
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

  // 靜態樣式 - 針對流動紅橙色運動主題優化
  const staticStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -1,
    backgroundSize: "400% 400%", // 增加背景大小使流動更明顯
    backgroundBlendMode: "overlay, soft-light, screen, normal", // 添加混合模式使顏色更豐富
    backgroundColor: "#1e2a5e", // 添加底色，確保始終有顏色
    opacity: 1, // 使用完全不透明，確保可見
    overflow: "hidden" as const,
    margin: 0,
    padding: 0,
    pointerEvents: "none" as const,
    boxShadow: "inset 0 0 150px rgba(0, 0, 0, 0.6)", // 增強內陰影效果
    transition: "background-color 0.8s ease", // 平滑過渡底色變化
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
