import React from "react";

const Card: React.FC = () => {
  return <div>Card</div>;
};

const NextWorkoutList: React.FC<{
  execriseList: WorkoutItem[];
  setExecriseList: React.Dispatch<React.SetStateAction<WorkoutItem[]>>;
}> = ({ execriseList, setExecriseList }) => {
  return (
    execriseList?.length > 1 && (
      <div className="flex gap-4 w-4/5 justify-start p-2 overflow-auto overflow-hidden">
        {execriseList?.map((item, index) => {
          if (index === 0) return null;

          return (
            <div
              key={item?.title}
              className="p-4 bg-white shadow-md font-bold border-indigo-800 border-2 rounded-3xl min-w-60 flex justify-center items-center"
            >
              {item?.title}
            </div>
          );
        })}
      </div>
    )
  );
};

export default NextWorkoutList;
