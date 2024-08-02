import React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Box, Button, Typography } from "@mui/material";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <div className="w-20">
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value)} / 100s`}
        </Typography>
      </div>
    </Box>
  );
}

const aerobicsList = [
  {
    title: "Walking Lunges",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
  {
    title: "Burpees",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
  {
    title: "Jumping Jacks",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
  {
    title: "Mountain Climbers",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
  {
    title: "High Knees",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
  {
    title: "Butt Kicks",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
  {
    title: "Skaters",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
  {
    title: "Plank Jacks",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
  },
];

const WorkoutProcess: React.FC = () => {
  const [execriseList, setExecriseList] = React.useState<any[]>(aerobicsList);
  const [isPause, setIsPause] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!execriseList?.length) return;

    const timer = setInterval(() => {
      if (isPause) return;

      const result = execriseList
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
              execriseTimes: 10,
              restTimes: 4,
            };
          } else {
            return null;
          }
        })
        ?.filter((ele) => ele);

      setExecriseList(result);
    }, 1000);

    return () => clearInterval(timer); // 清除上一次的計時器
  }, [execriseList, isPause]);

  const progressValue = () => {
    if (!execriseList?.length) return 0;

    if (execriseList[0]?.execriseTimes) {
      return execriseList[0]?.execriseTimes;
    } else if (execriseList[0]?.restTimes) {
      return execriseList[0]?.restTimes;
    } else {
      return 0;
    }
  };

  const execriseTitle = () => {
    if (!execriseList?.length) return "Finish !!!";

    if (execriseList[0]?.execriseTimes) {
      return `Execrise : ${execriseList[0]?.title} / Left times: ${execriseList[0]?.times}`;
    } else if (execriseList[0]?.restTimes) {
      return `${execriseList[0]?.title}: Rest Time`;
    } else if (execriseList[0]?.times) {
      return `Execrise : ${execriseList[0]?.title} / Left times: ${execriseList[0]?.times}`;
    } else {
      return "Next Execrise";
    }
  };

  return (
    <Box sx={{ width: "50%" }}>
      {execriseTitle()}
      <LinearProgressWithLabel value={progressValue()} />
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
