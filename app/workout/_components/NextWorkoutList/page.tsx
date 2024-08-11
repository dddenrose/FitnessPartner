import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import React from "react";
import { switchList } from "@/lib/features/workouts/workoutsSlice";

const Card: React.FC = () => {
  return <div>Card</div>;
};

const NextWorkoutList: React.FC = () => {
  const list = useAppSelector((state) => state.workout.list);
  const dispatch = useAppDispatch();

  return (
    list?.length > 1 && (
      <div className="flex gap-4 w-full justify-start p-2 overflow-auto overflow-hidden">
        {list?.map((item, index) => {
          if (index === 0) return null;

          return (
            <div
              key={item?.title}
              className="cursor-pointer p-4 bg-white shadow-md font-bold border-indigo-800 border-2 rounded-3xl min-w-60 flex justify-center items-center"
              onClick={() => dispatch(switchList(item.id))}
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
