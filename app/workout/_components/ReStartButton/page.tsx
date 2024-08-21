"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetState, setList } from "@/lib/features/workouts/workoutsSlice";

const ReStartButton: React.FC = () => {
  const originalList = useAppSelector((state) => state.workout.originalList);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleOnclick = () => {
    router.push("/");
    dispatch(resetState());
  };

  return (
    <div
      className="text-white text-3xl cursor-pointer font-bold flex items-center justify-center p-1 rounded-full text-center text-md bg-indigo-700 w-60 h-20 "
      onClick={handleOnclick}
    >
      Re-Start 💞
    </div>
  );
};

export default ReStartButton;
