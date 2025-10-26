"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux/useRedux";
import { Typography, Switch, Flex, Segmented } from "antd";
import Metronome from "../Metronome";
import BpmDetector from "../BpmDetector";
import {
  selectCurrentExercise,
  selectWorkoutType,
} from "@/lib/features/exercise/exerciseSlice";
import {
  selectBpmDetectorEnabled,
  setBpmDetectorEnabled,
} from "@/lib/features/bpmDetector/bpmDetectorSlice";
import styles from "./styles.module.css";

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
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.exercise.status);
  const workoutType = useAppSelector(selectWorkoutType);
  const currentExercise = useAppSelector(selectCurrentExercise);
  // 從 Redux 獲取目標 BPM
  const targetBpm = useAppSelector((state) => state.exercise.bpm);
  // BPM 容許誤差
  const tolerance = 10;

  // 從 Redux 獲取 BPM 檢測器開關狀態
  const enableBpmDetector = useAppSelector(selectBpmDetectorEnabled);

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

  // 檢查 BPM 與目標 BPM 的差距，決定顯示顏色
  const getBpmStatusColor = (bpm: number) => {
    if (bpm === 0) return "#666"; // 無數據

    if (Math.abs(bpm - targetBpm) <= tolerance) {
      return "#52c41a"; // 在目標範圍內：綠色
    } else if (bpm < targetBpm) {
      return "#faad14"; // 低於目標：黃色
    } else {
      return "#f5222d"; // 高於目標：紅色
    }
  };

  return (
    <div className={styles.container}>
      {/* 顯示當前運動名稱 - HIIT 模式 */}
      {workoutType === "hiit" && currentExercise && (
        <Title level={2} className={styles.exerciseTitle}>
          {isRestMode ? "休息時間" : currentExercise.name}
        </Title>
      )}

      {/* 主計時器 - 使用CSS modules */}
      <div className={styles.timerDisplay}>
        {/* 節拍器組件 - 僅在慢跑模式下顯示 */}
        <Metronome visible={isSlowRun} />
        {isSlowRun
          ? formatTime(elapsedTime)
          : formatTime(isRestMode ? currentRestTime : currentTime)}
      </div>

      {/* 顯示階段信息 - HIIT 模式 */}
      {workoutType === "hiit" && (
        <Title level={3} className={styles.phaseInfo}>
          {isRestMode ? "下一個: " + (currentExercise?.name || "") : "運動中"}
        </Title>
      )}

      {/* 超慢跑模式下的 BPM 檢測器開關 */}
      {isSlowRun && status === "active" && (
        <div>
          {/* 當開啟檢測器時顯示 BPM 檢測器和數據 */}
          {enableBpmDetector && (
            <BpmDetector isActive={enableBpmDetector && status === "active"} />
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedTimer;
