"use client";
import { setTime } from "@/lib/features/execrise/execriseSlice";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Timer from "./components/Timer";

const Execrise: React.FC = () => {
  const dispatch = useDispatch();
  const initialTime = useSelector(
    (state: RootState) => state.execrise.initialTime
  );

  React.useEffect(() => {
    return () => {
      dispatch(setTime([]));
    };
  }, []);

  return (
    <div className="min-w-screen min-h-screen">
      <Timer />
    </div>
  );
};

export default Execrise;
