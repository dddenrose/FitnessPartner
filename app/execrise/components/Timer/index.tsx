"use client";
import Execrise from "../Execrise";
import TimerBg from "../TimerBg";
import TimerLogic from "../TimerLogic";
import ModeButton from "../ModeButton";

const Timer = () => (
  <TimerLogic>
    <Execrise />
    <ModeButton.BackButton />
    <TimerBg />
  </TimerLogic>
);

export default Timer;
