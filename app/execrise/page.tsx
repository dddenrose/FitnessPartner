"use client";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackButton, SkipButton } from "./components/ModeButton";
import TimerBg from "./components/TimerBg";
import TimerLogic from "./components/TimerLogic";
import Timer from "./components/Timer";
import Execrise from "./components/Execrise";
import { Flex } from "antd";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const initialTime = useSelector(
    (state: RootState) => state.execrise.initialTime
  );

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{ minHeight: "100vh" }}
      gap={24}
    >
      <TimerLogic>
        <Execrise />

        <Flex gap={8}>
          <BackButton />
          <SkipButton />
        </Flex>

        <TimerBg />
      </TimerLogic>
    </Flex>
  );
};

export default App;
