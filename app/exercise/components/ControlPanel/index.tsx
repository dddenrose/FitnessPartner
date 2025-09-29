"use client";
import React from "react";
import {
  DoubleRightOutlined,
  MutedOutlined,
  PauseOutlined,
  RightOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Button, Flex, Modal, Tooltip } from "antd";
import { setIsGlobalPlaying } from "@/lib/features/audio/audioSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";
import { WorkoutModeType } from "@/lib/features/exercise/exerciseSlice";
import {
  setStatus,
  skipCurrentExercise,
  resetWorkout,
  completeWorkout,
  selectStatus,
  selectCurrentExercise,
  selectRemainingExercises,
  selectInitialWorkoutPlan,
  toggleMetronome,
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

  // 其他狀態
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );
  const metronomeActive = useAppSelector(
    (state) => state.exercise.metronomeActive
  );
  const workoutType = useAppSelector((state) => state.exercise.workoutType);

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

  const handleToggleMetronome = () => {
    dispatch(toggleMetronome(!metronomeActive));
  };

  const handleComplete = () => {
    modalApi.confirm({
      title: "完成運動",
      content: "確定要結束並記錄本次運動嗎？",
      okText: "完成",
      cancelText: "取消",
      onOk: () => {
        // 完成運動並記錄數據
        dispatch(completeWorkout());
        // 導航到報告頁面
        router.push("/workout-report");
      },
    });
  };

  const handleReturn = () => {
    modalApi.confirm({
      title: "返回選擇",
      content: "確定要返回嗎？當前運動進度將不會被記錄。",
      okText: "返回",
      cancelText: "取消",
      onOk: () => {
        // 重置運動狀態但不記錄數據
        dispatch(resetWorkout());
        // 返回主頁面
        router.push("/");
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

        {workoutType === "slowrun" && (
          <Tooltip title={metronomeActive ? "關閉節拍燈" : "開啟節拍燈"}>
            <Button
              onClick={handleToggleMetronome}
              style={buttonStyle}
              type="default"
              shape="circle"
              size="large"
            >
              {metronomeActive ? <AudioOutlined /> : <AudioMutedOutlined />}
            </Button>
          </Tooltip>
        )}

        <Button
          onClick={handleComplete}
          style={buttonStyle}
          shape="circle"
          size="large"
        >
          <CheckCircleOutlined />
        </Button>

        <Button
          onClick={handleReturn}
          style={buttonStyle}
          type="default"
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
