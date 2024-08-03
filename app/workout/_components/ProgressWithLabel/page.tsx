import React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Box, Button, Typography } from "@mui/material";

const ProgressWithLabel: React.FC<{
  execriseList: WorkoutItem[];
}> = ({ execriseList }) => {
  const totalTime = () => {
    if (execriseList?.[0]?.execriseTimes) {
      return execriseList?.[0]?.requiredItem?.time;
    } else if (execriseList?.[0]?.restTimes) {
      return execriseList?.[0]?.requiredItem?.rest;
    } else {
      return 0;
    }
  };

  const formatValue = () => {
    if (execriseList?.[0]?.execriseTimes) {
      const slot = 100 / execriseList?.[0]?.requiredItem?.time;

      return execriseList?.[0]?.execriseTimes * slot;
    } else if (execriseList?.[0]?.restTimes) {
      const slot = 100 / execriseList?.[0]?.requiredItem?.rest;

      return execriseList?.[0]?.restTimes * slot;
    } else {
      return 0;
    }
  };

  const progressValue = (): number => {
    if (!execriseList?.length) return 0;

    if (execriseList[0]?.execriseTimes) {
      return execriseList[0]?.execriseTimes;
    } else if (execriseList[0]?.restTimes) {
      return execriseList[0]?.restTimes;
    } else {
      return 0;
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={formatValue()} />
      </Box>
      <div className="w-20">
        <Typography variant="body2" color="text.secondary">
          {`${progressValue()} / ${totalTime()}`}
        </Typography>
      </div>
    </Box>
  );
};

export default ProgressWithLabel;
