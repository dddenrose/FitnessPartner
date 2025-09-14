"use client";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TimerBg from "./components/TimerBg";
import TimerLogic from "./components/TimerLogic";
import Timer from "./components/Timer";
import Exercise from "./components/Exercise";
import { Flex } from "antd";
import { setNavigationShow } from "@/lib/features/userInfo/userInfoSlice";
import Finish from "./components/Finish";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/index";
import ControlPanel from "./components/ControlPanel";
import { useCountdownSound } from "@/lib/hooks/index";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.exercise.mode);

  // 使用倒數音效 hook - 自動播放
  useCountdownSound({
    volume: 0.3,
    exerciseThreshold: 5, // 運動最後 5 秒播放提示音
    restThreshold: 5, // 休息最後 5 秒播放提示音
  });

  React.useEffect(() => {
    dispatch(setNavigationShow(false));

    return () => {
      dispatch(setNavigationShow(true));
    };
  }, [dispatch]);

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{ minHeight: "100vh", maxHeight: "100vh", overflow: "hidden" }}
      gap={24}
    >
      <TimerLogic />

      {mode === "exercise" && (
        <>
          <Exercise />
          <ControlPanel />
        </>
      )}

      {mode === "finished" && <Finish />}

      <TimerBg />
    </Flex>
  );
};

export default App;
