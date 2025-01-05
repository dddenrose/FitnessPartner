import { RootState } from "@/lib/store";
import React from "react";
import { useSelector } from "react-redux";

const Rest = () => {
  const time = useSelector((state: RootState) => state.execrise.time);

  return (
    time.main === 0 &&
    time.rest > 0 && (
      <div className="text-6xl flex flex-col text-white items-center">
        <div className="text-xl">休息</div>
        <div className="text-6xl">
          {time.rest < 10 ? `0${time.rest}` : time.rest}
        </div>
      </div>
    )
  );
};

export default Rest;
