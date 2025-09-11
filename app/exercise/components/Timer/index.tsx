"use client";
import Exercise from "../Exercise";
import TimerBg from "../TimerBg";
import TimerLogic from "../TimerLogic";
import ModeButton from "../ModeButton";

const Timer = () => (
  <TimerLogic>
    <Exercise />
    <ModeButton.BackButton />
    <TimerBg />
  </TimerLogic>
);

export default Timer;
