"use client";
import React from "react";
import Timer from "./components/Timer/page";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { setMode } from "@/lib/features/execrise/execriseSlice";
import { RootState } from "@/lib/store";

const Execrise: React.FC = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.execrise.mode);

  return (
    <div className="min-w-screen min-h-screen bg-orange-600">
      <Button onClick={() => dispatch(setMode("execrise"))}>
        Go to execrise
      </Button>

      {mode === "execrise" && <Timer />}
    </div>
  );
};

export default Execrise;
