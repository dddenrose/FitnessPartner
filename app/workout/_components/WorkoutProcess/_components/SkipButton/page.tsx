import React from "react";

const SkipButton: React.FC<{
  execriseList: WorkoutItem[];
  setExecriseList: React.Dispatch<React.SetStateAction<WorkoutItem[]>>;
}> = ({ execriseList, setExecriseList }) => (
  <div
    onClick={() => {
      setExecriseList(execriseList.slice(1));
    }}
    className="flex gap-1 justify-center rounded-full 
            border border-white
            text-white
            h-10 items-center w-40 cursor-pointer"
  >
    Skip
  </div>
);

export default SkipButton;
