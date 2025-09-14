"use client";
import {
  setWorkoutPlan,
  setStatus,
  skipCurrentExercise,
  resetWorkout,
  // 向下兼容
  setTime,
  setMode,
  setPause,
  selectInitialWorkoutPlan,
  selectStatus,
  selectIsPaused,
  selectCurrentExercise,
  selectRemainingExercises,
} from "@/lib/features/exercise/exerciseSlice";
import { RootState } from "@/lib/store";
import {
  DoubleRightOutlined,
  PauseOutlined,
  RightOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";

import { useRouter } from "next/navigation";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux/useRedux";

const StartButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const initialWorkoutPlan = useAppSelector(selectInitialWorkoutPlan);
  // 向下兼容
  const initialTime = useAppSelector((state) => state.exercise.initialTime);

  return (
    <Button
      onClick={() => {
        // 優先使用新的 API
        if (initialWorkoutPlan.length > 0) {
          dispatch(setWorkoutPlan(initialWorkoutPlan));
          dispatch(setStatus("active"));
        } else {
          // 向下兼容
          dispatch(setTime(initialTime));
          dispatch(setMode("exercise"));
        }
      }}
    >
      Go to exercise
    </Button>
  );
};

const BackButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const initialWorkoutPlan = useAppSelector(selectInitialWorkoutPlan);
  // 向下兼容
  const initialTime = useAppSelector((state) => state.exercise.initialTime);
  const [modalApi, context] = Modal.useModal();

  return (
    <>
      {context}
      <Button
        onClick={() => {
          modalApi.confirm({
            title: "確定要返回嗎？",
            content: "所有進度將會丟失",
            okText: "確定",
            cancelText: "取消",
            onOk: () => {
              // 優先使用新的 API
              if (initialWorkoutPlan.length > 0) {
                dispatch(resetWorkout());
              } else {
                // 向下兼容
                dispatch(setTime(initialTime));
                dispatch(setPause(false));
              }
              router.push("/create-workout-plan");
            },
          });
        }}
        style={{ width: 100 }}
        type="primary"
        danger
      >
        <RollbackOutlined />
        返回
      </Button>
    </>
  );
};

const SkipButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentExercise = useAppSelector(selectCurrentExercise);
  const remainingExercises = useAppSelector(selectRemainingExercises);
  // 向下兼容
  const time = useAppSelector((state) => state.exercise.times);

  return (
    <Button
      onClick={() => {
        // 優先使用新的 API
        if (
          currentExercise &&
          (remainingExercises.length > 0 ||
            currentExercise.time > 0 ||
            currentExercise.rest > 0)
        ) {
          dispatch(skipCurrentExercise());
        } else if (time.length > 1) {
          // 向下兼容
          dispatch(setTime(time.slice(1)));
        }
      }}
      style={{ width: 100 }}
      type="default"
    >
      <DoubleRightOutlined />
    </Button>
  );
};

const PauseButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const isPaused = useAppSelector(selectIsPaused);
  // 向下兼容
  const pause = useAppSelector((state) => state.exercise.pause);

  return (
    <Button
      onClick={() => {
        // 優先使用新的 API
        if (status === "active" || status === "paused") {
          dispatch(setStatus(status === "active" ? "paused" : "active"));
        } else {
          // 向下兼容
          dispatch(setPause(!pause));
        }
      }}
      style={{ width: 100 }}
      type="default"
    >
      {isPaused || pause ? <RightOutlined /> : <PauseOutlined />}
    </Button>
  );
};

export default { StartButton, BackButton, SkipButton, PauseButton };
