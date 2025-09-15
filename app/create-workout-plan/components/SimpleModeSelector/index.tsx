"use client";

import {
  WorkoutModeType,
  setBpm,
  setStatus,
  setWorkoutType,
} from "@/lib/features/exercise/exerciseSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import type { TabsProps } from "antd";
import { Tabs } from "antd";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import PlanForm from "../PlanForm";
import { DEFAULT_BPM, WORKOUT_MODE_TABS, TAB_LABELS } from "./const";
import SlowRunSettings from "./components/SlowRunSettings";

const SimpleModeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.exercise.workoutType);
  const currentBpm =
    useAppSelector((state) => state.exercise.bpm) || DEFAULT_BPM;
  const router = useRouter();

  const [bpm, setBpmState] = useState<number>(currentBpm);

  const handleSlowRunStart = useCallback(() => {
    dispatch(setStatus("active"));
    router.push("/exercise");
  }, [dispatch, router]);

  const handleModeChange = useCallback(
    (activeKey: string) => {
      const newMode = activeKey as WorkoutModeType;
      dispatch(setWorkoutType(newMode));
    },
    [dispatch]
  );

  const handleBpmChange = useCallback(
    (newValue: number | null) => {
      if (newValue !== null) {
        setBpmState(newValue);
        dispatch(setBpm(newValue));
      }
    },
    [dispatch]
  );

  // 當運動模式改變時，如果是超慢跑，確保 BPM 已設定
  useEffect(() => {
    if (currentMode === "slowrun" && !currentBpm) {
      dispatch(setBpm(DEFAULT_BPM));
    }
  }, [currentMode, currentBpm, dispatch]);

  // 使用超慢跑設定組件
  const handleSlowRunBpmChange = useCallback(
    (newValue: number | null) => handleBpmChange(newValue),
    [handleBpmChange]
  );

  const handleSlowRunStartCallback = useCallback(
    () => handleSlowRunStart(),
    [handleSlowRunStart]
  );

  const slowRunContent = (
    <SlowRunSettings
      bpm={bpm}
      onBpmChange={handleSlowRunBpmChange}
      onStart={handleSlowRunStartCallback}
    />
  );

  const items: TabsProps["items"] = [
    {
      key: WORKOUT_MODE_TABS.SLOWRUN,
      label: TAB_LABELS[WORKOUT_MODE_TABS.SLOWRUN],
      children: slowRunContent,
    },
    {
      key: WORKOUT_MODE_TABS.HIIT,
      label: TAB_LABELS[WORKOUT_MODE_TABS.HIIT],
      children: <PlanForm />,
    },
  ];

  return (
    <div style={{ marginBottom: "20px", width: "100%", maxWidth: 600 }}>
      <Tabs
        activeKey={currentMode}
        items={items}
        onChange={handleModeChange}
        style={{ marginTop: "15px" }}
        size="large"
      />
    </div>
  );
};

export default SimpleModeSelector;
