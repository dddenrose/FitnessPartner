import { RootState } from "@/lib/store";
import { time } from "console";
import React from "react";
import { useSelector } from "react-redux";

const Execrise = () => {
  const time = useSelector((state: RootState) => state.execrise.time);

  return (
    <div className="text-6xl flex flex-col text-white items-center">
      <div className="text-xl">{time?.[0]?.name}</div>
      <div>
        {time?.[0]?.time > 0 ? (
          <div className="text-9xl">
            00:{time[0].time < 10 ? `0${time[0].time}` : time[0].time}
          </div>
        ) : (
          <div className="text-9xl">00:00</div>
        )}
      </div>
    </div>
  );
};

export default Execrise;
