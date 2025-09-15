"use client";
import { setNavigationShow } from "@/lib/features/userInfo/userInfoSlice";
import {
  useAppDispatch,
  useAppSelector,
  useCountdownSound,
  useTimerLogic,
} from "@/lib/hooks/index";
import { Flex } from "antd";
import React from "react";
import ControlPanel from "./components/ControlPanel";
import Exercise from "./components/Exercise";
import Finish from "./components/Finish";
import ReactSpringBg from "./components/ReactSpringBg";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.exercise.status);

  // 使用計時器邏輯 hook
  useTimerLogic();

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
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
      gap={24}
    >
      {/* 運動進行中狀態 */}
      {(status === "active" || status === "paused") && (
        <>
          <Exercise />
          <ControlPanel />
        </>
      )}

      {/* 運動結束狀態 */}
      {status === "finished" && <Finish />}

      <ReactSpringBg />
    </Flex>
  );
};

export default App;
