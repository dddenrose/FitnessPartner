"use client";
import {
  moveToNextExercise,
  selectCurrentExercise,
  selectStatus,
  updateCurrentExerciseTime,
  updateCurrentRestTime,
} from "@/lib/features/exercise/exerciseSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/index";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 運動計時邏輯的 Hook
 * 只專注於:計時邏輯(本地+Redux)以及切換下一個運動的時機邏輯
 * flow: 註冊timer => 每秒觸發計時邏輯 => 更新本地狀態 => 在關鍵節點更新Redux
 */
export const useTimerLogic = () => {
  const dispatch = useAppDispatch();

  // Redux核心的當前運動
  const currentExercise = useAppSelector(selectCurrentExercise);
  const status = useAppSelector(selectStatus);

  // 本地狀態用於優化渲染頻率
  const [localTime, setLocalTime] = useState<number>(0);
  const [localRest, setLocalRest] = useState<number>(0);

  // 用於追蹤需要同步到Redux的狀態
  const [pendingReduxUpdate, setPendingReduxUpdate] = useState<{
    type: "time" | "rest" | "nextExercise";
    value?: number;
  } | null>(null);

  // 用於計時的 refs (訪問的值都是最新的)
  const isRunningRef = useRef<boolean>(false);
  const isRestModeRef = useRef<boolean>(false);

  // 當 currentExercise 改變時同步本地狀態
  useEffect(() => {
    if (currentExercise) {
      setLocalTime(currentExercise.time);
      setLocalRest(currentExercise.rest);
      // 根據時間狀態確定是否為休息模式
      isRestModeRef.current =
        currentExercise.time === 0 && currentExercise.rest > 0;
    }
  }, [currentExercise]);

  // 根據 status 更新運行狀態
  useEffect(() => {
    isRunningRef.current = status === "active";
  }, [status]);

  // 處理 Redux 狀態更新
  useEffect(() => {
    if (!pendingReduxUpdate) return;

    const { type, value } = pendingReduxUpdate;

    switch (type) {
      case "time":
        if (value !== undefined) {
          dispatch(updateCurrentExerciseTime(value));
        }
        break;
      case "rest":
        if (value !== undefined) {
          dispatch(updateCurrentRestTime(value));
        }
        break;
      case "nextExercise":
        dispatch(moveToNextExercise());
        break;
    }

    setPendingReduxUpdate(null);
  }, [pendingReduxUpdate, dispatch]);

  // 專注在處理localTime和localRest的變化
  const handleTimerTick = useCallback(() => {
    if (!isRunningRef.current || !currentExercise) return;

    // 運動時間模式
    if (!isRestModeRef.current) {
      setLocalTime((prevTime) => {
        if (prevTime <= 0) return prevTime;

        const newTime = prevTime - 1;

        // 只在關鍵節點更新 Redux（用於音效觸發和狀態同步）
        if (newTime === 0 || newTime <= 5 || newTime % 10 === 0) {
          setPendingReduxUpdate({ type: "time", value: newTime });
        }

        // 如果運動時間結束，切換到休息模式
        if (newTime === 0) {
          isRestModeRef.current = true;
        }

        return newTime;
      });
    }
    // 休息時間模式
    else {
      setLocalRest((prevRest) => {
        if (prevRest <= 0) return prevRest;

        const newRest = prevRest - 1;

        // 只在關鍵節點更新 Redux（用於音效觸發和狀態同步）
        if (newRest === 0 || newRest <= 5 || newRest % 10 === 0) {
          setPendingReduxUpdate({ type: "rest", value: newRest });
        }

        // 如果休息時間結束，移至下一個運動
        if (newRest === 0) {
          isRestModeRef.current = false;
          setPendingReduxUpdate({ type: "nextExercise" });
        }

        return newRest;
      });
    }
  }, [dispatch]); // 移除 localTime 和 localRest 依賴，避免不必要的重新創建

  // 設置計時器
  useEffect(() => {
    const timer = setInterval(handleTimerTick, 1000);
    return () => clearInterval(timer);
  }, [handleTimerTick]);

  return {
    currentTime: localTime,
    currentRestTime: localRest,
    isRunning: isRunningRef.current,
    isRestMode: isRestModeRef.current,
  };
};
