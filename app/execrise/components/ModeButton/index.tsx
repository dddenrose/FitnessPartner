import { setTime, setMode } from "@/lib/features/execrise/execriseSlice";
import { RootState } from "@/lib/store";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const StartButton: React.FC = () => {
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

const BackButton: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push("/createWorkoutPlan");
      }}
      style={{ width: 100 }}
      type="default"
    >
      Back
    </Button>
  );
};

const SkipButton: React.FC = () => {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.execrise.time);

  return (
    <Button
      onClick={() => {
        if (time.length < 2) return;
        dispatch(setTime(time.slice(1)));
      }}
      style={{ width: 100 }}
      type="default"
    >
      Skip
    </Button>
  );
};

export default { StartButton, BackButton, SkipButton };
