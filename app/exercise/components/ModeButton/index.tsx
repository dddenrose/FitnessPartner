"use client";
import {
  setWorkoutPlan,
  setStatus,
  skipCurrentExercise,
  resetWorkout,
  selectInitialWorkoutPlan,
  selectStatus,
  selectCurrentExercise,
  selectRemainingExercises,
} from "@/lib/features/exercise/exerciseSlice";
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

  return (
    <Button
      onClick={() => {
        if (initialWorkoutPlan.length > 0) {
          dispatch(setWorkoutPlan(initialWorkoutPlan));
          dispatch(setStatus("active"));
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
              dispatch(resetWorkout());
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

  return (
    <Button
      onClick={() => {
        if (
          currentExercise &&
          (remainingExercises.length > 0 ||
            currentExercise.time > 0 ||
            currentExercise.rest > 0)
        ) {
          dispatch(skipCurrentExercise());
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

  return (
    <Button
      onClick={() => {
        if (status === "active" || status === "paused") {
          dispatch(setStatus(status === "active" ? "paused" : "active"));
        }
      }}
      style={{ width: 100 }}
      type="default"
    >
      {status === "paused" ? <RightOutlined /> : <PauseOutlined />}
    </Button>
  );
};

export default { StartButton, BackButton, SkipButton, PauseButton };
