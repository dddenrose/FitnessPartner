"use client";
import React from "react";
import WorkoutProcess from "./_components/WorkoutProcess/page";
import { aerobicsList } from "./_components/WorkoutProcess/const";
import NextWorkoutList from "./_components/NextWorkoutList/page";
import Statistics from "./_components/Statistics/page";

const Workout: React.FC = () => {
  const [execriseList, setExecriseList] =
    React.useState<WorkoutItem[]>(aerobicsList);

  return (
    <div className="flex gap-4 flex-col items-center">
      <div className="text-md font-bold w-4/5">
        Hi Stanley, Let's workout !!!!! 🔥 💪
      </div>

      {/* process */}
      <WorkoutProcess />

      {/* upcomming workout list */}
      <NextWorkoutList />

      <Statistics execriseList={execriseList} />

      {/* {workoutOptions.map((option) => (
        <div
          key={option}
          className="flex flex-1 h-60 p-8 items-start rounded-3xl bg-gray-100 gap-4 w-full max-w-3xl"
        >
          <div className="flex-1 text-xl">{option}</div>
          <div className="flex flex-col gap-4">
            <div>Weights / Rest Times</div>
            <WeightSetting />
            <TimeSetting />
          </div>
          <Dragger />
          <div className="flex flex-col gap-4 items-center">
            <div>Edit</div>
            <DeleteButton />
          </div>
        </div>
      ))}
      <Button size="large" variant="contained">
        START!
      </Button> */}
    </div>
  );
};

export default Workout;
