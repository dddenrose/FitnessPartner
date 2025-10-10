"use client";
import { Flex, Typography } from "antd";
import React from "react";
import {
  selectCurrentExercise,
  selectStatus,
  selectWorkoutType,
  selectIsSlowRun,
} from "@/lib/features/exercise/exerciseSlice";
import { useAppSelector } from "@/lib/hooks";
import UnifiedTimer from "../UnifiedTimer";
import styles from "../../styles.module.css";

interface ExerciseProps {
  timerData: {
    currentTime: number;
    currentRestTime: number;
    isRunning: boolean;
    isRestMode: boolean;
  };
}

const Exercise: React.FC<ExerciseProps> = ({ timerData }) => {
  // 使用選擇器
  const isSlowRun = useAppSelector(selectIsSlowRun);
  const currentExercise = useAppSelector(selectCurrentExercise);
  const status = useAppSelector(selectStatus);
  const isFinished = status === "finished";
  const workoutType = useAppSelector(selectWorkoutType);

  // 如果運動已完成，顯示完成訊息
  if (isFinished) {
    return (
      <div className={styles.finishedContainer}>
        <Typography.Title level={2} className={styles.finishedTitle}>
          運動完成
        </Typography.Title>
        <div className={styles.congratsText}>恭喜！</div>
      </div>
    );
  }

  // 使用統一的計時器，傳入不同的參數
  const exerciseName = isSlowRun ? "超慢跑" : currentExercise?.name;
  return (
    <UnifiedTimer
      exerciseName={exerciseName}
      isSlowRun={isSlowRun}
      timerData={timerData}
    />
  );
};

export default Exercise;
