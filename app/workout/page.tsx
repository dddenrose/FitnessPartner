"use client";
import React from "react";
import WorkoutProcess from "./_components/WorkoutProcess/page";
import NextWorkoutList from "./_components/NextWorkoutList/page";
import Statistics from "./_components/Statistics/page";
import { useAppSelector } from "@/lib/hooks";
import ReStartButton from "./_components/ReStartButton/page";

const Workout: React.FC = () => {
  const list = useAppSelector((state) => state.workout.list);
  const userInfo = useAppSelector((state) => state.userInfo.user);

  return (
    <div className="flex gap-8 flex-col items-center">
      {list.length ? (
        <>
          {/* user name */}
          <div className="text-3xl font-bold w-full">
            Hi {userInfo.name}, Lets workout !!!!! 🔥 💪
          </div>

          {/* process */}
          <WorkoutProcess />

          {/* upcomming workout list */}
          <NextWorkoutList />
        </>
      ) : (
        <>
          {/* Statistics */}
          <Statistics />

          {/* Re start button */}
          <ReStartButton />
        </>
      )}
    </div>
  );
};

export default Workout;
