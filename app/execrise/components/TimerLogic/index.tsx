"use client";
import { setTime } from "@/lib/features/execrise/execriseSlice";
import { RootState } from "@/lib/store";
import { Flex } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const timeConfig = {
  main: 5,
  rest: 3,
  rounds: 8,
};

const TimerLogic = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.execrise.time);
  const pause = useSelector((state: RootState) => state.execrise.pause);
  const initialTime = useSelector(
    (state: RootState) => state.execrise.initialTime
  );

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
      } else {
        dispatch(setTime(time.slice(1)));
      }
    }, 1000);

    return () => clearInterval(t);
  }, [pause, time]);

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{ minHeight: "100vh" }}
    >
      {children}
    </Flex>
  );
};

export default TimerLogic;
