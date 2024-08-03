import React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
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
    <Box className="bg-slate-100 p-8" sx={{ width: "50%" }}>
      <Typography variant="h4">{execriseTitle()}</Typography>

      <ProgressWithLabel execriseList={execriseList} />

      <Button
        onClick={() => {
          setIsPause(!isPause);
        }}
      >
        {isPause ? "Resume" : "Pause"}
      </Button>

      <Button
        onClick={() => {
          setExecriseList(execriseList.slice(1));
        }}
      >
        Skip
      </Button>
    </Box>
  );
};

export default WorkoutProcess;
