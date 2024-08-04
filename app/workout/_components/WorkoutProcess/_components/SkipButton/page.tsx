import React from "react";
import { skip } from "@/lib/features/workouts/workoutsSlice";
import { useAppDispatch } from "@/lib/hooks";

const SkipButton: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => dispatch(skip())}
      className="flex gap-1 justify-center rounded-full 
            border border-white
            text-white
            h-10 items-center w-40 cursor-pointer"
    >
      Skip
    </div>
  );
};

export default SkipButton;
