import { RootState } from "@/lib/store";
import { time } from "console";
import React from "react";
import { useSelector } from "react-redux";

const Execrise = () => {
  const time = useSelector((state: RootState) => state.execrise.time);

  return time.main > 0 ? (
    <div className="text-6xl flex flex-col text-white items-center">
      <div className="text-xl">開合跳</div>
      <div>
        <div className="text-9xl">
          00:{time.main < 10 ? `0${time.main}` : time.main}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-6xl flex flex-col text-white items-center">
      <div>
        <div className="text-9xl">00:00</div>
      </div>
    </div>
  );
};

export default Execrise;
