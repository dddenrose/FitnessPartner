import React from "react";

const PauseButton: React.FC<{
  isPause: boolean;
  setIsPause: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isPause, setIsPause }) => (
  <div
    className="text-indigo-700 cursor-pointer font-bold flex items-center justify-center p-1 rounded-full text-center text-md bg-white w-40 h-10 "
    onClick={() => {
      setIsPause(!isPause);
    }}
  >
    {isPause ? "Resume 💞" : "Pause 💫"}
  </div>
);

export default PauseButton;
