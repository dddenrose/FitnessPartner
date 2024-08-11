import { useAppSelector } from "@/lib/hooks";
import { LinearProgress, linearProgressClasses } from "@mui/material";
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

const ProgressBar: React.FC<{ item: WorkoutItem & { doneTime: number } }> = ({
  item,
}) => {
  const totalRequiredTime = item.requiredItem.time * item.set;
  const value = (item.doneTime / totalRequiredTime) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex  place-content-between">
        <div>
          {item.title} {value === 100 ? "🎖️" : null}
        </div>
        <div className="text-gray-500">
          {item.doneTime} / {totalRequiredTime} s
        </div>
      </div>
      <BorderLinearProgress variant="determinate" value={value} />
    </div>
  );
};

const Statistics: React.FC = () => {
  const originalList = useAppSelector((state) => state.workout.originalList);
  const skipList = useAppSelector((state) => state.workout.skipList);

  console.log("skipList", skipList);

  // 統計完成秒數
  const result = originalList.map((item) => {
    const foundItem = skipList.find((ele) => ele?.id === item.id);

    if (!foundItem) {
      return {
        ...item,
        doneTime: item.requiredItem.time * item.set,
      };
    }

    if (item?.set) {
      return {
        ...item,
        doneTime:
          item.requiredItem.time * item.set -
          foundItem.execriseTimes * foundItem.set,
      };
    } else {
      return {
        ...item,
        doneTime: item.requiredItem.time * item.set - foundItem.execriseTimes,
      };
    }
  });

  return (
    <div className="w-4/5 flex flex-col gap-8">
      <div className=" text-3xl font-bold">
        Congratulations!
        <br />
        You have completed the workout !!! 🎊
      </div>

      {result.map((item) => (
        <ProgressBar key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Statistics;
