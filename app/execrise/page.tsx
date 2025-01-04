"use client";
import { RootState } from "@/lib/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ModeButton from "./components/ModeButton";
import Timer from "./components/Timer";

const Execrise: React.FC = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.execrise.mode);
  const initialTime = useSelector(
    (state: RootState) => state.execrise.initialTime
  );

  return (
    <div className="min-w-screen min-h-screen">
      {mode === "prepare" && <ModeButton.StartButton />}

      {mode === "execrise" && <Timer />}
    </div>
  );
};

export default Execrise;
