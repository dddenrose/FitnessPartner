"use client";
import Execrise from "../Execrise";
import Rest from "../Rest";
import TimerBg from "../TimerBg";
import TimerLogic from "../TimerLogic";
import ModeButton from "../ModeButton";

const Timer = () => (
  <TimerLogic>
    <Execrise />
    {/* <Rest /> */}
    <ModeButton.BackButton />
    <TimerBg />
  </TimerLogic>
);

export default Timer;
