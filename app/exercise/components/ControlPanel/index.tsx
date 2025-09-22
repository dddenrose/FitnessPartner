"use client";
import React from "react";
import {
  DoubleRightOutlined,
  MutedOutlined,
  PauseOutlined,
  RightOutlined,
  RollbackOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Button, Flex, Modal } from "antd";
import { setIsGlobalPlaying } from "@/lib/features/audio/audioSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import { WorkoutModeType } from "@/lib/features/exercise/exerciseSlice";
import {
  setStatus,
  skipCurrentExercise,
  resetWorkout,
  selectStatus,
  selectCurrentExercise,
  selectRemainingExercises,
  selectInitialWorkoutPlan,
} from "@/lib/features/exercise/exerciseSlice";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/hooks/index";

/**
 * 統一的控制面板組件，整合所有控制按鈕
 */
const ControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [modalApi, context] = Modal.useModal();

  // 狀態選擇器
  const status = useAppSelector(selectStatus);
  const currentExercise = useAppSelector(selectCurrentExercise);
  const remainingExercises = useAppSelector(selectRemainingExercises);
  const initialWorkoutPlan = useAppSelector(selectInitialWorkoutPlan);
  const workoutType = useAppSelector((state) => state.exercise.workoutType);

  // 其他狀態
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );

  // 是否為手機版面
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 按鈕處理函數
  const handlePause = () => {
    dispatch(setStatus(status === "active" ? "paused" : "active"));
  };

  const handleSkip = () => {
    if (
      currentExercise &&
      (remainingExercises.length > 0 ||
        currentExercise.time > 0 ||
        currentExercise.rest > 0)
    ) {
      dispatch(skipCurrentExercise());
    }
  };

  const handleAudio = () => {
    dispatch(setIsGlobalPlaying(!isGlobalPlaying));
  };

  const handleBack = () => {
    modalApi.confirm({
      title: "確定要返回嗎？",
      content: "所有進度將會遺失",
      okText: "確定",
      cancelText: "取消",
      onOk: () => {
        dispatch(resetWorkout());
        router.push("/create-workout-plan");
      },
    });
  };

  // 按鈕樣式
  const buttonStyle = {
    width: isMobile ? 70 : 100,
    height: isMobile ? 70 : 100,
    fontSize: isMobile ? 24 : 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      {context}
      <Flex gap={16} wrap="wrap" justify="center">
        <Button
          onClick={handlePause}
          style={buttonStyle}
          type="default"
          shape="circle"
          size="large"
        >
          {status === "paused" ? <RightOutlined /> : <PauseOutlined />}
        </Button>

        {workoutType === "hiit" && (
          <Button
            onClick={handleSkip}
            style={buttonStyle}
            type="default"
            shape="circle"
            size="large"
          >
            <DoubleRightOutlined />
          </Button>
        )}

        <Button
          onClick={handleAudio}
          style={buttonStyle}
          type="default"
          shape="circle"
          size="large"
        >
          {isGlobalPlaying ? <SoundOutlined /> : <MutedOutlined />}
        </Button>

        <Button
          onClick={handleBack}
          style={buttonStyle}
          type="primary"
          danger
          shape="circle"
          size="large"
        >
          <RollbackOutlined />
        </Button>
      </Flex>
    </>
  );
};

export default ControlPanel;
