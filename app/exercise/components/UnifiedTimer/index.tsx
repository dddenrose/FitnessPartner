"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import { Typography, Switch, Flex } from "antd";
import Metronome from "../Metronome";
import BpmDetector from "../BpmDetector";
import {
  selectCurrentExercise,
  selectWorkoutType,
} from "@/lib/features/exercise/exerciseSlice";
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
  const status = useAppSelector((state) => state.exercise.status);
  const workoutType = useAppSelector(selectWorkoutType);
  const currentExercise = useAppSelector(selectCurrentExercise);

  // 使用從父組件傳遞下來的 timer 數據，而不是重複調用 hook
  const { currentTime, currentRestTime, isRestMode } = timerData;

  const [elapsedTime, setElapsedTime] = useState(0); // 更新經過的時間 (僅用於慢跑模式)
  const [enableBpmDetector, setEnableBpmDetector] = useState(false); // 控制 BPM 檢測器的開關
  const [recentBpm, setRecentBpm] = useState<number>(0); // 記錄即時 BPM
  const [averageBpm, setAverageBpm] = useState<number>(0); // 記錄平均 BPM
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

  // 處理從 BPM 檢測器回傳的數值
  const handleBpmDetected = (recent: number, average: number) => {
    setRecentBpm(recent);
    if (average > 0) {
      setAverageBpm(average);
    }
  };

  return (
    <div className={styles.container}>
      {/* 節拍器組件 - 僅在慢跑模式下顯示 */}
      <Metronome visible={isSlowRun} />

      {/* 顯示當前運動名稱 - HIIT 模式 */}
      {workoutType === "hiit" && currentExercise && (
        <Title level={2} className={styles.exerciseTitle}>
          {isRestMode ? "休息時間" : currentExercise.name}
        </Title>
      )}

      {/* 主計時器 - 使用CSS modules */}
      <div className={styles.timerDisplay}>
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
        <Flex vertical align="center" gap="middle" style={{ marginTop: 20 }}>
          <Flex gap="small" align="center">
            <Typography.Text style={{ color: "white" }}>
              步頻檢測：
            </Typography.Text>
            <Switch
              checked={enableBpmDetector}
              onChange={(checked) => setEnableBpmDetector(checked)}
            />
          </Flex>

          {/* 當開啟檢測器時顯示 BPM 檢測器 */}
          {enableBpmDetector && (
            <BpmDetector
              isActive={enableBpmDetector && status === "active"}
              onBpmDetected={handleBpmDetected}
              isDebug={true} // 預設開啟調試模式，方便調整算法
            />
          )}
        </Flex>
      )}
    </div>
  );
};

export default UnifiedTimer;
