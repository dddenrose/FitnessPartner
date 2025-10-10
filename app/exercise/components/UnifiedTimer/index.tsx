"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import { Typography } from "antd";
import Metronome from "../Metronome";
import {
  selectCurrentExercise,
  selectWorkoutType,
} from "@/lib/features/exercise/exerciseSlice";

const { Title } = Typography;

interface UnifiedTimerProps {
  exerciseName?: string;
  isSlowRun?: boolean;
  timerData: {
    currentTime: number;
    currentRestTime: number;
    isRunning: boolean;
    isRestMode: boolean;
  };
}

const UnifiedTimer: React.FC<UnifiedTimerProps> = ({
  exerciseName,
  isSlowRun = false,
  timerData,
}) => {
  const status = useAppSelector((state) => state.exercise.status);
  const workoutType = useAppSelector(selectWorkoutType);
  const currentExercise = useAppSelector(selectCurrentExercise);

  // 使用從父組件傳遞下來的 timer 數據，而不是重複調用 hook
  const { currentTime, currentRestTime, isRestMode } = timerData;

  const [elapsedTime, setElapsedTime] = useState(0); // 更新經過的時間 (僅用於慢跑模式)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "active" && isSlowRun) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, isSlowRun]);

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

      {/* 顯示當前運動名稱 - HIIT 模式 */}
      {workoutType === "hiit" && currentExercise && (
        <Title
          level={2}
          style={{
            color: "white",
            marginBottom: "0.5rem",
          }}
        >
          {isRestMode ? "休息時間" : currentExercise.name}
        </Title>
      )}

      {/* 主計時器 - 簡潔樣式，無光暈效果 */}
      <div
        style={{
          fontSize: "8rem",
          fontWeight: "bold",
          color: "white",
          fontFamily: "monospace",
          margin: "0.5rem 0",
        }}
      >
        {isSlowRun
          ? formatTime(elapsedTime)
          : formatTime(isRestMode ? currentRestTime : currentTime)}
      </div>

      {/* 顯示階段信息 - HIIT 模式 */}
      {workoutType === "hiit" && (
        <Title
          level={3}
          style={{
            color: "white",
            marginTop: "0.5rem",
          }}
        >
          {isRestMode ? "下一個: " + (currentExercise?.name || "") : "運動中"}
        </Title>
      )}
    </div>
  );
};

export default UnifiedTimer;
