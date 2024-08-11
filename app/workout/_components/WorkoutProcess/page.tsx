import React from "react";
import ProgressWithLabel from "../ProgressWithLabel/page";
import PauseButton from "./_components/PauseButton/page";
import SkipButton from "./_components/SkipButton/page";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { decrement } from "@/lib/features/workouts/workoutsSlice";

const WorkoutProcess: React.FC = () => {
  const list = useAppSelector((state) => state.workout.list);
  const dispatch = useAppDispatch();
  // pause
  const [isPause, setIsPause] = React.useState(false);

  // timer
  React.useEffect(() => {
    if (!list?.length) return;

    console.log(list, "======list");

    const timer = setInterval(() => {
      if (isPause) return;

      dispatch(decrement());
    }, 1000);

    return () => clearInterval(timer); // 清除上一次的計時器
  }, [list, isPause]);

  // 顯示的大標題
  const execriseTitle = () => {
    if (!list?.length) return "Finish !!!";

    if (list?.[0]?.execriseTimes) {
      return list?.[0]?.title;
    } else if (list?.[0]?.restTimes) {
      return "Rest Time";
    } else if (list?.[0]?.set) {
      return list?.[0]?.title;
    } else if (list?.[0]?.prepareTimes) {
      const nextExecrise = list?.[1]?.title;

      if (nextExecrise) {
        return (
          <div className="text-white font-bold text-5xl">
            <div className="mb-2">Prepare Time</div>
            <div className="text-sm font-normal">Next : {nextExecrise}</div>
          </div>
        );
      }

      return "Prepare Time";
    } else {
      return "Next Execrise";
    }
  };

  // 剩餘組數
  const leftTimes = () => {
    if (!list?.length) return null;

    const currentTitle = execriseTitle();

    if (
      currentTitle === "Prepare Time" ||
      currentTitle === "Rest Time" ||
      typeof currentTitle !== "string"
    ) {
      return null;
    }

    return `Left Times : ${list?.[0]?.set}`;
  };

  // background color
  const bgColor = () => {
    const currentTitle = execriseTitle();

    if (currentTitle === "Prepare Time" || currentTitle === "Rest Time") {
      return "bg-indigo-300";
    }

    return "bg-indigo-800";
  };

  return (
    <div
      className={`flex ${bgColor()} p-8 w-4/5 gap-4 place-content-between rounded-3xl`}
    >
      <div className="flex flex-col place-content-between">
        <div className="block text-white font-bold text-5xl">
          {/* Title */}
          {execriseTitle()}

          {/* 剩餘組數 */}
          <div className="block text-white font-medium text-xl mt-3">
            {leftTimes()}
          </div>
        </div>
        <div className="flex gap-2">
          {/* Pause Button */}
          <PauseButton isPause={isPause} setIsPause={setIsPause} />

          {/* Skip Button */}
          <SkipButton />
        </div>
      </div>

      <div>
        <ProgressWithLabel />
      </div>
    </div>
  );
};

export default WorkoutProcess;
