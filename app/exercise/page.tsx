"use client";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Buttons from "./components/ModeButton";
import TimerBg from "./components/TimerBg";
import TimerLogic from "./components/TimerLogic";
import Timer from "./components/Timer";
import Exercise from "./components/Exercise";
import { Flex } from "antd";
import AudioPlayer from "./components/AudioPlayer";
import FloatFunctions from "./components/FloatFunctions";
import { setNavigationShow } from "@/lib/features/userInfo/userInfoSlice";
import Finish from "./components/Finish";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.exercise.mode);

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

          <Flex gap={8}>
            <Buttons.PauseButton />
            <Buttons.SkipButton />
          </Flex>

          <AudioPlayer />
        </>
      )}

      {mode === "finished" && <Finish />}

      <TimerBg />

      <FloatFunctions />
    </Flex>
  );
};

export default App;
