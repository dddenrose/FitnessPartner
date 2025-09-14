"use client";
import { setNavigationShow } from "@/lib/features/userInfo/userInfoSlice";
import {
  useAppDispatch,
  useAppSelector,
  useCountdownSound,
} from "@/lib/hooks/index";
import { Flex } from "antd";
import React from "react";
import ControlPanel from "./components/ControlPanel";
import Exercise from "./components/Exercise";
import Finish from "./components/Finish";
import ReactSpringBg from "./components/ReactSpringBg";
import TimerLogic from "./components/TimerLogic";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  // 使用新的選擇器
  const status = useAppSelector((state) => state.exercise.status);
  // 向下兼容
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
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
      gap={24}
    >
      <TimerLogic />

      {/* 初始狀態：選擇運動模式 */}
      {status === "idle" && (
        <div
          style={{ width: "100%", maxWidth: "1000px", padding: "20px" }}
        ></div>
      )}

      {/* 運動進行中狀態 */}
      {(status === "active" || status === "paused" || mode === "exercise") && (
        <>
          <Exercise />
          <ControlPanel />
        </>
      )}

      {/* 運動結束狀態 */}
      {(status === "finished" || mode === "finished") && <Finish />}

      <ReactSpringBg />
    </Flex>
  );
};

export default App;
