import React from "react";
import ProgressWithLabel from "../ProgressWithLabel/page";
import PauseButton from "./_components/PauseButton/page";
import SkipButton from "./_components/SkipButton/page";

const WorkoutProcess: React.FC<{
  execriseList: WorkoutItem[];
  setExecriseList: React.Dispatch<React.SetStateAction<WorkoutItem[]>>;
}> = ({ execriseList, setExecriseList }) => {
  // pause
  const [isPause, setIsPause] = React.useState(false);

  // timer
  React.useEffect(() => {
    if (!execriseList?.length) return;

    const timer = setInterval(() => {
      if (isPause) return;

      const result: WorkoutItem[] = execriseList
        ?.map((item, index) => {
          if (index !== 0) return item;

          if (item?.execriseTimes) {
            return {
              ...item,
              execriseTimes: item.execriseTimes - 1,
            };
          } else if (item?.restTimes) {
            return {
              ...item,
              restTimes: item.restTimes - 1,
            };
          } else if (item?.times) {
            return {
              ...item,
              times: item.times - 1,
              execriseTimes: execriseList[0]?.requiredItem?.time,
              restTimes: execriseList[0]?.requiredItem?.rest,
            };
          } else if (item?.prepareTimes) {
            return {
              ...item,
              prepareTimes: item.prepareTimes - 1,
            };
          } else {
            return null;
          }
        })
        ?.filter((ele) => ele) as WorkoutItem[];

      setExecriseList(result);
    }, 1000);

    return () => clearInterval(timer); // 清除上一次的計時器
  }, [execriseList, isPause]);

  // 顯示的大標題
  const execriseTitle = () => {
    if (!execriseList?.length) return "Finish !!!";

    if (execriseList[0]?.execriseTimes) {
      return execriseList[0]?.title;
    } else if (execriseList[0]?.restTimes) {
      return "Rest Time";
    } else if (execriseList[0]?.times) {
      return execriseList[0]?.title;
    } else if (execriseList[0]?.prepareTimes) {
      const nextExecrise = execriseList[1]?.title;

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
    if (!execriseList?.length) return null;

    const currentTitle = execriseTitle();

    if (
      currentTitle === "Prepare Time" ||
      currentTitle === "Rest Time" ||
      typeof currentTitle !== "string"
    ) {
      return null;
    }

    return `Left Times : ${execriseList[0]?.times}`;
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
          {execriseTitle()}

          {/* 剩餘組數 */}
          <div className="block text-white font-medium text-xl mt-3">
            {leftTimes()}
          </div>
        </div>

        <div className="flex gap-2">
          <PauseButton isPause={isPause} setIsPause={setIsPause} />

          <SkipButton
            execriseList={execriseList}
            setExecriseList={setExecriseList}
          />
        </div>
      </div>

      <div>
        <ProgressWithLabel execriseList={execriseList} />
      </div>
    </div>
  );
};

export default WorkoutProcess;
