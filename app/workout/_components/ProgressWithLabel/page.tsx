import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

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
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={formatValue()}
        size={200}
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-white text-4xl">{`${progressValue()}`}</div>
      </Box>
    </Box>
  );
};

export default ProgressWithLabel;