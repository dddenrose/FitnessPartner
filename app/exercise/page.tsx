"use client";
import { setNavigationShow } from "@/lib/features/userInfo/userInfoSlice";
import {
  useAppDispatch,
  useAppSelector,
  useCountdownSound,
  useTimerLogic,
} from "@/lib/hooks/index";
import { selectIsSlowRun } from "@/lib/features/exercise/exerciseSlice";
import { Flex } from "antd";
import React from "react";
import ControlPanel from "./components/ControlPanel";
import Exercise from "./components/Exercise";
import Finish from "./components/Finish";
import ReactSpringBg from "./components/ReactSpringBg";
import styles from "./styles.module.css";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.exercise.status);
  const isSlowRun = useAppSelector(selectIsSlowRun); // 添加檢查是否為慢跑模式

  // 使用計時器邏輯 hook - 在頁面層級統一管理
  const timerData = useTimerLogic();

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
    <div className={styles.exerciseContainer}>
      {/* 運動進行中狀態 */}
      {(status === "active" || status === "paused") && (
        <div className={styles.exerciseContent}>
          <Exercise timerData={timerData} />
          <ControlPanel />
        </div>
      )}

      {/* 運動結束狀態 */}
      {status === "finished" && <Finish />}

      <ReactSpringBg />
    </div>
  );
};

export default App;
