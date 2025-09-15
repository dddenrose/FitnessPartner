"use client";
import {
  moveToNextExercise,
  selectCurrentExercise,
  selectRemainingExercises,
  selectStatus,
  updateCurrentExerciseTime,
  updateCurrentRestTime,
} from "@/lib/features/exercise/exerciseSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/index";
import React, { useCallback, useEffect, useRef, useState } from "react";

const TimerLogic = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  // 使用新的選擇器
  const currentExercise = useAppSelector(selectCurrentExercise);
  const remainingExercises = useAppSelector(selectRemainingExercises);
  const status = useAppSelector(selectStatus);

  // 本地狀態用於優化渲染頻率
  const [localTime, setLocalTime] = useState<number>(0);
  const [localRest, setLocalRest] = useState<number>(0);

  // 用於計時的 refs，避免閉包問題
  const isRunningRef = useRef<boolean>(false);
  const isRestModeRef = useRef<boolean>(false);

  // 當 currentExercise 改變時同步本地狀態
  useEffect(() => {
    if (currentExercise) {
      setLocalTime(currentExercise.time);
      setLocalRest(currentExercise.rest);
    }
  }, [currentExercise]); // 在 currentExercise 變化時更新

  // 根據 status 更新運行狀態
  useEffect(() => {
    isRunningRef.current = status === "active";
  }, [status]);

  // 處理計時邏輯的核心函數
  const handleTimerTick = useCallback(() => {
    if (!isRunningRef.current || !currentExercise) return;

    // 運動時間模式
    if (!isRestModeRef.current && localTime > 0) {
      setLocalTime((prevTime) => {
        const newTime = prevTime - 1;

        // 只在關鍵節點 (0，5，10...) 更新 Redux，減少 re-render
        if (newTime === 0 || newTime % 5 === 0) {
          dispatch(updateCurrentExerciseTime(newTime));
        }

        // 如果運動時間結束，切換到休息模式
        if (newTime === 0) {
          isRestModeRef.current = true;
        }

        return newTime;
      });
    }
    // 休息時間模式
    else if (isRestModeRef.current && localRest > 0) {
      setLocalRest((prevRest) => {
        const newRest = prevRest - 1;

        // 只在關鍵節點更新 Redux
        if (newRest === 0 || newRest % 5 === 0) {
          dispatch(updateCurrentRestTime(newRest));
        }

        // 如果休息時間結束，移至下一個運動
        if (newRest === 0) {
          isRestModeRef.current = false;
          dispatch(moveToNextExercise());
        }

        return newRest;
      });
    }
  }, [currentExercise, localTime, localRest, dispatch]);

  // 設置計時器
  useEffect(() => {
    const timer = setInterval(handleTimerTick, 1000);
    return () => clearInterval(timer);
  }, [handleTimerTick]);

  return children;
};

export default TimerLogic;
