"use client";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Buttons from "./components/ModeButton";
import TimerBg from "./components/TimerBg";
import TimerLogic from "./components/TimerLogic";
import Timer from "./components/Timer";
import Execrise from "./components/Execrise";
import { Flex } from "antd";
import AudioPlayer from "./components/AudioPlayer";
import FloatFunctions from "./components/FloatFunctions";
import { setNavigationShow } from "@/lib/features/userInfo/userInfoSlice";
import Finish from "./components/Finish";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.execrise.mode);

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
      style={{ minHeight: "100vh" }}
      gap={24}
    >
      <TimerLogic />

      {mode === "execrise" && (
        <>
          <Execrise />

          <Flex gap={8}>
            <Buttons.PauseButton />
            <Buttons.SkipButton />
          </Flex>

          <AudioPlayer />
        </>
      )}

      {mode === "finish" && <Finish />}

      <TimerBg />

      <FloatFunctions />
    </Flex>
  );
};

export default App;
