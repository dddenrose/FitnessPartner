"use client";
import { setMode, setTime } from "@/lib/features/execrise/execriseSlice";
import { RootState } from "@/lib/store";
import { Flex } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const timeConfig = {
  main: 5,
  rest: 3,
  rounds: 8,
};

const TimerLogic = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.execrise.time);
  const pause = useSelector((state: RootState) => state.execrise.pause);

  React.useEffect(() => {
    const t = setInterval(() => {
      if (pause || !time.length) return;

      if (time[0].time > 0) {
        dispatch(
          setTime(
            time.map((t, index) => {
              if (index === 0) {
                return {
                  ...t,
                  time: t.time - 1,
                };
              }

              return t;
            })
          )
        );
      } else if (time[0].rest > 0) {
        dispatch(
          setTime(
            time.map((t, index) => {
              if (index === 0) {
                return {
                  ...t,
                  rest: t.rest - 1,
                };
              }

              return t;
            })
          )
        );
      } else if (time.length > 1) {
        dispatch(setTime(time.slice(1)));
      } else {
        dispatch(setMode("finish"));
      }
    }, 1000);

    return () => clearInterval(t);
  }, [pause, time, dispatch]);

  return children;
};

export default TimerLogic;
