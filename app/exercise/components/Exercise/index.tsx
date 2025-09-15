"use client";
import { Flex, Typography } from "antd";
import React from "react";
import {
  selectCurrentExercise,
  selectIsFinished,
  selectWorkoutType,
} from "@/lib/features/exercise/exerciseSlice";
import { useAppSelector } from "@/lib/hooks/redux/useRedux";
import UnifiedTimer from "../UnifiedTimer";

const Exercise: React.FC = () => {
  // 使用選擇器
  const currentExercise = useAppSelector(selectCurrentExercise);
  const isFinished = useAppSelector(selectIsFinished);
  const workoutType = useAppSelector(selectWorkoutType);

  // 如果運動已完成，顯示完成訊息
  if (isFinished) {
    return (
      <Flex vertical align="center">
        <Typography.Title level={2} style={{ color: "white" }}>
          運動完成
        </Typography.Title>
        <div className="text-6xl text-white">恭喜！</div>
      </Flex>
    );
  }

  // 使用統一的計時器，傳入不同的參數
  const exerciseName =
    workoutType === "hiit" ? currentExercise?.name : "超慢跑";
  return <UnifiedTimer exerciseName={exerciseName} />;
};

export default Exercise;
