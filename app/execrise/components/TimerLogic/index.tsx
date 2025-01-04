"use client";
import {
  selectTime,
  setPause,
  setTime,
} from "@/lib/features/execrise/execriseSlice";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const timeConfig = {
  main: 5,
  rest: 3,
  rounds: 8,
};

const TimerLogic = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const time = selectTime(useSelector((state: RootState) => state));
  const pause = useSelector((state: RootState) => state.execrise.pause);
  const initialTime = useSelector(
    (state: RootState) => state.execrise.initialTime
  );

  React.useEffect(() => {
    const t = setInterval(() => {
      if (pause) return;

      if (time.main > 0) {
        dispatch(setTime({ ...time, main: time.main - 1 }));
      } else if (time.rest > 0) {
        dispatch(
          setTime({
            ...time,
            rest: time.rest - 1,
          })
        );
      } else if (time.rounds > 0) {
        dispatch(
          setTime({
            main: initialTime.main,
            rest: initialTime.rest,
            rounds: time.rounds - 1,
          })
        );
      } else {
        dispatch(setPause(true));
      }
    }, 1000);

    return () => clearInterval(t);
  }, [pause, time]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      {children}
    </div>
  );
};

export default TimerLogic;
