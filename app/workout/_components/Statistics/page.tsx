import {
  CircularProgress,
  LinearProgress,
  linearProgressClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "rgb(55 48 163)",
  },
}));

const ProgressBar: React.FC<{ item: WorkoutItem }> = ({ item }) => {
  const totalRequiredTime = item.requiredItem.time * item.set;
  const totalExecriseTime = item.requiredItem.time * item.set;

  const value = (totalExecriseTime / totalRequiredTime) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex  place-content-between">
        <div>
          {item.title} {value === 100 ? "🎖️" : null}
        </div>
        <div className="text-gray-500">
          {totalExecriseTime} / {totalRequiredTime} s
        </div>
      </div>
      <BorderLinearProgress variant="determinate" value={value} />
    </div>
  );
};

const Statistics: React.FC<{
  execriseList: WorkoutItem[];
}> = ({ execriseList }) => {
  return (
    <div className="w-4/5 flex flex-col gap-8">
      <div className=" text-3xl font-bold">
        Congratulations!
        <br />
        You have completed the workout !!! 🎊
      </div>

      {execriseList.map((item) => (
        <ProgressBar key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Statistics;
