import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const ProgressWithLabel: React.FC = () => {
  const list = useAppSelector((state) => state.workout.list);

  const formatValue = () => {
    if (list?.[0]?.execriseTimes) {
      const slot = 100 / list?.[0]?.requiredItem?.time;

      return list?.[0]?.execriseTimes * slot;
    } else if (list?.[0]?.restTimes) {
      const slot = 100 / list?.[0]?.requiredItem?.rest;

      return list?.[0]?.restTimes * slot;
    } else if (list?.[0]?.prepareTimes) {
      const slot = 100 / list?.[0]?.requiredItem?.prepare;

      return list?.[0]?.prepareTimes * slot;
    } else {
      return 0;
    }
  };

  const progressValue = (): number => {
    if (!list?.length) return 0;

    if (list[0]?.execriseTimes) {
      return list[0]?.execriseTimes;
    } else if (list[0]?.restTimes) {
      return list[0]?.restTimes;
    } else if (list[0]?.prepareTimes && list[0]?.set === 0) {
      return list[0]?.prepareTimes;
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
