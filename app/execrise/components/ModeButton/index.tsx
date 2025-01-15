import { setTime, setMode } from "@/lib/features/execrise/execriseSlice";
import { RootState } from "@/lib/store";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const StartButton = () => {
  const dispatch = useDispatch();
  const initialTime = useSelector(
    (state: RootState) => state.execrise.initialTime
  );

  return (
    <Button
      onClick={() => {
        dispatch(setTime(initialTime));
        dispatch(setMode("execrise"));
      }}
    >
      Go to execrise
    </Button>
  );
};

const BackButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push("/createWorkoutPlan");
      }}
      style={{ width: 120 }}
    >
      Back
    </Button>
  );
};

export default {
  StartButton,
  BackButton,
};
