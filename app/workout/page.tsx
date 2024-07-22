"use client";
import React from "react";
import Dragger from "./_components/Dragger";
import DeleteButton from "./_components/DeleteButton";
import TimeSetting from "./_components/TimeSetting";
import WeightSetting from "./_components/WeightSetting";

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
    <div className="flex gap-4 flex-col">
      <div>Workout</div>
      {workoutOptions.map((option) => (
        <div
          key={option}
          className="flex h-150 p-8 items-center bg-gray-100 gap-4"
        >
          <div className="flex-1">{option}</div>
          <WeightSetting />
          <TimeSetting />
          <Dragger />
          <DeleteButton />
        </div>
      ))}
    </div>
  );
};

export default Workout;
