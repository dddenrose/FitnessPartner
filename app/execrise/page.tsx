"use client";
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
    console.log("mount");

    return () => {
      console.log("unmount");
      // dispatch(setTime([]));
    };
  }, []);

  return <Timer />;
};

export default Execrise;
