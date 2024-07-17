import React from "react";

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
          className="flex p-8 items-center bg-gray-100 rounded-full"
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default Workout;
