"use client";
import React from "react";
import Dragger from "./_components/Dragger";
import DeleteButton from "./_components/DeleteButton";
import TimeSetting from "./_components/TimeSetting";
import WeightSetting from "./_components/WeightSetting";
import { Button } from "@mui/material";
import WorkOutList from "./_components/WorkOutList/page";
import CategoryCard from "./_components/CategoryCard/page";
import WorkoutProcess from "./_components/WorkoutProcess/page";

const Workout: React.FC = () => {
  const workoutOptions = [
    "Push",
    "Pull",
    "Legs",
    "Full Body",
    "Upper Body",
    "Lower Body",
    "Core",
    "Cardio",
  ];

  return (
    <div className="flex gap-4 flex-col items-center">
      <div className="text-4xl">Workout</div>
      {/* <WorkOutList /> */}
      {/* <CategoryCard /> */}
      <WorkoutProcess />
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
