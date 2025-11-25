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
  OpenAIOutlined,
} from "@ant-design/icons";
import { Button, Flex, Modal, Switch, Tooltip, Typography } from "antd";
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
import styles from "./styles.module.css";
import {
  setBpmDetectorEnabled,
  toggleBpmDetector,
} from "@/lib/features/bpmDetector/bpmDetectorSlice";

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
  const enableBpmDetector = useAppSelector(
    (state) => state.bpmDetector.enabled
  );

  // 其他狀態
  const isGlobalPlaying = useAppSelector(
    (state) => state.audio.isGlobalPlaying
  );
  const metronomeActive = useAppSelector(
    (state) => state.exercise.metronomeActive
  );
  const workoutType = useAppSelector((state) => state.exercise.workoutType);

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
        // 返回運動計劃選擇頁面
        router.push("/create-workout-plan");
      },
    });
  };

  return (
    <>
      {context}
      <div className={styles.controlContainer}>
        <Button
          onClick={handlePause}
          className={styles.controlButton}
          type="default"
          shape="circle"
          size="large"
        >
          {status === "paused" ? <RightOutlined /> : <PauseOutlined />}
        </Button>

        {workoutType === "hiit" && (
          <Button
            onClick={handleSkip}
            className={styles.controlButton}
            type="default"
            shape="circle"
            size="large"
          >
            <DoubleRightOutlined />
          </Button>
        )}

        <Button
          onClick={handleAudio}
          className={styles.controlButton}
          type="default"
          shape="circle"
          size="large"
        >
          {isGlobalPlaying ? <SoundOutlined /> : <MutedOutlined />}
        </Button>

        {workoutType === "slowrun" && (
          <>
            <Button
              onClick={() => dispatch(toggleBpmDetector())}
              className={styles.controlButton}
              type={enableBpmDetector ? "primary" : "default"}
              shape="circle"
              size="large"
              title="步頻檢測"
            >
              <OpenAIOutlined />
            </Button>

            <Tooltip title={metronomeActive ? "關閉節拍燈" : "開啟節拍燈"}>
              <Button
                onClick={handleToggleMetronome}
                className={styles.controlButton}
                type="default"
                shape="circle"
                size="large"
              >
                {metronomeActive ? <AudioOutlined /> : <AudioMutedOutlined />}
              </Button>
            </Tooltip>
          </>
        )}

        <Button
          onClick={handleComplete}
          className={styles.controlButton}
          shape="circle"
          size="large"
        >
          <CheckCircleOutlined />
        </Button>

        <Button
          onClick={handleReturn}
          className={styles.controlButton}
          type="default"
          shape="circle"
          size="large"
        >
          <RollbackOutlined />
        </Button>
      </div>
    </>
  );
};

export default ControlPanel;
