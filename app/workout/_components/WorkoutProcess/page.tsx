import React from "react";
import ProgressWithLabel from "../ProgressWithLabel/page";
import { aerobicsList } from "./const";

const WorkoutProcess: React.FC = () => {
  const [execriseList, setExecriseList] =
    React.useState<WorkoutItem[]>(aerobicsList);
  const [isPause, setIsPause] = React.useState(false);

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
          } else {
            return null;
          }
        })
        ?.filter((ele) => ele) as WorkoutItem[];

      setExecriseList(result);
    }, 1000);

    return () => clearInterval(timer); // 清除上一次的計時器
  }, [execriseList, isPause]);

  const execriseTitle = () => {
    if (!execriseList?.length) return "Finish !!!";

    if (execriseList[0]?.execriseTimes) {
      return execriseList[0]?.title;
    } else if (execriseList[0]?.restTimes) {
      return "Rest Time";
    } else if (execriseList[0]?.times) {
      return execriseList[0]?.title;
    } else {
      return "Next Execrise";
    }
  };

  const execriseSeconds = () => {
    if (!execriseList?.length) return "Finish !!!";

    if (execriseList[0]?.execriseTimes) {
      return execriseList[0]?.times;
    } else if (execriseList[0]?.restTimes) {
      return execriseList[0]?.restTimes;
    } else if (execriseList[0]?.times) {
      return {
        title: execriseList[0]?.title,
        leftTimes: execriseList[0]?.times,
      };
    } else {
      return "Next Execrise";
    }
  };

  return (
    <div className="flex bg-indigo-800 p-8 w-4/5 gap-4 place-content-between rounded-3xl">
      <div className="flex flex-col place-content-between">
        <div className="block text-white font-bold text-5xl">
          {execriseTitle()}
          <div className="block text-white font-medium text-xl mt-3">
            Left Times : {execriseList?.[0]?.times}
          </div>
        </div>

        <div className="flex gap-8">
          <div
            className="text-indigo-700 cursor-pointer font-bold flex items-center justify-center p-1 rounded-full text-center text-md bg-white w-40 h-10 "
            onClick={() => {
              setIsPause(!isPause);
            }}
          >
            {isPause ? "Resume" : "Pause"}
          </div>

          <div
            onClick={() => {
              setExecriseList(execriseList.slice(1));
            }}
            className="flex gap-1 justify-center rounded-full 
            border border-white
            text-white
            h-10 items-center w-40 cursor-pointer"
          >
            Skip
          </div>
        </div>
      </div>
      <div>
        <ProgressWithLabel execriseList={execriseList} />
      </div>
    </div>
  );
};

export default WorkoutProcess;
