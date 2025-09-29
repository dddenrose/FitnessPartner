"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import { Typography } from "antd";
import Metronome from "../Metronome";

const { Title } = Typography;

interface UnifiedTimerProps {
  exerciseName?: string;
  isSlowRun?: boolean;
}

const UnifiedTimer: React.FC<UnifiedTimerProps> = ({
  exerciseName,
  isSlowRun = false,
}) => {
  const status = useAppSelector((state) => state.exercise.status);

  const [elapsedTime, setElapsedTime] = useState(0);

  // 更新經過的時間
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "active") {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  // 格式化時間顯示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* 節拍器組件 - 僅在慢跑模式下顯示 */}
      <Metronome visible={isSlowRun} />

      {/* 主計時器 - 使用白色大字體 */}
      <div
        style={{
          fontSize: "8rem",
          fontWeight: "bold",
          color: "white",
          fontFamily: "monospace",
          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
};

export default UnifiedTimer;
