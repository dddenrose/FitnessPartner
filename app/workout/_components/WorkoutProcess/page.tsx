import React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Box, Typography } from "@mui/material";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}
        seconds`}</Typography>
      </Box>
    </Box>
  );
}

const aerobicsList = [
  {
    title: "Walking Lunges",
    execriseTimes: 60,
    times: 10,
    restTimes: 30,
  },
  {
    title: "Burpees",
    execriseTimes: 60,
    times: 10,
    restTimes: 30,
  },
  {
    title: "Jumping Jacks",
    execriseTimes: 60,
    times: 10,
    restTimes: 30,
  },
  {
    title: "Mountain Climbers",
    execriseTimes: 60,
    times: 5,
    restTimes: 30,
  },
  {
    title: "High Knees",
    execriseTimes: 60,
    times: 5,
    restTimes: 30,
  },
  {
    title: "Butt Kicks",
    execriseTimes: 60,
    times: 5,
    restTimes: 30,
  },
  {
    title: "Skaters",
    execriseTimes: 60,
    times: 5,
    restTimes: 30,
  },
  {
    title: "Plank Jacks",
    execriseTimes: 60,
    times: 5,
    restTimes: 30,
  },
];

const WorkoutProcess: React.FC = () => {
  const [execriseList, setExecriseList] = React.useState(aerobicsList);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!execriseList?.length) return;

    const timer = setInterval(() => {
      const slot = 100 / aerobicsList[0].execriseTimes;

      setProgress((prevProgress) => (prevProgress += slot));
    }, 1000);

    if (progress >= aerobicsList[0].execriseTimes) {
      execriseList?.filter((item, index) => index !== 0);

      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [execriseList?.length]);

  return (
    <Box sx={{ width: "50%" }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
};

export default WorkoutProcess;
